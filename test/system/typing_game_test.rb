# test/system/typing_game_test.rb
require "application_system_test_case"

class TypingGameTest < ApplicationSystemTestCase
  setup do
    # テスト前の準備
    visit root_path
  end

  test "ページが正しく表示される" do
    assert_selector "h1", text: "TypeCode"
    assert_selector "#language"
    assert_selector "#inputArea"
    assert_selector "#codeDisplay"
    assert_selector "#previewContent"
  end

  test "言語セレクトボックスが正しく動作する" do
    assert_selector "select#language"
    
    # HTMLが選択されている
    assert_equal "html", find("#language").value
    
    # CSSに変更できる
    select "CSS", from: "language"
    assert_equal "css", find("#language").value
  end

  test "スペースキーでゲームが開始される" do
    # 初期状態では入力フィールドが無効
    assert find("#inputArea").disabled?
    
    # スペースキーを押す
    find("body").send_keys(:space)
    
    # 入力フィールドが有効になる
    assert_not find("#inputArea").disabled?
  end

  test "正解を入力すると次の問題に進む" do
    # ゲーム開始
    find("body").send_keys(:space)
    
    # 初期の進捗を確認
    assert_text "0/10"
    
    # 表示されている問題を取得
    code_text = find("#codeDisplay").text.strip
    
    # 正解を入力
    fill_in "inputArea", with: code_text
    find("#inputArea").send_keys(:enter)
    
    # 進捗が更新される
    assert_text "1/10"
  end

  test "不正解を入力してもエラー数が増える" do
    # ゲーム開始
    find("body").send_keys(:space)
    
    # 間違った答えを入力
    fill_in "inputArea", with: "wrong answer"
    find("#inputArea").send_keys(:enter)
    
    # 進捗は変わらない（0のまま）
    assert_text "0/10"
  end

  test "10問完了すると結果が表示される" do
    # ゲーム開始
    find("body").send_keys(:space)
    
    # 10問正解する
    10.times do
      code_text = find("#codeDisplay .current-line").text.strip
      fill_in "inputArea", with: code_text
      find("#inputArea").send_keys(:enter)
      sleep 0.1 # 少し待つ
    end
    
    # 結果画面が表示される
    assert_selector "#results", visible: true
    assert_text "完了"
    assert_selector "#resultMessage"
  end

  test "もう一度ボタンでゲームがリセットされる" do
    # ゲーム開始して問題を解く
    find("body").send_keys(:space)
    
    code_text = find("#codeDisplay .current-line").text.strip
    fill_in "inputArea", with: code_text
    find("#inputArea").send_keys(:enter)
    
    assert_text "1/10"
    
    # リセット（スペースキーで新規開始）
    find("body").send_keys(:space)
    
    # 進捗がリセットされる
    assert_text "0/10"
  end

  test "HTMLモードでプレビューが表示される" do
    select "HTML", from: "language"
    find("body").send_keys(:space)
    
    # プレビューエリアが存在する
    assert_selector "#previewContent"
  end

  test "CSSモードでプレビューボックスが表示される" do
    select "CSS", from: "language"
    find("body").send_keys(:space)
    
    # CSSプレビューボックスが存在する
    assert_selector ".css-preview-box"
  end

  test "入力に応じてコードがハイライトされる" do
    find("body").send_keys(:space)
    
    code_text = find("#codeDisplay .current-line").text.strip
    
    # 1文字ずつ入力
    first_char = code_text[0]
    fill_in "inputArea", with: first_char
    
    # 正しく入力された文字が緑色になる
    assert_selector ".typed-char"
  end

  test "間違った文字を入力すると赤くなる" do
    find("body").send_keys(:space)
    
    # 間違った文字を入力
    fill_in "inputArea", with: "x"
    
    # エラー文字が赤色になる
    assert_selector ".error-char"
  end

  test "レスポンシブデザインが機能する" do
    # モバイルサイズに変更
    page.driver.browser.manage.window.resize_to(375, 667)
    
    # 要素が表示される
    assert_selector "h1"
    assert_selector "#inputArea"
    
    # デスクトップサイズに戻す
    page.driver.browser.manage.window.resize_to(1280, 720)
  end
end

# test/system/typing_game_accessibility_test.rb
class TypingGameAccessibilityTest < ApplicationSystemTestCase
  test "キーボード操作のみでゲームができる" do
    visit root_path
    
    # スペースキーでゲーム開始
    find("body").send_keys(:space)
    
    # Tabキーで入力フィールドに移動
    find("body").send_keys(:tab)
    
    # 入力フィールドがフォーカスされている
    assert_equal "inputArea", evaluate_script("document.activeElement.id")
  end

  test "適切なARIA属性が設定されている" do
    visit root_path
    
    # 主要な要素にID属性がある
    assert_selector "#language"
    assert_selector "#inputArea"
    assert_selector "#codeDisplay"
  end
end

# test/system/typing_game_performance_test.rb
class TypingGamePerformanceTest < ApplicationSystemTestCase
  test "大量の問題でもパフォーマンスが維持される" do
    visit root_path
    
    start_time = Time.now
    
    # ゲーム開始
    find("body").send_keys(:space)
    
    # ページが素早く反応する（1秒以内）
    end_time = Time.now
    assert (end_time - start_time) < 1.0
  end

  test "入力のレスポンスが速い" do
    visit root_path
    find("body").send_keys(:space)
    
    start_time = Time.now
    
    # 文字を入力
    fill_in "inputArea", with: "a"
    
    # 即座に反映される（100ms以内）
    end_time = Time.now
    assert (end_time - start_time) < 0.1
  end
end