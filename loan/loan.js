(function () {
  'use strict';
  const C = window.SERVICE_CONFIG;
  const {parseAmount, calculate} = window.LoanCalculator;
  const number = new Intl.NumberFormat('ja-JP');
  const setText = (selector, value) => document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  document.title = C.serviceName + '｜制作プレビュー';
  setText('[data-service-name]', C.serviceName);
  document.querySelectorAll('[data-provisional]').forEach(el => { el.hidden = !C.serviceNameIsProvisional; });
  setText('[data-rate-range]', C.annualRateMin.toFixed(1) + '–' + C.annualRateMax.toFixed(1));
  setText('[data-rate-min]', C.annualRateMin.toFixed(1) + '%');
  setText('[data-rate-max]', C.annualRateMax.toFixed(1) + '%');
  setText('[data-min-man]', number.format(C.minLoan / 10000));
  setText('[data-ltv]', number.format(C.ltv * 100));
  setText('[data-term-years]', C.termYears + '年');
  setText('[data-term-days]', number.format(C.termDays));
  setText('[data-example-collateral-man]', number.format(Math.ceil(C.minLoan / C.ltv) / 10000));
  setText('[data-example-loan-man]', number.format(C.minLoan / 10000));
  document.querySelectorAll('[data-ltv-bar]').forEach(el => { el.style.width = (C.ltv * 100) + '%'; });
  const list = document.getElementById('process-steps');
  C.processSteps.forEach(step => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3'); h3.textContent = step.title;
    const p = document.createElement('p'); p.textContent = step.description;
    li.append(h3, p); list.append(li);
  });
  const form = document.getElementById('calculator-form');
  const fields = {collateral: form.elements.collateral, loan: form.elements.loan, rate: form.elements.rate};
  fields.rate.min = String(C.annualRateMin);
  fields.rate.max = String(C.annualRateMax);
  fields.rate.value = String(Math.min(C.annualRateMax, Math.max(C.annualRateMin, C.defaultRate)));
  fields.loan.value = number.format(C.minLoan);
  fields.collateral.value = number.format(Math.ceil(C.minLoan / C.ltv));
  function renderResults() {
    const rate = Number(fields.rate.value);
    const output = document.getElementById('rate-value');
    const percent = document.createElement('span'); percent.textContent = '%';
    output.replaceChildren(document.createTextNode(Number.isFinite(rate) ? rate.toFixed(1) : '—'), percent);
    const result = calculate({collateral: fields.collateral.value, loan: fields.loan.value, rate: fields.rate.value}, C);
    Object.entries(fields).forEach(([key, field]) => {
      const message = result.errors[key] || '';
      document.getElementById(key + '-error').textContent = message;
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
    });
    for (const key of ['limit', 'interest', 'total']) {
      const el = document.getElementById('result-' + key);
      el.textContent = result[key] === null ? '—' : number.format(result[key]);
      el.classList.toggle('compact-number', el.textContent.length > 13);
    }
    document.getElementById('result-message').textContent = result.valid
      ? '借入' + number.format(parseAmount(fields.loan.value) / 10000) + '万円・年率' + rate.toFixed(1) + '%の場合'
      : '入力内容をご確認ください。返済額は計算されていません。';
    return result;
  }
  form.addEventListener('submit', event => { event.preventDefault(); renderResults(); });
  Object.entries(fields).forEach(([key, field]) => {
    field.addEventListener('input', renderResults);
    if (key !== 'rate') field.addEventListener('blur', () => {
      const value = parseAmount(field.value);
      if (value !== null) field.value = number.format(value);
    });
  });
  renderResults();
})();
