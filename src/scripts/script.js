// ============================================
// TRANSLATIONS
// ============================================
const translations = {
  en: {
    'nav.home':       'Home',
    'nav.testimonials': 'Reviews',
    'nav.skills':     'Skills',
    'nav.whatido':    'What I Do',
    'nav.portfolio':  'Code',
    'nav.contact':    'Contact',
    'nav.articles':   'Articles',

    'hero.tag':         "I'm a Software Engineer",
    'hero.sub':         "From São Paulo, Brazil, I'm a Software Engineer with 11 years of experience designing and building backend systems for distributed, high-availability environments.",
    'hero.cta_contact': 'Get in touch',

    'about.stat1_label': 'Years of Experience',
    'about.stat2_num':   'Backend',
    'about.stat2_label': 'Engineer',

    'skills.label': 'Expertise',
    'skills.title':          'Skills',
    'skills.cat1':           'Backend & Distributed Systems',
    'skills.cat1_desc':      '11 years building backend systems in Python, Go, and C#/.NET, focused on reliability and scale.',
    'skills.cat2':           'Cloud & Infrastructure',
    'skills.cat2_desc':      'AWS, Terraform, Docker, and Kubernetes in production, with event-driven pipelines via Kafka.',
    'skills.cat3':           'Data & Databases',
    'skills.cat3_desc':      'PostgreSQL, MySQL, SQL Server, MongoDB, and Redis — choosing the right store for each consistency, scale, or latency need.',
    'skills.cat4':           'AI Engineering',
    'skills.cat4_desc':      'LLM-based applications and agents with LangChain, LangGraph, and MCP, integrating tools like Claude Code, Cursor, and Devin into daily work.',
    'skills.spoken_label':  'Spoken Languages',
    'skills.lang_pt_level': 'Native',
    'skills.lang_en_level': 'B2 · Intermediate',

    'whatido.label':    'Specialization',
    'whatido.title':    'WHAT I DO',
    'whatido1.title': 'Backend Engineering',
    'whatido1.desc':  'I design and build backend systems for distributed, high-demand environments, focused on reliability, scalability, and performance.',
    'whatido2.title': 'System Design & Architecture',
    'whatido2.desc':  'I make architectural decisions for systems that need to scale safely under strict regulatory and availability constraints.',
    'whatido3.title': 'AI Engineering',
    'whatido3.desc':  'I build LLM-based applications, RAG pipelines, and agent systems, with a focus on observability in production.',

    'portfolio.label':    'Code',
    'portfolio.title':    'On GitHub',
    'portfolio.gh_title': 'Explore my code on GitHub',
    'portfolio.gh_stat_repos': 'Public Repositories',
    'portfolio.gh_cta':   'GitHub',

    'testimonials.label':    'Recommendation',
    'testimonials.title':    'What People Say',
    'testimonials1.text': 'Henrique is a professional with excellent technical command and a strong commitment to the quality of his work. He has always shown proactivity, maturity in decision-making, and the ability to add value both technically and as part of a team.',
    'testimonials1.name': 'Yan Kelvin',
    'testimonials1.role': 'Senior Software Engineer at iFood',
    'testimonials2.text': 'I had the opportunity to work with Henrique and I can say he is an extremely competent, dedicated, and collaborative professional. During the time we worked together, he showed great technical ability and always stayed focused on the goals, adding great value to the team.',
    'testimonials2.name': 'Evandro Alcantara',
    'testimonials2.role': 'Risk Coordinator at Itaú Unibanco',
    'testimonials3.text': 'Henrique is a dedicated and extremely competent person in what he does, and always showed skill, technical ability, and proactivity in solving the problems that came up. He puts forward his ideas to further improve the work requested, which will certainly make him a good Systems Analyst.',
    'testimonials3.name': 'Roney Amorim',
    'testimonials3.role': 'Engineering Coordinator at Itaú Unibanco',
    'testimonials4.text': "Henrique is an exemplary professional with impeccable character. Always committed to the company's vision and mission, he strongly pursues applying his technical skills to contribute to the business. He has a unique ability to engage people in teamwork and achieve excellent results! It's always a great pleasure to work alongside professionals like Henrique!",
    'testimonials4.name': 'João Maziero',
    'testimonials4.role': 'Software Engineer at BTG Pactual',

    'contact.label': 'Contact',
    'contact.title': "Let's talk?<br /><span></span>",
    'contact.email_label': 'Email',

    'footer.copy': '© 2026 Henrique Bittencourt Severo',
  },

  pt: {
    'nav.home':       'Início',
    'nav.testimonials': 'Avaliações',
    'nav.skills':     'Habilidades',
    'nav.whatido':    'O Que Eu Faço',
    'nav.portfolio':  'Código',
    'nav.contact':    'Contato',
    'nav.articles':   'Artigos',

    'hero.tag':         'Eu sou Engenheiro de Software',
    'hero.sub':         'De São Paulo, Brasil, sou um Engenheiro de Software com 11 anos de experiência projetando e construindo sistemas backend para ambientes distribuídos e de alta disponibilidade.',
    'hero.cta_contact': 'Entre em contato',

    'about.stat1_label': 'Anos de Experiência',
    'about.stat2_num':   'Backend',
    'about.stat2_label': 'Engineer',

    'skills.label':          'Conhecimento',
    'skills.title':          'Habilidades',
    'skills.cat1':           'Backend & Sistemas Distribuídos',
    'skills.cat1_desc':      '11 anos construindo sistemas backend em Python, Go e C#/.NET, com foco em confiabilidade e escala.',
    'skills.cat2':           'Cloud & Infraestrutura',
    'skills.cat2_desc':      'AWS, Terraform, Docker e Kubernetes em produção, com pipelines orientados a eventos via Kafka.',
    'skills.cat3':           'Dados & Bancos de Dados',
    'skills.cat3_desc':      'PostgreSQL, MySQL, SQL Server, MongoDB e Redis — escolhendo o armazenamento certo para cada necessidade de consistência, escala ou latência.',
    'skills.cat4':           'Engenharia de IA',
    'skills.cat4_desc':      'Aplicações baseadas em LLM e agentes com LangChain, LangGraph e MCP, integrando ferramentas como Claude Code, Cursor e Devin ao dia a dia.',
    'skills.spoken_label':  'Idiomas',
    'skills.lang_pt_level': 'Nativo',
    'skills.lang_en_level': 'B2 · Intermediário',

    'whatido.label':    'Especialização',
    'whatido.title':    'O QUE EU FAÇO',
    'whatido1.title': 'Engenharia Backend',
    'whatido1.desc':  'Projeto e construo sistemas backend para ambientes distribuídos e de alta demanda, com foco em confiabilidade, escalabilidade e performance.',
    'whatido2.title': 'Design de Sistemas & Arquitetura',
    'whatido2.desc':  'Tomo decisões de arquitetura para sistemas que precisam escalar com segurança sob rígidas restrições regulatórias e de disponibilidade.',
    'whatido3.title': 'Engenharia de IA',
    'whatido3.desc':  'Construo aplicações baseadas em LLM, pipelines RAG e sistemas de agentes, com foco em observabilidade em produção.',

    'portfolio.label':    'Código',
    'portfolio.title':    'No GitHub',
    'portfolio.gh_title': 'Explore meu código no GitHub',
    'portfolio.gh_stat_repos': 'Repositórios Públicos',
    'portfolio.gh_cta':   'GitHub',

    'testimonials.label':    'Recomendação',
    'testimonials.title':    'O Que Dizem Sobre Mim',
    'testimonials1.text': 'Henrique é um profissional com excelente domínio técnico e grande comprometimento com a qualidade das entregas. Sempre demonstrou proatividade, maturidade na tomada de decisões e capacidade de agregar valor tanto tecnicamente quanto no trabalho em equipe.',
    'testimonials1.name': 'Yan Kelvin',
    'testimonials1.role': 'Senior Software Engineer no iFood',
    'testimonials2.text': 'Tive a oportunidade de trabalhar com o Henrique e posso dizer que é um profissional extremamente competente, dedicado e colaborativo. No período que trabalhamos juntos, ele demonstrou grande capacidade técnica e sempre focado nos objetivos agregando grande valor para o time.',
    'testimonials2.name': 'Evandro Alcantara',
    'testimonials2.role': 'Coordenador de Risco no Itaú Unibanco',
    'testimonials3.text': 'Henrique é uma pessoa dedicada e extremamente competente no que faz e sempre demostrou destreza, técnica e proatividade em resolver os problemas que surgiram. Expõe suas ideias para melhorar ainda mais o trabalho solicitado, levando com certeza a ser um bom Analista de Sistemas.',
    'testimonials3.name': 'Roney Amorim',
    'testimonials3.role': 'Coordenador de Engenharia no Itaú Unibanco',
    'testimonials4.text': 'Henrique é um profissional exemplar e de caráter irrepreensível. Sempre comprometido com a visão e missão da empresa, busca com veemência aplicar suas competências técnicas para contribuir com os negócios da Cia. Possuí habilidades ímpares para envolver as pessoas no trabalho em equipe e alcançar excelentes resultados! É sempre um enorme prazer trabalhar ao lado de profissionais como o Henrique!',
    'testimonials4.name': 'João Maziero',
    'testimonials4.role': 'Engenheiro de Software no BTG Pactual',

    'contact.label': 'Contato',
    'contact.title': 'Vamos<br /><span>Conversar?</span>',
    'contact.email_label': 'Email',

    'footer.copy': '© 2026 Henrique Bittencourt Severo',
  },

  es: {
    'nav.home':       'Inicio',
    'nav.testimonials': 'Reseñas',
    'nav.skills':     'Habilidades',
    'nav.whatido':    'Qué Hago',
    'nav.portfolio':  'Código',
    'nav.contact':    'Contacto',
    'nav.articles':   'Artículos',

    'hero.tag':         'Soy Ingeniero de Software',
    'hero.sub':         'Desde São Paulo, Brasil, soy un Ingeniero de Software con 11 años de experiencia diseñando y construyendo sistemas backend para entornos distribuidos y de alta disponibilidad.',
    'hero.cta_contact': 'Contáctame',

    'about.stat1_label': 'Años de Experiencia',
    'about.stat2_num':   'Backend',
    'about.stat2_label': 'Engineer',

    'skills.label':          'Conocimiento',
    'skills.title':          'Habilidades',
    'skills.cat1':           'Backend & Sistemas Distribuidos',
    'skills.cat1_desc':      '11 años construyendo sistemas backend en Python, Go y C#/.NET, con foco en confiabilidad y escala.',
    'skills.cat2':           'Cloud & Infraestructura',
    'skills.cat2_desc':      'AWS, Terraform, Docker y Kubernetes en producción, con pipelines orientados a eventos vía Kafka.',
    'skills.cat3':           'Datos & Bases de Datos',
    'skills.cat3_desc':      'PostgreSQL, MySQL, SQL Server, MongoDB y Redis — eligiendo el almacenamiento correcto para cada necesidad de consistencia, escala o latencia.',
    'skills.cat4':           'Ingeniería de IA',
    'skills.cat4_desc':      'Aplicaciones basadas en LLM y agentes con LangChain, LangGraph y MCP, integrando herramientas como Claude Code, Cursor y Devin al trabajo diario.',
    'skills.spoken_label':  'Idiomas',
    'skills.lang_pt_level': 'Nativo',
    'skills.lang_en_level': 'B2 · Intermedio',

    'whatido.label':    'Especialización',
    'whatido.title':    'QUÉ HAGO',
    'whatido1.title': 'Ingeniería Backend',
    'whatido1.desc':  'Diseño y construyo sistemas backend para entornos distribuidos y de alta demanda, con foco en confiabilidad, escalabilidad y rendimiento.',
    'whatido2.title': 'Diseño de Sistemas & Arquitectura',
    'whatido2.desc':  'Tomo decisiones de arquitectura para sistemas que necesitan escalar con seguridad bajo estrictas restricciones regulatorias y de disponibilidad.',
    'whatido3.title': 'Ingeniería de IA',
    'whatido3.desc':  'Construyo aplicaciones basadas en LLM, pipelines RAG y sistemas de agentes, con foco en observabilidad en producción.',

    'portfolio.label':    'Código',
    'portfolio.title':    'En GitHub',
    'portfolio.gh_title': 'Explora mi código en GitHub',
    'portfolio.gh_stat_repos': 'Repositorios Públicos',
    'portfolio.gh_cta':   'GitHub',

    'testimonials.label':    'Recomendación',
    'testimonials.title':    'Lo Que Dicen de Mí',
    'testimonials1.text': 'Henrique es un profesional con excelente dominio técnico y un gran compromiso con la calidad de sus entregas. Siempre demostró proactividad, madurez en la toma de decisiones y capacidad de agregar valor tanto técnicamente como en el trabajo en equipo.',
    'testimonials1.name': 'Yan Kelvin',
    'testimonials1.role': 'Senior Software Engineer en iFood',
    'testimonials2.text': 'Tuve la oportunidad de trabajar con Henrique y puedo decir que es un profesional extremadamente competente, dedicado y colaborativo. Durante el tiempo que trabajamos juntos, demostró gran capacidad técnica y siempre estuvo enfocado en los objetivos, agregando gran valor al equipo.',
    'testimonials2.name': 'Evandro Alcantara',
    'testimonials2.role': 'Coordinador de Riesgo en Itaú Unibanco',
    'testimonials3.text': 'Henrique es una persona dedicada y extremadamente competente en lo que hace, y siempre mostró destreza, capacidad técnica y proactividad para resolver los problemas que surgían. Expone sus ideas para mejorar aún más el trabajo solicitado, lo que sin duda lo convertirá en un buen Analista de Sistemas.',
    'testimonials3.name': 'Roney Amorim',
    'testimonials3.role': 'Coordinador de Ingeniería en Itaú Unibanco',
    'testimonials4.text': 'Henrique es un profesional ejemplar y de carácter intachable. Siempre comprometido con la visión y misión de la empresa, busca con firmeza aplicar sus competencias técnicas para contribuir con el negocio. Posee una habilidad única para involucrar a las personas en el trabajo en equipo y alcanzar excelentes resultados! Siempre es un enorme placer trabajar junto a profesionales como Henrique!',
    'testimonials4.name': 'João Maziero',
    'testimonials4.role': 'Ingeniero de Software en BTG Pactual',

    'contact.label': 'Contacto',
    'contact.title': '¿Lo<br /><span>Hablamos?</span>',
    'contact.email_label': 'Email',

    'footer.copy': '© 2026 Henrique Bittencourt Severo',
  },
};

