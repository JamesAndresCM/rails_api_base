class Api::V1::UserTokenController < Knock::AuthTokenController
  skip_before_action :verify_authenticity_token

  rescue_from Knock.not_found_exception_class_name, with: :bad_request

  #devuelve JWT mas propiedades de usuario al momento de logearse
=begin
  def create
    @user = User.find_by(email: params[:auth][:email])
    data = {username: @user.username, email: @user.email, role: @user.role}
    render json: {
        jwt: auth_token.token,
        user: data,
        status: 200
      }
  end
=end
  # excepcion email-password al logearse
  def bad_request
    render json: { status: 401, msg: "Invalid email address or password" }
  end
end
