require 'redcarpet'

class BlogPost < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged
  
  has_one_attached :featured_image
  
  validates :title, presence: true
  validates :teaser, presence: true
  validates :content, presence: true
  
  scope :published, -> { where(published: true) }
  scope :recent, -> { order(published_at: :desc) }
  scope :draft, -> { where(published: false) }
  scope :featured, -> { where(featured: true) }
  
  before_save :set_published_at
  before_save :ensure_single_featured
  
  def published?
    published
  end
  
  def content_html
    renderer = Redcarpet::Render::HTML.new(
      filter_html: false,
      no_intra_emphasis: true,
      tables: true,
      fenced_code_blocks: true,
      autolink: true,
      strikethrough: true,
      superscript: true
    )
    
    markdown = Redcarpet::Markdown.new(renderer,
      tables: true,
      fenced_code_blocks: true,
      autolink: true,
      strikethrough: true,
      superscript: true,
      no_intra_emphasis: true
    )
    
    markdown.render(content || '').html_safe
  end
  
  def should_generate_new_friendly_id?
    title_changed? || super
  end
  
  def as_json_with_urls(options = {})
    as_json(options).merge({
      'featured_image_url' => featured_image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(featured_image, only_path: true) : nil,
      'edit_url' => Rails.application.routes.url_helpers.admin_blog_post_path(self),
      'public_url' => "/blog/#{slug || id}",
      'status' => published? ? 'Published' : 'Draft',
      'featured' => featured
    })
  end
  
  private
  
  def set_published_at
    if published && published_at.blank?
      self.published_at = Time.current
    elsif !published
      self.published_at = nil
    end
  end
  
  def ensure_single_featured
    if featured_changed? && featured
      BlogPost.where.not(id: id).update_all(featured: false)
    end
  end
end
