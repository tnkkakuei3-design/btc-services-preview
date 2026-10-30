# BTCサービス LP 制作プレビュー v5

ローンとレンディングを独立したページとして確認するためのプレビューです。正式なサービス案内ではありません。

- `/loan/` : BTC担保ローン
- `/lending/` : BTCレンディング

Fintertech本体の情報構成をデザイン基準とし、独自の文章・挿絵・図解で実装しています。他社の画像やブランドは使用していません。

LINE URL・運営情報は `site-config.js`、ローン条件は `loan/config.js`、レンディングの提案条件は `lending/config.js` で編集します。LINE URL未設定時は外部遷移しません。レンディング年利は未確定です。

静的HTML/CSS/JavaScriptのためビルドは不要です。GitHub Pagesは `main` ブランチのルートを使用します。デザイン調整は既存CSSの後に読み込む `reference-v5.css` で管理します。

noindexを指定していますが、アクセス制限のない確認用公開です。
