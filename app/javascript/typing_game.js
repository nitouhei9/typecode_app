class SimpleTypeCodeGame {
    constructor() {
        this.currentCode = [];
        this.currentLineIndex = 0;
        this.totalLines = 10;
        this.correctLines = 0;
        this.errors = 0;
        this.isPlaying = false;
        this.codeDatabase = { html: [], css: [] };
        
        this.loadProblems();
    }

    async loadProblems() {
        try {
            // HTMLの問題を読み込み
            const htmlResponse = await fetch('/html_problems.json');
            const htmlData = await htmlResponse.json();
            this.codeDatabase.html = htmlData.html;

            // CSSの問題を読み込み
            const cssResponse = await fetch('/css_problems.json');
            const cssData = await cssResponse.json();
            this.codeDatabase.css = cssData.css;

            console.log('問題データを読み込みました');
            console.log('HTML問題数:', this.codeDatabase.html.length);
            console.log('CSS問題数:', this.codeDatabase.css.length);
            
            this.initEventListeners();
        } catch (error) {
            console.error('問題データの読み込みに失敗しました:', error);
            // フォールバック用のデータ
            this.codeDatabase = {
                html: [
                    "<h1>Welcome to our website</h1>",
                    "<p>This is a simple paragraph.</p>",
                    "<div class='container'>",
                    "<img src='photo.jpg' alt='A beautiful photo'>",
                    "<a href='https://example.com'>Visit our site</a>",
                    "<ul><li>First item</li><li>Second item</li></ul>",
                    "<input type='text' name='username' placeholder='Enter name'>",
                    "<button type='submit'>Send Message</button>",
                    "<form method='post' action='/submit'>",
                    "<meta name='viewport' content='width=device-width'>"
                ],
                css: [
                    "color: red;",
                    "background-color: red;",
                    "font-size: 30px;",
                    "margin: 20px auto;",
                    "padding: 70px 80px;",
                    "border: 5px solid red;",
                    "border-radius: 30px;",
                    "display: flex;",
                    "justify-content: space-between;",
                    "box-shadow: 0 2px 20px rgba(0,0,0.1);"
                ]
            };
            this.initEventListeners();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    initEventListeners() {
        // スペースキーでスタート
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isPlaying) {
                e.preventDefault();
                this.startGame();
            }
        });
        
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.resetGame());
        }
        
        const inputArea = document.getElementById('inputArea');
        if (inputArea) {
            inputArea.addEventListener('keydown', (e) => this.handleKeyDown(e));
            inputArea.addEventListener('input', () => this.updateDisplay());
        }
    }

    startGame() {
        this.resetStats();
        this.loadCode();
        this.isPlaying = true;
        
        const inputArea = document.getElementById('inputArea');
        inputArea.disabled = false;
        inputArea.focus();
        document.getElementById('results').style.display = 'none';
        
        this.updateDisplay();
        this.updateStats();
    }

    resetGame() {
        this.isPlaying = false;
        this.resetStats();
        
        const inputArea = document.getElementById('inputArea');
        inputArea.disabled = true;
        inputArea.value = '';
        document.getElementById('results').style.display = 'none';
        document.getElementById('codeDisplay').innerHTML = '<div class="code-line">スペースキーでスタート</div>';
        
        this.updateStats();
    }

    resetStats() {
        this.currentLineIndex = 0;
        this.correctLines = 0;
        this.errors = 0;
        this.updateStats();
    }

    loadCode() {
        const language = document.getElementById('language').value;
        const allCodes = this.codeDatabase[language];
        
        if (!allCodes || allCodes.length === 0) {
            console.error('問題データがありません');
            return;
        }
        
        // 10行をランダムに選択
        this.currentCode = [];
        const shuffled = [...allCodes].sort(() => 0.5 - Math.random());
        this.currentCode = shuffled.slice(0, Math.min(this.totalLines, shuffled.length));
    }

    handleKeyDown(e) {
        if (!this.isPlaying) return;
        
        if (e.key === 'Enter') {
            e.preventDefault();
            this.checkLine();
        }
    }

    checkLine() {
        const input = document.getElementById('inputArea').value.trim();
        const currentLine = this.currentCode[this.currentLineIndex];
        
        if (input === currentLine) {
            this.correctLines++;
            this.nextLine();
        } else {
            this.errors++;
        }
        
        this.updateStats();
        this.updateDisplay();
    }

    nextLine() {
        this.currentLineIndex++;
        document.getElementById('inputArea').value = '';
        
        // プレビューを初期状態に戻す
        const language = document.getElementById('language').value;
        if (language === 'css') {
            this.updateCssPreview('', document.getElementById('previewContent'));
        } else {
            document.getElementById('previewContent').innerHTML = `
                <div style="color: #999; text-align: center; padding: 30px;">
                    ここにプレビューが表示されます
                </div>
            `;
        }
        
        if (this.currentLineIndex >= this.totalLines) {
            this.endGame();
        } else {
            this.updateDisplay();
        }
    }

    updateDisplay() {
        const display = document.getElementById('codeDisplay');
        
        if (this.currentLineIndex >= this.totalLines) {
            return;
        }
        
        const currentLine = this.currentCode[this.currentLineIndex];
        const input = document.getElementById('inputArea').value;
        
        let formattedLine = '';
        for (let i = 0; i < currentLine.length; i++) {
            const char = currentLine[i];
            const displayChar = char === ' ' ? '&nbsp;' : this.escapeHtml(char);
            
            if (i < input.length) {
                if (char === input[i]) {
                    formattedLine += `<span class="typed-char">${displayChar}</span>`;
                } else {
                    formattedLine += `<span class="error-char">${displayChar}</span>`;
                }
            } else {
                formattedLine += `<span>${displayChar}</span>`;
            }
        }
        
        display.innerHTML = `<div class="code-line current-line">${formattedLine}</div>`;
        
        // プレビューを更新
        this.updatePreview(input);
    }

    updatePreview(input) {
        const previewContent = document.getElementById('previewContent');
        const language = document.getElementById('language').value;
        
        if (language === 'css') {
            this.updateCssPreview(input, previewContent);
        } else if (language === 'html') {
            if (input.trim() === '') {
                previewContent.innerHTML = `
                    <div style="color: #999; text-align: center; padding: 30px;">
                       ここにプレビューが表示されます
                    </div>
                `;
                return;
            }
            this.updateHtmlPreview(input, previewContent);
        }
    }

    updateHtmlPreview(input, previewContent) {
        try {
            // 安全なHTMLのみ表示
            const safeInput = input
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
            previewContent.innerHTML = safeInput;
        } catch (e) {
            previewContent.innerHTML = `
                <div style="color: #e53e3e; text-align: center; padding: 20px;">
                    プレビューエラー
                </div>
            `;
        }
    }

    updateCssPreview(input, previewContent) {
        try {
            const cssBox = document.createElement('div');
            cssBox.className = 'css-preview-box';
            cssBox.textContent = 'プレビュー';
            
            if (input.trim() !== '') {
                // 安全なCSSプロパティのみ適用
                const safeInput = input.replace(/expression\(/gi, '').replace(/javascript:/gi, '');
                cssBox.style.cssText = safeInput;
            }
            
            previewContent.innerHTML = '';
            previewContent.appendChild(cssBox);
        } catch (e) {
            const cssBox = document.createElement('div');
            cssBox.className = 'css-preview-box';
            cssBox.textContent = 'プレビュー';
            previewContent.innerHTML = '';
            previewContent.appendChild(cssBox);
        }
    }

    updateStats() {
        document.getElementById('progress').textContent = `${this.correctLines}/${this.totalLines}`;
    }

    endGame() {
        this.isPlaying = false;
        document.getElementById('inputArea').disabled = true;
        
        this.showResults();
    }

    showResults() {
        const resultsDiv = document.getElementById('results');
        const messageDiv = document.getElementById('resultMessage');
        
        const accuracy = ((this.correctLines / this.totalLines) * 100).toFixed(1);
        
        messageDiv.innerHTML = `
            正解数: ${this.correctLines} / ${this.totalLines}<br>
            正解率: ${accuracy}%<br>
            エラー数: ${this.errors}
        `;
        
        resultsDiv.style.display = 'block';
    }
}

// ページ読み込み後にゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    new SimpleTypeCodeGame();
});