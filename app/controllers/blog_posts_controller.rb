class BlogPostsController < ApplicationController
  before_action :set_blog_post, only: [:show]
  
  def index
    @blog_posts = BlogPost.published.recent.includes(featured_image_attachment: :blob)
  end

  def show
    redirect_to blog_path unless @blog_post.published?
  end
  
  private
  
  def set_blog_post
    @blog_post = BlogPost.friendly.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to blog_path
  end
end
