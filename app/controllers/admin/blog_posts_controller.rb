class Admin::BlogPostsController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_blog_post, only: [:show, :update, :destroy]

  def index
    @blog_posts = BlogPost.all.order(created_at: :desc)
    
    respond_to do |format|
      format.html
      format.json { render json: @blog_posts.map(&:as_json_with_urls) }
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @blog_post.as_json_with_urls }
    end
  end

  def create
    @blog_post = BlogPost.new(blog_post_params)
    
    if @blog_post.save
      render json: @blog_post.as_json_with_urls, status: :created
    else
      render json: { errors: @blog_post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @blog_post.update(blog_post_params)
      render json: @blog_post.as_json_with_urls
    else
      render json: { errors: @blog_post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @blog_post.destroy
    head :no_content
  end

  private

  def set_blog_post
    @blog_post = BlogPost.find(params[:id])
  end

  def blog_post_params
    params.require(:blog_post).permit(:title, :teaser, :content, :published, :featured_image)
  end

  def authenticate_admin!
    redirect_to root_path unless user_signed_in? && current_user.admin?
  end
end
