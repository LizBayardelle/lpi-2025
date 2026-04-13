class Testimonial < ApplicationRecord
  belongs_to :project, optional: true
  has_one_attached :headshot
  has_many_attached :photos

  validates :name, presence: true
  validates :blurb, presence: true
  validates :rating, numericality: { only_integer: true, in: 1..5 }, allow_blank: true
  validates :website_url, format: URI::regexp(%w[http https]), allow_blank: true

  scope :visible, -> { where(visible: true) }
  scope :ordered, -> { order(Arel.sql("position IS NULL, position ASC, created_at DESC")) }

  def as_json_with_photo_urls(options = {})
    as_json(options).merge({
      'headshot_url' => headshot.attached? ? Rails.application.routes.url_helpers.rails_blob_url(headshot, only_path: true) : nil,
      'photo_urls' => photos.attached? ? photos.map { |p| Rails.application.routes.url_helpers.rails_blob_url(p, only_path: true) } : [],
      'project_name' => project&.name
    })
  end
end
