class AdminController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin

  def index
    @projects = Project.all.includes(image_attachment: :blob).order(:created_at)
    @messages = Message.recent.limit(50)
    @blog_posts = BlogPost.all.order(created_at: :desc)
    @proposal_requests = ProposalRequest.recent.limit(50)
  end

  private

  def ensure_admin
    redirect_to root_path unless current_user&.admin?
  end
end