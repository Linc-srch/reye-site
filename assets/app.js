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

  let saved = 'zh';
  try { saved = localStorage.getItem('reye-lang') || 'zh'; } catch (_) {}
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

  // ── Favourites (hybrid: backend canonical, localStorage cache + offline queue) ──
  const FAV_KEY = 'reye-favourites';
  const FAV_QUEUE_KEY = 'reye-fav-queue';

  const readFavs = () => {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); }
    catch { return new Set(); }
  };
  const writeFavs = (set) => {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(set))); } catch {}
  };
  const readQueue = () => {
    try { return JSON.parse(localStorage.getItem(FAV_QUEUE_KEY) || '[]'); }
    catch { return []; }
  };
  const writeQueue = (q) => {
    try { localStorage.setItem(FAV_QUEUE_KEY, JSON.stringify(q)); } catch {}
  };

  let _favSet = readFavs();
  const isFav = (id) => _favSet.has(String(id));

  async function _postFav(id)   { return fetch('/api/favorites/' + id, { method: 'POST' }); }
  async function _deleteFav(id) { return fetch('/api/favorites/' + id, { method: 'DELETE' }); }

  async function _flushQueue() {
    const q = readQueue();
    if (!q.length) return;
    const remaining = [];
    for (const op of q) {
      try {
        const r = op.op === 'add' ? await _postFav(op.id) : await _deleteFav(op.id);
        if (!r.ok && r.status !== 404) remaining.push(op);
      } catch { remaining.push(op); }
    }
    writeQueue(remaining);
  }

  async function toggleFav(id) {
    const sid = String(id);
    const wasFav = _favSet.has(sid);
    if (wasFav) _favSet.delete(sid); else _favSet.add(sid);
    writeFavs(_favSet);
    try {
      const r = wasFav ? await _deleteFav(sid) : await _postFav(sid);
      if (!r.ok && r.status !== 404) {
        const q = readQueue();
        q.push({ op: wasFav ? 'del' : 'add', id: sid });
        writeQueue(q);
      }
    } catch {
      const q = readQueue();
      q.push({ op: wasFav ? 'del' : 'add', id: sid });
      writeQueue(q);
    }
    return !wasFav;
  }
  window._toggleFav = toggleFav;
  window._isFav = isFav;

  async function _reconcileFavs() {
    let backend;
    try {
      const r = await fetch('/api/favorites');
      if (!r.ok) return;
      backend = await r.json();
    } catch { return; }

    const backendIds = new Set(backend.map(f => String(f.content_id)));

    if (backendIds.size === 0 && _favSet.size > 0) {
      try {
        await fetch('/api/favorites/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content_ids: Array.from(_favSet).map(Number) }),
        });
      } catch {}
    } else {
      _favSet = backendIds;
      writeFavs(_favSet);
    }
    await _flushQueue();
  }
  _reconcileFavs();

  const favBtn = document.getElementById('fav-btn');
  if (favBtn) {
    const id = favBtn.dataset.contentId;
    favBtn.textContent = isFav(id) ? '★' : '☆';
    favBtn.classList.toggle('is-fav', isFav(id));
    favBtn.addEventListener('click', async () => {
      const added = await toggleFav(id);
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


  // ── Image lightbox ──────────────────────────────────────────────────────
  (function () {
    const modal = document.getElementById('lightbox');
    if (!modal) return;
    const img    = modal.querySelector('.lightbox-img');
    const cap    = modal.querySelector('.lightbox-caption');
    const closeB = modal.querySelector('.lightbox-close');
    const inB    = modal.querySelector('.lightbox-zoom-in');
    const outB   = modal.querySelector('.lightbox-zoom-out');
    const resetB = modal.querySelector('.lightbox-reset');
    const label  = modal.querySelector('.lightbox-zoom-label');
    const view   = modal.querySelector('.lightbox-viewport');

    let scale = 1, panX = 0, panY = 0;
    let dragging = false, startX = 0, startY = 0;
    const ZOOM_MIN = 0.5, ZOOM_MAX = 8, ZOOM_STEP = 1.25;

    const apply = () => {
      img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
      label.textContent = Math.round(scale * 100) + '%';
    };
    const reset = () => { scale = 1; panX = panY = 0; apply(); };

    const open = (src, caption) => {
      img.src = src;
      img.alt = caption || '';
      cap.textContent = caption || '';
      cap.style.display = caption ? '' : 'none';
      reset();
      modal.classList.add('is-open');
      modal.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      closeB.focus();
    };
    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      img.src = '';
    };

    document.querySelectorAll('.article-figure-img').forEach(el => {
      el.addEventListener('click', () => {
        const fig = el.closest('.article-figure');
        const figcap = fig ? fig.querySelector('figcaption') : null;
        let caption = '';
        if (figcap) {
          const isZh = document.body.classList.contains('lang-zh');
          const span = figcap.querySelector(isZh ? '.lang-zh' : '.lang-en');
          caption = (span || figcap).textContent.trim();
        }
        open(el.src, caption);
      });
    });

    closeB.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === '+' || e.key === '=') { scale = Math.min(ZOOM_MAX, scale * ZOOM_STEP); apply(); }
      if (e.key === '-' || e.key === '_') { scale = Math.max(ZOOM_MIN, scale / ZOOM_STEP); apply(); }
      if (e.key === '0') reset();
    });

    inB.addEventListener('click', () => { scale = Math.min(ZOOM_MAX, scale * ZOOM_STEP); apply(); });
    outB.addEventListener('click', () => { scale = Math.max(ZOOM_MIN, scale / ZOOM_STEP); apply(); });
    resetB.addEventListener('click', reset);

    view.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      scale = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, scale * delta));
      apply();
    }, { passive: false });

    view.addEventListener('mousedown', (e) => {
      e.preventDefault();
      dragging = true; startX = e.clientX - panX; startY = e.clientY - panY;
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      panX = e.clientX - startX; panY = e.clientY - startY; apply();
    });
    window.addEventListener('mouseup', () => { dragging = false; });
  })();

})();
