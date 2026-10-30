# BTCサービス LP 制作プレビュー

ローンとレンディングを独立したページとして確認するためのプレビューです。正式なサービス案内ではありません。

- `/loan/` : BTC担保ローン
- `/lending/` : BTCレンディング

LINE URL・運営情報は `site-config.js`、ローン条件は `loan/config.js`、レンディングの提案条件は `lending/config.js` で編集します。LINE URL未設定時は外部遷移しません。

静的HTML/CSS/JavaScriptのためビルドは不要です。GitHub Pagesは `main` ブランチのルートを使用します。
