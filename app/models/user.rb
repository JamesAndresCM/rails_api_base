class User < ApplicationRecord

  #include friendly_id
  extend FriendlyId
  friendly_id :username, use: :slugged

  #carrierwave uploader  
  mount_base64_uploader :avatar, AvatarUploader, file_name: -> (u) { u.username }

  #accessors 
  attr_accessor :current_password
  attr_accessor :skip_current_password_validation

  #password and enum role
  has_secure_password
  enum role: [:admin, :user]

  #callbacks
  before_create :set_default_role
  before_validation :downcase_user

  #validations
  validates :username, presence: true, uniqueness: true, length:  {in: 3..12}, format: { with: /\A[a-zA-Z0-9_ ]+\z/, message: 'letters and numbers with space' }
  validates :email, email: true
  validates :email, presence: true, uniqueness: true
  validates_length_of   :password, maximum: 72, minimum: 8, allow_nil: true, allow_blank: false
  validates_confirmation_of :password, if: -> { current_password.present? }
  validates_presence_of :password, if: -> { password_confirmation.present? }
  validates_presence_of :password_confirmation, if: :password_digest_changed?, on: :update
  validate :current_password_is_correct, unless: :skip_current_password_validation, on: :update


  #methods
  def generate_password_token!
    self.reset_password_token = generate_token
    self.reset_password_sent_at = Time.now.utc
    save!
  end

  def password_token_valid?
    (self.reset_password_sent_at + 4.hours) > Time.now.utc
  end

  def reset_password!(password, password_confirmation)
      self.reset_password_token = nil
      self.password = password
      self.password_confirmation = password_confirmation
      save
  end

  #private methods
  private

  def set_default_role
    self.role ||= :user
  end

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
  
  def generate_token
    SecureRandom.hex(20)
  end
end
