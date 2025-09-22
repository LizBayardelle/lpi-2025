class Admin::ProposalRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin
  before_action :set_proposal_request, only: [:show, :update, :destroy]

  def index
    @proposal_requests = ProposalRequest.recent
    render json: @proposal_requests.map(&:as_json_with_admin_data)
  end

  def show
    render json: @proposal_request.as_json_with_admin_data
  end

  def update
    if @proposal_request.update(proposal_request_params)
      render json: @proposal_request.as_json_with_admin_data
    else
      render json: { errors: @proposal_request.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @proposal_request.destroy
    head :no_content
  end

  private

  def set_proposal_request
    @proposal_request = ProposalRequest.find(params[:id])
  end

  def proposal_request_params
    params.require(:proposal_request).permit(:status, :internal_notes)
  end

  def ensure_admin
    redirect_to root_path unless current_user&.admin?
  end
end
