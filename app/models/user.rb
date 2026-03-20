class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Associations
  has_many :blogs, dependent: :destroy
  has_many :resources, dependent: :destroy
  has_many :rfps, dependent: :destroy

  # Scopes
  scope :admins, -> { where(admin: true) }
  scope :contributors, -> { where(contributor: true) }

  # Methods
  def full_name
    "#{first_name} #{last_name}".strip
  end

  def display_name
    full_name.present? ? full_name : email
  end

  def admin?
    admin
  end

  def contributor?
    contributor || admin?
  end
end
