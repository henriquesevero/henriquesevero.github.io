# CLAUDE.md — Portfólio Henrique Severo

Guia completo para qualquer IA continuar este projeto sem perder contexto.

---

## Sobre o projeto

Portfólio pessoal e blog técnico de **Henrique Bittencourt Severo** — Senior Software Engineer com 11 anos de experiência, especializado em sistemas distribuídos e setor financeiro (Itaú Unibanco). Publicado no **GitHub Pages** como site estático puro (HTML + CSS + JS). Sem build tools, sem frameworks, sem dependências locais.

---

## Estrutura de arquivos

```
portifolio/
├── index.html                  ← portfólio principal (single page)
├── favicon.svg                 ← ícone "HS" verde
├── src/
│   ├── styles/styles.css       ← TODO o CSS do portfólio principal
│   ├── scripts/script.js       ← TODO o JS do portfólio principal
│   └── assets/
│       ├── henrique.png        ← foto de perfil, PNG com fundo transparente (cutout real, alpha 0 nas bordas)
│       ├── itau-logo.png       ← ÓRFÃO — não referenciado em nenhum HTML/CSS/JS (sobrou da remoção da seção Experience)
│       ├── pan-logo.png        ← ÓRFÃO — idem
│       ├── resource-logo.png   ← ÓRFÃO — idem
│       ├── fiap-logo.jpeg      ← ÓRFÃO — Academic Background voltou em #skills (2026-06-20), mas só como texto (instituição por extenso), sem logos
│       └── unip-logo.jpeg      ← ÓRFÃO — idem
└── articles/                   ← blog técnico
    ├── index.html              ← listagem de artigos
    ├── post.html               ← leitor de artigo individual
    ├── articles.css            ← estilos específicos do blog
    ├── listing.js              ← lógica da listagem (i18n, render cards)
    ├── reader.js               ← lógica do leitor (fetch .md, marked, hljs)
    ├── data.js                 ← metadados de todos os artigos (global window.ARTICLES_DATA)
    ├── covers/                 ← imagens de capa dos artigos
    └── posts/                  ← arquivos Markdown dos artigos
        └── *.md
```

---

## Design System

### Paleta de cores (CSS variables em `src/styles/styles.css`)

**Dark mode (padrão):**
```css
--bg:          #08101c
--bg-2:        #0c1526
--bg-card:     #111f32
--border:      rgba(255,255,255,0.07)
--border-2:    rgba(255,255,255,0.12)
--accent:      #22c55e   /* verde — cor primária de destaque */
--accent-2:    #4ade80   /* verde claro — textos accent */
--accent-glow: rgba(34,197,94,0.25)
--text-1:      #ecf2ff   /* texto principal */
--text-2:      #8baabe   /* texto secundário */
--text-3:      #4c6880   /* texto terciário / labels */
```

**Light mode (`html[data-theme="light"]`):**
```css
--bg:       #f0f5ff
--bg-card:  #ffffff
--accent:   #16a34a
--accent-2: #15803d   /* verde mais escuro para contraste no claro */
--text-1:   #08142a
--text-2:   #2e4462
```

> Paleta trocada de índigo para verde a pedido do usuário, espelhando um template de referência (freelancer portfolio). Qualquer `rgba(R,G,B,...)` hardcoded fora de `var(--accent*)` deve seguir essa paleta — ver `styles.css` para valores em uso.

### Tipografia
- **Corpo:** Inter (Google Fonts)
- **Código / labels mono:** JetBrains Mono (Google Fonts)
- **CSS vars:** `--font` e `--mono`

### Espaçamento
- **border-radius:** `--radius: 12px`, `--radius-sm: 8px`
- **Transições:** `--transition: 0.3s cubic-bezier(0.4,0,0.2,1)`

