class CreateTestimonials < ActiveRecord::Migration[7.2]
  def change
    create_table :testimonials do |t|
      t.string :name
      t.string :company
      t.string :title
      t.text :blurb
      t.integer :rating
      t.string :website_url
      t.boolean :visible, default: false, null: false
      t.integer :position

      t.timestamps
    end
  end
end
