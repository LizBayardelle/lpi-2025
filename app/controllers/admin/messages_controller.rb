class Admin::MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin
  before_action :set_message, only: [:show, :update, :destroy]

  def index
    @messages = Message.recent.limit(50)
    render json: @messages.as_json(only: [:id, :name, :email, :subject, :content, :read, :created_at])
  end

  def show
    render json: @message.as_json(only: [:id, :name, :email, :subject, :content, :read, :created_at])
  end

  def update
    if @message.update(message_params)
      render json: @message.as_json(only: [:id, :name, :email, :subject, :content, :read, :created_at])
    else
      render json: { errors: @message.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @message.destroy
    head :no_content
  end

  private

  def set_message
    @message = Message.find(params[:id])
  end

  def message_params
    params.require(:message).permit(:read)
  end

  def ensure_admin
    render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user&.admin?
  end
end