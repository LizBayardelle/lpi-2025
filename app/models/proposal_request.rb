class ProposalRequest < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :project_description, presence: true
  validates :project_type, presence: true
  validates :budget_range, presence: true
  validates :timeline, presence: true
  
  enum status: {
    submitted: 'submitted',
    reviewed: 'reviewed', 
    quoted: 'quoted',
    won: 'won',
    lost: 'lost'
  }
  
  scope :recent, -> { order(created_at: :desc) }
  scope :pending, -> { where(status: ['submitted', 'reviewed']) }
  
  PROJECT_TYPES = [
    'Custom Web App',
    'E-commerce Site', 
    'Membership Platform',
    'iPhone App',
    'API Development',
    'Not Sure Yet'
  ].freeze
  
  BUDGET_RANGES = [
    'Under $10k',
    '$10k-25k', 
    '$25k-50k',
    '$50k+',
    'Let\'s discuss'
  ].freeze
  
  TIMELINES = [
    'ASAP',
    '1-2 months',
    '3-6 months', 
    '6+ months',
    'Flexible'
  ].freeze
  
  def display_status
    status.humanize
  end
  
  def short_description
    project_description.length > 100 ? "#{project_description[0..97]}..." : project_description
  end
  
  def as_json_with_admin_data(options = {})
    as_json(options).merge({
      'status_display' => display_status,
      'short_description' => short_description,
      'created_at_formatted' => created_at.strftime("%B %d, %Y at %l:%M %p"),
      'priority_score' => calculate_priority_score
    })
  end
  
  private
  
  def calculate_priority_score
    score = 0
    score += 3 if budget_range.in?(['$25k-50k', '$50k+'])
    score += 2 if timeline.in?(['ASAP', '1-2 months'])
    score += 1 if project_type != 'Not Sure Yet'
    score += 1 if company.present?
    score
  end
end
