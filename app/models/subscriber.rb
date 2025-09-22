class Subscriber < ApplicationRecord
  # Associations
  belongs_to :resource, optional: true

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  # Scopes
  scope :active, -> { where(unsubscribed: false) }
  scope :unsubscribed, -> { where(unsubscribed: true) }

  # Methods
  def unsubscribe!
    update!(unsubscribed: true)
  end

  def resubscribe!
    update!(unsubscribed: false)
  end
end
