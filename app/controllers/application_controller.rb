class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  
  before_action :new_subscriber

  private

  def new_subscriber
    @new_subscriber = Subscriber.new if defined?(Subscriber)
  end
end
