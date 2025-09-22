class Contact < ApplicationRecord
  # Validations
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :message, presence: true

  # Scopes
  scope :active, -> { where(archived: false) }
  scope :archived, -> { where(archived: true) }
  scope :recent, -> { order(created_at: :desc) }

  # Methods
  def archive!
    update!(archived: true)
  end

  def unarchive!
    update!(archived: false)
  end
end