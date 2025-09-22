class CreateContacts < ActiveRecord::Migration[7.2]
  def change
    create_table :contacts do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.text :message, null: false
      t.string :phone
      t.boolean :archived, default: false

      t.timestamps
    end

    add_index :contacts, :email
    add_index :contacts, :archived
  end
end
