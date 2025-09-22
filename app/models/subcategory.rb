class Subcategory < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  # Validations
  validates :name, presence: true, uniqueness: true

  # Scopes
  scope :general, -> { where(general: true) }
  scope :specific, -> { where(general: false) }

  # Categories constant
  CATEGORIES = %w[Strategy Development Content Marketing Design Other].freeze

  private

  def should_generate_new_friendly_id?
    name_changed?
  end
end
