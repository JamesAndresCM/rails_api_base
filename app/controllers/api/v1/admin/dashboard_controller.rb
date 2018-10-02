class Api::V1::Admin::DashboardController < ApplicationController
  include CancanWarning
  authorize_resource class: false
  before_action :authenticate_user

  def index
    #TODO: front-end button to next params[per_page]...
    #users = User.where.not(role: 0).paginate(page: params[:page], per_page: 5).order(created_at: :desc)
    users = User.where.not(role: 0).order(created_at: :desc)
    render json: users
  end
end
