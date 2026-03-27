class AddProjectTypeToTestimonials < ActiveRecord::Migration[7.2]
  def change
    add_column :testimonials, :project_type, :string
  end
end
