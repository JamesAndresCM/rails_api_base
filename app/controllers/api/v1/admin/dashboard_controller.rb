class Api::V1::Admin::DashboardController < ApplicationController
  include CancanWarning
  authorize_resource class: false
  before_action :authenticate_user

  def index
    users = User.where.not(role: 0)
    render json: users
  end
end
