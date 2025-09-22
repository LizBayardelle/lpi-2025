class Project < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged
  
  has_one_attached :image
  
  validates :name, presence: true
  validates :short_description, presence: true
  validates :what_special, presence: true
  validates :long_description, presence: true
  validates :url, presence: true, format: URI::regexp(%w[http https])
  
  scope :published, -> { where(published: true) }
  
  def should_generate_new_friendly_id?
    name_changed? || super
  end
  
  def as_json_with_image_url(options = {})
    as_json(options).merge({
      'image_url' => image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true) : nil
    })
  end
end
