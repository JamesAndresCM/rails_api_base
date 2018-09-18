class User < ApplicationRecord
  extend FriendlyId
  friendly_id :username, use: :slugged
  has_secure_password
  before_create :set_default_role
  before_validation :downcase_user
  mount_base64_uploader :avatar, AvatarUploader, file_name: -> (u) { u.username }
  attr_accessor :current_password

  validates :username, presence: true, uniqueness: true, length:  {in: 3..12}, format: { with: /\A[a-zA-Z0-9_ ]+\z/, message: 'letters and numbers with space' }
  validates :email, email: true
  validates :email, presence: true, uniqueness: true
  validates_length_of   :password, maximum: 72, minimum: 8, allow_nil: true, allow_blank: false
  validates_presence_of :password_confirmation, if: :password_digest_changed?

  enum role: [:admin, :user]

  private

  def set_default_role
    self.role ||= :user
  end

  validate :current_password_is_correct,
           if: :validate_password?, on: :update

  def current_password_is_correct
    if User.find(id).authenticate(current_password) == false
      errors.add(:current_password, "is incorrect.")
    end
  end
  

  def validate_password?
    !password.blank?
  end
  
  def downcase_user
    self.username = self.username.downcase if self.username?
    self.email = self.email.downcase if self.email?
  end

  def should_generate_new_friendly_id?
    username_changed?
  end
end
