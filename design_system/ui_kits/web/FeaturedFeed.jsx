// Reye UI kit — FeaturedFeed
// Apple-flavor: a hero "this week" card + a list of recent analyses.
// Click any card to open the article detail.

const ARTICLES = [
  {
    id: 1086,
    title_en: 'DashAttention: Differentiable & Adaptive Sparse Hierarchical Attention',
    title_zh: 'DashAttention：可微分自适应稀疏分层注意力',
    authors: 'Yuxiang Huang, Nuno M. T. Gonçalves, Federico Alvetreti, et al.',
    date: '2026-05-19',
    source: 'arxiv',
    domain: 'system_safety',
    rating: 4,
    summary_en: 'Replaces hard top-k block routing with α-entmax — 75% sparsity, accuracy parity with full attention, 3.36× inference speedup over FlashAttention-3.',
    summary_zh: '用 α-entmax 替代硬 top-k 路由 — 75% 稀疏度、精度与全注意力持平、推理较 FlashAttention-3 提速 3.36 倍。',
    tags: ['long-context', 'differentiable-routing', 'entmax', 'hierarchical-attention'],
    featured: true,
  },
  {
    id: 1100,
    title_en: 'Provable Post-Quantum Key Encapsulation from Module-LWE',
    title_zh: '基于 Module-LWE 的可证后量子密钥封装',
    authors: 'F. Tanaka, R. Patel, J. Liang',
    date: '2026-05-18',
    source: 'arxiv',
    domain: 'cryptography',
    rating: 4,
    summary_en: 'A tighter reduction for ML-KEM-class schemes; brings concrete bounds within striking distance of the NIST round-4 estimates.',
    summary_zh: '为 ML-KEM 类方案提供更紧致的归约，使具体安全界限接近 NIST 第四轮估计。',
    tags: ['post-quantum', 'lattice-crypto', 'KEM'],
  },
  {
    id: 1099,
    title_en: 'Jailbreak Surface Area: A Geometric View of Refusal',
    title_zh: '越狱表面积：拒绝行为的几何视角',
    authors: 'L. Okafor, S. Nakamura, P. Liu',
    date: '2026-05-17',
    source: 'arxiv',
    domain: 'ai_safety',
    rating: 5,
    summary_en: 'Frames LLM refusal as a manifold; introduces a measurable "surface area" that predicts robustness to multi-turn attacks.',
    summary_zh: '将 LLM 拒绝行为表征为流形，引入可度量的"表面积"指标，可预测多轮攻击下的鲁棒性。',
    tags: ['jailbreak', 'red-teaming', 'mechanistic-interpretability'],
  },
  {
    id: 1111,
    title_en: 'Reimagining the mouse pointer for the AI era',
    title_zh: '为 AI 时代重新想象鼠标指针',
    authors: 'Google DeepMind',
    date: '2026-05-19',
    source: 'deepmind_blog',
    domain: 'ai_safety',
    rating: 3,
    summary_en: 'A Gemini-powered cursor that understands both visual and semantic context — point at a thing, talk about it.',
    summary_zh: '由 Gemini 驱动的光标，理解视觉与语义上下文 — 指着东西，就能和它对话。',
    tags: ['agents', 'interaction-design', 'multimodal'],
  },
  {
    id: 1095,
    title_en: 'Sandboxing Agentic Tool Use without Performance Loss',
    title_zh: '无性能损失的智能体工具调用沙箱',
    authors: 'M. Rivera, K. Sato',
    date: '2026-05-16',
    source: 'arxiv',
    domain: 'system_safety',
    rating: 4,
    summary_en: 'A capability-based sandbox layer for autonomous agents that adds <2ms overhead per tool call.',
    summary_zh: '面向自主智能体的能力沙箱层 — 每次工具调用开销小于 2ms。',
    tags: ['agents', 'sandboxing', 'capabilities'],
  },
];

function StarRating({ value }) {
  return (
    <span className="rating" title={`${value}/5`}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= value ? 'on' : ''}>●</span>
      ))}
    </span>
  );
}

function FeaturedFeed({ lang, onOpen }) {
  const featured = ARTICLES.find(a => a.featured);
  const rest = ARTICLES.filter(a => !a.featured);

  return (
    <section className="reye-section feed-section">
      <div className="section-head fade-up">
        <p className="eyebrow">{lang === 'en' ? '05 Today' : '05 今日'}</p>
        <h2 className="section-h2">
          {lang === 'en'
            ? <>The frontier, <span className="accent">condensed.</span></>
            : <>前沿，<span className="accent">精炼。</span></>}
        </h2>
        <p className="section-lede">
          {lang === 'en'
            ? 'A research eye sees more than it can interpret. So we filter, summarise, and rank — every day.'
            : '研究之眼看到的，远超它能解读的。因此我们每日做过滤、做摘要、做评分。'}
        </p>
      </div>

      <article
        className="featured-card fade-up"
        onClick={() => onOpen(featured)}
      >
        <div className="featured-meta">
          <span className="domain-tag">{getDomainName(featured.domain, lang)}</span>
          <span>{featured.date}</span>
          <span>·</span>
          <span>{featured.source}</span>
          <StarRating value={featured.rating} />
        </div>
        <h3 className="featured-title">{lang === 'en' ? featured.title_en : featured.title_zh}</h3>
        <p className="featured-summary">{lang === 'en' ? featured.summary_en : featured.summary_zh}</p>
        <div className="featured-tags">
          {featured.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <span className="featured-cta">
          {lang === 'en' ? 'Read deep note' : '阅读深度笔记'} <span>→</span>
        </span>
      </article>

      <div className="feed-list">
        {rest.map((a, i) => (
          <article
            key={a.id}
            className="feed-item fade-up"
            style={{ '--d': `${i * 60}ms` }}
            onClick={() => onOpen(a)}
          >
            <div className="feed-meta">
              <span className="domain-tag">{getDomainName(a.domain, lang)}</span>
              <span>{a.date}</span>
              <span>·</span>
              <span>{a.source}</span>
              <StarRating value={a.rating} />
            </div>
            <h4>{lang === 'en' ? a.title_en : a.title_zh}</h4>
            <p>{lang === 'en' ? a.summary_en : a.summary_zh}</p>
            <div className="feed-tags">
              {a.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function getDomainName(id, lang) {
  const d = window.DOMAINS.find(x => x.id === id);
  return d ? (lang === 'en' ? d.en : d.zh) : id;
}

window.FeaturedFeed = FeaturedFeed;
window.ARTICLES = ARTICLES;
window.StarRating = StarRating;
window.getDomainName = getDomainName;