### Princípios visuais
- Tema escuro minimalista, sem decoração excessiva
- Acento verde (`--accent-2`) para elementos interativos e títulos de destaque
- **Nome no Hero do portfólio principal:** "Henrique Severo" é texto estático em `--text-1` (sem dois-tons, sem animação de digitação — `initTypewriter` foi removida de `script.js` por quebrar o layout) — decisão deliberada para espelhar um template de referência (foto: nome inteiro branco, verde só na linha do cargo abaixo).
- **O blog (`articles/`) ainda usa o padrão antigo:** "Henrique" em `--text-1` + "Severo" em `.tw-accent` (`--accent-2`) na mesma linha. Isso é uma divergência conhecida entre portfólio principal e blog — não "corrigir" sem confirmar com o usuário, pois foi intencional.
- Cards com `border: 1px solid var(--border)` e hover com `border-color: var(--border-2)` + `translateY(-Xpx)`
- Nunca usar emojis

---

## Funcionalidades implementadas

### Portfólio principal (`index.html` + `script.js`)

| Feature | Detalhe |
|---|---|
| **Dark/Light mode** | Toggle na navbar, persiste em `localStorage`, detecta `prefers-color-scheme` na primeira visita. Anti-flash via script inline no `<head>`. |
| **Multilíngue** | PT 🇧🇷 / EN 🇺🇸 / ES 🇪🇸 via dropdown de bandeiras. Traduções em `window.translations` no `script.js`. Detecta idioma do browser. Persiste em `localStorage`. |
| **Reveal on scroll** | `IntersectionObserver` com classe `.reveal` → `.visible`. Stagger entre siblings. |
| **Navbar** | Fixa, blur ao scroll via `.scrolled`. Hamburger no mobile. Logo (`.nav-logo`) é o wordmark "Henrique Severo" em negrito (sem caixa/borda) — não é mais um badge "HS". O link de Contact (`.nav-cta`) é estilizado como botão pill verde, diferente dos outros links (que são texto simples, sem cor especial — "Articles" não tem mais destaque verde). Idioma e tema continuam funcionando, mantidos a pedido do usuário mesmo após pedir fidelidade "100%" à navbar de referência (que não tem essas opções). |
| **Foto do Hero** | PNG cutout (`henrique.png`, fundo transparente) sobreposto a um blob verde sólido (`.photo-blob-solid`, ~420px, círculo cheio, sem gradiente/opacidade) — a foto (~440px) extrapola o círculo em cima e embaixo, sem crop circular, e domina visualmente a coluna direita do Hero (deve ser bem maior que o bloco de texto, não do mesmo tamanho). Badges de estatística (`.photo-stats`) ficam sobrepostos na borda inferior da foto via `position: absolute`. |

### Seções do portfólio (`index.html`)

Estrutura atual (a partir de 2026-06-20), espelhando um template de referência tipo "freelancer portfolio". **Não tem mais Experience nem Education** — foram removidas a pedido do usuário para fidelidade total ao template. **Ordem das seções na página: Hero → What I Do → Portfolio → Testimonials → Skills → Contact** (nav linka Home/What I Do/Code/Reviews/Skills/Articles/Contact, na mesma ordem). O link de nav para `#portfolio` mostra o texto "Code"/"Código" (chave `nav.portfolio`, renomeado de "Portfolio" em 2026-06-20 — a chave continua se chamando `nav.portfolio` internamente, só o texto exibido mudou). **Testimonials ganhou item de nav em 2026-06-20** (`<a href="#testimonials" data-i18n="nav.testimonials">`, entre Code e Skills) — texto é "Reviews"/"Avaliações"/"Reseñas" (chave `nav.testimonials`); a primeira tentativa foi "Recommendations"/"Recomendações"/"Recomendaciones" mas o usuário achou a palavra muito grande no menu e pediu algo mais curto. Skills e Testimonials foram reordenadas mais de uma vez a pedido do usuário; não mover sem pedido explícito.

**Padrão "título grande → label pequeno abaixo, sem traço verde"**: usado em **todas** as seções com heading (What I Do, Portfolio, Testimonials, Skills e Contact — Contact foi convertido em 2026-06-20, era a última a usar o padrão antigo). Classes: `.section-title` ganha modifier `.title-tight` (reduz `margin-bottom` de 4rem pro padrão pequeno) e vem **antes** no HTML; o `.section-label` vem **depois**, com modifiers `.no-dash` (remove o `::before` que desenha o tracinho verde) e `.label-below` (ajusta o espaçamento já que ele virou o último elemento do heading). Esse padrão antigo (label pequeno com traço, vindo ANTES do título grande) não existe mais em nenhuma seção do portfólio principal — não reintroduzi-lo sem pedido explícito.

