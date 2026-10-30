/* Pure calculation module. No network requests or price feeds. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LoanCalculator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalize(raw) {
    if (typeof raw !== 'string' && typeof raw !== 'number') return '';
    return String(raw).trim().replace(/[０-９]/g, function (character) {
      return String.fromCharCode(character.charCodeAt(0) - 0xFEE0);
    }).replace(/，/g, ',').replace(/．/g, '.');
  }

  // Accept yen integers, including correctly grouped commas and full-width digits.
  // Invalid values return null; zero is parsed here and rejected by calculate().
  function parseAmount(raw) {
    var value = normalize(raw);
    if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value)) return null;
    var number = Number(value.replace(/,/g, ''));
    return Number.isSafeInteger(number) && number >= 0 ? number : null;
  }

  function parseRate(raw) {
    var value = normalize(raw);
    if (!/^\d+(?:\.\d+)?$/.test(value)) return null;
    var number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function yen(value) {
    return value.toLocaleString('ja-JP') + '円';
  }

  function amountError(raw, label) {
    if (normalize(raw) === '') return label + 'を入力してください。';
    return label + 'は0より大きい整数（円）で入力してください。大きすぎる金額や不正な文字は使用できません。';
  }

  function calculate(input, config) {
    input = input || {};
    config = config || {};
    var errors = {};
    var collateral = parseAmount(input.collateral);
    var loan = parseAmount(input.loan);
    var rate = parseRate(input.rate);
    var limit = null;

    var settingsValid = Number.isSafeInteger(config.minLoan) && config.minLoan > 0 &&
      Number.isFinite(config.ltv) && config.ltv > 0 && config.ltv <= 1 &&
      Number.isFinite(config.annualRateMin) && config.annualRateMin >= 0 &&
      Number.isFinite(config.annualRateMax) && config.annualRateMax >= config.annualRateMin &&
      Number.isSafeInteger(config.termDays) && config.termDays > 0;
    if (!settingsValid) {
      return {
        valid: false,
        errors: { rate: '計算条件が設定されていません。設定内容をご確認ください。' },
        limit: null,
        interest: null,
        total: null
      };
    }

    if (collateral === null || collateral <= 0) {
      errors.collateral = amountError(input.collateral, '担保評価額');
    } else {
      limit = Math.floor(collateral * config.ltv);
    }

    if (loan === null || loan <= 0) {
      errors.loan = amountError(input.loan, '借入希望額');
    } else if (loan < config.minLoan) {
      errors.loan = '借入額は原則' + yen(config.minLoan) + 'からです。借入条件をご確認ください。';
    } else if (limit !== null && loan > limit) {
      errors.loan = '借入希望額が担保評価額の' + (config.ltv * 100) + '%（' + yen(limit) + '）を超えています。';
    }

    if (rate === null || rate < config.annualRateMin || rate > config.annualRateMax) {
      errors.rate = '年率は' + config.annualRateMin + '～' + config.annualRateMax + '%の範囲で入力してください。';
    }

    if (Object.keys(errors).length > 0) {
      return { valid: false, errors: errors, limit: limit, interest: null, total: null };
    }

    // Illustrative simple interest: principal × rate × days / 365.
    // Round sub-yen fractions to the nearest yen; no fees are included.
    var interest = Math.round(loan * (rate / 100) * (config.termDays / 365));
    var total = loan + interest;
    if (!Number.isSafeInteger(interest) || !Number.isSafeInteger(total)) {
      return {
        valid: false,
        errors: { loan: '計算できる金額の範囲を超えています。借入希望額を小さくしてください。' },
        limit: limit,
        interest: null,
        total: null
      };
    }
    return { valid: true, errors: {}, limit: limit, interest: interest, total: total };
  }

  return { parseAmount: parseAmount, calculate: calculate };
});
