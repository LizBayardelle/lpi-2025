class CreateBlogPosts < ActiveRecord::Migration[7.2]
  def change
    create_table :blog_posts do |t|
      t.string :title
      t.text :teaser
      t.text :content
      t.boolean :published
      t.string :slug
      t.datetime :published_at

      t.timestamps
    end
  end
end
