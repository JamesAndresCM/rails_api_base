class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user,  only: [:index, :update]
  before_action :set_user, only: %i[update destroy show]
  load_and_authorize_resource

  def create
    user = User.new(user_params)
    if user.save
      # devuelve el token una vez creado el usuario (evita tener que crear user y luego obtener el token)
      auth_token = Knock::AuthToken.new payload: { sub: user.id }

      #devuelve JWT mas propiedades de usuario al momento de registrarse
      #user_data = {id: user.id, email: user.email, username: user.username, role: user.role, slug: user.slug}
      #render json: {jwt: auth_token.token, user: user_data}, status: :created
      render json: {jwt: auth_token.token, user_id: user.id}, status: :created
      
    else
      render json: {status: 422, msg: user.errors}
    end
  end
  
  def show
    render json: @user
  end

  def update
  if @user.update(user_params)
    render json: { status: 200, msg: 'User has been updated.' }
  else
    render json: {status: 422, msg: @user.errors}
  end
  end

  def destroy
    if @user.destroy
      render json: { status: 200, msg: 'User has been deleted.' }
    else
      render json: {status: 422, msg: @user.errors}
    end
  end

  private 

  def user_params
    if current_user && current_user.admin?
      params.require(:user).permit(:role, :email, :username, :password, :password_confirmation, :avatar, :current_password)
    else
      params.require(:user).permit(:email, :username, :password, :password_confirmation, :avatar, :current_password)
    end
  end
  
  def set_user
    @user = User.friendly.find(params[:id])
  end
  
end
