// typing_game.test.js
// Jest用の単体テストコード

// DOMのモック
document.body.innerHTML = `
  <div class="container">
    <select id="language">
      <option value="html">HTML</option>
      <option value="css">CSS</option>
    </select>
    <div id="progress">0/10</div>
    <div id="codeDisplay"></div>
    <div id="previewContent"></div>
    <input type="text" id="inputArea" />
    <div id="results" style="display: none;">
      <div id="resultMessage"></div>
      <button id="restartBtn">再スタート</button>
    </div>
  </div>
`;

// SimpleTypeCodeGameクラスをインポート
// const SimpleTypeCodeGame = require('./typing_game');

describe('SimpleTypeCodeGame', () => {
  let game;

  beforeEach(() => {
    // テスト用のモックデータ
    global.fetch = jest.fn((url) => {
      if (url === '/html_problems.json') {
        return Promise.resolve({
          json: () => Promise.resolve({
            html: [
              "<h1>Test</h1>",
              "<p>Paragraph</p>",
              "<div>Container</div>",
              "<a href='#'>Link</a>",
              "<button>Button</button>",
              "<input type='text'>",
              "<ul><li>Item</li></ul>",
              "<span>Text</span>",
              "<img src='test.jpg'>",
              "<strong>Bold</strong>"
            ]
          })
        });
      } else if (url === '/css_problems.json') {
        return Promise.resolve({
          json: () => Promise.resolve({
            css: [
              "color: red;",
              "background: blue;",
              "font-size: 20px;",
              "margin: 10px;",
              "padding: 5px;",
              "border: 1px solid;",
              "display: flex;",
              "width: 100px;",
              "height: 50px;",
              "opacity: 0.5;"
            ]
          })
        });
      }
    });

    game = new SimpleTypeCodeGame();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('初期化テスト', () => {
    test('ゲームが正しく初期化される', async () => {
      await game.loadProblems();
      
      expect(game.currentLineIndex).toBe(0);
      expect(game.correctLines).toBe(0);
      expect(game.errors).toBe(0);
      expect(game.isPlaying).toBe(false);
      expect(game.totalLines).toBe(10);
    });

    test('問題データが正しく読み込まれる', async () => {
      await game.loadProblems();
      
      expect(game.codeDatabase.html.length).toBe(10);
      expect(game.codeDatabase.css.length).toBe(10);
    });
  });

  describe('escapeHtmlメソッドのテスト', () => {
    test('HTMLタグが正しくエスケープされる', () => {
      const input = '<script>alert("test")</script>';
      const expected = '&lt;script&gt;alert("test")&lt;/script&gt;';
      
      expect(game.escapeHtml(input)).toBe(expected);
    });

    test('特殊文字が正しくエスケープされる', () => {
      expect(game.escapeHtml('<')).toBe('&lt;');
      expect(game.escapeHtml('>')).toBe('&gt;');
      expect(game.escapeHtml('&')).toBe('&amp;');
    });

    test('通常のテキストはそのまま返される', () => {
      const input = 'Hello World';
      expect(game.escapeHtml(input)).toBe(input);
    });
  });

  describe('loadCodeメソッドのテスト', () => {
    test('HTML問題が正しくロードされる', async () => {
      await game.loadProblems();
      document.getElementById('language').value = 'html';
      
      game.loadCode();
      
      expect(game.currentCode.length).toBe(10);
      expect(typeof game.currentCode[0]).toBe('string');
    });

    test('CSS問題が正しくロードされる', async () => {
      await game.loadProblems();
      document.getElementById('language').value = 'css';
      
      game.loadCode();
      
      expect(game.currentCode.length).toBe(10);
      expect(typeof game.currentCode[0]).toBe('string');
    });

    test('問題がランダムに選択される', async () => {
      await game.loadProblems();
      document.getElementById('language').value = 'html';
      
      game.loadCode();
      const firstSet = [...game.currentCode];
      
      game.loadCode();
      const secondSet = [...game.currentCode];
      
      // 完全に同じ順序になる確率は低い
      const isDifferent = firstSet.some((code, index) => code !== secondSet[index]);
      expect(isDifferent).toBe(true);
    });
  });

  describe('checkLineメソッドのテスト', () => {
    beforeEach(async () => {
      await game.loadProblems();
      game.loadCode();
      game.isPlaying = true;
    });

    test('正解の入力で正解数が増える', () => {
      const correctAnswer = game.currentCode[0];
      document.getElementById('inputArea').value = correctAnswer;
      
      game.checkLine();
      
      expect(game.correctLines).toBe(1);
      expect(game.currentLineIndex).toBe(1);
    });

    test('不正解の入力でエラー数が増える', () => {
      document.getElementById('inputArea').value = 'wrong answer';
      
      game.checkLine();
      
      expect(game.errors).toBe(1);
      expect(game.currentLineIndex).toBe(0); // 進まない
    });

    test('前後の空白は無視される', () => {
      const correctAnswer = game.currentCode[0];
      document.getElementById('inputArea').value = `  ${correctAnswer}  `;
      
      game.checkLine();
      
      expect(game.correctLines).toBe(1);
    });
  });

  describe('updateStatsメソッドのテスト', () => {
    test('進捗が正しく表示される', () => {
      game.correctLines = 3;
      game.totalLines = 10;
      
      game.updateStats();
      
      const progressElement = document.getElementById('progress');
      expect(progressElement.textContent).toBe('3/10');
    });

    test('完了時の進捗が正しい', () => {
      game.correctLines = 10;
      game.totalLines = 10;
      
      game.updateStats();
      
      const progressElement = document.getElementById('progress');
      expect(progressElement.textContent).toBe('10/10');
    });
  });

  describe('resetStatsメソッドのテスト', () => {
    test('統計情報が正しくリセットされる', () => {
      game.currentLineIndex = 5;
      game.correctLines = 3;
      game.errors = 2;
      
      game.resetStats();
      
      expect(game.currentLineIndex).toBe(0);
      expect(game.correctLines).toBe(0);
      expect(game.errors).toBe(0);
    });
  });

  describe('startGameメソッドのテスト', () => {
    test('ゲームが正しく開始される', async () => {
      await game.loadProblems();
      
      game.startGame();
      
      expect(game.isPlaying).toBe(true);
      expect(document.getElementById('inputArea').disabled).toBe(false);
      expect(document.getElementById('results').style.display).toBe('none');
    });
  });

  describe('endGameメソッドのテスト', () => {
    test('ゲームが正しく終了する', async () => {
      await game.loadProblems();
      game.startGame();
      
      game.endGame();
      
      expect(game.isPlaying).toBe(false);
      expect(document.getElementById('inputArea').disabled).toBe(true);
    });
  });

  describe('updateCssPreviewメソッドのテスト', () => {
    test('CSSプレビューが正しく生成される', () => {
      const previewContent = document.getElementById('previewContent');
      const cssInput = 'color: red; background: blue;';
      
      game.updateCssPreview(cssInput, previewContent);
      
      const previewBox = previewContent.querySelector('.css-preview-box');
      expect(previewBox).toBeTruthy();
      expect(previewBox.textContent).toBe('プレビュー');
    });

    test('空のCSS入力でもエラーが出ない', () => {
      const previewContent = document.getElementById('previewContent');
      
      expect(() => {
        game.updateCssPreview('', previewContent);
      }).not.toThrow();
    });

    test('危険なCSS表現が除去される', () => {
      const previewContent = document.getElementById('previewContent');
      const dangerousInput = 'color: red; expression(alert("xss"));';
      
      game.updateCssPreview(dangerousInput, previewContent);
      
      const previewBox = previewContent.querySelector('.css-preview-box');
      expect(previewBox.style.cssText).not.toContain('expression');
    });
  });

  describe('showResultsメソッドのテスト', () => {
    test('結果が正しく表示される', () => {
      game.correctLines = 8;
      game.totalLines = 10;
      game.errors = 3;
      
      game.showResults();
      
      const resultsDiv = document.getElementById('results');
      const messageDiv = document.getElementById('resultMessage');
      
      expect(resultsDiv.style.display).toBe('block');
      expect(messageDiv.innerHTML).toContain('8 / 10');
      expect(messageDiv.innerHTML).toContain('80.0%');
      expect(messageDiv.innerHTML).toContain('3');
    });

    test('完璧なスコアが正しく表示される', () => {
      game.correctLines = 10;
      game.totalLines = 10;
      game.errors = 0;
      
      game.showResults();
      
      const messageDiv = document.getElementById('resultMessage');
      expect(messageDiv.innerHTML).toContain('10 / 10');
      expect(messageDiv.innerHTML).toContain('100.0%');
    });
  });

  describe('エッジケースのテスト', () => {
    test('問題数が0の場合でもエラーが出ない', async () => {
      game.codeDatabase = { html: [], css: [] };
      
      expect(() => {
        game.loadCode();
      }).not.toThrow();
    });

    test('totalLinesを超える問題数でも正常に動作', async () => {
      await game.loadProblems();
      game.totalLines = 5;
      
      game.loadCode();
      
      expect(game.currentCode.length).toBeLessThanOrEqual(5);
    });
  });
});


// テスト環境用のエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleTypeCodeGame;
}