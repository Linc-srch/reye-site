// Reye UI kit — About + Footer.

function AboutPane({ lang }) {
  return (
    <section className="reye-section about-section">
      <div className="section-head fade-up">
        <p className="eyebrow">{lang === 'en' ? 'About this feed' : '关于此订阅'}</p>
        <h2 className="section-h2">
          {lang === 'en'
            ? <>An open feed, <span className="accent">by Singapore Digital Trust.</span></>
            : <>开放订阅，<span className="accent">由新加坡数字信任实验室出品。</span></>}
        </h2>
      </div>

      <div className="about-grid">
        <div className="about-card fade-up">
          <h3>{lang === 'en' ? 'Reye / 数字信任之眼' : 'Reye / 数字信任之眼'}</h3>
          <p>{lang === 'en'
            ? 'Reye (数字信任之眼) is an open daily research feed published by Singapore Digital Trust — tracking the moving frontier of LLM safety, system security, cryptography, and digital identity.'
            : 'Reye（数字信任之眼）是新加坡数字信任实验室运营的每日研究订阅，持续追踪 LLM 安全、系统安全、密码学与数字身份的前沿。'}</p>
        </div>
        <div className="about-card fade-up" style={{ '--d': '100ms' }}>
          <h3>{lang === 'en' ? 'How it works' : '工作原理'}</h3>
          <ol>
            <li>{lang === 'en' ? 'Crawl arXiv, DeepMind blog, IETF, NIST drafts.' : '抓取 arXiv、DeepMind 博客、IETF、NIST 草案。'}</li>
            <li>{lang === 'en' ? 'Filter by tracked keywords.' : '按追踪关键词过滤。'}</li>
            <li>{lang === 'en' ? 'Auto-summarise to a 4-line lede + a Deep Note.' : '自动生成 4 行摘要与深度笔记。'}</li>
            <li>{lang === 'en' ? 'Score 1–5 on quality and personal relevance.' : '按质量与相关性 1–5 分评分。'}</li>
            <li>{lang === 'en' ? 'Generate fresh insights every day, 09:30.' : '每日 09:30 生成洞察。'}</li>
          </ol>
        </div>
        <div className="about-card fade-up" style={{ '--d': '200ms' }}>
          <h3>{lang === 'en' ? 'Tracked keywords' : '追踪关键词'}</h3>
          <div className="keyword-tags">
            {['large language models','reinforcement learning','agentic AI','retrieval-augmented generation','multimodal models','AI safety','post-quantum cryptography','digital identity','3GPP'].map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ lang, stats }) {
  return (
    <footer className="reye-footer fade-up">
      <div className="footer-row">
        <span className="footer-brand"><window.EyeMark size={22}/> Reye</span>
        <span className="footer-zh">数字信任之眼</span>
      </div>
      <div className="footer-lab">
        <span className="footer-by">{lang === 'en' ? 'A research feed by' : '由以下机构出品：'}</span>
        <a href="#" onClick={(e)=>e.preventDefault()} className="footer-lab-name">
          {lang === 'en' ? 'Singapore Digital Trust' : '新加坡数字信任实验室'}
          <span>→</span>
        </a>
      </div>
      <div className="footer-meta">
        <span>{lang === 'en' ? 'Updated' : '最后更新'} <strong>{stats.updated}</strong></span>
        <span>·</span>
        <span><strong>{stats.analysed}</strong> {lang === 'en' ? 'analysed' : '已分析'}</span>
        <span>·</span>
        <span><strong>{stats.tracked}</strong> {lang === 'en' ? 'tracked' : '已追踪'}</span>
      </div>
      <div className="footer-lede">
        {lang === 'en'
          ? 'A static research feed. No tracking, no accounts, no ads. Just papers.'
          : '静态研究订阅。无追踪、无账户、无广告，仅论文。'}
      </div>
    </footer>
  );
}

window.AboutPane = AboutPane;
window.Footer = Footer;
