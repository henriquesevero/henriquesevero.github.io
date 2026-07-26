// ============================================
// Translations
// ============================================
const READER_I18N = {
  en: { minRead: 'min read', back: '← All articles', backList: 'Articles', role: 'Senior Software Engineer', blogLabel: 'Technical Blog' },
  pt: { minRead: 'min de leitura', back: '← Todos os artigos', backList: 'Artigos', role: 'Engenheiro de Software Sênior', blogLabel: 'Blog Técnico' },
  es: { minRead: 'min de lectura', back: '← Todos los artículos', backList: 'Artículos', role: 'Ingeniero de Software Senior', blogLabel: 'Blog Técnico' },
};
const langCfg = { en: { flag: 'us', code: 'EN' }, pt: { flag: 'br', code: 'PT' }, es: { flag: 'es', code: 'ES' } };

function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved && READER_I18N[saved]) return saved;
  const b = navigator.language.toLowerCase();
  if (b.startsWith('pt')) return 'pt';
  if (b.startsWith('es')) return 'es';
  return 'en';
}

let currentLang = detectLang();
function t(key) { return (READER_I18N[currentLang] || READER_I18N.en)[key] || key; }

function updateLangUI() {
  const cfg = langCfg[currentLang];
  const f = document.getElementById('alLangFlag'), c = document.getElementById('alLangCode');
  if (f) f.className = `fi fi-${cfg.flag} lang-flag`;
  if (c) c.textContent = cfg.code;
  document.querySelectorAll('.al-lang-option').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));
  document.querySelectorAll('[data-ali18n]').forEach(el => { el.textContent = t(el.dataset.ali18n); });
  document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : currentLang;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  updateLangUI();
}

// ============================================
// Lang switcher wiring
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const trigger  = document.getElementById('alLangTrigger');
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
  loadArticle();

  const HL_DARK  = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css';
  const HL_LIGHT = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
  const hljsLink = document.getElementById('hljs-theme');
  let theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const syncHljs = () => { if (hljsLink) hljsLink.href = theme === 'light' ? HL_LIGHT : HL_DARK; };
  syncHljs();
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.add('theme-switching');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    syncHljs();
    setTimeout(() => document.documentElement.classList.remove('theme-switching'), 400);
  });

  const progressBar = document.getElementById('reading-progress');
  window.addEventListener('scroll', () => {
    const body = document.getElementById('article-body');
    if (!body || !progressBar) return;
    const pct = Math.min(Math.max((scrollY + innerHeight - body.offsetTop) / body.offsetHeight, 0), 1);
    progressBar.style.width = (pct * 100) + '%';
  });
});

// ============================================
// Article loading
// ============================================
function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString(
    currentLang === 'pt' ? 'pt-BR' : currentLang === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
}

async function loadArticle() {
  const slug = new URLSearchParams(location.search).get('post');
  if (!slug) { showError('not-found'); return; }

  const data = window.ARTICLES_DATA;
  const meta = data?.articles?.find(a => a.slug === slug) || null;
  if (meta) { document.title = meta.title + ' — Henrique Severo'; updateSocialMeta(meta); }
  renderHeader(meta);

  try {
    const res = await fetch(`posts/${slug}.md`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();
    renderBody(md);
  } catch (err) {
    console.error('Failed to fetch article:', err);
    if (window.location.protocol === 'file:') {
      document.getElementById('article-body').innerHTML = `
        <div class="file-notice">
          <p>Para visualizar o artigo localmente, use um servidor HTTP:</p>
          <pre><code>npx serve .</code></pre>
          <p>No GitHub Pages, o artigo aparecerá normalmente.</p>
        </div>`;
    } else {
      showError('load-fail');
    }
  }
}

function renderHeader(meta) {
  const header = document.getElementById('article-header');
  if (!meta) { header.innerHTML = ''; return; }

  let coverHtml = '';
  if (meta.cover) {
    coverHtml = `<div class="article-reader-cover"><img src="${meta.cover}" alt="${meta.title}" class="article-reader-cover-img" /></div>`;
  } else if (meta.gradient) {
    coverHtml = `<div class="article-reader-cover"><div class="article-reader-cover-gradient" style="background:${meta.gradient}"></div></div>`;
  }

  header.innerHTML = `
    ${coverHtml}
    <div class="article-card-tags" style="margin-bottom:1.5rem">
      ${meta.tags.map(tag => `<span class="atag">${tag}</span>`).join('')}
    </div>
    <h1 class="article-h1">${meta.title}</h1>
    <div class="article-meta-row">
      <time>${fmt(meta.date)}</time>
      <span class="article-sep">·</span>
      <span>${meta.readTime} ${t('minRead')}</span>
    </div>
    <hr class="article-divider" />
  `;
}

// ============================================
// Markdown renderer — compatible with marked v9+
// ============================================
function buildRenderer() {
  return {
    code(token) {
      const text = typeof token === 'object' ? (token.text || '') : String(token);
      const lang = typeof token === 'object' ? (token.lang || '') : (arguments[1] || '');

      if (typeof hljs === 'undefined') {
        return `<pre><code>${escapeHtml(text)}</code></pre>`;
      }

      const language = (lang && hljs.getLanguage(lang)) ? lang : 'plaintext';
      try {
        const highlighted = hljs.highlight(text, { language }).value;
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
      } catch {
        return `<pre><code>${escapeHtml(text)}</code></pre>`;
      }
    }
  };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderBody(md) {
  const content = md.replace(/^#\s+.+\n/, '');
  try {
    marked.use({ renderer: buildRenderer(), gfm: true, breaks: false });
    document.getElementById('article-body').innerHTML = marked.parse(content);
  } catch (err) {
    console.error('marked.parse failed:', err);
    document.getElementById('article-body').innerHTML =
      `<pre style="white-space:pre-wrap;font-size:.9rem">${escapeHtml(content)}</pre>`;
  }
}

function updateSocialMeta(meta) {
  const imgUrl = meta.cover ? new URL(meta.cover, location.href).href : null;
  const pageUrl = location.origin + location.pathname.replace(/[^/]*$/, '') + meta.slug + '/';
  const set = (sel, val) => document.querySelector(sel)?.setAttribute('content', val);
  set('meta[property="og:url"]', pageUrl);
  ['meta[property="og:title"]',       'meta[name="twitter:title"]'      ].forEach(s => set(s, meta.title));
  ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'].forEach(s => set(s, meta.excerpt));
  if (imgUrl) ['meta[property="og:image"]', 'meta[name="twitter:image"]'].forEach(s => set(s, imgUrl));
}

function showError(type) {
  document.getElementById('article-body').innerHTML =
    `<p class="articles-empty">${type === 'not-found' ? 'Article not found.' : 'Failed to load article.'}</p>`;
}
