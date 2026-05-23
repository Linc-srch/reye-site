// Reye — vanilla JS for the public site
// Language toggle (persisted in localStorage) + search + tabs + fade-up observer

(function () {
  // ── Language toggle ──────────────────────────────────────────────────────
  const setLang = (lang) => {
    document.body.classList.toggle('lang-zh', lang === 'zh');
    document.querySelectorAll('.lang-toggle button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === lang);
    });
    localStorage.setItem('reye-lang', lang);
  };

  document.querySelectorAll('.lang-toggle button').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  const saved = localStorage.getItem('reye-lang') || 'en';
  setLang(saved);

  // Sync when parent frame (e.g. dashboard) changes the stored language
  window.addEventListener('storage', (e) => {
    if (e.key === 'reye-lang' && e.newValue) setLang(e.newValue);
  });

  // ── Tabs (Papers / News & Blogs on domain pages) ─────────────────────────
  document.querySelectorAll('.tabs').forEach(tabs => {
    const buttons = tabs.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        buttons.forEach(b => b.classList.toggle('is-active', b === btn));
        document.querySelectorAll('[data-tab]').forEach(panel => {
          panel.style.display = panel.dataset.tab === target ? '' : 'none';
        });
      });
    });
    if (buttons.length) buttons[0].click();
  });

  // ── Fade-up scroll animation ─────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-up').forEach(el => {
      el.classList.add('pre-anim');
      obs.observe(el);
    });
  }

  // ── Client-side search ───────────────────────────────────────────────────
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchCount = document.getElementById('search-count');
  const clearBtn = document.getElementById('search-clear');

  if (searchInput && searchResults) {
    let index = [];

    const renderSearch = (query) => {
      const q = query.trim().toLowerCase();
      const hits = !q ? index : index.filter(entry => {
        const hay = [
          entry.title, entry.title_zh, entry.summary_en, entry.summary_zh,
          (entry.domains || []).join(' '),
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });

      if (searchCount) {
        searchCount.textContent = q
          ? `${hits.length} result${hits.length !== 1 ? 's' : ''} for "${q}"`
          : (index.length ? `${index.length} items in index` : '');
      }
      if (clearBtn) clearBtn.style.display = q ? '' : 'none';

      searchResults.innerHTML = hits.slice(0, 100).map(e => {
        const pageUrl = e.article_page || e.url;
        const origLink = e.article_page
          ? `<a href="${escapeAttr(e.url)}" target="_blank" rel="noopener" class="dim-link">Original →</a>`
          : '';
        return `<article class="result-card" onclick="location.href='${escapeAttr(pageUrl)}'">
          <div class="result-meta">
            <span class="domain-tag">${escapeHtml(e.type || 'article')}</span>
            <span>·</span>
            <span>${escapeHtml((e.domains || []).join(', '))}</span>
            ${origLink}
          </div>
          <h3><a href="${escapeAttr(pageUrl)}" onclick="event.stopPropagation()">
            <span class="lang-en">${escapeHtml(e.title)}</span>
            <span class="lang-zh">${escapeHtml(e.title_zh || e.title)}</span>
          </a></h3>
          <p class="lang-en">${escapeHtml(e.summary_en || '')}</p>
          <p class="lang-zh">${escapeHtml(e.summary_zh || e.summary_en || '')}</p>
        </article>`;
      }).join('') || '<p style="color:var(--color-fg-2);padding:2rem 0;text-align:center">No matches.</p>';
    };

    fetch('assets/search-index.json')
      .then(r => r.json())
      .then(data => { index = data; renderSearch(''); })
      .catch(() => { if (searchCount) searchCount.textContent = 'Search index unavailable.'; });

    searchInput.addEventListener('input', e => renderSearch(e.target.value));
    if (clearBtn) clearBtn.addEventListener('click', () => { searchInput.value = ''; renderSearch(''); searchInput.focus(); });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }
  function escapeAttr(s) { return escapeHtml(s); }
})();
