// Reye UI kit — SearchPane
// Live filter over the in-memory ARTICLES list.

const { useState: useStateS, useMemo } = React;

function SearchPane({ lang, onOpen }) {
  const [q, setQ] = useStateS('');

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return window.ARTICLES;
    return window.ARTICLES.filter(a => {
      const hay = [
        a.title_en, a.title_zh, a.summary_en, a.summary_zh,
        a.authors, a.source, a.domain, (a.tags || []).join(' '),
      ].join(' ').toLowerCase();
      return hay.includes(needle);
    });
  }, [q]);

  return (
    <section className="reye-section search-section">
      <div className="section-head fade-up">
        <p className="eyebrow">{lang === 'en' ? '\u2329  Search the feed' : '\u2329  搜索订阅'}</p>
        <h2 className="section-h2">
          {lang === 'en'
            ? <>Find anything in <span className="accent">five domains</span>.</>
            : <>在 <span className="accent">五大领域</span> 中查找。</>}
        </h2>
      </div>

      <div className="search-input-wrap fade-up">
        <span className="search-glyph">⌕</span>
        <input
          type="text"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === 'en'
            ? 'Search titles, summaries, tags…'
            : '搜索标题、摘要、标签…'}
        />
        {q && (
          <button className="clear" onClick={() => setQ('')}>×</button>
        )}
      </div>

      <div className="search-meta fade-up">
        {hits.length === 0
          ? (lang === 'en' ? 'No matches.' : '没有匹配项。')
          : (lang === 'en'
              ? `${hits.length} of ${window.ARTICLES.length} articles`
              : `${hits.length} / ${window.ARTICLES.length} 篇`)}
      </div>

      <div className="search-results">
        {hits.map((a, i) => (
          <article
            key={a.id}
            className="result-card fade-up"
            style={{ '--d': `${i * 40}ms` }}
            onClick={() => onOpen(a)}
          >
            <div className="result-meta">
              <span className="domain-tag">{window.getDomainName(a.domain, lang)}</span>
              <span>{a.source}</span>
              <span>·</span>
              <span>{a.date}</span>
            </div>
            <h3>{lang === 'en' ? a.title_en : a.title_zh}</h3>
            <p>{lang === 'en' ? a.summary_en : a.summary_zh}</p>
            <div className="result-tags">
              {(a.tags || []).slice(0, 4).map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

window.SearchPane = SearchPane;
