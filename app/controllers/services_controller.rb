class ServicesController < ApplicationController
  def index
    # Services overview page
  end

  def show
    # Individual service details (if needed later)
    @service = params[:id]
  end
end