1. **Hero** (`#hero`) — layout 2 colunas (`.hero-layout`, `1fr 460px`, `align-items: start` — **não usar `center`**, ver nota abaixo): texto à esquerda é `.hero-name` (nome estático "Henrique Severo", **sem typewriter, sem animação** — foi removido por quebrar o layout) → `.hero-role` verde com o cargo (frase no formato "Eu sou/I'm a ...", sem label "Hello, I am" separado) → `.hero-sub` com uma bio curta de 1 frase (cidade + anos de experiência + foco) → botão único `.btn-pill` "Get in touch". Foto à direita (blob 360px + cutout 460px + stat badges, ver acima). Sem grid de fundo (`.hero-grid` foi removida). **Não reintroduzir o typewriter nem a label "Hello, I am" sem o usuário pedir** — foram removidos deliberadamente.
   - **Sobre `align-items` em `.hero-layout`:** foi `center` originalmente, mas como a foto (coluna direita) é mais alta que o texto, centralizar as colunas cria um vão grande entre a navbar e o texto (o usuário reclamou disso). `start` resolve isso alinhando o topo das duas colunas. Não trocar de volta para `center` sem testar o espaçamento resultante.
   - `#hero` não tem `min-height: 100vh` — foi removido pelo mesmo motivo (gerava espaço vazio). `.hero-content` usa `padding: 5.5rem 2rem 2rem` (o `5.5rem` no topo é só pra não colar na navbar fixa).
   - **Foto (`.photo-cutout`) é deliberadamente maior que o blob verde (`.photo-blob-solid`)** — `cutout: 460px` vs `blob: 360px` (cutout ≈ largura total da coluna `1fr 460px`, preenchendo-a por completo), pra ombros/braços da foto extrapolarem visivelmente as bordas do círculo verde, igual a uma imagem de referência enviada pelo usuário (pessoa maior que o fundo colorido, não contida dentro do círculo). Esse tamanho foi aumentado em 2026-06-20 a partir de um valor menor (blob 340/cutout 360) que existia só pra garantir que o Hero coubesse sem scroll em telas baixas (~600-700px de altura) — **esse trade-off foi aceito explicitamente**: em viewports muito baixos (~600px) os stat badges (`.photo-stats`) podem ficar abaixo da dobra e exigir um pequeno scroll. Não reduzir o tamanho da foto de volta pra "resolver" isso sem confirmar com o usuário, já que a fidelidade visual à referência foi priorizada deliberadamente sobre o encaixe perfeito em telas baixas.
   - **`.photo-cutout` tem `transform: translateY(-48px)`** — desloca a foto pra cima dentro do `.photo-frame` (que centraliza via flex `align-items:center`), pra cabeça ficar perto do topo do círculo verde em vez de centralizada nele (igual à imagem de referência). Os stat badges (`.photo-stats`) são posicionados via `position:absolute; bottom:0` relativo ao `.photo-frame`, não ao cutout, então esse deslocamento não afeta a posição deles. Se a foto parecer "baixa" de novo no futuro, ajustar esse `translateY` em vez de remexer no `top: 44%` do blob.
