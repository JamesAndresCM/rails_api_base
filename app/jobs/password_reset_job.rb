class PasswordResetJob < ApplicationJob
  queue_as :default

  def perform(user)
    @user = user
    UserMailer.password_reset(@user).deliver_later
  end
end
