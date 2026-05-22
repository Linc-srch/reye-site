// Reye UI kit — App
// Top-level: state for current section, language, open article;
// IntersectionObserver to drive .fade-up enter animations.

const { useEffect: useEffectA, useRef: useRefA, useState: useStateA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroScale": "cinematic",
  "gradientHeadlines": true,
  "scrollCue": true,
  "domainHoverGlow": true,
  "parallaxOrbs": true,
  "lang": "en"
}/*EDITMODE-END*/;

function useScrollFadeUp(deps = []) {
  useEffectA(() => {
    // Mark elements BELOW the fold as needing the entry animation.
    // Above-the-fold ones stay visible by default — no class added.
    const markBelowFold = () => {
      const cutoff = window.innerHeight * 0.95;
      document.querySelectorAll('.fade-up:not(.pre-anim):not(.is-in)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top >= cutoff) el.classList.add('pre-anim');
      });
    };
    markBelowFold();

    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -5% 0px' });

    const observe = () => {
      markBelowFold();
      document.querySelectorAll('.fade-up.pre-anim:not(.is-in)').forEach(el => io.observe(el));
    };
    observe();

    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, deps);
}

function App() {
  const [section, setSection] = useStateA('home');
  const [openArticle, setOpenArticle] = useStateA(null);
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const lang = t.lang;
  const setLang = (v) => setTweak('lang', v);

  useScrollFadeUp([section, openArticle, lang]);

  // Apply tweak side effects to the DOM root
  useEffectA(() => {
    document.body.classList.toggle('hero-compact', t.heroScale === 'compact');
    document.body.classList.toggle('no-gradient-headlines', !t.gradientHeadlines);
    document.body.classList.toggle('no-scroll-cue', !t.scrollCue);
    document.body.classList.toggle('no-hover-glow', !t.domainHoverGlow);
    document.body.classList.toggle('no-parallax', !t.parallaxOrbs);
  }, [t.heroScale, t.gradientHeadlines, t.scrollCue, t.domainHoverGlow, t.parallaxOrbs]);

  // Persist lang separately so it survives non-tweak reloads too
  useEffectA(() => {
    const saved = localStorage.getItem('reye-lang');
    if ((saved === 'en' || saved === 'zh') && saved !== lang) {
      setTweak('lang', saved);
    }
  }, []);
  useEffectA(() => { localStorage.setItem('reye-lang', lang); }, [lang]);

  const stats = {
    analysed: 107,
    tracked: 111,
    domains: 5,
    updated: '2026-05-21',
  };

  const navigate = (id) => {
    setOpenArticle(null);
    setSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openArticleView = (a) => {
    setOpenArticle(a);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Article detail overrides the section view
  let content;
  if (openArticle) {
    content = (
      <window.ArticleDetail
        article={openArticle}
        lang={lang}
        onBack={() => setOpenArticle(null)}
      />
    );
  } else if (section === 'home') {
    content = (
      <>
        <window.Hero lang={lang} stats={stats} />
        <window.DomainGrid lang={lang} onPick={() => navigate('search')} />
        <window.FeaturedFeed lang={lang} onOpen={openArticleView} />
      </>
    );
  } else if (section === 'search') {
    content = <window.SearchPane lang={lang} onOpen={openArticleView} />;
  } else if (section === 'about') {
    content = <window.AboutPane lang={lang} />;
  } else if (section === 'insights') {
    content = <InsightsPane lang={lang} />;
  }

  return (
    <div className={`reye-app ${openArticle ? 'is-detail' : ''}`}>
      <window.Header
        section={section}
        onNavigate={navigate}
        lang={lang}
        setLang={setLang}
      />
      <main>{content}</main>
      <window.Footer lang={lang} stats={stats} />

      <window.TweaksPanel>
        <window.TweakSection label="Hero" />
        <window.TweakRadio
          label="Scale"
          value={t.heroScale}
          options={['compact', 'cinematic']}
          onChange={(v) => setTweak('heroScale', v)}
        />
        <window.TweakToggle
          label="Scroll cue"
          value={t.scrollCue}
          onChange={(v) => setTweak('scrollCue', v)}
        />
        <window.TweakToggle
          label="Parallax orbs"
          value={t.parallaxOrbs}
          onChange={(v) => setTweak('parallaxOrbs', v)}
        />

        <window.TweakSection label="Headlines" />
        <window.TweakToggle
          label="Gradient accent"
          value={t.gradientHeadlines}
          onChange={(v) => setTweak('gradientHeadlines', v)}
        />

        <window.TweakSection label="Domain cards" />
        <window.TweakToggle
          label="Hover glow"
          value={t.domainHoverGlow}
          onChange={(v) => setTweak('domainHoverGlow', v)}
        />

        <window.TweakSection label="Language" />
        <window.TweakRadio
          label="Surface"
          value={t.lang}
          options={['en', 'zh']}
          onChange={(v) => setTweak('lang', v)}
        />
      </window.TweaksPanel>
    </div>
  );
}

function InsightsPane({ lang }) {
  return (
    <section className="reye-section insights-section">
      <div className="section-head fade-up">
        <p className="eyebrow">{lang === 'en' ? 'Daily insights' : '每日洞察'}</p>
        <h2 className="section-h2">
          {lang === 'en'
            ? <>Synthesis arrives <span className="accent">every day, 09:30.</span></>
            : <>综合洞察 <span className="accent">每日 09:30</span> 发布。</>}
        </h2>
      </div>
      <div className="insights-placeholder fade-up">
        <div className="placeholder-orb"></div>
        <p>
          {lang === 'en'
            ? "Today's batch is still being prepared. New synthesis lands every day at 09:30 — check back shortly."
            : '今日批次正在生成中。每日 09:30 发布新的综合洞察 — 稍后再来。'}
        </p>
      </div>
    </section>
  );
}

window.App = App;