// ============================================
// THEME
// ============================================
let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  currentTheme = theme;
  const btn = document.getElementById('themeToggle');
  if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

function toggleTheme() {
  const next = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.classList.add('theme-switching');
  applyTheme(next);
  localStorage.setItem('theme', next);
  setTimeout(() => document.documentElement.classList.remove('theme-switching'), 400);
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// ============================================
// I18N ENGINE
// ============================================
const langConfig = {
  en: { flag: 'us', code: 'EN' },
  pt: { flag: 'br', code: 'PT' },
  es: { flag: 'es', code: 'ES' },
};

function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved && translations[saved]) return saved;
  const b = navigator.language.toLowerCase();
  if (b.startsWith('pt')) return 'pt';
  if (b.startsWith('es')) return 'es';
  return 'en';
}

let currentLang = detectLang();

const LANG_BCP47 = { en: 'en', pt: 'pt-BR', es: 'es' };

function t(key) {
  return (translations[currentLang] && translations[currentLang][key])
    || translations.en[key]
    || key;
}

function applyTranslations() {
  document.documentElement.lang = LANG_BCP47[currentLang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
}

function updateLangTrigger() {
  const cfg = langConfig[currentLang];
  const flag = document.getElementById('langFlag');
  const code = document.getElementById('langCode');
  if (flag) flag.className = `fi fi-${cfg.flag} lang-flag`;
  if (code) code.textContent = cfg.code;
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
  updateLangTrigger();
}

// ============================================
// LANG SWITCHER UI
// ============================================
const langTrigger  = document.getElementById('langTrigger');
const langDropdown = document.getElementById('langDropdown');

langTrigger.addEventListener('click', () => {
  const isOpen = langDropdown.classList.toggle('open');
  langTrigger.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', e => {
  if (!e.target.closest('#langSwitcher')) {
    langDropdown.classList.remove('open');
    langTrigger.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('.lang-option').forEach(btn => {
  btn.addEventListener('click', () => {
    setLanguage(btn.dataset.lang);
    langDropdown.classList.remove('open');
    langTrigger.setAttribute('aria-expanded', 'false');
  });
});

// Apply on load
applyTranslations();
updateLangTrigger();

// ============================================
// NAVBAR SCROLL
// ============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ============================================
// REVEAL ON SCROLL
// ============================================
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      siblings.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 80));
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================
// MOBILE HAMBURGER
// ============================================
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--text-1)'
          : '';
      });
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

