require "test_helper"

class Admin::BlogPostsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_blog_posts_index_url
    assert_response :success
  end

  test "should get show" do
    get admin_blog_posts_show_url
    assert_response :success
  end

  test "should get create" do
    get admin_blog_posts_create_url
    assert_response :success
  end

  test "should get update" do
    get admin_blog_posts_update_url
    assert_response :success
  end

  test "should get destroy" do
    get admin_blog_posts_destroy_url
    assert_response :success
  end
end