2. **What I Do** (`#what-i-do`) — título grande em CAIXA ALTA "WHAT I DO"/"O QUE EU FAÇO"/"QUÉ HAGO" (chave `whatido.title`, **o texto precisa estar literalmente em maiúsculas, não é `text-transform`**), com label pequeno "Specialization"/"Especialização"/"Especialización" (chave `whatido.label`) abaixo, sem traço (ver padrão título/label no topo desta seção). Sem `.section-sub` (foi removido — não recriar). Grid de 3 `.whatido-card` (ícone circular outline + título uppercase + descrição) — **sem link/CTA "Say Hello" nos cards** (foi removido a pedido do usuário). Conteúdo: Backend Engineering, System Design & Architecture, AI Engineering.
3. **Portfolio** (`#portfolio`) — título grande "On GitHub"/"No GitHub"/"En GitHub" (chave `portfolio.title`) com label pequeno "Code"/"Código" (chave `portfolio.label`) abaixo, sem traço. Sem `.section-sub`. **Não é mais uma grade de projetos** — o usuário rejeitou tanto cards de projeto placeholder quanto um grid dinâmico de repositórios do GitHub. O que existe hoje é um único card "presentacional" (`.github-feature`, `max-width: 460px`): ícone do GitHub em badge circular + `<h3>` "Explore my code on GitHub" (chave `portfolio.gh_title`) + **stats ao vivo** (`#githubStats`, populado via `fetch` em `https://api.github.com/users/henriquesevero` no final de `script.js` — mostra `public_repos` real, ex: "14+ Public Repositories", chave `portfolio.gh_stat_repos`) + botão pill verde "GitHub" (chave `portfolio.gh_cta`, **uma palavra só**) linkando para `https://github.com/henriquesevero`. **Histórico do card, para não repetir ciclos já percorridos**: já teve uma descrição longa em parágrafo (`portfolio.gh_desc`) — removida em 2026-06-20 porque o usuário achou o texto "muito robótico"; **não recriar esse parágrafo de descrição**, prefira sempre dados reais (stats da API) a texto genérico gerado. Followers (atualmente 5) são deliberadamente não exibidos por ficarem com número baixo/pouco impressionante — só `public_repos` é mostrado. Botão já foi "View my GitHub profile" e o usuário trocou pra uma palavra só ("GitHub"); não reverter sem pedido explícito.
4. **Testimonials** (`#testimonials`) — título grande "What People Say"/"O Que Dizem Sobre Mim"/"Lo Que Dicen de Mí" com label pequeno "Recommendation"/"Recomendação"/"Recomendación" (chave `testimonials.label`) abaixo, sem traço. **Os 4 depoimentos mock (Jane Doe etc.) foram removidos em 2026-06-20** quando o primeiro depoimento real chegou — não faz sentido misturar identidades fictícias com pessoas reais no mesmo carrossel. Conteúdo atual é **real**, enviado diretamente pelo usuário (texto, nome, cargo e foto) — chaves `testimonials1.text`/`.name`/`.role`, `testimonials2.*` etc., uma por pessoa, **nessa ordem cronológica decrescente (mais recente primeiro)**: atualmente Yan Kelvin (Senior Software Engineer, iFood, 2026), Evandro Alcantara (Coordenador de Risco, Itaú Unibanco, 2026), Roney Amorim (Coordenador de Engenharia, Itaú Unibanco, 2017) e João Maziero (Engenheiro de Software, BTG Pactual, 2017). Ao adicionar um novo depoimento, inserir o `.testimonial-card` na posição correta por ano (há um comentário HTML acima de cada card indicando ano/cargo/empresa) e criar as chaves i18n seguintes (`testimonials5.*` etc.). Fotos reais ficam em `src/assets/testimonials/<nome>.<ext>` (ex: `yan.png`, `evandro.jpeg`, `roney.jpeg`, `joao.jpeg`) e são referenciadas via `<img>` dentro de `.testimonial-avatar` (substituiu as iniciais usadas antes). **Não inventar novos depoimentos** — só adicionar quando o usuário mandar nome, cargo, texto e foto reais.
   - **Layout é um carrossel horizontal moderno** (`.testimonial-track`): `display:flex` com `overflow-x:auto`, `scroll-snap-type:x mandatory` e cards de largura fixa (`flex: 0 0 clamp(260px, 32vw, 340px)`) — todos os cards ficam "lado a lado" em uma única fileira (não paginado em grupos de 2), e o usuário pode arrastar com o mouse (drag-to-scroll via Pointer Events em `script.js`, classe `.dragging` desativa o scroll-snap durante o arrasto) ou passar o dedo/trackpad nativamente. Setas (`#testimonialPrev`/`#testimonialNext`) fazem `scrollBy` de uma largura de card e voltam pro início ao passar do último (loop). **As setas devem ficar sempre visíveis, mesmo com poucos cards** — uma tentativa anterior de escondê-las quando havia só 1 card foi revertida a pedido explícito do usuário ("tem que ficar igual era antes, com as setas"); não esconder/remover `.testimonial-controls` condicionalmente de novo. **Não é** uma grid CSS estática nem um carrossel com `transform`/dots — já foi tentado das duas formas e o usuário pediu explicitamente o comportamento de arrastar/deslizar suave.
