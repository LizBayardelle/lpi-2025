class Admin::TestimonialsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin
  before_action :set_testimonial, only: [:show, :update, :destroy]

  def index
    @testimonials = Testimonial.all.order(created_at: :desc)
    render json: @testimonials.map(&:as_json_with_photo_urls)
  end

  def show
    render json: @testimonial.as_json_with_photo_urls
  end

  def create
    @testimonial = Testimonial.new(testimonial_params)

    if @testimonial.save
      render json: @testimonial.as_json_with_photo_urls, status: :created
    else
      render json: { errors: @testimonial.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @testimonial.update(testimonial_params)
      render json: @testimonial.as_json_with_photo_urls
    else
      render json: { errors: @testimonial.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @testimonial.destroy
    head :no_content
  end

  private

  def set_testimonial
    @testimonial = Testimonial.find(params[:id])
  end

  def testimonial_params
    params.require(:testimonial).permit(:name, :company, :title, :blurb, :rating, :website_url, :visible, :position, photos: [])
  end

  def ensure_admin
    render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user&.admin?
  end
end
