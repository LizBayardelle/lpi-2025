class CreateRfps < ActiveRecord::Migration[7.2]
  def change
    create_table :rfps do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :company
      t.text :project_description, null: false
      t.string :budget
      t.string :timeline
      t.text :services_needed
      t.boolean :responded, default: false
      t.boolean :archived, default: false
      t.references :user, null: true, foreign_key: true

      t.timestamps
    end

    add_index :rfps, :email
    add_index :rfps, :responded
    add_index :rfps, :archived
  end
end
