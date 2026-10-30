/*
 * レンディングの検討用条件。確定した商品条件ではありません。
 * 年利12%は広告の参考表示であり、本設定では採用していません。
 * 正式な商品設計・契約内容を確認したうえで更新してください。
 * LINE URL・運営情報は ../site-config.js で管理します。
 */
(function (root, factory) {
  'use strict';
  var config = factory();
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.LENDING_CONFIG = config;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  return {
    serviceName: 'BTCレンディング',
    serviceNameIsProvisional: true,
    proposalStatus: '制作上の提案条件',
    proposalExplanation: '以下は制作上の提案です。正式な商品条件ではありません。',
    asset: 'BTC',
    termMonths: 12,
    minimumAmount: 0.1,
    annualRate: null,
    annualRatePendingText: '未確定',
    interestMethod: 'BTC建て・単利',
    interestPayment: '満期に一括支払い',
    principalReturn: '満期にBTCで返還',
    earlyTermination: '原則不可',
    riskText: '元本保証はありません。BTCの価格変動リスクと、事業者の信用リスクがあります。',
    unresolvedItems: '手数料、計算日数・端数処理、返還手順は未確定です。',
    processNote: '手続きの案内案です。必要書類と実際の手順は、正式条件とあわせて確認が必要です。',
    processSteps: [
      { title: 'LINEで条件を確認', description: '数量・期間・返還方法などを確認します。' },
      { title: '条件・リスクの説明', description: '適用条件とリスクの説明を受けます。' },
      { title: '契約内容を確認', description: '契約書と必要な案内を確認します。' },
      { title: '契約後、BTCを貸出', description: '契約で定める手順に沿って貸し出します。' }
    ]
  };
});