5. **Skills** (`#skills`, título grande "Skills"/"Habilidades"/"Habilidades" com label pequeno "Expertise"/"Conhecimento"/"Conocimiento" abaixo, sem traço, **heading centralizado** (`.center` em ambos, igual What I Do/Portfolio/Testimonials) — segue o padrão título/label descrito no topo desta seção; só o heading é centralizado, o conteúdo abaixo (`.knowledge-grid`, `.spoken-langs`) continua alinhado à esquerda) — **reformulada totalmente em 2026-06-20, não lista mais nomes/ícones de ferramentas**. O usuário pediu explicitamente para tirar a grade de pills com ícones Devicon (`.tech-categories`/`.tech-row`/`.tech-card`/`.ai-icon` foram **removidos do HTML e do CSS**, não existem mais) e substituir por texto descritivo do conhecimento, em parágrafos curtos (resumidos a pedido do usuário em 2026-06-20 — não reexpandir os textos de `skills.cat1-4_desc` sem pedido). **Academic Background e Certifications foram removidos inteiramente em 2026-06-20** (HTML, CSS — `.skills-subblock`/`.edu-*`/`.cert-*` não existem mais — e chaves i18n `skills.edu_label`/`skills.edu1-3_course`/`skills.edu1-3_meta`/`skills.cert_label`) a pedido explícito do usuário. Não recriar esses blocos sem pedido explícito — se o usuário quiser readicionar formação/certificações no futuro, pedir os dados reais de novo (instituição, curso, ano / emissor, nome), não reaproveitar os dados antigos sem confirmar que ainda são válidos. Estrutura atual, bem mais simples:
   - **`.knowledge-grid`** (primeiro e único bloco principal, logo após o heading) — grid 2x2 de `.knowledge-item` (label pequeno `.tech-cat-label` + parágrafo `.knowledge-text` descrevendo a expertise, sem citar nomes de ferramentas em forma de lista/pill). 4 áreas: Backend & Distributed Systems, Cloud & Infrastructure, Data & Databases, AI Engineering. As chaves i18n são `skills.cat1-4` (título) e `skills.cat1-4_desc` (texto).
   - **`.spoken-langs` "Spoken Languages"** (segundo bloco, com `border-top` separador) — inalterado.
   - **`#skills` usa `background: var(--bg)` sem `border-top`/`border-bottom` e `padding: 4rem 0`** (menor que o padrão global de `7rem 0`) — única discrição que resta na seção. **O heading (`.section-title`/`.section-label`) voltou ao tamanho padrão do site em 2026-06-20** (igual ao de Testimonials) — os overrides `#skills .section-title { font-size: 1.4rem }`/`#skills .section-label { font-size: 0.7rem }` foram removidos do CSS a pedido do usuário ("deve ficar igual o tamanho do texto da parte What People Say / Recommendation"). Não reintroduzir esses overrides sem pedido explícito.
   - **Não recriar a grade de tools com ícones** sem pedido explícito.
6. **Contact** (`#contact`) — título grande "Let's talk?" com label pequeno "Contact" abaixo, sem traço (segue o padrão título/label do topo desta seção, convertido em 2026-06-20). **Sem `.section-sub`** (o subtítulo "Open to opportunities, projects, and meaningful conversations." foi removido em 2026-06-20, junto com a chave `contact.desc` — não recriar sem pedido). Grid de **2** `.contact-card` (`.contact-cards` é `repeat(2, 1fr)`, não 3): e-mail (`mailto:`) e LinkedIn, ambos links. Cada card mostra só ícone + `.contact-card-title` ("Email"/"LinkedIn") — **o endereço de e-mail e a URL do LinkedIn não aparecem como texto** (`.contact-card-sub` foi removido do HTML e do CSS em 2026-06-20 a pedido do usuário); o link continua funcional (`href="mailto:..."`/`href="https://linkedin.com/..."`), só não expõe o dado em texto visível. Não reintroduzir esse texto sem pedido explícito. **Não tem mais o card de identidade** ("Henrique Severo" / cargo) — removido a pedido do usuário. Não recriar sem pedido explícito.

