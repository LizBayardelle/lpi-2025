class CreateProposalRequests < ActiveRecord::Migration[7.2]
  def change
    create_table :proposal_requests do |t|
      t.string :name
      t.string :email
      t.string :company
      t.string :phone
      t.string :project_type
      t.string :budget_range
      t.string :timeline
      t.text :project_description
      t.string :existing_website
      t.string :target_audience
      t.text :special_requirements
      t.text :why_custom
      t.string :success_metrics
      t.string :status, default: 'submitted'
      t.text :internal_notes

      t.timestamps
    end
  end
end
