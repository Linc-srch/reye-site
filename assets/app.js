// Reye — vanilla JS for the public site
// Language toggle (persisted in localStorage) + search + tabs + fade-up observer

(function () {
  // ── Language toggle ──────────────────────────────────────────────────────
  const setLang = (lang) => {
    if (lang === 'zh') {
      document.body.classList.add('lang-zh');
      // Remove fade-up animation hold so Chinese content isn't hidden by opacity:0
      document.querySelectorAll('.fade-up.pre-anim').forEach(el => el.classList.remove('pre-anim'));
    } else {
      document.body.classList.remove('lang-zh');
    }
    document.querySelectorAll('.lang-toggle button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === lang);
    });
    try { localStorage.setItem('reye-lang', lang); } catch (_) {}
  };

  document.querySelectorAll('.lang-toggle button').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  let saved = 'en';
  try { saved = localStorage.getItem('reye-lang') || 'en'; } catch (_) {}
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
    // Skip animation for Chinese-content elements when loading in Chinese mode
    // (they're already visible — adding pre-anim opacity:0 would cause a flash)
    const isChinese = saved === 'zh';
    document.querySelectorAll('.fade-up').forEach(el => {
      if (isChinese && el.closest('.lang-zh')) return;
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
    let showFavsOnly = false;
    const filterFavsBtn = document.getElementById('filter-favs');

    if (filterFavsBtn) {
      filterFavsBtn.addEventListener('click', () => {
        showFavsOnly = !showFavsOnly;
        filterFavsBtn.classList.toggle('is-active', showFavsOnly);
        renderSearch(searchInput.value);
      });
    }

    const renderSearch = (query) => {
      const q = query.trim().toLowerCase();
      let hits = !q ? index : index.filter(entry => {
        const hay = [
          entry.title, entry.title_zh, entry.summary_en, entry.summary_zh,
          (entry.domains || []).join(' '),
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });

      if (showFavsOnly) {
        hits = hits.filter(e => isFav(String(e.id)));
      }

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
        const starred = isFav(String(e.id));
        return `<article class="result-card" onclick="location.href='${escapeAttr(pageUrl)}'">
          <div class="result-meta">
            <span class="domain-tag">${escapeHtml(e.type || 'article')}</span>
            <span>·</span>
            <span>${escapeHtml((e.domains || []).join(', '))}</span>
            ${origLink}
            <button class="fav-btn${starred ? ' is-fav' : ''}" data-fav-id="${escapeAttr(String(e.id))}" onclick="event.stopPropagation();(function(btn,id){var added=window._toggleFav(id);btn.textContent=added?'★':'☆';btn.classList.toggle('is-fav',added);})(this,'${escapeAttr(String(e.id))}')" aria-label="Favourite">${starred ? '★' : '☆'}</button>
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

  // ── Overview history ─────────────────────────────────────────────
  const historyListEl = document.querySelector('.past-overviews-list');
  if (historyListEl) {
    const domainId = historyListEl.dataset.domain;
    const depth = window.location.pathname.split('/').filter(Boolean).length > 2 ? '../../' : '';
    fetch(`${depth}history/${domainId}.json`)
      .then(r => r.ok ? r.json() : [])
      .then(hist => {
        if (!hist.length) {
          historyListEl.innerHTML = '<p class="past-overview-empty lang-en">No past overviews yet.</p><p class="past-overview-empty lang-zh">暂无历史概览。</p>';
          return;
        }
        historyListEl.innerHTML = hist.map(h => `
          <div class="past-overview-entry">
            <div class="past-overview-date">${escapeHtml(h.date_display)}</div>
            <div class="lang-en">${escapeHtml(h.en)}</div>
            <div class="lang-zh">${escapeHtml(h.zh || h.en)}</div>
          </div>
        `).join('');
      })
      .catch(() => {});
  }

  // ── Top-content carousel ─────────────────────────────────────────
  function initCarousels(allItems) {
    document.querySelectorAll('.content-carousel').forEach(el => {
      const domain = el.dataset.domain;
      const pool = domain === 'all'
        ? [...allItems]
        : allItems.filter(e => Array.isArray(e.domains) && e.domains.includes(domain));
      const items = pool
        .filter(e => e.score != null)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10);
      if (!items.length) {
        const wrap = el.querySelector('.carousel-item-wrap');
        if (wrap) wrap.innerHTML = '<p class="carousel-empty lang-en">No content yet.</p><p class="carousel-empty lang-zh">暂无内容。</p>';
        return;
      }
      setupCarousel(el, items);
    });
  }

  function setupCarousel(el, items) {
    let idx = 0;
    let timer = null;
    const wrap = el.querySelector('.carousel-item-wrap');
    const dotsEl = el.querySelector('.carousel-dots');
    const prev = el.querySelector('.carousel-prev');
    const next = el.querySelector('.carousel-next');

    function renderSlide() {
      const e = items[idx];
      const href = escapeAttr(e.article_page || e.url || '#');
      const scoreHtml = e.score != null ? `<span class="carousel-score">★ ${Number(e.score).toFixed(1)}</span>` : '';
      wrap.innerHTML = `<div class="carousel-item">
        <div class="carousel-item-meta">
          <span class="domain-tag">${escapeHtml(e.type || 'article')}</span>
          ${scoreHtml}
        </div>
        <h4>
          <a href="${href}" onclick="event.stopPropagation()" class="lang-en">${escapeHtml(e.title || '')}</a>
          <a href="${href}" onclick="event.stopPropagation()" class="lang-zh">${escapeHtml(e.title_zh || e.title || '')}</a>
        </h4>
        <p class="lang-en">${escapeHtml((e.summary_en || '').slice(0, 160))}${(e.summary_en || '').length > 160 ? '…' : ''}</p>
        <p class="lang-zh">${escapeHtml((e.summary_zh || e.summary_en || '').slice(0, 160))}${(e.summary_zh || e.summary_en || '').length > 160 ? '…' : ''}</p>
      </div>`;
      wrap.parentElement.onclick = () => { location.href = href; };

      dotsEl.innerHTML = items.map((_, i) =>
        `<span class="carousel-dot${i === idx ? ' is-active' : ''}" data-i="${i}"></span>`
      ).join('');
      dotsEl.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', ev => { ev.stopPropagation(); goTo(+dot.dataset.i); resetTimer(); });
      });
    }

    function goTo(n) { idx = ((n % items.length) + items.length) % items.length; renderSlide(); }
    function resetTimer() { clearInterval(timer); timer = setInterval(() => goTo(idx + 1), 10000); }

    if (prev) prev.addEventListener('click', ev => { ev.stopPropagation(); goTo(idx - 1); resetTimer(); });
    if (next) next.addEventListener('click', ev => { ev.stopPropagation(); goTo(idx + 1); resetTimer(); });

    renderSlide();
    resetTimer();
  }

  // Carousels on pages without a search input (e.g. index.html)
  if (!document.getElementById('search-input') && document.querySelector('.content-carousel')) {
    fetch('assets/search-index.json')
      .then(r => r.json())
      .then(data => initCarousels(data))
      .catch(() => {});
  }

  // ── Favourites ───────────────────────────────────────────────────
  const FAV_KEY = 'reye-favourites';
  const getFavs = () => { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; } };
  const setFavs = (f) => { try { localStorage.setItem(FAV_KEY, JSON.stringify(f)); } catch {} };
  const isFav = (id) => getFavs().includes(String(id));
  const toggleFav = (id) => {
    const f = getFavs(); const s = String(id); const i = f.indexOf(s);
    if (i === -1) { f.push(s); } else { f.splice(i, 1); }
    setFavs(f); return i === -1;
  };
  window._toggleFav = toggleFav;
  window._isFav = isFav;

  const favBtn = document.getElementById('fav-btn');
  if (favBtn) {
    const id = favBtn.dataset.contentId;
    favBtn.textContent = isFav(id) ? '★' : '☆';
    favBtn.classList.toggle('is-fav', isFav(id));
    favBtn.addEventListener('click', () => {
      const added = toggleFav(id);
      favBtn.textContent = added ? '★' : '☆';
      favBtn.classList.toggle('is-fav', added);
    });
  }

  // ── Browse history ────────────────────────────────────────────────
  const rvList = document.getElementById('recently-viewed-list');
  if (rvList) {
    let hist = [];
    try { hist = JSON.parse(localStorage.getItem('reye-history') || '[]'); } catch {}
    const recent = hist.slice(0, 10);
    const rvSection = document.getElementById('recently-viewed');
    if (!recent.length) {
      if (rvSection) rvSection.style.display = 'none';
    } else {
      rvList.innerHTML = recent.map(h => {
        const d = new Date(h.timestamp);
        const _M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const ts = `${d.getDate()} ${_M[d.getMonth()]} ${d.getFullYear()}`;
        return `<a href="${escapeAttr(h.url)}" class="rv-entry">
          <span class="rv-title">${escapeHtml(h.title)}</span>
          <span class="rv-date">${escapeHtml(ts)}</span>
        </a>`;
      }).join('');
    }
  }

})();
