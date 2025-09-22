class Message < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :subject, presence: true
  validates :content, presence: true
  
  scope :unread, -> { where(read: false) }
  scope :read, -> { where(read: true) }
  scope :recent, -> { order(created_at: :desc) }
  
  def mark_as_read!
    update!(read: true)
  end
  
  def mark_as_unread!
    update!(read: false)
  end
end