### Fundo alternado entre seções
As seções alternam `var(--bg)`/`var(--bg-2)` para criar separação visual: Hero(`bg`) → What I Do(`bg-2`) → Portfolio(`bg`) → Skills(`bg-2`) → Testimonials(`bg-2`) → Contact(`bg`). Ao reordenar seções no futuro, verificar se duas seções consecutivas não ficaram com o mesmo tom de fundo (cria uma faixa monótona sem separação).

### Overscroll / bounce no topo da página
`html` e `body` têm `background-color: var(--bg)` (não só `body`) e `overscroll-behavior-y: none` em **ambos** (não só um) — no Chrome/Edge/Firefox, o elemento que controla o scroll raiz pode ser o `html`, então a propriedade precisa estar nos dois para funcionar de forma confiável. Isso evita o "flash" de fundo branco e o bounce ao rolar para cima além do topo. Não remover essas regras achando que são redundantes.

### Footer
**Só tem o copyright** (`<p data-i18n="footer.copy">`) — os ícones sociais circulares (`.footer-social`/`.footer-social-icon`, e-mail e LinkedIn) foram removidos em 2026-06-20 por ficarem repetitivos com os mesmos links já presentes nos `.contact-card` da seção Contact, logo acima. CSS correspondente também foi removido. Não recriar sem pedido explícito. Não adicionar ícones de redes que não existem (ex: GitHub/Twitter) sem confirmar a URL real com o usuário.

### Blog de artigos (`articles/`)

| Feature | Detalhe |
|---|---|
| **Listagem** | Grid 3 colunas (desktop), 2 (tablet), 1 (mobile). Cards verticais com capa + avatar + autor + título + excerpt + tags + data. Link de voltar na navbar (`.articles-back-link`, ícone de seta) mostra "Home"/"Início"/"Inicio" (chave `home` em `LISTING_I18N`, renomeada de `portfolio` em 2026-06-20 — não confundir com a chave `nav.portfolio` do portfólio principal, que é outro arquivo/objeto). Footer só tem o copyright, sem link "Portfolio" (removido em 2026-06-20). |
| **Typewriter no blog** | "Henrique " em `--text-1` + "Severo" em `.tw-accent` na mesma linha (menor que o hero). |
| **Dark/Light mode** | Idêntico ao portfólio principal — mesmo localStorage. |
| **Multilíngue** | EN/PT/ES com `data-ali18n` (atributo diferente do portfólio que usa `data-i18n`). Traduções em `LISTING_I18N` / `READER_I18N`. Re-renderiza cards ao trocar idioma. |
| **Leitor** | Markdown renderizado com `marked` v9 + highlight.js. Barra de progresso de leitura. Avatar + nome do autor no rodapé. |
| **GitHub Pages** | Funciona 100%. `data.js` é carregado via `<script src>` (sem fetch). Markdown é carregado via `fetch()` (funciona em HTTP/HTTPS). |
| **File:// local** | Listagem funciona (data.js é global). Artigo individual mostra aviso para usar `npx serve .`. |

---

## Como adicionar um novo artigo

**Passo 1** — criar `articles/posts/meu-slug.md`:
```markdown
# Título do Artigo

Conteúdo em Markdown normal.
```

**Passo 2** — adicionar entrada em `articles/data.js`:
```js
{
  slug:     'meu-slug',
  title:    'Título do Artigo',
  excerpt:  'Resumo curto de 1-2 frases.',
  date:     '2026-05-01',       // YYYY-MM-DD
  readTime: 6,                  // minutos estimados
  tags:     ['Tag1', 'Tag2'],
  cover:    'covers/capa.png',  // opcional — imagem em articles/covers/
  gradient: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', // fallback sem capa
},
```

