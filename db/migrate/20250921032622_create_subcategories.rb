class CreateSubcategories < ActiveRecord::Migration[7.2]
  def change
    create_table :subcategories do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.boolean :general, default: false
      t.json :categories

      t.timestamps
    end

    add_index :subcategories, :slug, unique: true
  end
end
