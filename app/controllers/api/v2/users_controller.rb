class Api::V2::UsersController < Api::V1::UsersController
  before_action :set_namespace

  private 

  def set_namespace
    self.namespace_for_serializer = ::V2
  end
end
