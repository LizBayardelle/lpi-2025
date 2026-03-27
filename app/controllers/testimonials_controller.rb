class TestimonialsController < ApplicationController
  include Recaptcha::Adapters::ControllerMethods

  def new
    @testimonial = Testimonial.new
  end

  def create
    @testimonial = Testimonial.new(testimonial_params)

    if verify_recaptcha(action: 'testimonial', minimum_score: 0.5) && @testimonial.save
      TestimonialMailer.new_submission(@testimonial).deliver_later
      redirect_to new_testimonial_path, notice: 'Thank you for sharing your experience! Your feedback means a lot to us.'
    else
      flash.now[:alert] = 'There was an issue submitting your feedback. Please try again.' unless @testimonial.errors.any?
      render :new, status: :unprocessable_entity
    end
  end

  private

  def testimonial_params
    params.require(:testimonial).permit(:name, :company, :title, :blurb, :rating, :website_url, :project_type, photos: [])
  end
end
