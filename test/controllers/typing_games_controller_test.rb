require "test_helper"

class TypingGamesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get typing_games_index_url
    assert_response :success
  end
end
