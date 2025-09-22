class Admin::ProjectsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin
  before_action :set_project, only: [:show, :update, :destroy]

  def index
    @projects = Project.all.order(:created_at)
    render json: @projects.as_json(include: { image_attachment: { include: :blob } })
  end

  def show
    render json: @project.as_json(include: { image_attachment: { include: :blob } })
  end

  def create
    @project = Project.new(project_params)
    
    if @project.save
      render json: @project.as_json(include: { image_attachment: { include: :blob } }), status: :created
    else
      render json: { errors: @project.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @project.update(project_params)
      render json: @project.as_json(include: { image_attachment: { include: :blob } })
    else
      render json: { errors: @project.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @project.destroy
    head :no_content
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:name, :short_description, :what_special, :long_description, :url, :published, :image)
  end

  def ensure_admin
    render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user&.admin?
  end
end