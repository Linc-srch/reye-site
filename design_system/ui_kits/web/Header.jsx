// Reye UI kit — Header
// Sticky floating glass capsule, identical to the source repo header
// but extracted as a React component with click-to-navigate.

const { useState } = React;

function Header({ section, onNavigate, lang, setLang }) {
  const navItems = [
    { id: 'home',     en: 'Home',     zh: '首页' },
    { id: 'search',   en: 'Search',   zh: '搜索' },
    { id: 'insights', en: 'Insights', zh: '洞察' },
    { id: 'about',    en: 'About',    zh: '关于' },
  ];

  return (
    <header className="reye-header">
      <a
        className="brand"
        href="#home"
        onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
      >
        <window.EyeMark size={22}/>
        <span className="wordmark">Reye</span>
        <span className="sep">·</span>
        <span className="zh-mark">数字信任之眼</span>
      </a>

      <nav>
        {navItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={section === item.id ? 'is-active' : ''}
            onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
          >
            {lang === 'en' ? item.en : item.zh}
          </a>
        ))}

        <div className="lang-toggle">
          <button
            className={lang === 'en' ? 'is-active' : ''}
            onClick={() => setLang('en')}
          >EN</button>
          <button
            className={lang === 'zh' ? 'is-active' : ''}
            onClick={() => setLang('zh')}
          >中</button>
        </div>
      </nav>
    </header>
  );
}

window.Header = Header;
