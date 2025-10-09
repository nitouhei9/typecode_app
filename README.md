# TypeCode

プログラミング学習者向けのタイピング練習アプリケーション

## 概要

TypeCodeは、HTMLとCSSのコードを題材にしたタイピング練習アプリです。実際のコードを正確にタイピングしながら、プログラミング言語の構文に慣れ親しむことができます。リアルタイムプレビュー機能により、入力したコードの実行結果を即座に確認できるため、学習効果が高まります。

## 特徴

- **2つの言語に対応**: HTML、CSS
- **豊富な問題数**: HTML 75問、CSS 130問以上
- **リアルタイムプレビュー**: 入力中のコードが即座に視覚化
- **シンプルな操作**: スペースキーでゲーム開始
- **進捗表示**: 10問中の現在位置を表示
- **レスポンシブデザイン**: モバイル端末にも対応

## 動作環境

- Ruby 3.0以上
- Rails 7.0以上
- データベース: SQLite3（開発環境）
- ブラウザ: Chrome、Firefox、Safari、Edge（最新版推奨）



## ファイル構成

```
typecode/
├── app/
│   ├── controllers/
│   │   └── typing_games_controller.rb
│   ├── views/
│   │   ├── layouts/
│   │   │   └── application.html.erb
│   │   └── typing_games/
│   │       └── index.html.erb
│   ├── assets/
│   │   └── stylesheets/
│   │       └── typing_game.css
│   ├── javascript/
│   │   └── typing_game.js
│   └── data/
│       ├── html_problems.json
│       └── css_problems.json
├── config/
│   ├── routes.rb
│   └── importmap.rb
└── README.md
```

## 使用方法

### 基本操作

1. **言語選択**: 画面左上で HTML または CSS を選択
2. **ゲーム開始**: スペースキーを押してゲーム開始
3. **タイピング**: 表示されたコードを正確に入力
4. **次の問題**: Enterキーで次の問題に進む
5. **ゲーム完了**: 10問完了後表示

### プレビュー機能

- **HTML**: 入力したタグが実際のHTML要素として表示
- **CSS**: 入力したスタイルがプレビューボックスに適用
- **リアルタイム更新**: 文字を入力するたびに即座に反映

### 評価システム

- **10問正解**: パーフェクト
- **8-9問正解**: とても良い成績
- **6-7問正解**: 良い結果
- **5問以下**: さらなる練習が必要

## 問題の追加・編集

### HTML問題の追加
`app/data/html_problems.json` に新しい問題を追加:

```json
{
  "html": [
    "<h1>新しい見出し</h1>",
    "<p style='color: red;'>赤い文字</p>"
  ]
}
```

### CSS問題の追加
`app/data/css_problems.json` に新しい問題を追加:

```json
{
  "css": [
    "color: blue;",
    "background-color: yellow;"
  ]
}
```


## 技術仕様

### フロントエンド
- **HTML5**: セマンティックなマークアップ
- **CSS3**: レスポンシブデザイン、グラデーション、アニメーション
- **JavaScript (ES6+)**: モジュール、async/await、クラス構文

### バックエンド
- **Ruby on Rails 7**: MVC アーキテクチャ
- **Importmap**: JavaScript モジュール管理
- **JSON**: 問題データの管理

### デザイン
- **レスポンシブ**: モバイルファーストデザイン
- **アクセシビリティ**: キーボード操作対応
- **ユーザビリティ**: 直感的なインターフェース

## 今後の拡張予定

- [ ] JavaScript問題の追加
- [ ] Python問題の追加
- [ ] ユーザー登録・ログイン機能
- [ ] スコアランキング機能
- [ ] 難易度選択機能
- [ ] タイピング速度（WPM）表示



### 開発環境のセットアップ
```bash
git clone https://github.com/your-username/typecode.git
cd typecode
bundle install
rails db:create db:migrate
rails server
```

### コーディング規約
- Ruby: RuboCop に準拠
- JavaScript: ESLint に準拠
- CSS: BEM 記法を推奨


## 参考・謝辞

プログラミング学習者のタイピングスキル向上を目的として開発されました。

---

**TypeCode** - プログラミングとタイピングを同時に学べる革新的な学習ツール