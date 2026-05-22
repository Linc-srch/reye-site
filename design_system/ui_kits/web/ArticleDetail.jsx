// Reye UI kit — ArticleDetail
// Long-form reading view for a single article. Tracks the source repo's
// CRGP schema but renders it as a polished Apple-magazine layout.

function ArticleDetail({ article, lang, onBack }) {
  if (!article) return null;

  const copy = lang === 'en' ? {
    back: '← All articles',
    summary: 'Summary',
    deepNote: 'Deep Note',
    why: 'Why read it',
    crgp: 'Context · Related · Gap · Proposal',
    exp: 'Experiments',
    matters: 'Why it matters',
    next: 'Next steps',
    rating: 'Rating',
    original: 'Open original source',
    sections: {
      C: 'Context',
      R: 'Related work',
      G: 'Gap',
      P: 'Proposal',
    },
  } : {
    back: '← 全部文章',
    summary: '摘要',
    deepNote: '深度笔记',
    why: '阅读理由',
    crgp: '背景 · 相关 · 差距 · 方案',
    exp: '实验',
    matters: '重要性',
    next: '下一步',
    rating: '评分',
    original: '查看原始来源',
    sections: {
      C: '背景',
      R: '相关工作',
      G: '差距',
      P: '方案',
    },
  };

  return (
    <article className="reye-article">
      <button className="back-link fade-up" onClick={onBack}>{copy.back}</button>

      <header className="article-header fade-up">
        <div className="article-meta">
          <span className="domain-tag">{window.getDomainName(article.domain, lang)}</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.source}</span>
        </div>
        <h1 className="article-title">
          {lang === 'en' ? article.title_en : article.title_zh}
        </h1>
        <p className="article-authors">{article.authors}</p>
        <div className="article-rating">
          <span>{copy.rating}</span>
          <window.StarRating value={article.rating || 3} />
        </div>
      </header>

      <section className="article-body fade-up">
        <h2 className="eyebrow">{copy.summary}</h2>
        <p className="lede">{lang === 'en' ? article.summary_en : article.summary_zh}</p>

        <h2 className="eyebrow">{copy.why}</h2>
        <p>
          {lang === 'en'
            ? 'DashAttention replaces the hard top-k block selection in hierarchical attention with differentiable α-entmax routing, enabling adaptive per-query sparsity and end-to-end gradient flow while achieving 75% sparsity with accuracy comparable to full attention.'
            : '本文用可微分的 α-entmax 路由替代分层注意力中硬性的 top-k 块选择，实现每个查询的自适应稀疏性，同时保持端到端梯度流动。'}
        </p>

        <h2 className="eyebrow">{copy.crgp}</h2>
        <div className="crgp-grid">
          {['C','R','G','P'].map(k => (
            <div key={k} className="crgp-tile">
              <span className="crgp-letter">{k}</span>
              <h3>{copy.sections[k]}</h3>
              <p>{getCRGPSnippet(k, lang)}</p>
            </div>
          ))}
        </div>

        <h2 className="eyebrow">{copy.exp}</h2>
        <p>
          {lang === 'en'
            ? 'Comparable accuracy to full attention at 75% sparsity. Outperforms NSA and InfLLMv2 on the accuracy-vs-sparsity Pareto frontier. Triton implementation reaches 3.36× speedup over FlashAttention-3 and 1.35× over InfLLMv2 at inference time.'
            : '在 75% 稀疏度下精度与全注意力持平；在精度-稀疏帕累托前沿上优于 NSA 与 InfLLMv2；Triton 实现推理较 FlashAttention-3 提速 3.36×，较 InfLLMv2 提速 1.35×。'}
        </p>

        <h2 className="eyebrow">{copy.matters}</h2>
        <ol className="matters-list">
          <li>{lang === 'en'
            ? 'Provides a principled way to make hierarchical attention fully differentiable.'
            : '为分层注意力提供完全可微分的方案，使稀疏模式可通过梯度优化。'}</li>
          <li>{lang === 'en'
            ? 'α-entmax non-dispersion directly addresses long-context softmax degradation.'
            : 'α-entmax 的非分散特性直接解决长上下文 softmax 退化问题。'}</li>
          <li>{lang === 'en'
            ? 'Triton kernel ships measured speedups — deployable today.'
            : 'Triton 实现具实测加速，可立即部署。'}</li>
        </ol>

        <h2 className="eyebrow">{copy.next}</h2>
        <ul className="next-list">
          <li>{lang === 'en' ? 'Plug into existing long-context training pipeline.' : '接入现有长上下文训练流水线。'}</li>
          <li>{lang === 'en' ? 'Explore adaptive α scheduling per layer.' : '逐层探索自适应 α 调度。'}</li>
          <li>{lang === 'en' ? 'Cross-head shared summaries for memory reduction.' : '跨头共享摘要以降低内存。'}</li>
        </ul>

        <div className="article-tags">
          {(article.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        <a className="original-link" href="#" onClick={(e)=>e.preventDefault()}>
          {copy.original} <span>→</span>
        </a>
      </section>
    </article>
  );
}

function getCRGPSnippet(k, lang) {
  const en = {
    C: 'Dense softmax is dispersive over long context; hard top-k sparsity breaks differentiability — a sharp trade-off.',
    R: 'NSA, InfLLMv2, MoBA all use top-k block routing. AdaSplash provides efficient α-entmax kernels.',
    G: 'Fixed top-k assumes every query needs the same number of blocks. Routing has no gradient to chunk summaries.',
    P: 'Three stages: chunk summarisation via local attention → α-entmax sparse routing → fine-grained softmax on selected blocks.',
  };
  const zh = {
    C: '长上下文中 softmax 分散，硬 top-k 切断梯度 — 两难权衡。',
    R: 'NSA、InfLLMv2、MoBA 均用 top-k 块路由；AdaSplash 提供 α-entmax 的高效核函数。',
    G: '固定 top-k 假设所有查询所需块数相同；路由阶段没有梯度回到块摘要。',
    P: '三阶段：局部注意力做块摘要 → α-entmax 稀疏路由 → 在选中块上做精细 softmax。',
  };
  return (lang === 'en' ? en : zh)[k];
}

window.ArticleDetail = ArticleDetail;
