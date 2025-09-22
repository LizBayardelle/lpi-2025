class Rfp < ApplicationRecord
  # Associations
  belongs_to :user, optional: true

  # Validations
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :project_description, presence: true

  # Scopes
  scope :active, -> { where(archived: false) }
  scope :archived, -> { where(archived: true) }
  scope :responded, -> { where(responded: true) }
  scope :unresponded, -> { where(responded: false) }
  scope :recent, -> { order(created_at: :desc) }

  # Budget options
  BUDGET_OPTIONS = [
    'Under $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    'Over $100,000',
    'Prefer not to say'
  ].freeze

  # Timeline options
  TIMELINE_OPTIONS = [
    'ASAP',
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3-6 months',
    '6+ months',
    'Flexible'
  ].freeze

  # Methods
  def mark_responded!
    update!(responded: true)
  end

  def mark_unresponded!
    update!(responded: false)
  end

  def archive!
    update!(archived: true)
  end

  def unarchive!
    update!(archived: false)
  end
end
