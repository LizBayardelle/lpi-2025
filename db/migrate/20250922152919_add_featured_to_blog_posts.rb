class AddFeaturedToBlogPosts < ActiveRecord::Migration[7.2]
  def change
    add_column :blog_posts, :featured, :boolean, default: false, null: false
    add_index :blog_posts, :featured
  end
end
