class CreateBlogs < ActiveRecord::Migration[7.2]
  def change
    create_table :blogs do |t|
      t.string :title, null: false
      t.string :slug, null: false
      t.text :content
      t.text :excerpt
      t.string :primary_category
      t.boolean :published, default: false
      t.boolean :featured, default: false
      t.json :subcategory_ids
      t.json :resource_ids
      t.references :user, null: true, foreign_key: true

      t.timestamps
    end

    add_index :blogs, :slug, unique: true
    add_index :blogs, :published
    add_index :blogs, :featured
    add_index :blogs, :primary_category
  end
end
