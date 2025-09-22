class CreateSubscribers < ActiveRecord::Migration[7.2]
  def change
    create_table :subscribers do |t|
      t.string :email, null: false
      t.boolean :unsubscribed, default: false
      t.bigint :resource_id

      t.timestamps
    end

    add_index :subscribers, :email
    add_index :subscribers, :resource_id
  end
end
