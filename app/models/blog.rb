class Blog < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged

  # Associations
  belongs_to :user, optional: true
  has_many_attached :images
  has_one_attached :featured_image

  # Validations
  validates :title, presence: true
  validates :content, presence: true
  validates :primary_category, presence: true

  # Scopes
  scope :published, -> { where(published: true) }
  scope :featured, -> { where(featured: true) }
  scope :by_category, ->(category) { where(primary_category: category) }
  scope :recent, -> { order(created_at: :desc) }

  # Categories constant
  CATEGORIES = %w[Strategy Development Content Marketing Design Other].freeze

  # Methods
  def published?
    published
  end

  def featured?
    featured
  end

  def excerpt_or_truncated_content
    excerpt.present? ? excerpt : content.truncate(200)
  end

  def reading_time
    words_per_minute = 200
    word_count = content.split.size
    (word_count / words_per_minute.to_f).ceil
  end

  private

  def should_generate_new_friendly_id?
    title_changed?
  end
end