// ============================================
// TESTIMONIALS CAROUSEL (drag to scroll + arrows)
// ============================================
const testimonialTrack = document.getElementById('testimonialTrack');

if (testimonialTrack) {
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');

  function scrollByCard(direction) {
    const maxScroll = testimonialTrack.scrollWidth - testimonialTrack.clientWidth;
    const atEnd   = testimonialTrack.scrollLeft >= maxScroll - 4;
    const atStart = testimonialTrack.scrollLeft <= 4;

    if (direction > 0 && atEnd) {
      testimonialTrack.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (direction < 0 && atStart) {
      testimonialTrack.scrollTo({ left: maxScroll, behavior: 'smooth' });
      return;
    }

    const card = testimonialTrack.querySelector('.testimonial-card');
    const step = card ? card.getBoundingClientRect().width + 24 : 320;
    testimonialTrack.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  testimonialPrev.addEventListener('click', () => scrollByCard(-1));
  testimonialNext.addEventListener('click', () => scrollByCard(1));

  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  testimonialTrack.addEventListener('pointerdown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartScroll = testimonialTrack.scrollLeft;
    testimonialTrack.classList.add('dragging');
  });

  testimonialTrack.addEventListener('pointermove', e => {
    if (!isDragging) return;
    e.preventDefault();
    testimonialTrack.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
  });

  function endDrag() {
    isDragging = false;
    testimonialTrack.classList.remove('dragging');
  }

  testimonialTrack.addEventListener('pointerup', endDrag);
  testimonialTrack.addEventListener('pointerleave', endDrag);
  testimonialTrack.addEventListener('pointercancel', endDrag);
}

// ============================================
// GITHUB FEATURE STATS (live, public_repos count)
// ============================================
const githubFeature = document.getElementById('githubFeature');

if (githubFeature) {
  const githubStats = document.getElementById('githubStats');
  const githubUser = githubFeature.dataset.githubUser;

  fetch(`https://api.github.com/users/${githubUser}`)
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (!data || !githubStats) return;
      githubStats.innerHTML = `
        <div class="github-stat">
          <span class="github-stat-num">${data.public_repos}+</span>
          <span class="github-stat-label" data-i18n="portfolio.gh_stat_repos">Public Repositories</span>
        </div>
      `;
      applyTranslations();
    })
    .catch(() => {});
}

