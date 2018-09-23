class Api::V1::PasswordsController < ApplicationController
  before_action :reset_params, only: [:reset]

  def forgot
    email = params[:email]

    if email.blank? # check if email is present
      return render json: {status: 200, msg: 'Email not present'}
    end

    user = User.find_by(email: email) # if present find user by email

    if user.present?
      user.skip_current_password_validation = true
      token = user.generate_password_token! #generate pass token
      PasswordResetJob.set(wait: 20.seconds).perform_later(user)
      render json: {status: 200,msg: 'An email has been sent to you with further instructions for reset your password'}
    else
      render json: {status: 404, msg: 'Email address not found. Please check and try again.'}
    end

  end

  def reset

    token = params[:user][:token].to_s

    if token.blank?
      return render json: {status: 200, msg: 'Token not present'}
    end

    user = User.find_by(reset_password_token: token)
    
    if user.present? && user.password_token_valid?
      user.skip_current_password_validation = true
      if user.reset_password!(params[:user][:password], params[:user][:password_confirmation])
        render json: {status: 201, msg: 'Password has been changed'}
      else
        render json: {status: 400, msg: user.errors.full_messages[0]}
      end
    else
      render json: {status: 200, msg: 'Link not valid or expired. Try generating a new link.'}
    end

  end

  private

  def reset_params
    params.require(:user).permit(:token, :password, :password_confirmation)
  end

end
