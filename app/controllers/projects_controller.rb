class ProjectsController < ApplicationController
  def index
    @projects = Project.published.order(:name)
  end

  def show
    @project = Project.friendly.find(params[:id])
  end
end
