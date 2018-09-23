class Api::V1::Admin::DashboardController < ApplicationController
  include CancanWarning
  authorize_resource class: false
  before_action :authenticate_user

  def index
    users = User.all
    render json: users
  end
end
