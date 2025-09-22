class ProposalRequestsController < ApplicationController
  include Recaptcha::Adapters::ControllerMethods
  
  def new
    @proposal_request = ProposalRequest.new
  end

  def create
    @proposal_request = ProposalRequest.new(proposal_request_params)
    
    if verify_recaptcha(action: 'proposal', minimum_score: 0.5) && @proposal_request.save
      # Send notification email (you can add this later)
      redirect_to new_proposal_request_path, notice: 'Thank you! We\'ve received your proposal request and will get back to you within 24 hours.'
    else
      @proposal_request = ProposalRequest.new(proposal_request_params) if @proposal_request.persisted?
      flash.now[:alert] = 'Please complete the security check and fix any errors below.'
      render :new, status: :unprocessable_entity
    end
  end

  private

  def proposal_request_params
    params.require(:proposal_request).permit(
      :name, :email, :company, :phone, :project_type, :budget_range, 
      :timeline, :project_description, :existing_website, :target_audience, 
      :special_requirements, :why_custom, :success_metrics
    )
  end
end
