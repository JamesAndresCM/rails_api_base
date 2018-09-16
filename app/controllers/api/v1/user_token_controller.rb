class Api::V1::UserTokenController < Knock::AuthTokenController
  skip_before_action :verify_authenticity_token

  rescue_from Knock.not_found_exception_class_name, with: :bad_request

  #devuelve JWT mas propiedades de usuario al momento de logearse
  def create
    @user = User.find_by(email: params[:auth][:email])
    #data = {user_id: @user.id,username: @user.username, email: @user.email, role: @user.role, slug: @user.slug}
    render json: {
        jwt: auth_token.token,
        user_id: @user.id,
        status: 200
      }
  end

  # excepcion email-password al logearse
  def bad_request
    render json: { status: 401, msg: "Invalid email address or password" }
  end
end
