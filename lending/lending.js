(function () {
  'use strict';
  const C = window.LENDING_CONFIG;
  const number = new Intl.NumberFormat('ja-JP', {maximumFractionDigits: 8});
  const hasRate = typeof C.annualRate === 'number' && Number.isFinite(C.annualRate);
  const rate = hasRate ? number.format(C.annualRate) + '%' : C.annualRatePendingText;
  const fields = {
    serviceName: C.serviceName,
    serviceNameNote: C.serviceNameIsProvisional ? '仮称' : '',
    proposalStatus: C.proposalStatus,
    proposalExplanation: C.proposalExplanation,
    assetWithName: C.asset === 'BTC' ? 'ビットコイン（BTC）' : C.asset,
    minimum: number.format(C.minimumAmount) + ' ' + C.asset,
    term: number.format(C.termMonths) + 'か月',
    annualRate: rate,
    interestMethod: C.interestMethod,
    interestPayment: C.interestPayment,
    principalReturn: C.principalReturn,
    earlyTermination: C.earlyTermination,
    riskText: C.riskText,
    unresolvedItems: C.unresolvedItems,
    processNote: C.processNote,
    maturityDescription: '元本は' + C.principalReturn + '。利息は' + C.interestPayment + 'の条件案です。',
    liquidityDescription: '中途解約は' + C.earlyTermination + 'とする提案です。BTCを使う予定と貸出期間を照らし合わせてください。',
    faqCancellation: '中途解約は' + C.earlyTermination + 'とする提案です。例外の有無や適用条件は未確定です。',
    faqRate: (hasRate ? '現在の条件案は年利' + rate + 'です。' : '年利が' + rate + 'のため、受取額は提示していません。') + '実際の年利と計算方法は、正式な契約条件をご確認ください。'
  };
  document.querySelectorAll('[data-lend]').forEach(el => {
    if (Object.prototype.hasOwnProperty.call(fields, el.dataset.lend)) el.textContent = fields[el.dataset.lend];
  });
  const list = document.querySelector('.process-list');
  list.replaceChildren();
  C.processSteps.forEach(step => {
    const li = document.createElement('li');
    const title = document.createElement('h3'); title.textContent = step.title;
    const description = document.createElement('p'); description.textContent = step.description;
    li.append(title, description); list.append(li);
  });
  document.title = C.serviceName + '｜制作プレビュー';
})();
