class TestimonialMailer < ApplicationMailer
  def new_submission(testimonial)
    @testimonial = testimonial
    mail(
      to: "elizabeth@linchpinindustries.com",
      subject: "New client feedback from #{testimonial.name}"
    )
  end
end
