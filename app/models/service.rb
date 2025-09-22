class Service < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged

  # Associations
  has_one_attached :image

  # Validations
  validates :title, presence: true
  validates :description, presence: true
  validates :category, presence: true

  # Scopes
  scope :featured, -> { where(featured: true) }
  scope :by_category, ->(category) { where(category: category) }
  scope :recent, -> { order(created_at: :desc) }

  # Categories constant
  CATEGORIES = %w[Strategy Development Content Marketing Design Other].freeze

  private

  def should_generate_new_friendly_id?
    title_changed?
  end
end
