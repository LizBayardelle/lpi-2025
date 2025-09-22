class AddWhatSpecialToProjects < ActiveRecord::Migration[7.2]
  def change
    add_column :projects, :what_special, :text
  end
end
