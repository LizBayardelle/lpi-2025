class CreateServices < ActiveRecord::Migration[7.2]
  def change
    create_table :services do |t|
      t.string :title, null: false
      t.string :slug, null: false
      t.text :description
      t.string :category, null: false
      t.boolean :featured, default: false
      t.decimal :price, precision: 10, scale: 2
      t.string :duration

      t.timestamps
    end

    add_index :services, :slug, unique: true
    add_index :services, :category
    add_index :services, :featured
  end
end
