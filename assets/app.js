// Reye — vanilla JS for the public site
// Language toggle (persisted in localStorage) + search filter + tab switcher

(function () {
  // ── Language toggle ──────────────────────────────────────────────────────
  const setLang = (lang) => {
    document.body.classList.toggle('lang-zh', lang === 'zh');
    document.querySelectorAll('.lang-toggle button').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    localStorage.setItem('reye-lang', lang);
  };

  document.querySelectorAll('.lang-toggle button').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  const saved = localStorage.getItem('reye-lang') || 'en';
  setLang(saved);

  // ── Tabs (Papers / News & Blogs on domain pages) ─────────────────────────
  document.querySelectorAll('.tabs').forEach(tabs => {
    const buttons = tabs.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll(`[data-tab]`).forEach(panel => {
          panel.style.display = panel.dataset.tab === target ? '' : 'none';
        });
      });
    });
    if (buttons.length) buttons[0].click();
  });

  // ── Client-side search ───────────────────────────────────────────────────
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (searchInput && searchResults) {
    let index = [];
    const renderSearch = (query) => {
      const q = query.trim().toLowerCase();
      const hits = !q ? index : index.filter(entry => {
        const hay = [
          entry.title, entry.summary_en, entry.summary_zh,
          (entry.domains || []).join(' '),
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });
      searchResults.innerHTML = hits.slice(0, 100).map(e => {
        const pageUrl = e.article_page || e.url;
        const origLink = e.article_page
          ? `<a href="${escapeAttr(e.url)}" target="_blank" class="dim-link">Original →</a>`
          : '';
        return `<article class="glass-card">
          <h2><a href="${escapeAttr(pageUrl)}">${escapeHtml(e.title)}</a></h2>
          <div class="meta">${escapeHtml(e.type)} · ${escapeHtml((e.domains || []).join(', '))} ${origLink}</div>
          <div class="lang-en">${escapeHtml(e.summary_en || '')}</div>
          <div class="lang-zh">${escapeHtml(e.summary_zh || e.summary_en || '')}</div>
        </article>`;
      }).join('') || '<p>No matches.</p>';
    };
    fetch('assets/search-index.json')
      .then(r => r.json())
      .then(data => { index = data; renderSearch(''); });
    searchInput.addEventListener('input', (e) => renderSearch(e.target.value));
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }
  function escapeAttr(s) { return escapeHtml(s); }
})();
