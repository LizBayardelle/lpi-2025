class MessagesController < ApplicationController
  include Recaptcha::Verify
  def create
    @message = Message.new(message_params)
    
    if verify_recaptcha(model: @message) && @message.save
      redirect_to contact_path, notice: 'Thank you for your message! We\'ll get back to you soon.'
    else
      # Store the message for the form to repopulate
      @message = Message.new(message_params) if @message.persisted?
      flash.now[:alert] = 'Please complete the security check and try again.'
      render 'contacts/new', status: :unprocessable_entity
    end
  end

  private

  def message_params
    params.require(:message).permit(:name, :email, :subject, :content)
  end
end