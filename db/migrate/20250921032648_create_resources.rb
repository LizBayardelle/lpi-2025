class CreateResources < ActiveRecord::Migration[7.2]
  def change
    create_table :resources do |t|
      t.string :title, null: false
      t.string :slug, null: false
      t.text :description
      t.string :primary_category
      t.string :classification
      t.json :subcategory_ids
      t.references :user, null: true, foreign_key: true

      t.timestamps
    end

    add_index :resources, :slug, unique: true
    add_index :resources, :primary_category
  end
end
