// Reye UI kit — Hero
// Apple-marketing-cinema flavor while keeping the dark-glass colour palette:
// huge display type, breathy whitespace, parallax orbs reacting to scroll,
// in-view fade-up, a soft scroll cue.

const { useEffect, useRef, useState: useStateH } = React;

function Hero({ lang, stats }) {
  const ref = useRef(null);
  const [scrollY, setScrollY] = useStateH(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Subtle parallax on the orbs — they drift up as user scrolls
  const blueT  = `translate3d(${scrollY * 0.04}px, ${-scrollY * 0.12}px, 0)`;
  const violetT = `translate3d(${-scrollY * 0.05}px, ${-scrollY * 0.08}px, 0)`;

  const copy = {
    en: {
      lab: 'Singapore Digital Trust',
      eyebrow: 'A daily research feed',
      title1: 'A research eye,',
      title2: 'exploring the frontiers',
      title3: 'of digital trust.',
      lede: 'Reye tracks the moving frontier of LLM safety, system security, cryptography and digital identity. Every paper, every blog. Summarised, scored, refreshed daily.',
      cta: 'Browse the feed',
      cta2: 'How it works',
    },
    zh: {
      lab: '新加坡数字信任实验室',
      eyebrow: '每日研究订阅',
      title1: '数字信任之眼，',
      title2: '探索研究的',
      title3: '前沿。',
      lede: 'Reye 持续追踪 LLM 安全、系统安全、密码学与数字身份的前沿。每篇论文、每条博客，自动摘要、自动评分，每日更新。',
      cta: '浏览订阅',
      cta2: '工作原理',
    }
  }[lang];

  return (
    <section className="reye-hero" ref={ref}>
      <div className="orb orb-blue" style={{ transform: blueT }} />
      <div className="orb orb-violet" style={{ transform: violetT }} />

      <div className="hero-inner">
        <div className="flame-stage fade-up" style={{ '--d': '0ms' }}>
          <window.ReyeFlame size={360} beam={true}/>
        </div>
        <a className="lab-badge fade-up" href="#" onClick={(e) => e.preventDefault()} style={{ '--d': '100ms' }}>
          <window.EyeMark size={14}/>
          <span>{copy.lab}</span>
          <span className="lab-badge-arrow">→</span>
        </a>
        <p className="eyebrow fade-up" style={{ '--d': '180ms' }}>{copy.eyebrow}</p>
        <h1 className="display">
          <span className="fade-up" style={{ '--d': '120ms' }}>{copy.title1}</span>
          <span className="fade-up" style={{ '--d': '240ms' }}>{copy.title2}</span>
          <span className="fade-up accent" style={{ '--d': '360ms' }}>{copy.title3}</span>
        </h1>
        <p className="lede fade-up" style={{ '--d': '520ms' }}>{copy.lede}</p>

        <div className="cta-row fade-up" style={{ '--d': '680ms' }}>
          <a href="#search" className="btn btn-primary">{copy.cta} <span>→</span></a>
          <a href="#about" className="btn btn-ghost">{copy.cta2}</a>
        </div>

        <div className="stats fade-up" style={{ '--d': '860ms' }}>
          <div className="stat">
            <div className="num">{stats.analysed}</div>
            <div className="lbl">{lang === 'en' ? 'papers analysed' : '篇已分析'}</div>
          </div>
          <div className="stat">
            <div className="num">{stats.tracked}</div>
            <div className="lbl">{lang === 'en' ? 'total tracked' : '篇已追踪'}</div>
          </div>
          <div className="stat">
            <div className="num">{stats.domains}</div>
            <div className="lbl">{lang === 'en' ? 'domains' : '研究领域'}</div>
          </div>
          <div className="stat">
            <div className="num">{stats.updated}</div>
            <div className="lbl">{lang === 'en' ? 'updated' : '最后更新'}</div>
          </div>
        </div>

        <div className="scroll-cue">
          <span>{lang === 'en' ? 'Scroll' : '向下浏览'}</span>
          <div className="cue-line"></div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
