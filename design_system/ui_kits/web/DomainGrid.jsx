// Reye UI kit — DomainGrid
// 5 domain cards (AI Safety, System Safety, Cryptography, Digital Identity, General).
// Apple-flavor upgrade: large numerals, sub-line of progress meta, hover lift,
// in-view stagger.

const DOMAINS = [
  { id: 'ai_safety',         en: 'AI Safety',                zh: 'AI 安全',       count: 98,  today: 2 },
  { id: 'system_safety',     en: 'System Safety',            zh: '系统安全',       count: 79,  today: 1 },
  { id: 'cryptography',      en: 'Cryptography',             zh: '密码学',         count: 50,  today: 0 },
  { id: 'digital_identity',  en: 'Digital Identity & Trust', zh: '数字身份与信任', count: 52,  today: 0 },
  { id: 'general',           en: 'General · All',            zh: '全部',           count: 111, today: 3 },
];

function DomainGrid({ lang, onPick }) {
  return (
    <section className="reye-section domain-section">
      <div className="section-head fade-up">
        <p className="eyebrow">{lang === 'en' ? '04 Domains tracked' : '04 追踪领域'}</p>
        <h2 className="section-h2">
          {lang === 'en'
            ? <>Five corners of <span className="accent">Singapore trust research</span>.</>
            : <>新加坡数字信任的 <span className="accent">五个角落</span>。</>}
        </h2>
      </div>

      <div className="domain-grid">
        {DOMAINS.map((d, i) => (
          <a
            href={`#domain/${d.id}`}
            key={d.id}
            className="domain-card fade-up"
            style={{ '--d': `${i * 80}ms` }}
            onClick={(e) => { e.preventDefault(); onPick(d.id); }}
          >
            <div className="count">{d.count}</div>
            <h3>{lang === 'en' ? d.en : d.zh}</h3>
            <div className="meta">
              {d.today === 0
                ? (lang === 'en' ? 'No new today' : '今日无新增')
                : (lang === 'en' ? `${d.today} new today` : `今日新增 ${d.today}`)}
              <span className="arrow">→</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

window.DomainGrid = DomainGrid;
window.DOMAINS = DOMAINS;
