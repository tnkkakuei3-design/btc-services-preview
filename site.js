(function () {
  'use strict';
  const config = window.SITE_CONFIG;
  const https = value => { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; } };
  let timer;
  function message(event) {
    if (https(config.lineUrl)) return;
    event.preventDefault();
    const status = document.getElementById('line-status');
    if (!status) return;
    status.textContent = 'LINE URLは未設定です。プレビューでは移動できません。';
    status.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(() => status.classList.remove('is-visible'), 4500);
  }
  const url = https(config.lineUrl);
  document.querySelectorAll('[data-line]').forEach(a => {
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.removeAttribute('aria-disabled'); a.removeAttribute('role'); }
    else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.setAttribute('role', 'link'); }
    a.tabIndex = 0;
    a.addEventListener('click', message);
    a.addEventListener('keydown', e => { if (!url && (e.key === 'Enter' || e.key === ' ')) message(e); });
  });
  document.querySelectorAll('[data-line-note]').forEach(el => {el.textContent = url ? 'LINEが別のタブで開きます。' : 'プレビュー：LINEへの移動は無効です。';});
  document.querySelectorAll('[data-operator]').forEach(el => { el.textContent = config.operator[el.dataset.operator] || '未提供（差し替え予定）'; });
  document.querySelectorAll('[data-policy]').forEach(el => {
    const href = https(config.operator[el.dataset.policy]);
    if (!href) return;
    const a = document.createElement('a'); a.href = href;
    a.textContent = el.dataset.policy === 'privacyUrl' ? 'プライバシーポリシー' : '利用規約';
    el.replaceChildren(a);
  });

  // The four procedure illustrations are fixed SVG assets; terms remain in each service config.
  const processDrawings = [
    '<path d="M12 16h58v35H41L25 64V51H12z" fill="#edf3ef" stroke="currentColor" stroke-width="2"/><path d="M24 28h34M24 38h24" stroke="currentColor" stroke-width="2"/>',
    '<path d="M12 24h24l8-9h25v48H12z" fill="#edf3ef" stroke="currentColor" stroke-width="2"/><path d="M24 33h32M24 43h25M24 53h18" stroke="currentColor" stroke-width="2"/>',
    '<path d="M18 11h40v52H18z" fill="white" stroke="currentColor" stroke-width="2"/><path d="M27 23h21M27 33h16M27 53h20" stroke="currentColor" stroke-width="2"/><path d="M45 49l21-27 7 6-21 27-11 5z" fill="#dfbc75" stroke="currentColor" stroke-width="2"/>',
    '<circle cx="41" cy="36" r="23" fill="#edf3ef" stroke="currentColor" stroke-width="2"/><path d="M30 36l8 9 15-19" fill="none" stroke="#008f83" stroke-width="3"/><path d="M18 66h47" stroke="#c8d8cd" stroke-width="2"/>'
  ];
  document.querySelectorAll('.reference-page .process-list li').forEach((li, index) => {
    const drawing = processDrawings[index];
    if (!drawing) return;
    li.insertAdjacentHTML('afterbegin', '<svg class="process-icon" viewBox="0 0 82 76" aria-hidden="true">' + drawing + '</svg>');
  });
  const dock = document.querySelector('.mobile-dock'), hero = document.querySelector('.hero'), final = document.querySelector('.final-cta'), faq = document.querySelector('#faq');
  if (dock && hero && final) {
    let frame = 0;
    function update() {
      const readingBoundary = faq || final;
      const show = hero.getBoundingClientRect().bottom <= 0 && readingBoundary.getBoundingClientRect().top >= innerHeight;
      dock.classList.toggle('is-visible', show);
      dock.inert = !show;
      frame = 0;
    }
    function queue() { if (!frame) frame = requestAnimationFrame(update); }
    addEventListener('scroll', queue, {passive: true}); addEventListener('resize', queue); update();
  }
})();
