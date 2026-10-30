/*
 * サービスの表示・計算・導線を一元管理する設定です。
 * 未提供の情報は空欄のまま保存し、確認後に更新してください。
 * LINE URL・運営情報は ../site-config.js で共通管理します。
 */
(function (root, factory) {
  'use strict';
  var config = factory();
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.SERVICE_CONFIG = config;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  return {
    serviceName: 'BTC担保ローン',
    serviceNameIsProvisional: true,
    annualRateMin: 4,
    annualRateMax: 8,
    minLoan: 5000000,
    ltv: 0.5,
    termYears: 1,
    termDays: 365,
    defaultRate: 6,
    // 案内の順序・必要書類・実際の担保差入れ手順は公開前に要確認。
    processSteps: [
      {
        title: 'LINEで連絡',
        description: '借入希望額や確認したい条件を伝えます。'
      },
      {
        title: '条件・必要書類の案内',
        description: '借入条件と、必要な書類の案内を受けます。'
      },
      {
        title: '審査・契約',
        description: '審査を経て、契約内容を確認します。'
      },
      {
        title: '担保差入れ・融資',
        description: '契約の手順に沿ってBTCを差し入れ、日本円の融資を受けます。'
      }
    ]
  };
});
