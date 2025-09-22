class CreateMessages < ActiveRecord::Migration[7.2]
  def change
    create_table :messages do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :subject, null: false
      t.text :content, null: false
      t.boolean :read, default: false

      t.timestamps
    end
    
    add_index :messages, :created_at
    add_index :messages, :read
  end
end
