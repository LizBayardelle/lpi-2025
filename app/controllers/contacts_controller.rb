class ContactsController < ApplicationController
  def new
    @message = Message.new
  end

  def create
    @message = Message.new(message_params)
    
    if @message.save
      redirect_to contact_path, notice: 'Thank you for your message! We\'ll get back to you soon.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def message_params
    params.require(:message).permit(:name, :email, :subject, :content)
  end
end