**A extensão do cover DEVE bater com o arquivo real** (erro comum: `.jpg` no data.js mas arquivo é `.png`).

---

## Como adicionar traduções

### Portfólio principal
Em `src/scripts/script.js`, o objeto `translations` tem 3 chaves: `en`, `pt`, `es`.
No HTML, usar `data-i18n="chave"` (textContent) ou `data-i18n-html="chave"` (innerHTML).

### Blog (articles)
Em `articles/listing.js`, objeto `LISTING_I18N`. Em `articles/reader.js`, objeto `READER_I18N`.
No HTML do blog, usar `data-ali18n="chave"` (note o prefixo `al`).

---

## CDNs utilizadas

```html
<!-- Fontes -->
https://fonts.googleapis.com/css2?family=Inter&family=JetBrains+Mono

<!-- Bandeiras -->
https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/css/flag-icons.min.css

<!-- Ícones de tecnologias -->
https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/devicon.min.css

<!-- Markdown (só no blog) -->
https://cdn.jsdelivr.net/npm/marked@9/marked.min.js

<!-- Syntax highlighting (só no blog) -->
https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css  ← dark
https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css              ← light
```

---

## Convenções de código

- **Sem frameworks** — HTML/CSS/JS puro, sem React, Vue, Webpack, etc.
- **Sem build step** — arquivos editados diretamente, publicados como estão
- **CSS Variables** — toda cor, sombra e tamanho relevante usa `var(--*)` de `:root`
- **Tokens de tema** — `--nav-bg`, `--nav-mobile-bg`, `--shadow-card`, `--shadow-photo` existem para diferenciar dark/light sem duplicar regras
- **Sem comentários óbvios** — comentar apenas o "porquê" não óbvio
- **Responsivo** — breakpoints em `900px` e `640px` via `@media`
- **Animações reveal** — classe `.reveal` com `IntersectionObserver`. Nunca adicionar `opacity:0` manual em outros elementos

---

## Padrões visuais recorrentes

### Card padrão
```css
background: var(--bg-card);
border: 1px solid var(--border);
border-radius: var(--radius);
transition: border-color var(--transition), transform var(--transition);
/* hover: */
border-color: var(--border-2);
transform: translateY(-Xpx);
```

### Section label (mini-título de seção)
```html
<div class="section-label">Nome da Seção</div>
```
Linha verde + texto mono uppercase pequeno.

### Tag/chip de tecnologia
```html
<span class="atag">Nome</span>           <!-- blog -->
<span class="portfolio-tag">Nome</span>  <!-- card de projeto no Portfolio -->
```

### AI tool cards (sem devicon)
```html
<span class="ai-icon" style="--ic:#16a34a">
  <svg>...</svg>
</span>
```
Usa CSS custom property `--ic` para a cor de fundo do badge.

---

## O que NÃO fazer

- Não usar `!important` exceto nos casos já existentes (`.nav-cta`, para garantir texto branco sobre o fundo verde do botão)
- Não adicionar animações CSS em elementos que já usam `.reveal`
- Não criar novos arquivos CSS — estender `styles.css` (portfólio) ou `articles.css` (blog)
- Não usar `fetch()` para carregar dados locais do blog — usar `data.js` como global `window.ARTICLES_DATA`
- Não duplicar o seletor de idioma — o portfólio usa IDs `langTrigger/langDropdown`, o blog usa `alLangTrigger/alLangDropdown`
- Não alterar a estrutura de pastas sem atualizar os caminhos relativos em `index.html`
- Não inventar depoimentos para a seção Testimonials (ainda não implementada) — só com conteúdo real do usuário
- Não recriar Experience/Education sem confirmar com o usuário — foram removidas deliberadamente para fidelidade ao template de referência

---

## Contato e deploy

- **E-mail:** contato@henriquesevero.com
- **LinkedIn:** linkedin.com/in/henriquesevero
- **Deploy:** GitHub Pages — push para `main` publica automaticamente em ~1 min
- **Teste local:** `npx serve .` na raiz do projeto (necessário para o blog carregar artigos)
