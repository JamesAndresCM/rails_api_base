class Api::V1::Admin::DashboardController < ApplicationController
  before_action :authenticate_user
  authorize_resource class: false

  def index
    users = User.all
    render json: users
  end
end
