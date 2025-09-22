class Resource < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged

  # Associations
  belongs_to :user, optional: true
  has_many :subscribers, dependent: :destroy
  has_many_attached :files
  has_one_attached :thumbnail

  # Validations
  validates :title, presence: true
  validates :description, presence: true
  validates :primary_category, presence: true

  # Scopes
  scope :by_category, ->(category) { where(primary_category: category) }
  scope :recent, -> { order(created_at: :desc) }

  # Categories constant
  CATEGORIES = %w[Strategy Development Content Marketing Design Other].freeze
  
  # Classification types
  CLASSIFICATIONS = %w[Free Premium].freeze

  private

  def should_generate_new_friendly_id?
    title_changed?
  end
end
