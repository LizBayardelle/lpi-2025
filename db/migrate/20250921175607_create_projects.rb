class CreateProjects < ActiveRecord::Migration[7.2]
  def change
    create_table :projects do |t|
      t.string :name
      t.text :short_description
      t.text :long_description
      t.string :url
      t.boolean :published, default: true

      t.timestamps
    end
  end
end
