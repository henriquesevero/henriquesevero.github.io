const LISTING_I18N = {
  en: { articles: 'Articles', blogLabel: 'Technical Blog', minRead: 'min read',        home: 'Home',   backList: 'Articles',  empty: 'No articles yet — check back soon.' },
  pt: { articles: 'Artigos',  blogLabel: 'Blog Técnico',   minRead: 'min de leitura',  home: 'Início', backList: 'Artigos',   empty: 'Nenhum artigo ainda — volte em breve.' },
  es: { articles: 'Artículos',blogLabel: 'Blog Técnico',   minRead: 'min de lectura',  home: 'Inicio', backList: 'Artículos', empty: 'Aún sin artículos — vuelve pronto.' },
};

function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved && LISTING_I18N[saved]) return saved;
  const b = navigator.language.toLowerCase();
  if (b.startsWith('pt')) return 'pt';
  if (b.startsWith('es')) return 'es';
  return 'en';
}

let currentLang = detectLang();
const langCfg = { en: { flag: 'us', code: 'EN' }, pt: { flag: 'br', code: 'PT' }, es: { flag: 'es', code: 'ES' } };

function i18n(key) { return (LISTING_I18N[currentLang] || LISTING_I18N.en)[key] || key; }

function applyTranslations() {
  document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : currentLang;
  document.querySelectorAll('[data-ali18n]').forEach(el => { el.textContent = i18n(el.dataset.ali18n); });
}

function updateLangUI() {
  const cfg = langCfg[currentLang];
  const f = document.getElementById('alLangFlag'), c = document.getElementById('alLangCode');
  if (f) f.className = `fi fi-${cfg.flag} lang-flag`;
  if (c) c.textContent = cfg.code;
  document.querySelectorAll('.al-lang-option').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));
  applyTranslations();
}

function setLang(lang) { currentLang = lang; localStorage.setItem('lang', lang); updateLangUI(); renderIfReady(); }

document.addEventListener('DOMContentLoaded', () => {
  // Lang switcher wiring
  const trigger = document.getElementById('alLangTrigger');
  const dropdown = document.getElementById('alLangDropdown');
  if (trigger && dropdown) {
    trigger.addEventListener('click', () => {
      const open = dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('#alLangSwitcher')) { dropdown.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); }
    });
    document.querySelectorAll('.al-lang-option').forEach(btn => {
      btn.addEventListener('click', () => { setLang(btn.dataset.lang); dropdown.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); });
    });
  }

  updateLangUI();
  renderIfReady();
  initBlogNameTypewriter();
});

// ---- Blog name typewriter (same effect as portfolio hero) ----
function initBlogNameTypewriter() {
  const el = document.getElementById('blogName');
  if (!el) return;

  const word1 = 'Henrique '; // non-breaking space keeps words together
  const word2 = 'Severo';
  const speed      = 72;
  const wordPause  = 120;
  const startDelay = 350;

  el.innerHTML =
    '<span id="bn1"></span>' +
    '<span class="tw-accent" id="bn2"></span>' +
    '<span class="tw-cursor" id="bnC">|</span>';

  setTimeout(() => {
    const bn1    = document.getElementById('bn1');
    const bn2    = document.getElementById('bn2');
    const cursor = document.getElementById('bnC');
    let i = 0;

    function type1() {
      if (i < word1.length) {
        bn1.textContent += word1[i++];
        setTimeout(type1, speed);
      } else {
        setTimeout(() => {
          let j = 0;
          function type2() {
            if (j < word2.length) {
              bn2.textContent += word2[j++];
              setTimeout(type2, speed);
            } else {
              setTimeout(() => cursor && cursor.classList.add('tw-done'), 1800);
            }
          }
          type2();
        }, wordPause);
      }
    }
    type1();
  }, startDelay);
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString(
    currentLang === 'pt' ? 'pt-BR' : currentLang === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
}

function renderIfReady() {
  const data = window.ARTICLES_DATA;
  if (!data) return;
  render(data.articles || [], data.author || {});
}

function coverHTML(article) {
  if (article.cover) {
    return `<img src="${article.cover}" alt="" class="card-cover-img" loading="lazy" />`;
  }
  const gradient = article.gradient || 'linear-gradient(135deg, #0ea5e9 0%, #61dafb 100%)';
  return `<div class="card-cover-gradient" style="background:${gradient}">
    <svg viewBox="0 0 48 48" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-linecap="round">
      <rect x="6" y="6" width="36" height="36" rx="4"/>
      <path d="M6 18h36M18 18v24"/>
    </svg>
  </div>`;
}

function render(articles, author) {
  const grid = document.getElementById('articles-grid');
  if (!articles.length) {
    grid.innerHTML = `<p class="articles-empty">${i18n('empty')}</p>`;
    return;
  }
  const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
  grid.innerHTML = sorted.map((a, idx) => `
    <a href="post.html?post=${a.slug}" class="article-card" style="animation-delay:${idx * 70}ms">
      <div class="article-card-cover">
        ${coverHTML(a)}
      </div>
      <div class="article-card-content">
        <div class="article-card-author">
          <img class="card-avatar" src="${author.avatar || ''}" alt="${author.name || ''}" />
          <span class="card-author-name">${author.name || ''}</span>
        </div>
        <h2 class="article-card-title">${a.title}</h2>
        <p class="article-card-excerpt">${a.excerpt}</p>
        <div class="article-card-footer">
          <div class="article-card-tags">
            ${a.tags.map(t => `<span class="atag">${t}</span>`).join('')}
          </div>
          <span class="article-card-meta">
            <time>${fmt(a.date)}</time>
            <span class="article-sep">·</span>
            <span>${a.readTime} ${i18n('minRead')}</span>
          </span>
        </div>
      </div>
    </a>
  `).join('');
}
