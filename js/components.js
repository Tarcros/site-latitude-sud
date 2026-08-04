/* ============================================================
   LATITUDE SUD — COMPONENTS.JS
   Shared header, footer, filter tabs, scroll reveal, project modal
   ============================================================ */

'use strict';

let igEmbedScriptLoaded = false;
function ensureInstagramEmbeds() {
  if (!igEmbedScriptLoaded) {
    igEmbedScriptLoaded = true;
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => setTimeout(() => { if (window.instgrm) window.instgrm.Embeds.process(); }, 0);
    document.body.appendChild(script);
  } else {
    setTimeout(() => { if (window.instgrm) window.instgrm.Embeds.process(); }, 0);
  }
}
function igEmbedHTML(permalink) {
  return `<blockquote class="instagram-media" data-instgrm-permalink="${permalink}" data-instgrm-version="14"></blockquote>`;
}

function setModalBackgroundInert(modal, isInert) {
  [...document.body.children].forEach((element) => {
    if (element === modal || element.tagName === 'SCRIPT') return;
    element.inert = isInert;
  });
}

function initModalFocusTrap(modal) {
  modal.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !modal.classList.contains('open')) return;
    const focusable = [...modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/* ── HERO WAVE ────────────────────────────────────────────────
   One SVG source is shared by every page and stretched edge to edge.
   ───────────────────────────────────────────────────────────── */
function initHeroWaves(activePage) {
  if (activePage) document.body.dataset.page = activePage;

  const wavePath = 'M3808.73,124.82v4687.56H0V124.82c136.05-33.32,289.72-38.15,429.73-29.41,260.42,10.44,505.18,153.29,769.12,126.73,250.79-13.48,331.33-143.24,546.07-200.65,423.08-102.86,512.96,196.66,894.4,202.69,247.88,12.59,480.49-117.95,725.76-128.72,147.16-10.52,300.1-5.11,443.65,29.36Z';

  document.querySelectorAll('.hero-wave').forEach((wave, index) => {
    const arcId = `ls-hero-wave-arc-${index}`;
    wave.dataset.heroWave = '';
    wave.setAttribute('aria-hidden', 'true');
    wave.innerHTML = `
      <svg class="wave-bg" viewBox="0 0 3808.73 500" preserveAspectRatio="none" focusable="false">
        <path class="hero-wave-surface" d="${wavePath}"></path>
      </svg>
      <div class="hero-wave-mark">
        <svg class="hero-wave-mark__arc" viewBox="0 0 186 116" focusable="false">
          <defs><path id="${arcId}" d="M 22,100 A 70,70 0 0,1 164,100"></path></defs>
          <text font-family="Poppins, sans-serif" font-size="8" fill="#56522d" letter-spacing="2.2" font-weight="500">
            <textPath href="#${arcId}" startOffset="50%" text-anchor="middle">CRÉATION • STRATÉGIE • DIGITAL</textPath>
          </text>
        </svg>
        <img class="hero-wave-mark__palm" src="/assets/icons/ui/icon-ui-cocotier.svg" alt="" decoding="async">
      </div>`;
  });
}

/* ── HEADER ── */
function renderHeader(activePage) {
  const isActive    = (page) => activePage === page ? ' active' : '';
  const isExpertise = ['video', 'print', 'charte', 'social', 'web', 'photos', 'catalogue'].includes(activePage);

  const html = `
<header class="ls-header" id="ls-header" role="banner">
  <div class="ls-header-inner">

    <a href="/index.html" class="ls-logo" aria-label="Latitude Sud — Accueil">
      <img src="/assets/logo-sud.svg" alt="Logo Latitude Sud"
           class="ls-logo-badge" width="50" height="50">
      <div class="ls-logo-text">
        <span class="ls-logo-name">Latitude Sud</span>
        <span class="ls-logo-sub">Agence de communication</span>
      </div>
    </a>

    <!-- Nav links — absolutely centered -->
    <nav class="ls-nav-links" role="navigation" aria-label="Navigation principale">
      <a href="/index.html"  class="ls-nav-link${isActive('accueil')}">Accueil</a>
      <a href="/pages/agence.html" class="ls-nav-link${isActive('agence')}">Agence</a>
      <div class="ls-nav-dropdown" id="ls-dropdown-realisations">
        <a href="/pages/realisations.html"
           class="ls-nav-link${isActive('realisations') || isExpertise ? ' active' : ''}"
           aria-haspopup="true" aria-expanded="false">
          Réalisations <span class="ls-nav-caret" aria-hidden="true">▾</span>
        </a>
        <div class="ls-nav-dropdown-menu" role="menu">
          <a href="/pages/photos.html" role="menuitem">Photos</a>
          <a href="/pages/charte-graphique.html" role="menuitem">Charte graphique</a>
          <a href="/pages/social.html" role="menuitem">Réseaux Sociaux</a>
          <a href="/pages/catalogue.html" role="menuitem">Catalogue</a>
        </div>
      </div>

      <a href="/pages/contact.html" class="ls-nav-link${isActive('contact')}">Contact</a>
    </nav>

    <!-- Right group: socials + CTA -->
    <div class="ls-nav-right">
      <div class="ls-nav-socials" aria-label="Nos réseaux sociaux">
        <a href="https://www.instagram.com/latitudesud/"
           target="_blank" rel="noopener noreferrer"
           class="ls-nav-social" aria-label="Instagram">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.4"/>
            <rect x="8.5" y="8.5" width="11" height="11" rx="3" stroke="currentColor" stroke-width="1.3" fill="none"/>
            <circle cx="14" cy="14" r="3" stroke="currentColor" stroke-width="1.3" fill="none"/>
            <circle cx="18" cy="10" r="0.9" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/company/latitudesud/"
           target="_blank" rel="noopener noreferrer"
           class="ls-nav-social" aria-label="LinkedIn">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.4"/>
            <path d="M10 13v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <circle cx="10" cy="10.5" r="1" fill="currentColor"/>
            <path d="M14 18v-3a2 2 0 0 1 4 0v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 13v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </a>
      </div>

      <a href="/pages/contact.html" class="btn btn-primary btn-arrow ls-header-cta">
        Nous contacter
      </a>
    </div>

    <div class="ls-mobile-header-socials" aria-label="Nos réseaux sociaux">
      <a href="https://www.instagram.com/latitudesud/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.4"/><rect x="8.5" y="8.5" width="11" height="11" rx="3" stroke="currentColor" stroke-width="1.3"/><circle cx="14" cy="14" r="3" stroke="currentColor" stroke-width="1.3"/><circle cx="18" cy="10" r=".9" fill="currentColor"/></svg>
      </a>
      <a href="https://www.linkedin.com/company/latitudesud/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.4"/><path d="M10 13v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="10" cy="10.5" r="1" fill="currentColor"/><path d="M14 18v-3a2 2 0 0 1 4 0v3M14 13v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </div>

    <button class="ls-hamburger" id="ls-hamburger"
            aria-label="Ouvrir le menu" aria-expanded="false"
            aria-controls="ls-mobile-nav">
      <span></span><span></span><span></span>
    </button>

  </div>
</header>

<nav class="ls-mobile-nav" id="ls-mobile-nav"
     role="navigation" aria-label="Navigation mobile">
  <a href="/index.html">Accueil</a>
  <a href="/pages/agence.html">Agence</a>
  <a href="/pages/realisations.html">Réalisations</a>
  <a href="/pages/photos.html"       class="ls-mobile-sub">Photos</a>
  <a href="/pages/charte-graphique.html" class="ls-mobile-sub">Charte graphique</a>
  <a href="/pages/social.html"       class="ls-mobile-sub">Réseaux Sociaux</a>
  <a href="/pages/catalogue.html"    class="ls-mobile-sub">Catalogue</a>
  <a href="/pages/contact.html">Contact</a>
  <a href="/pages/contact.html" class="btn btn-primary btn-arrow ls-mobile-cta">
    Nous contacter
  </a>
</nav>
  `.trim();

  document.body.insertAdjacentHTML('afterbegin', html);
  _initHeader();
}

function _initHeader() {
  const header    = document.getElementById('ls-header');
  const hamburger = document.getElementById('ls-hamburger');
  const mobileNav = document.getElementById('ls-mobile-nav');
  if (!header || !hamburger || !mobileNav) return;

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Dropdown — open on hover, close with a delay so the user has time
     to travel from the trigger down to the menu items before it closes */
  const dropdown = document.getElementById('ls-dropdown-realisations');
  if (dropdown) {
    const trigger = dropdown.querySelector('.ls-nav-link');
    let closeTimer = null;
    const open = () => {
      clearTimeout(closeTimer);
      dropdown.classList.add('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      dropdown.classList.remove('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    };
    const closeDelayed = () => { closeTimer = setTimeout(close, 500); };
    dropdown.addEventListener('mouseenter', open);
    dropdown.addEventListener('mouseleave', closeDelayed);
    dropdown.addEventListener('focusin', open);
    dropdown.addEventListener('focusout', closeDelayed);
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('open')
        && !mobileNav.contains(e.target)
        && !hamburger.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── FOOTER ── */
function renderFooter() {
  if (document.querySelector('.ls-footer')) return;
  const year = new Date().getFullYear();
  const html = `
<div class="ls-footer-arch" aria-hidden="true">
  <svg viewBox="0 0 1440 64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,64 Q720,4 1440,64 Z" fill="#F5E3D0"/>
  </svg>
</div>
<footer class="ls-footer" role="contentinfo">

  <div class="ls-footer-inner">

    <div class="ls-footer-brand">
      <div class="ls-logo-badge-div" aria-label="Logo Latitude Sud">SUD</div>
      <p class="ls-footer-agency-name">Latitude Sud</p>
      <p class="ls-footer-agency-sub">Agence de communication<br>en Guadeloupe</p>
    </div>

    <div class="ls-footer-nav-col">
      <p class="ls-footer-col-title">Navigation</p>
      <a href="/index.html">Accueil</a>
      <a href="/pages/agence.html">L'agence</a>
      <a href="/pages/realisations.html">Réalisations</a>
      <a href="/pages/contact.html">Contact</a>
    </div>

    <div class="ls-footer-expertises-col">
      <p class="ls-footer-col-title">Expertises</p>
      <a href="/pages/photos.html">Photos</a>
      <a href="/pages/charte-graphique.html">Charte graphique</a>
      <a href="/pages/social.html">Réseaux Sociaux</a>
      <a href="/pages/catalogue.html">Catalogue</a>
    </div>

    <div class="ls-footer-contact-col">
      <p class="ls-footer-col-title">Contact</p>
      <div class="ls-footer-contact-line">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A8B6F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>1<sup>er</sup> étage, Imm. Le Sommet, Rue Fulton, Baie-Mahault 97122</span>
      </div>
      <div class="ls-footer-contact-line">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A8B6F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <a href="tel:+590590922948">+590 590 92 29 48</a>
      </div>
      <div class="ls-footer-contact-line">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A8B6F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
        <a href="mailto:regis.malotaux@latitudesud.gp">regis.malotaux@latitudesud.gp</a>
      </div>
    </div>

    <div class="ls-footer-social-col">
      <p class="ls-footer-col-title">Suivez-nous</p>
      <div class="ls-footer-socials" aria-label="Nos réseaux sociaux">
        <a href="https://www.instagram.com/latitudesud/" target="_blank" rel="noopener noreferrer" class="ls-footer-social" aria-label="Instagram">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.4"/>
            <rect x="8.5" y="8.5" width="11" height="11" rx="3" stroke="currentColor" stroke-width="1.3" fill="none"/>
            <circle cx="14" cy="14" r="3" stroke="currentColor" stroke-width="1.3" fill="none"/>
            <circle cx="18" cy="10" r="0.9" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/company/latitudesud/" target="_blank" rel="noopener noreferrer" class="ls-footer-social" aria-label="LinkedIn">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.4"/>
            <path d="M10 13v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <circle cx="10" cy="10.5" r="1" fill="currentColor"/>
            <path d="M14 18v-3a2 2 0 0 1 4 0v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 13v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </a>
      </div>
    </div>

  </div>

  <div class="ls-footer-bottom">
    <p>© ${year} Latitude Sud — Tous droits réservés</p>
    <div class="ls-footer-bottom-links">
      <a href="/pages/mentions-legales.html">Mentions légales</a>
      <a href="/pages/politique-de-confidentialite.html">Politique de confidentialité</a>
    </div>
  </div>

</footer>
  `.trim();

  document.body.insertAdjacentHTML('beforeend', html);
}

/* ── FILTER TABS ── */
function initFilterTabs(containerSelector) {
  const containers = document.querySelectorAll(containerSelector || '.filter-tabs-container');
  containers.forEach(_bindFilterContainer);
}

function _bindFilterContainer(container) {
  const tabs = container.querySelectorAll('.filter-tab');
  // Grid = nearest following sibling that holds [data-category] children
  let grid = container.nextElementSibling;
  while (grid && !grid.querySelector('[data-category]')) grid = grid.nextElementSibling;
  const scope = grid ? grid.parentElement : container.parentElement;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const filter = tab.dataset.filter || 'all';
      (scope || document).querySelectorAll('[data-category]').forEach((item) => {
        const cats  = (item.dataset.category || '').split(' ').filter(Boolean);
        const match = filter === 'all' || cats.includes(filter);
        item.setAttribute('data-hidden', match ? 'false' : 'true');
        if (match) {
          item.style.display = '';
          requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; });
        } else {
          item.style.opacity = '0'; item.style.transform = 'translateY(8px)';
          setTimeout(() => { if (item.dataset.hidden === 'true') item.style.display = 'none'; }, 220);
        }
      });
    });
  });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── STAGGERED LOGO REVEAL — logos fade in one after another ── */
function initLogoStagger() {
  const grids = document.querySelectorAll('[data-stagger]');
  if (!grids.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  grids.forEach((grid) => {
    grid.querySelectorAll(':scope > *').forEach((el, i) => {
      el.classList.add('stagger-item');
      el.style.transitionDelay = reduce ? '0s' : (i * 0.06) + 's';
    });
  });

  if (!('IntersectionObserver' in window)) {
    grids.forEach(g => g.querySelectorAll('.stagger-item').forEach(el => el.classList.add('in')));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stagger-item').forEach(el => el.classList.add('in'));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  grids.forEach(g => obs.observe(g));
}

/* ── PROJECT MODAL ────────────────────────────────────────────
   Standard projects use a carousel, social projects a fixed 4+1
   composition, and only explicit photo galleries scroll vertically.
   Data attributes on the trigger:
     data-project           (presence = clickable)
     data-project-title     project title
     data-project-client    client / subtitle
     data-project-images    pipe-separated image URLs
     data-project-grid      "true" for social content
     data-project-layout    "gallery" for a vertical photo gallery
   ───────────────────────────────────────────────────────────── */
function initProjectModal() {
  const triggers = document.querySelectorAll('[data-project]');
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'ls-modal';
  modal.id = 'ls-project-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="ls-modal-backdrop" data-close></div>
    <div class="ls-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="ls-modal-title" aria-describedby="ls-modal-client">
      <button class="ls-modal-close" data-close aria-label="Fermer">&times;</button>
      <div class="ls-modal-head">
        <p class="ls-modal-kicker">Projet Latitude Sud</p>
        <h2 class="ls-modal-title" id="ls-modal-title"></h2>
        <p class="ls-modal-client" id="ls-modal-client"></p>
        <p class="ls-modal-desc" id="ls-modal-desc" hidden></p>
      </div>
      <div class="ls-modal-viewport">
        <div class="ls-modal-track" id="ls-modal-track"></div>
        <button class="ls-modal-arrow ls-modal-arrow--prev" data-modal-prev aria-label="Visuel précédent">&#8249;</button>
        <button class="ls-modal-arrow ls-modal-arrow--next" data-modal-next aria-label="Visuel suivant">&#8250;</button>
      </div>
      <div class="ls-modal-dots" id="ls-modal-dots" aria-label="Choisir un visuel"></div>
    </div>`;
  document.body.appendChild(modal);
  initModalFocusTrap(modal);

  const track   = modal.querySelector('#ls-modal-track');
  const dots    = modal.querySelector('#ls-modal-dots');
  const prev    = modal.querySelector('[data-modal-prev]');
  const next    = modal.querySelector('[data-modal-next]');
  const dialog  = modal.querySelector('.ls-modal-dialog');
  const kickerEl = modal.querySelector('.ls-modal-kicker');
  const titleEl = modal.querySelector('#ls-modal-title');
  const clientEl= modal.querySelector('#ls-modal-client');
  const descEl  = modal.querySelector('#ls-modal-desc');
  let slides = [], index = 0, mode = 'slider', lastFocus = null;

  const safeImageSource = (source) => {
    if (!source || !source.trim()) return '';
    try {
      const url = new URL(source, window.location.href);
      return url.origin === window.location.origin ? url.href : '';
    } catch (_) {
      return '';
    }
  };

  const icon = (name) => {
    const paths = {
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.3l7.8-7.8a5.5 5.5 0 0 0 1-8.9Z"/>',
      comment: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
      send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
      bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
      play: '<path d="m9 7 8 5-8 5Z"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ''}</svg>`;
  };

  const renderSocialComposition = (trigger) => {
    const account = trigger.dataset.projectAccount || 'latitudesud_';
    const project = trigger.dataset.projectTitle || 'Projet';
    const adImage = trigger.dataset.projectAdImage || '';
    const adLabel = trigger.dataset.projectAdLabel || 'Annonce';
    const avatar = trigger.dataset.projectAvatar || '';
    const avatarHtml = avatar
      ? `<img class="ls-ig-avatar" src="${avatar}" alt="" aria-hidden="true">`
      : `<span class="ls-ig-avatar" aria-hidden="true">${account.charAt(0).toUpperCase()}</span>`;
    const parsedGridCount = parseInt(trigger.dataset.projectPostCount, 10);
    const gridCount = Number.isNaN(parsedGridCount) ? 4 : parsedGridCount;
    const posts = slides.slice(0, gridCount);
    const reelSrc = slides[gridCount] || '';
    const reelUrl = trigger.dataset.projectReelUrl || '';
    const reelImages = (trigger.dataset.projectReelImages || '')
      .split('|')
      .map(source => safeImageSource(source.trim()))
      .filter(Boolean);
    const noReel = trigger.dataset.projectNoReel === 'true';
    const carousels = [trigger.dataset.projectCarousel1 || '', trigger.dataset.projectCarousel2 || ''];
    const postsWrap = document.createElement('div');
    postsWrap.className = 'ls-social-posts';
    if (gridCount > 4) postsWrap.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';

    posts.forEach((src, i) => {
      const card = document.createElement('article');
      card.className = 'ls-ig-post';
      if (gridCount === 3 && i === 2) card.classList.add('ls-ig-post--wide');

      card.innerHTML = `
        <header class="ls-ig-head">
          ${avatarHtml}
          <strong></strong><span class="ls-ig-more" aria-hidden="true">•••</span>
        </header>
        <div class="ls-ig-image-wrap"><img class="ls-ig-image" alt=""></div>
        <div class="ls-ig-actions">
          <span>${icon('heart')}</span><span>${icon('comment')}</span><span>${icon('send')}</span>
          <span class="ls-ig-save">${icon('bookmark')}</span>
        </div>
        <p class="ls-ig-likes">Aimé par la communauté</p>
        <p class="ls-ig-caption"><strong></strong> <span></span></p>`;
      card.querySelector('.ls-ig-head strong').textContent = account;
      const imgEl = card.querySelector('.ls-ig-image');
      imgEl.src = src;
      imgEl.alt = `${project} — publication ${i + 1}`;
      card.querySelector('.ls-ig-caption strong').textContent = account;
      card.querySelector('.ls-ig-caption span').textContent = `Une création pensée pour ${project}.`;

      const carouselList = (carousels[i] || '').split('|').map(s => s.trim()).filter(Boolean);
      if (carouselList.length > 1) {
        let ci = 0;
        imgEl.src = carouselList[0];
        const wrap = card.querySelector('.ls-ig-image-wrap');
        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'ls-ig-carousel-dots';
        carouselList.forEach((_, di) => {
          const dot = document.createElement('span');
          if (di === 0) dot.classList.add('active');
          dotsWrap.appendChild(dot);
        });
        const update = () => {
          imgEl.src = carouselList[ci];
          dotsWrap.querySelectorAll('span').forEach((d, di) => d.classList.toggle('active', di === ci));
        };
        const makeArrow = (dir, label) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `ls-ig-carousel-arrow ls-ig-carousel-arrow--${dir > 0 ? 'next' : 'prev'}`;
          button.setAttribute('aria-label', label);
          button.textContent = dir > 0 ? '›' : '‹';
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            ci = (ci + dir + carouselList.length) % carouselList.length;
            update();
          });
          return button;
        };
        wrap.append(makeArrow(-1, 'Image précédente'), makeArrow(1, 'Image suivante'), dotsWrap);
      }

      postsWrap.appendChild(card);
    });

    const leftCol = document.createElement('div');
    leftCol.className = 'ls-social-left';
    leftCol.appendChild(postsWrap);

    let adBlock = null;
    if (adImage) {
      adBlock = document.createElement('article');
      adBlock.className = 'ls-social-ad';
      if (trigger.dataset.projectAdExpanded === 'true') adBlock.classList.add('ls-social-ad--expanded');
      adBlock.innerHTML = `
        <div class="ls-ig-ad-badge">${adLabel}</div>
        <img class="ls-ig-ad-image" alt="Publicité ${project}">
        <div class="ls-ig-ad-foot">
          ${avatar ? `<img class="ls-ig-ad-favicon" src="${avatar}" alt="" aria-hidden="true">` : `<span class="ls-ig-ad-favicon" aria-hidden="true">${project.charAt(0).toUpperCase()}</span>`}
          <div class="ls-ig-ad-text"><strong></strong><small></small></div>
          <span class="ls-ig-ad-cta">En savoir plus</span>
        </div>`;
      adBlock.querySelector('.ls-ig-ad-image').src = adImage;
      adBlock.querySelector('.ls-ig-ad-text strong').textContent = project;
      adBlock.querySelector('.ls-ig-ad-text small').textContent = `${account}.fr`;
      const adUrl = trigger.dataset.projectAdUrl || '';
      const adCtaEl = adBlock.querySelector('.ls-ig-ad-cta');
      if (adUrl) {
        const link = document.createElement('a');
        link.className = 'ls-ig-ad-cta';
        link.href = adUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'En savoir plus';
        adCtaEl.replaceWith(link);
      }
    }

    const ghostSrcs = [posts[1] || posts[0], posts[0] || posts[1]].filter(Boolean);
    if (ghostSrcs.length && trigger.dataset.projectHideTeaser !== 'true') {
      const more = document.createElement('div');
      more.className = 'ls-social-more';
      more.setAttribute('aria-hidden', 'true');
      more.innerHTML = `
        <div class="ls-social-more-row">
          ${ghostSrcs.map(s => `<span class="ls-ig-post-ghost"><img alt=""></span>`).join('')}
        </div>
        <div class="ls-social-more-fade"></div>
        <div class="ls-social-more-dots">•••</div>`;
      more.querySelectorAll('.ls-ig-post-ghost img').forEach((img, i) => { img.src = ghostSrcs[i]; });
      leftCol.appendChild(more);
    }

    if (adBlock) leftCol.appendChild(adBlock);

    const ctaRow = document.createElement('div');
    ctaRow.className = 'ls-social-cta-row';
    const photoLink = trigger.dataset.projectPhotoLink || '';
    if (photoLink) {
      const photoCta = document.createElement('a');
      photoCta.className = 'ls-social-contact-cta ls-social-contact-cta--ghost';
      photoCta.href = photoLink;
      photoCta.textContent = `Voir ${project} en photo`;
      ctaRow.appendChild(photoCta);
    }
    if (ctaRow.children.length) leftCol.appendChild(ctaRow);

    const makeImageReel = (src, reelIndex = 0) => {
      const reelCard = document.createElement('article');
      reelCard.className = 'ls-ig-reel ls-ig-reel--image';
      reelCard.innerHTML = `
        <img class="ls-ig-reel-image" src="${src}" alt="${project} — aperçu du reel ${reelIndex + 1}">
        <div class="ls-ig-reel-shade" aria-hidden="true"></div>
        <div class="ls-ig-reel-top"><span class="ls-ig-reel-label">Reels</span><span>${icon('play')}</span></div>
        <div class="ls-ig-reel-bottom"><strong>${account}</strong><p>Création et réalisation Latitude Sud</p></div>`;
      return reelCard;
    };

    let reel = document.createElement('article');
    reel.className = 'ls-ig-reel';
    const videoUrl = trigger.dataset.projectVideo || '';
    const videoMatch = videoUrl.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
    if (videoMatch) {
      reel.innerHTML = `
        <iframe class="ls-ig-reel-frame" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
          src="https://www.youtube-nocookie.com/embed/${videoMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${videoMatch[1]}&controls=0&modestbranding=1&rel=0&playsinline=1"
          title="${project} — reel"></iframe>
        <div class="ls-ig-reel-shade" aria-hidden="true"></div>
        <div class="ls-ig-reel-top"><span class="ls-ig-reel-label">Reels</span><span>${icon('play')}</span></div>
        <div class="ls-ig-reel-bottom"><strong>${account}</strong><p>Création et réalisation Latitude Sud</p></div>`;
    } else if (reelUrl) {
      reel.classList.add('ls-ig-reel--embed');
      reel.innerHTML = igEmbedHTML(reelUrl);
      ensureInstagramEmbeds();
    } else if (reelSrc) {
      reel = makeImageReel(reelSrc);
    } else {
      reel.classList.add('ls-ig-reel--empty');
      reel.innerHTML = `
        <div class="ls-ig-reel-pending"><span aria-hidden="true">⏳</span>Réel à venir</div>
        <div class="ls-ig-reel-bottom"><strong>${account}</strong><p>Création et réalisation Latitude Sud</p></div>`;
    }

    if (reelImages.length) {
      const reelsRow = document.createElement('div');
      reelsRow.className = 'ls-social-reels-row';
      reelImages.forEach((src, reelIndex) => reelsRow.appendChild(makeImageReel(src, reelIndex)));
      leftCol.insertBefore(reelsRow, ctaRow);
      track.append(leftCol);
    } else if (noReel) {
      track.classList.add('ls-modal-track--social-no-reel');
      track.append(leftCol);
    } else {
      track.classList.remove('ls-modal-track--social-no-reel');
      track.append(leftCol, reel);
    }
  };

  const renderSlider = () => {
    if (mode !== 'slider') return;
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    dots.querySelectorAll('button').forEach((button, i) => {
      button.classList.toggle('active', i === index);
      button.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
  };

  const move = (direction) => {
    if (mode !== 'slider' || slides.length < 2) return;
    index = (index + direction + slides.length) % slides.length;
    renderSlider();
  };

  const open = (trigger) => {
    const imgs = (trigger.dataset.projectImages || '')
      .split('|')
      .map(source => safeImageSource(source.trim()))
      .filter(Boolean);
    slides = imgs.length ? imgs : ['/backgrounds/image-bg/header-bg-homme.png'];
    mode = trigger.dataset.projectLayout === 'custom'
      ? 'custom'
      : trigger.dataset.projectLayout === 'gallery'
      ? 'gallery'
      : trigger.dataset.projectGrid === 'true' ? 'grid' : 'slider';
    index = 0;
    const isCustom = mode === 'custom';
    titleEl.parentElement.hidden = isCustom;
    titleEl.textContent  = isCustom ? '' : (trigger.dataset.projectTitle  || '');
    const metaAttr = trigger.dataset.projectMeta || '';
    kickerEl.textContent = metaAttr
      ? metaAttr.split('|').map(s => s.trim()).filter(Boolean).join(' · ')
      : 'Projet Latitude Sud';
    clientEl.textContent = isCustom ? '' : (metaAttr ? '' : (trigger.dataset.projectClient || ''));
    clientEl.hidden = isCustom || !!metaAttr;
    const description = isCustom ? '' : (trigger.dataset.projectDescription || '');
    const descriptionLabel = trigger.classList.contains('catalogue-card')
      ? 'À propos du catalogue'
      : mode === 'grid'
      ? 'À propos de la campagne'
      : 'À propos du projet';
    descEl.innerHTML = description ? `<strong class="ls-modal-desc-kicker">${descriptionLabel}</strong>${description}` : '';
    descEl.hidden = !description;
    track.replaceChildren();
    track.classList.remove('ls-modal-track--social-no-reel');
    dots.replaceChildren();
    if (mode === 'custom') {
      const tpl = document.getElementById(trigger.dataset.projectCustomTemplate || '');
      if (tpl) {
        track.appendChild(tpl.content.cloneNode(true));
        ensureInstagramEmbeds();
      }
    } else if (mode === 'grid') {
      renderSocialComposition(trigger);
    } else {
      slides.forEach((src, i) => {
        const figure = document.createElement('figure');
        figure.className = 'ls-modal-slide';
        const image = document.createElement('img');
        image.src = src;
        image.alt = `${trigger.dataset.projectTitle || 'Projet'} — visuel ${i + 1}`;
        image.loading = i < 2 ? 'eager' : 'lazy';
        figure.appendChild(image);
        track.appendChild(figure);
      });
    }
    if (mode === 'slider' && slides.length > 1) {
      slides.forEach((_, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Afficher le visuel ${i + 1}`);
        button.addEventListener('click', () => { index = i; renderSlider(); });
        dots.appendChild(button);
      });
    }
    applyCaseStudyContactCta(dialog, trigger);
    modal.classList.remove('slider-mode', 'grid-mode', 'gallery-mode', 'custom-mode', 'light-surface');
    modal.classList.add(`${mode}-mode`);
    modal.classList.toggle('light-surface', trigger.classList.contains('catalogue-card'));
    prev.hidden = mode !== 'slider' || slides.length < 2;
    next.hidden = mode !== 'slider' || slides.length < 2;
    dots.hidden = mode !== 'slider' || slides.length < 2;
    track.style.transform = '';
    dialog.scrollTop = 0;
    modal.querySelector('.ls-modal-viewport').scrollTop = 0;
    renderSlider();
    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setModalBackgroundInert(modal, true);
    document.body.style.overflow = 'hidden';
    modal.querySelector('.ls-modal-close').focus();
  };
  const close = () => {
    modal.classList.remove('open');
    modal.classList.remove('slider-mode', 'grid-mode', 'gallery-mode', 'custom-mode', 'light-surface');
    modal.setAttribute('aria-hidden', 'true');
    setModalBackgroundInert(modal, false);
    document.body.style.overflow = document.querySelector('.product-gallery-modal.open') ? 'hidden' : '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  modal.addEventListener('click', (e) => {
    const gotoBtn = e.target.closest('[data-modal-goto]');
    if (!gotoBtn) return;
    const targetTrigger = document.querySelector(`[data-project-title="${gotoBtn.dataset.modalGoto}"]`);
    if (!targetTrigger) return;
    close();
    setTimeout(() => open(targetTrigger), 260);
  });

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  triggers.forEach((t) => {
    t.style.cursor = 'pointer';
    t.addEventListener('click', (e) => { e.preventDefault(); open(t); });
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(t); }
    });
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '0');
    if (!t.hasAttribute('role')) t.setAttribute('role', 'button');
  });

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'ArrowLeft') move(-1);
  });
}

/* ── MARINA BAS-DU-FORT CASE STUDY ──────────────────────────
   A dedicated long-form presentation built from the client's dossier. */
function initMarinaProject() {
  const triggers = document.querySelectorAll('[data-marina-project]');
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'marina-case-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="marina-case-backdrop" data-marina-close></div>
    <div class="marina-case-dialog" role="dialog" aria-modal="true" aria-labelledby="marina-case-title">
      <button class="marina-case-close" type="button" data-marina-close aria-label="Fermer">&times;</button>
      <div class="marina-case-content">
        <header class="marina-case-hero">
          <div>
            <span class="marina-case-badge">Charte graphique</span>
            <h2 id="marina-case-title">Marina Bas-du-Fort</h2>
            <p>Nous avons modernisé l'identité de la Marina Bas-du-Fort en conservant ses repères essentiels : la voile, l'horizon et le bleu du littoral. Le nouveau système gagne en lisibilité et peut vivre avec cohérence sur les supports d'accueil, d'information et d'événementiel.</p>
            <span class="marina-case-meta">Logo · Couleurs · Applications · Déploiement</span>
          </div>
          <img class="marina-case-logo" src="/assets/projects/marina/logo-blue-transparent.webp" alt="Logo bleu de la Marina Bas-du-Fort" loading="lazy">
        </header>

        <section class="marina-case-section">
          <h3>Avant &amp; après</h3>
          <div class="marina-before-after">
            <figure><figcaption><span>Avant</span></figcaption><img src="/assets/projects/marina/logo-before.webp" alt="Ancienne identité de la Marina Bas-du-Fort" loading="lazy"></figure>
            <span class="marina-before-after-arrow" aria-hidden="true">&rarr;</span>
            <figure class="marina-after-logo"><figcaption><span>Après</span></figcaption><img src="/assets/projects/marina/logo-after.webp" alt="Nouvelle identité blanche de la Marina Bas-du-Fort sur fond bleu" loading="lazy"></figure>
          </div>
        </section>

        <section class="marina-case-section">
          <h3>Fondations de la charte</h3>
          <div class="marina-dossier-grid">
            <figure class="marina-media-card marina-media-card--wide"><img src="/assets/projects/marina/charte-foundations.webp" alt="Construction du logo, variantes chromatiques, typographies et palette de la Marina Bas-du-Fort" loading="lazy"></figure>
          </div>
        </section>

        <section class="marina-case-section">
          <h3>Présentation du système</h3>
          <div class="marina-system-grid marina-system-grid--sim-row">
            <figure class="marina-media-card"><img src="/assets/projects/marina/simulation-4_3-source.webp" alt="Simulation d'une publication Marina Bas-du-Fort au format 4/3 — fichier source" loading="lazy"></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/simulation-4_3.webp" alt="Simulation d'une publication Marina Bas-du-Fort au format 4/3" loading="lazy"></figure>
          </div>
          <div class="marina-system-grid marina-system-grid--single">
            <figure class="marina-media-card"><img src="/assets/projects/marina/charte-format-square.webp" alt="Présentation du système de composition au format carré" loading="lazy"></figure>
          </div>
        </section>

        <section class="marina-case-section">
          <h3>Simulations &amp; déploiement</h3>
          <div class="marina-deployment-grid">
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/marina-equipe-accueil.webp" alt="Mockup de l'identité Marina Bas-du-Fort sur la tenue et le badge de l'équipe d'accueil" loading="lazy"><figcaption>Équipe d'accueil</figcaption></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/marina-kit-visiteur.webp" alt="Mockup d'un kit visiteur Marina Bas-du-Fort" loading="lazy"><figcaption>Kit visiteur</figcaption></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/generated/marina-plan-orientation.webp" alt="Mockup du plan d'orientation de la Marina Bas-du-Fort" loading="lazy"><figcaption>Plan d'orientation</figcaption></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/generated/marina-signaletique.webp" alt="Mockup de la signalétique de la Marina Bas-du-Fort" loading="lazy"><figcaption>Signalétique directionnelle</figcaption></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/generated/marina-guide-port.webp" alt="Mockup du guide de port de la Marina Bas-du-Fort" loading="lazy"><figcaption>Guide de port</figcaption></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/generated/marina-borne-digitale.webp" alt="Mockup de la borne digitale de la Marina Bas-du-Fort" loading="lazy"><figcaption>Borne d'information</figcaption></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/generated/marina-polo-equipe.webp" alt="Mockup du polo de l'équipe de la Marina Bas-du-Fort" loading="lazy"><figcaption>Tenue d'équipe</figcaption></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/generated/marina-drapeaux.webp" alt="Mockup des drapeaux de la Marina Bas-du-Fort" loading="lazy"><figcaption>Drapeaux d'accueil</figcaption></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/generated/marina-badge-acces.webp" alt="Mockup du badge d'accès de la Marina Bas-du-Fort" loading="lazy"><figcaption>Badge d'accès</figcaption></figure>
            <figure class="marina-media-card"><img src="/assets/projects/marina/mockups/generated/marina-poloshirts.webp" alt="Mockup des polos de la Marina Bas-du-Fort" loading="lazy"><figcaption>Collection textile</figcaption></figure>
          </div>
        </section>
      </div>
    </div>`;
  document.body.appendChild(modal);
  initModalFocusTrap(modal);

  const dialog = modal.querySelector('.marina-case-dialog');
  const closeButton = modal.querySelector('.marina-case-close');
  let lastFocus = null;
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setModalBackgroundInert(modal, false);
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  const open = () => {
    lastFocus = document.activeElement;
    dialog.scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setModalBackgroundInert(modal, true);
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('click', (event) => { event.preventDefault(); open(); });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
  modal.querySelectorAll('[data-marina-close]').forEach((element) => element.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* ── CIST 971 CASE STUDY ────────────────────────────────────
   Long-form presentation based on the approved CIST brand guide. */
function initSoClassProject() {
  const triggers = document.querySelectorAll('[data-so-class-project]');
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'so-class-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="so-class-backdrop" data-so-class-close></div>
    <div class="so-class-dialog" role="dialog" aria-modal="true" aria-labelledby="so-class-title">
      <button class="so-class-close" type="button" data-so-class-close aria-label="Fermer">&times;</button>
      <div class="so-class-content">
        <header class="so-class-hero">
          <div>
            <span class="so-class-eyebrow">Photographie · 2022</span>
            <h2 id="so-class-title">So Class<br><em>Collection Jazz</em></h2>
            <p>Un shooting éditorial réalisé en Guadeloupe pour présenter la collection de lunettes Jazz. Les portraits associent style, caractère et architecture locale dans une lumière franche et solaire.</p>
          </div>
          <img src="/assets/projects/so-class/gallery/so-class-collection-jazz-cover-clean-2022.webp" alt="Couverture de la collection Jazz de So Class" loading="eager">
        </header>

        <section class="so-class-section so-class-section--social">
          <div class="so-class-heading">
            <span>Déploiement social</span>
            <h3>La collection dans le feed</h3>
            <p>Quatre compositions carrées prolongent le shooting sur Instagram avec une signature cohérente et une lecture immédiate de la collection.</p>
          </div>
          <div class="so-class-instagram-grid">
            ${[1, 2, 3, 4].map((index) => `
              <article class="so-class-instagram-post">
                <header><img class="so-class-avatar" src="/assets/projects/so-class/profile/instagram-profile-so-class-2022.webp" alt=""><div><strong>soclass971</strong><small>Guadeloupe</small></div><b>•••</b></header>
                <img src="/assets/projects/so-class/instagram/so-class-instagram-collection-jazz-2022-${String(index).padStart(2, '0')}.webp?v=4" alt="Publication Instagram So Class, collection Jazz ${index}" loading="lazy">
                <footer>
                  <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.3l7.8-7.8a5.5 5.5 0 0 0 1-8.9Z"/></svg></span>
                  <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></svg></span>
                  <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></span>
                  <b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg></b>
                  <p><strong>soclass971</strong> Collection Jazz · Made in Guadeloupe.</p>
                </footer>
              </article>`).join('')}
          </div>
        </section>

        <section class="so-class-section">
          <div class="so-class-heading">
            <span>Le shooting</span>
            <h3>Des montures mises en situation</h3>
            <p>Les cadrages alternent silhouettes, portraits serrés et détails produit. Chaque image laisse les lunettes lisibles tout en construisant un univers mode ancré dans les couleurs de Pointe-à-Pitre.</p>
          </div>
          <div class="so-class-gallery">
            <figure class="so-class-gallery__wide"><img src="/assets/projects/so-class/gallery/so-class-shooting-eglise-pap-fiona-2022.webp" alt="Fiona avec lunettes devant l'église à Pointe-à-Pitre" loading="lazy"></figure>
          </div>
          <p class="so-class-product-intro">Les vues sur fond clair complètent les portraits avec une lecture précise des formes, des couleurs et des finitions de la collection.</p>
          <div class="so-class-product-spreads">
            <article class="so-class-product-spread">
              <figure class="so-class-product-model"><img src="/assets/projects/so-class/gallery/so-class-portrait-homme-lunettes-2022.webp" alt="Portrait homme portant une monture Jazz" loading="lazy"></figure>
              <div class="so-class-product-pair">
                <article class="so-class-product-item">
                  <figure><img src="/assets/projects/so-class/products/so-class-lunettes-noir-transparent.webp?v=4" alt="Monture Jazz noire et transparente" loading="lazy"></figure>
                  <div><span>01</span><h4>Lecture immédiate</h4><p>Un cadrage constant permet de comparer les modèles rapidement, sans détourner l’attention du produit.</p></div>
                </article>
                <article class="so-class-product-item">
                  <figure><img src="/assets/projects/so-class/products/so-class-lunettes-ecaille.webp?v=4" alt="Monture Jazz écaille" loading="lazy"></figure>
                  <div><span>02</span><h4>Couleurs fidèles</h4><p>La lumière révèle les nuances de l’acétate, les transparences et les détails métalliques des branches.</p></div>
                </article>
              </div>
            </article>
            <article class="so-class-product-spread so-class-product-spread--reverse">
              <div class="so-class-product-pair">
                <article class="so-class-product-item">
                  <figure><img src="/assets/projects/so-class/products/so-class-lunettes-bleu-rouge.webp?v=4" alt="Monture Jazz bleue et rouge" loading="lazy"></figure>
                  <div><span>03</span><h4>Déclinaison souple</h4><p>Chaque vue fonctionne seule, en grille ou dans une mise en page éditoriale, du catalogue aux réseaux sociaux.</p></div>
                </article>
                <article class="so-class-product-item">
                  <figure><img src="/assets/projects/so-class/products/so-class-lunettes-blanc-ecaille.webp?v=4" alt="Monture Jazz blanche et écaille" loading="lazy"></figure>
                  <div><span>04</span><h4>Ensemble cohérent</h4><p>Le même fond, la même échelle et le même angle donnent à la collection une présentation homogène.</p></div>
                </article>
              </div>
              <figure class="so-class-product-model"><img src="/assets/projects/so-class/gallery/so-class-portrait-femme-lunettes-2022.webp" alt="Portrait femme portant une monture Jazz" loading="lazy"></figure>
            </article>
          </div>
          <div class="so-class-gallery so-class-gallery--closing">
            <figure class="so-class-gallery__wide"><img src="/assets/projects/so-class/gallery/so-class-portrait-fiona-pap-2022.webp" alt="Portrait Fiona avec lunettes à Pointe-à-Pitre" loading="lazy"></figure>
            <figure class="so-class-gallery__wide"><img src="/assets/projects/so-class/gallery/so-class-brochure-mockup-jazz-2022.webp" alt="Mockup brochure So Class collection Jazz" loading="lazy"></figure>
          </div>
        </section>
      </div>
    </div>`;
  document.body.appendChild(modal);
  initModalFocusTrap(modal);

  const dialog = modal.querySelector('.so-class-dialog');
  const closeButton = modal.querySelector('.so-class-close');
  let lastFocus = null;
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setModalBackgroundInert(modal, false);
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  const open = () => {
    lastFocus = document.activeElement;
    dialog.scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setModalBackgroundInert(modal, true);
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('click', (event) => { event.preventDefault(); open(); });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
  modal.querySelectorAll('[data-so-class-close]').forEach((button) => button.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

function initCistProject() {
  const triggers = document.querySelectorAll('[data-cist-project]');
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'cist-case-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="cist-case-backdrop" data-cist-close></div>
    <div class="cist-case-dialog" role="dialog" aria-modal="true" aria-labelledby="cist-case-title">
      <button class="cist-case-close" type="button" data-cist-close aria-label="Fermer">&times;</button>
      <div class="cist-case-content">
        <header class="cist-case-hero">
          <div>
            <span class="cist-case-badge">Charte graphique</span>
            <h2 id="cist-case-title">CIST 971</h2>
            <p>Le CIST est un acteur engagé de la santé au travail, au service des entreprises et des salariés de Guadeloupe. Son identité affirme une vision claire, rassurante et accessible, fondée sur trois piliers : la prévention, l'accompagnement des entreprises et la relation humaine.</p>
            <span class="cist-case-meta">Logo · Couleurs · Typographies · Pictogrammes · Photos · Applications</span>
          </div>
          <img class="cist-case-logo" src="/assets/projects/cist/logo-vertical-trimmed.webp" alt="Logo CIST, ma santé au travail" loading="eager">
        </header>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Évolution</span>
            <h3>Avant &amp; après</h3>
            <p>Face à la digitalisation, à la multiplication des formats et à l'exigence de lisibilité, le CIST a fait évoluer son identité tout en conservant ses repères essentiels. La refonte modernise l'image, harmonise les prises de parole et valorise la mission de service auprès des salariés et des entreprises.</p>
          </div>
          <div class="cist-before-after">
            <figure><figcaption>Avant</figcaption><img src="/assets/projects/cist/logo-before.webp" alt="Ancienne version monochrome du logo CIST" loading="lazy"></figure>
            <span class="cist-before-after-arrow" aria-hidden="true">&rarr;</span>
            <figure><figcaption>Après</figcaption><img src="/assets/projects/cist/logo-horizontal.webp" alt="Nouvelle identité horizontale colorée du CIST" loading="lazy"></figure>
          </div>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Le logo</span>
            <h3>Un symbole d'accompagnement</h3>
            <p>Le symbole cœur associe le bleu du bien-être et le vert de la santé. Il évoque la protection, la prévention et la vitalité. La typographie arrondie renforce la dimension humaine, tandis que « ma santé au travail » personnalise le message et crée un lien direct avec chaque salarié.</p>
          </div>
          <div class="cist-logo-grid">
            <figure class="cist-media-card cist-media-card--logo"><img src="/assets/projects/cist/logo-vertical.webp" alt="Version verticale du logo CIST" loading="lazy"><figcaption><strong>Version principale</strong><span>La version verticale est la représentation prioritaire de l'image du CIST.</span></figcaption></figure>
            <figure class="cist-media-card cist-media-card--logo"><img src="/assets/projects/cist/logo-horizontal.webp" alt="Version horizontale du logo CIST" loading="lazy"><figcaption><strong>Version horizontale</strong><span>Elle assure une lisibilité optimale sur les formats larges et les espaces restreints en hauteur.</span></figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--tinted">
          <div class="cist-section-heading">
            <span>Les missions</span>
            <h3>Trois branches, une identité</h3>
          </div>
          <div class="cist-branch-grid">
            <figure class="cist-branch-card"><img src="/assets/projects/cist/branch-suivi.webp" alt="Déclinaison verte du CIST" loading="lazy"><figcaption><strong>Suivi individuel</strong><span>Une version monochrome verte dédiée à l'accompagnement personnalisé des salariés et au suivi médical.</span></figcaption></figure>
            <figure class="cist-branch-card"><img src="/assets/projects/cist/branch-risque.webp" alt="Déclinaison bleu bien-être du CIST" loading="lazy"><figcaption><strong>Risque professionnel</strong><span>Le bleu traduit la rigueur, la confiance et l'engagement dans la protection de la santé au travail.</span></figcaption></figure>
            <figure class="cist-branch-card"><img src="/assets/projects/cist/branch-maintien.webp" alt="Déclinaison bleu institutionnel du CIST" loading="lazy"><figcaption><strong>Maintien de l'emploi</strong><span>Le bleu institutionnel exprime la stabilité, le soutien et la continuité professionnelle.</span></figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Règles d'usage</span>
            <h3>Protéger la lisibilité</h3>
          </div>
          <div class="cist-guideline-grid">
            <figure><img src="/assets/projects/cist/guidelines/cist-zone-protection-horizontal.webp" alt="Zone de protection de la version horizontale du logo CIST" loading="lazy"><figcaption><strong>Zone de protection horizontale</strong><span>La hauteur de la baseline sert d'unité X et définit un espace libre identique sur les quatre côtés.</span></figcaption></figure>
            <figure><img src="/assets/projects/cist/guidelines/cist-zone-protection-vertical.webp" alt="Zone de protection de la version verticale du logo CIST" loading="lazy"><figcaption><strong>Zone de protection verticale</strong><span>L'espace entre le pictogramme et le mot « cist » devient l'unité de respiration minimale.</span></figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--tinted">
          <div class="cist-section-heading">
            <span>Palette</span>
            <h3>Une couleur pour chaque mission</h3>
            <p>L'identité visuelle repose sur une palette structurée, issue directement du logo générique et déclinée pour identifier ses trois grandes branches. Chaque couleur incarne une mission spécifique tout en garantissant la cohérence graphique globale.</p>
          </div>
          <div class="cist-palette cist-palette--primary">
            <article style="--swatch:#3B8634"><span class="cist-palette-main"></span><strong>Vert santé</strong><small>RGB 59 · 134 · 52<br>#3B8634</small><div class="cist-tone-row" aria-label="Tons de vert santé"><i style="opacity:1"></i><i style="opacity:.8"></i><i style="opacity:.6"></i><i style="opacity:.4"></i><i style="opacity:.2"></i></div></article>
            <article style="--swatch:#1581C3"><span class="cist-palette-main"></span><strong>Bleu bien-être</strong><small>RGB 21 · 129 · 195<br>#1581C3</small><div class="cist-tone-row" aria-label="Tons de bleu bien-être"><i style="opacity:1"></i><i style="opacity:.8"></i><i style="opacity:.6"></i><i style="opacity:.4"></i><i style="opacity:.2"></i></div></article>
            <article style="--swatch:#2055A1"><span class="cist-palette-main"></span><strong>Bleu institutionnel</strong><small>RGB 32 · 85 · 161<br>#2055A1</small><div class="cist-tone-row" aria-label="Tons de bleu institutionnel"><i style="opacity:1"></i><i style="opacity:.8"></i><i style="opacity:.6"></i><i style="opacity:.4"></i><i style="opacity:.2"></i></div></article>
            <article style="--swatch:#E9EAEA"><span class="cist-palette-main"></span><strong>Blanc cassé</strong><small>RGB 233 · 234 · 234<br>#E9EAEA</small><div class="cist-tone-row" aria-label="Tons de blanc cassé"><i style="opacity:1"></i><i style="opacity:.8"></i><i style="opacity:.6"></i><i style="opacity:.4"></i><i style="opacity:.2"></i></div></article>
          </div>
          <h4 class="cist-palette-subtitle">Couleurs secondaires</h4>
          <div class="cist-palette cist-palette--secondary">
            <article style="--swatch:#D7E7F5"><span class="cist-palette-main"></span><strong>Bleu clair</strong><small>Arrière-plans</small></article>
            <article style="--swatch:#D6EEE2"><span class="cist-palette-main"></span><strong>Vert menthe</strong><small>Encadrés</small></article>
            <article style="--swatch:#F5ECE1"><span class="cist-palette-main"></span><strong>Beige</strong><small>Respiration</small></article>
            <article style="--swatch:#919BA1"><span class="cist-palette-main"></span><strong>Gris moyen</strong><small>Textes secondaires</small></article>
          </div>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Typographies</span>
            <h3>Accessible dans chaque contexte</h3>
          </div>
          <div class="cist-type-grid">
            <article><span>Police principale</span><strong class="cist-type-harabara">Harabara Mais</strong><p>Ses courbes modernes et structurées expriment le professionnalisme, l'accessibilité et la contemporanéité. Cette sans serif légèrement arrondie est utilisée pour les titres, sous-titres et éléments forts.</p></article>
            <article><span>Police secondaire</span><strong class="cist-type-montserrat">Montserrat</strong><p>Claire, équilibrée et moderne, elle apporte rigueur et lisibilité. Elle accompagne les textes courants et les documents administratifs.</p></article>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--tinted">
          <div class="cist-section-heading">
            <span>Éléments complémentaires</span>
            <h3>Un langage graphique cohérent</h3>
            <p>Des pictogrammes en ligne, sobres et épurés structurent l'information, illustrent rapidement les thématiques de santé, de prévention et d'accompagnement et renforcent la cohérence visuelle.</p>
          </div>
          <div class="cist-symbol-layout">
            <figure><img src="/assets/projects/cist/logo-icon.webp" alt="Icône cœur du CIST" loading="lazy"><figcaption>Le cœur devient avatar, favicon ou repère dans les petits espaces.</figcaption></figure>
            <figure class="cist-icon-system"><img src="/assets/projects/cist/guidelines/cist-systeme-pictogrammes.webp" alt="Système complet de pictogrammes linéaires du CIST" loading="lazy"><figcaption>Une bibliothèque cohérente couvre la santé, la prévention, l'accompagnement, les services et les environnements de travail.</figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Direction photo</span>
            <h3>La relation humaine au premier plan</h3>
            <p>La direction photographique valorise la relation humaine, l'écoute et la confiance. Les images privilégient une lumière douce et naturelle, des cadrages clairs, des situations réelles et des profils identifiables au territoire guadeloupéen.</p>
          </div>
          <div class="cist-photo-grid">
            <figure class="cist-photo-grid__wide"><img src="/assets/projects/cist/photo-consultation.webp" alt="Salariée en échange avec un professionnel de santé" loading="lazy"><figcaption><strong>Écoute et dialogue</strong><span>Des situations réelles, des attitudes bienveillantes et une proximité humaine.</span></figcaption></figure>
            <figure><img src="/assets/projects/cist/photo-accompagnement.webp" alt="Professionnel de santé accompagnant un salarié" loading="lazy"><figcaption><strong>Accompagnement</strong><span>La confiance au cœur de la relation entre le salarié et le professionnel.</span></figcaption></figure>
            <figure><img src="/assets/projects/cist/photo-ecoute.webp" alt="Consultation de santé au travail" loading="lazy"><figcaption><strong>Suivi individuel</strong><span>Une présence attentive dans un environnement clair et naturel.</span></figcaption></figure>
            <figure><img src="/assets/projects/cist/photo-prevention-collective.webp" alt="Intervention de prévention devant un public" loading="lazy"><figcaption><strong>Prévention en entreprise</strong><span>Informer, alerter et accompagner les collectifs de travail.</span></figcaption></figure>
            <figure><img src="/assets/projects/cist/photo-dialogue.webp" alt="Échange entre une médecin et une salariée" loading="lazy"><figcaption><strong>Proximité</strong><span>Une photographie positive, accessible et ancrée dans le quotidien.</span></figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Prévention</span>
            <h3>Des flyers prêts à diffuser</h3>
          </div>
          <div class="cist-flyer-grid cist-flyer-grid--mockups">
            <figure class="cist-flyer-card">
              <img src="/assets/projects/cist/flyer-rayonnement-ionisant.jpg" alt="Flyer CIST consacré au rayonnement ionisant" loading="lazy">
            </figure>
            <figure class="cist-flyer-card">
              <img src="/assets/projects/cist/flyer-boulanger-patissier.jpg" alt="Flyer CIST consacré aux métiers de boulanger et pâtissier" loading="lazy">
            </figure>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--applications">
          <div class="cist-section-heading">
            <span>Déploiement</span>
            <h3>Une identité prête à vivre</h3>
            <p>Chaque support reprend les mêmes principes : hiérarchie claire, palette maîtrisée, typographies lisibles et présence humaine. L'ensemble reste immédiatement reconnaissable, du document institutionnel à l'événementiel.</p>
          </div>
          <div class="cist-application-grid">
            <figure class="cist-application-card"><img src="/assets/projects/cist/mockup-business-cards.webp" alt="Cartes de visite du CIST mises en situation" loading="lazy"><figcaption><strong>Carte de visite</strong><span>Un format horizontal, lisible et institutionnel.</span></figcaption></figure>
            <figure class="cist-application-card"><img src="/assets/projects/cist/mockup-event-rollup.webp" alt="Oriflamme CIST dans un événement professionnel en Guadeloupe" loading="lazy"><figcaption><strong>Événementiel</strong><span>Un support visible qui exprime proximité et expertise.</span></figcaption></figure>
          </div>
          <div class="cist-social-heading">
            <span>Gestion des réseaux sociaux</span>
            <h4>Des publications cohérentes et accessibles</h4>
          </div>
          <div class="cist-social-showcase">
            <article class="cist-social-post">
              <header><img src="/assets/projects/cist/logo-icon.webp" alt=""><div><strong>cist971</strong><span>Guadeloupe</span></div><b>•••</b></header>
              <img src="/assets/projects/cist/application-instagram.webp" alt="Publication Instagram du CIST" loading="lazy">
              <footer class="cist-instagram-actions"><span aria-label="J'aime"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg></span><span aria-label="Commenter"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></svg></span><span aria-label="Partager"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></span><b aria-label="Enregistrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg></b><p><strong>cist971</strong> La prévention et l'accompagnement au plus près des salariés.</p></footer>
            </article>
            <figure class="cist-social-mockup"><img src="/assets/projects/cist/application-facebook-square.webp" alt="Mise en situation Facebook du CIST" loading="lazy"><figcaption><strong>Publication Facebook</strong><span>La page et sa publication sont présentées en plein format pour conserver une lecture nette.</span></figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Site internet</span>
            <h3>Une identité digitale complète</h3>
            <p>La charte graphique se prolonge sur le site institutionnel du CIST : navigation claire, parcours différenciés salarié/employeur et mise en avant des ressources de prévention.</p>
            <a class="cist-website-visit" href="https://www.cist-gpe.com/" target="_blank" rel="noopener">Visiter cist-gpe.com <span aria-hidden="true">→</span></a>
          </div>
          <div class="cist-website-grid">
            <figure class="cist-website-card cist-website-card--wide">
              <div class="cist-website-chrome"><i></i><i></i><i></i><span>cist-gpe.com</span></div>
              <img src="/assets/projects/cist/website/cist-site-accueil-2026.jpg" alt="Page d'accueil du site internet du CIST" loading="lazy">
              <figcaption><strong>Accueil</strong><span>Le message d'accueil, les parcours salarié et employeur, puis les offres principales.</span></figcaption>
            </figure>
            <figure class="cist-website-card">
              <div class="cist-website-chrome"><i></i><i></i><i></i><span>cist-gpe.com/adherer</span></div>
              <img src="/assets/projects/cist/website/cist-site-tarifs.jpg" alt="Page des tarifs d'adhésion du site internet du CIST" loading="lazy">
              <figcaption><strong>Tarif d'adhésion</strong><span>Les cotisations et les services inclus sont présentés dans une lecture directe.</span></figcaption>
            </figure>
            <figure class="cist-website-card">
              <div class="cist-website-chrome"><i></i><i></i><i></i><span>cist-gpe.com/faq</span></div>
              <img src="/assets/projects/cist/website/cist-site-actualites-faq.jpg" alt="Page des actualités et de la foire aux questions du site internet du CIST" loading="lazy">
              <figcaption><strong>Actualités &amp; FAQ</strong><span>Les articles de prévention et les questions fréquentes sont réunis sur une même page.</span></figcaption>
            </figure>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--tinted">
          <div class="cist-section-heading">
            <span>Motion design</span>
            <h3>Une identité qui se raconte</h3>
            <p>Un film de présentation prolonge la charte sur les supports numériques et rend la mission du CIST immédiatement accessible.</p>
          </div>
          <div class="cist-motion-video"><iframe src="https://www.youtube-nocookie.com/embed/CBANvHPZRgY?controls=1&amp;modestbranding=1&amp;playsinline=1&amp;rel=0" title="Motion design CIST 971" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
        </section>
      </div>
    </div>`;
  document.body.appendChild(modal);
  initModalFocusTrap(modal);

  const dialog = modal.querySelector('.cist-case-dialog');
  const closeButton = modal.querySelector('.cist-case-close');
  let lastFocus = null;
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setModalBackgroundInert(modal, false);
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  const open = () => {
    lastFocus = document.activeElement;
    dialog.scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setModalBackgroundInert(modal, true);
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('click', (event) => { event.preventDefault(); open(); });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
  modal.querySelectorAll('[data-cist-close]').forEach((element) => element.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* ── LES BONNES ÉPICES CASE STUDY ──────────────────────────
   Rebranding presentation assembled from the 2022 brand dossier. */
function initBonnesEpicesProject() {
  const triggers = document.querySelectorAll('[data-bonnes-epices-project]');
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'cist-case-modal bonnes-case-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="cist-case-backdrop bonnes-case-backdrop" data-bonnes-close></div>
    <div class="cist-case-dialog bonnes-case-dialog" role="dialog" aria-modal="true" aria-labelledby="bonnes-case-title">
      <button class="cist-case-close" type="button" data-bonnes-close aria-label="Fermer">&times;</button>
      <div class="cist-case-content">
        <header class="cist-case-hero bonnes-case-hero">
          <div>
            <span class="cist-case-badge bonnes-case-badge">Rebranding</span>
            <h2 id="bonnes-case-title">Les Bonnes Épices</h2>
            <p>Une refonte pensée pour faire évoluer une marque familiale guadeloupéenne sans effacer son histoire. Le nouveau territoire conserve les feuilles, la chaleur des épices et la figure de Monsieur Maurice, tout en gagnant en impact sur les emballages et les réseaux sociaux.</p>
            <span class="cist-case-meta bonnes-case-meta">Logo · Territoire graphique · Édition · Réseaux sociaux</span>
          </div>
          <img class="cist-case-logo bonnes-case-logo" src="/assets/projects/bonnes-epices/identity/logo-badge-original.svg" alt="Nouvelle identité Les Bonnes Épices de Monsieur Maurice" loading="eager">
        </header>

        <section class="cist-case-section">
          <div class="cist-section-heading bonnes-section-heading">
            <span>Évolution</span>
            <h3>Faire mûrir une marque historique</h3>
            <p>La refonte simplifie la lecture, renforce la hiérarchie et installe une palette solaire. L'identité reste immédiatement familière, mais devient plus souple pour accompagner les produits, les recettes et les histoires de la maison.</p>
          </div>
          <div class="bonnes-evolution-grid">
            <figure><img src="/assets/projects/bonnes-epices/logo-before.webp" alt="Ancien logo Les Bonnes Épices de Monsieur Maurice, 2017" loading="lazy"><figcaption><span>Avant</span> Un emblème illustré et très détaillé</figcaption></figure>
            <figure><img src="/assets/projects/bonnes-epices/logo-after.webp" alt="Nouvelle identité Les Bonnes Épices en jaune sur fond vert" loading="lazy"><figcaption><span>Après</span> Une signature plus directe et plus lisible</figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section bonnes-process-section">
          <div class="cist-section-heading bonnes-section-heading">
            <span>Dans les coulisses</span>
            <h3>Ce qu'on a gardé, fait évoluer, ajouté</h3>
            <p>La refonte préserve les repères déjà installés, puis intervient sur le dessin, la hiérarchie et les éléments qui manquaient au système.</p>
          </div>
          <div class="bonnes-process-grid">
            <article class="bonnes-process-card">
              <span class="bonnes-process-icon" aria-hidden="true">✓</span>
              <h4>Gardé</h4>
              <ul><li>Les codes couleurs</li><li>Les feuilles</li><li>La structure</li></ul>
            </article>
            <article class="bonnes-process-card">
              <span class="bonnes-process-icon" aria-hidden="true">↗</span>
              <h4>Fait évoluer</h4>
              <ul><li>Les feuilles : dégradé et épaisseurs</li><li>Le soleil</li><li>Les typographies</li></ul>
            </article>
            <article class="bonnes-process-card">
              <span class="bonnes-process-icon" aria-hidden="true">+</span>
              <h4>Ajouté</h4>
              <ul><li>Une accroche</li><li>Un reflet</li></ul>
            </article>
          </div>
          <figure class="bonnes-process-dossier">
            <div class="bonnes-process-dossier__text">
              <h4>Détail du tracé des feuilles</h4>
              <p>Les feuilles ont été redessinées avec un dégradé et des épaisseurs variables pour plus de profondeur et de lisibilité.</p>
              <ul class="bonnes-process-dossier__legend">
                <li><span style="--dot:#3B8634"></span>Nouveau tracé</li>
                <li><span style="--dot:#E0B900"></span>Éléments conservés</li>
              </ul>
            </div>
            <div class="bonnes-process-dossier__media">
              <img src="/assets/projects/bonnes-epices/identity/logo-detail-dossier.webp" alt="Planche du dossier de marque détaillant le dessin d'une feuille du logo" loading="lazy" decoding="async">
              <figcaption>Extrait du dossier de refonte, détail du tracé des feuilles</figcaption>
            </div>
          </figure>
        </section>

        <section class="cist-case-section bonnes-variants-section">
          <div class="cist-section-heading bonnes-section-heading">
            <span>Système de marque</span>
            <h3>Un logo pensé pour tous les supports</h3>
            <p>Les variantes reprennent strictement le même dessin. Seuls le contraste, le nombre de couleurs et le format changent selon le support.</p>
          </div>
          <div class="bonnes-bsys">
            <div class="bonnes-bsys__variants">
              <div class="bonnes-bsys__card bonnes-bsys__card--svg" style="--bsys-bg:#FFFFFF;--bsys-border:rgba(30,44,31,.14)">
                <div class="bonnes-bsys__card-logo"><img src="/assets/projects/bonnes-epices/identity/logo-badge-vertfonce.svg" alt="Logo Les Bonnes Épices, version vert foncé" loading="lazy" decoding="async"></div>
              </div>
              <div class="bonnes-bsys__card bonnes-bsys__card--svg" style="--bsys-bg:#FFFFFF;--bsys-border:rgba(30,44,31,.14)">
                <div class="bonnes-bsys__card-logo"><img src="/assets/projects/bonnes-epices/identity/logo-badge-vert.svg" alt="Logo Les Bonnes Épices, version verte" loading="lazy" decoding="async"></div>
              </div>
              <div class="bonnes-bsys__card bonnes-bsys__card--svg" style="--bsys-bg:#FFFFFF;--bsys-border:rgba(30,44,31,.14)">
                <div class="bonnes-bsys__card-logo"><img src="/assets/projects/bonnes-epices/identity/logo-badge-bicolor-vert.svg" alt="Logo Les Bonnes Épices, version bicolore verte" loading="lazy" decoding="async"></div>
              </div>
              <div class="bonnes-bsys__card bonnes-bsys__card--svg" style="--bsys-bg:#FFFFFF;--bsys-border:rgba(30,44,31,.14)">
                <div class="bonnes-bsys__card-logo"><img src="/assets/projects/bonnes-epices/identity/logo-badge-bicolor-jaune.svg" alt="Logo Les Bonnes Épices, version bicolore jaune" loading="lazy" decoding="async"></div>
              </div>
            </div>
            <div class="bonnes-bsys__horiz-row">
              <figure class="bonnes-bsys__horiz" style="--bsys-bg:#FAEA1D"><img src="/assets/projects/bonnes-epices/identity/logo-horizontal-yellow.webp" alt="Logo horizontal Les Bonnes Épices sur fond jaune" loading="lazy" decoding="async"></figure>
              <figure class="bonnes-bsys__horiz" style="--bsys-bg:#FFFFFF;--bsys-border:rgba(30,44,31,.12)"><img src="/assets/projects/bonnes-epices/identity/logo-horizontal-white.webp" alt="Logo horizontal Les Bonnes Épices sur fond blanc" loading="lazy" decoding="async"></figure>
            </div>
            <p class="bonnes-bsys__horiz-label">VERSION HORIZONTALE ALTERNATIVE</p>
            <p class="bonnes-bsys__note">Utile pour les formats couchés — couverture Facebook, papier à en-tête, bannières.</p>
            <div class="bonnes-bsys__patterns">
              <div class="bonnes-bsys__pattern bonnes-bsys__pattern--tile" style="background-image:url('/assets/projects/bonnes-epices/applications/pattern-a-vert.png')" role="img" aria-label="Motif répétitif feuilles sur fond vert foncé"></div>
              <div class="bonnes-bsys__pattern bonnes-bsys__pattern--tile" style="background-image:url('/assets/projects/bonnes-epices/applications/pattern-b-jaune.jpg')" role="img" aria-label="Motif répétitif feuilles sur fond jaune"></div>
            </div>
            <p class="bonnes-bsys__note">Un motif signature, déclinable en packaging, présentoirs et habillage de point de vente.</p>
            <figure class="bonnes-bsys__banner">
              <img src="/assets/projects/bonnes-epices/applications/pattern-promotion.webp" alt="Bannière promotionnelle Les Bonnes Épices, Promotion de Monsieur Maurice®" loading="lazy" decoding="async">
            </figure>
          </div>
        </section>

        <section class="cist-case-section bonnes-colours-section">
          <div class="cist-section-heading bonnes-section-heading">
            <span>Couleurs &amp; typographie</span>
            <h3>Une base claire pour exprimer la marque</h3>
            <p>Quatre couleurs issues du dossier de marque, associées à Quincy pour les prises de parole éditoriales.</p>
          </div>
          <div class="bonnes-colour-grid">
            <article style="--bonnes-colour:#FFFFFF"><span class="bonnes-colour-swatch"></span><h4>Blanc</h4><code>#FFFFFF</code><div class="bonnes-colour-tones" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></article>
            <article style="--bonnes-colour:#289046"><span class="bonnes-colour-swatch"></span><h4>Vert Émeraude</h4><code>#289046</code><div class="bonnes-colour-tones" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></article>
            <article style="--bonnes-colour:#1E2C1F"><span class="bonnes-colour-swatch"></span><h4>Vert Oxyde de Chrome</h4><code>#1E2C1F</code><div class="bonnes-colour-tones" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></article>
            <article style="--bonnes-colour:#FAEA1D"><span class="bonnes-colour-swatch"></span><h4>Jaune Cobalt</h4><code>#FAEA1D</code><div class="bonnes-colour-tones" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></article>
          </div>
          <div class="bonnes-type-dossier">
            <div class="bonnes-type-dossier__header">
              <div class="bonnes-type-dossier__meta">
                <span>POLICE</span><span>INFORMATIONS</span>
              </div>
              <div class="bonnes-type-dossier__nameblock">
                <span class="bonnes-type-dossier__family">Quincy</span>
                <span class="bonnes-type-dossier__weight">Medium</span>
                <span class="bonnes-type-dossier__style">Normal</span>
              </div>
            </div>
            <p class="bonnes-type-dossier__section-label">EXEMPLES DES CARACTÈRES</p>
            <div class="bonnes-type-dossier__chars" aria-label="Alphabet majuscule Quincy">
              <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span><span>I</span><span>J</span><span>K</span><span>L</span><span>M</span><span>N</span><span>O</span><span>P</span><span>Q</span><span>R</span><span>S</span><span>T</span><span>U</span><span>V</span><span>W</span><span>X</span><span>Y</span><span>Z</span>
            </div>
            <div class="bonnes-type-dossier__chars bonnes-type-dossier__chars--lower" aria-label="Alphabet minuscule Quincy">
              <span>a</span><span>b</span><span>c</span><span>d</span><span>e</span><span>f</span><span>g</span><span>h</span><span>i</span><span>j</span><span>k</span><span>l</span><span>m</span><span>n</span><span>o</span><span>p</span><span>q</span><span>r</span><span>s</span><span>t</span><span>u</span><span>v</span><span>w</span><span>x</span><span>y</span><span>z</span>
            </div>
            <div class="bonnes-type-dossier__nums" aria-label="Chiffres Quincy">
              <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
            </div>
          </div>
        </section>

        <section class="cist-case-section bonnes-terrain-section">
          <div class="cist-section-heading bonnes-section-heading">
            <span>Sur le terrain</span>
            <h3>La marque telle qu'elle est rencontrée en rayon</h3>
            <p>Quatre vues prises en magasin, présentées sans décor ajouté ni simulation.</p>
          </div>
          <div class="bonnes-terrain-grid">
            <figure><img src="/assets/projects/bonnes-epices/terrain/rayon-coco-carre.webp" alt="Pots de coco râpée Les Bonnes Épices en rayon" loading="lazy" decoding="async"><figcaption>Repéré en rayon, Guadeloupe</figcaption></figure>
            <figure class="bonnes-terrain-grid__tall"><img src="/assets/projects/bonnes-epices/terrain/rayon-massale-bois-inde.webp" alt="Pots de massale et bois d'Inde Les Bonnes Épices en rayon" loading="lazy" decoding="async"><figcaption>Repéré en rayon, Guadeloupe</figcaption></figure>
            <figure><img src="/assets/projects/bonnes-epices/terrain/rayon-piments-poivre.webp" alt="Piment oiseaux et poivre vert Les Bonnes Épices en rayon" loading="lazy" decoding="async"><figcaption>Repéré en rayon, Guadeloupe</figcaption></figure>
            <figure><img src="/assets/projects/bonnes-epices/terrain/rayon-cannelle.webp" alt="Pots de cannelle entière Les Bonnes Épices en rayon" loading="lazy" decoding="async"><figcaption>Repéré en rayon, Guadeloupe</figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section bonnes-language-section">
          <div class="cist-section-heading bonnes-section-heading">
            <span>Système visuel</span>
            <h3>Un langage construit autour du produit</h3>
            <p>Les formats carrés et larges conservent la même hiérarchie, jusque dans la mise en récit d'une recette.</p>
          </div>
          <div class="bonnes-editorial-block">
            <div class="bonnes-editorial-label"><span>Information</span><strong>Axe 1</strong></div>
            <div class="bonnes-colombo-grid">
              <figure><img src="/assets/projects/bonnes-epices/editorial/colombo-square.webp" alt="Publication carrée consacrée au Colombo" loading="lazy" decoding="async"></figure>
              <figure><img src="/assets/projects/bonnes-epices/editorial/colombo-wide.webp" alt="Publication large consacrée au Colombo" loading="lazy" decoding="async"></figure>
            </div>
          </div>
          <div class="bonnes-editorial-block">
            <div class="bonnes-editorial-label"><span>Histoire</span><strong>Axe 2</strong></div>
            <div class="bonnes-history-grid">
              <figure><img src="/assets/projects/bonnes-epices/editorial/history-nutmeg.webp" alt="Publication sur l'histoire de la noix de muscade" loading="lazy" decoding="async"></figure>
              <figure><img src="/assets/projects/bonnes-epices/editorial/history-clove-drying.webp" alt="Publication sur la préparation des clous de girofle" loading="lazy" decoding="async"></figure>
              <figure><img src="/assets/projects/bonnes-epices/editorial/history-clove-closeup.webp" alt="Publication carrée sur les clous de girofle" loading="lazy" decoding="async"></figure>
              <figure><img src="/assets/projects/bonnes-epices/editorial/history-clove-wide.webp" alt="Publication large sur les clous de girofle" loading="lazy" decoding="async"></figure>
            </div>
          </div>
          <div class="bonnes-editorial-block">
            <div class="bonnes-editorial-label"><span>Recette</span><strong>Présentation 1</strong></div>
            <div class="bonnes-carousel-track" role="region" aria-label="Recette de soupe de crevettes en quatre visuels" tabindex="0">
              <figure><img src="/assets/projects/bonnes-epices/editorial/recipe-soup-cover.webp" alt="Soupe de crevettes, couverture de la recette" loading="lazy" decoding="async"></figure>
              <figure><img src="/assets/projects/bonnes-epices/editorial/recipe-soup-ingredients.webp" alt="Ingrédients de la soupe de crevettes" loading="lazy" decoding="async"></figure>
              <figure><img src="/assets/projects/bonnes-epices/editorial/recipe-soup-step-one.webp" alt="Première partie de la préparation de la soupe de crevettes" loading="lazy" decoding="async"></figure>
              <figure><img src="/assets/projects/bonnes-epices/editorial/recipe-soup-step-two.webp" alt="Fin de la préparation de la soupe de crevettes" loading="lazy" decoding="async"></figure>
            </div>
          </div>
        </section>

        <section class="cist-case-section bonnes-situation-section">
          <div class="cist-section-heading bonnes-section-heading">
            <span>Système de marque</span>
            <h3>En situation</h3>
            <p>Le même signe est décliné sur les supports physiques, les formats promotionnels et la page Facebook.</p>
          </div>
          <div class="bonnes-situation-grid">
            <figure class="bonnes-situation-grid__half"><figcaption>Tote bag</figcaption><img src="/assets/projects/bonnes-epices/applications/tote-bag-custom.webp" alt="Logo Les Bonnes Épices appliqué sur un tote bag" loading="lazy" decoding="async"></figure>
            <figure class="bonnes-situation-grid__half"><figcaption>T-shirt</figcaption><img src="/assets/projects/bonnes-epices/applications/t-shirt-custom.webp" alt="Logo Les Bonnes Épices appliqué sur un t-shirt" loading="lazy" decoding="async"></figure>
            <figure class="bonnes-situation-grid__large bonnes-situation-grid__facebook"><figcaption>Facebook</figcaption><img src="/assets/projects/bonnes-epices/applications/facebook.webp?v=2" alt="Identité Les Bonnes Épices déployée sur Facebook" loading="lazy" decoding="async"></figure>
            <figure class="bonnes-situation-grid__large"><figcaption>Carte de visite</figcaption><img src="/assets/projects/bonnes-epices/presentation/bonnes-epices-cartes-visite-mockup.webp" alt="Recto et verso de la carte de visite Les Bonnes Épices" loading="lazy" decoding="async"></figure>
          </div>
        </section>
      </div>
    </div>`;
  document.body.appendChild(modal);
  initModalFocusTrap(modal);

  const dialog = modal.querySelector('.bonnes-case-dialog');
  const closeButton = modal.querySelector('.cist-case-close');
  let lastFocus = null;
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setModalBackgroundInert(modal, false);
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  const open = () => {
    lastFocus = document.activeElement;
    dialog.scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setModalBackgroundInert(modal, true);
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };
  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('click', (event) => { event.preventDefault(); open(); });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
    });
  });
  modal.querySelectorAll('[data-bonnes-close]').forEach((element) => element.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* ── SMGEAG CASE STUDY ─────────────────────────────────────
   Proposal presented during the public communication tender. */
function initSmgeagProject() {
  const triggers = document.querySelectorAll('[data-smgeag-project]');
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'cist-case-modal smgeag-case-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="cist-case-backdrop smgeag-case-backdrop" data-smgeag-close></div>
    <div class="cist-case-dialog smgeag-case-dialog" role="dialog" aria-modal="true" aria-labelledby="smgeag-case-title">
      <button class="cist-case-close" type="button" data-smgeag-close aria-label="Fermer">&times;</button>
      <div class="cist-case-content">
        <header class="cist-case-hero smgeag-case-hero">
          <div>
            <span class="cist-case-badge smgeag-case-badge">Appel d'offre</span>
            <h2 id="smgeag-case-title">SMGEAG</h2>
            <p>La proposition de communication vise à renouer avec la confiance des usagers, retrouver un dialogue apaisé et rendre chaque intervention immédiatement identifiable. Une signature forte, moderne et engageante donne de la visibilité au syndicat et affirme son action sur tout le territoire.</p>
            <span class="cist-case-meta smgeag-case-meta">Stratégie · Symbole · Logo · Couleurs · Typographies · Déploiement</span>
          </div>
          <img class="cist-case-logo smgeag-case-logo" src="/assets/projects/smgeag/logo-baseline-transparent.webp" alt="Logo SMGEAG, Eaux de Guadeloupe" loading="eager">
        </header>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Stratégie</span>
            <h3>Deux réflexions, un seul objectif</h3>
            <p>La proposition s'appuie sur deux actions complémentaires : rassurer les usagers après des années de difficultés et différencier clairement la nouvelle structure de l'ancienne image de marque.</p>
          </div>
          <div class="smgeag-strategy-grid">
            <article><b>01</b><strong>Réassurer</strong><p>Le bleu évoque l'eau et l'expertise. Les capitales installent un sentiment de sérieux, de rigueur et de stabilité.</p></article>
            <article><b>02</b><strong>Se différencier</strong><p>Un langage contemporain permet de marquer une rupture, d'affirmer la présence du SMGEAG et de rendre ses prises de parole plus visibles.</p></article>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--tinted smgeag-case-section--tinted">
          <div class="smgeag-construction-heading">
            <div class="cist-section-heading">
              <span>Construction</span>
              <h3>Trouver l'essence sans perdre l'esthétique</h3>
              <p>L'icône réunit une goutte, symbole de l'eau, et la lettre « G » pour la Guadeloupe. Leur fusion fait apparaître un mouvement proche du yin et du yang, symbole d'équilibre. Le bleu central représente l'assainissement de l'eau par le SMGEAG.</p>
            </div>
            <div class="smgeag-construction-logo">
              <img src="/assets/projects/smgeag/scr-20260804-imjstra.png" alt="Logo SMGEAG sans fond" loading="lazy">
            </div>
          </div>
          <div class="smgeag-icon-grid">
            <figure><img src="/assets/projects/smgeag/icon-primary-trim.webp" alt="Icône principale du SMGEAG" loading="lazy"><figcaption>Bleu &amp; bleu ciel</figcaption></figure>
            <figure><img src="/assets/projects/smgeag/icon-hussard-trim.webp" alt="Variante bleu hussard de l'icône" loading="lazy"><figcaption>Bleu de hussard</figcaption></figure>
            <figure><img src="/assets/projects/smgeag/icon-silver-trim.webp" alt="Variante gris argent de l'icône" loading="lazy"><figcaption>Gris argent &amp; bleu ciel</figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Système de logo</span>
            <h3>Un logo qui recherche la pureté</h3>
            <p>L'acronyme rend le signe simple et immédiatement compréhensible. Les espacements généreux installent une sensation de liberté et de légèreté ; la goutte conserve une place centrale pour rappeler l'abondance et l'importance de l'eau en Guadeloupe.</p>
          </div>
          <div class="smgeag-logo-grid">
            <figure><img src="/assets/projects/smgeag/logo-horizontal-card.webp" alt="Version horizontale du logo SMGEAG" loading="lazy"><figcaption>Version horizontale</figcaption></figure>
            <figure><img src="/assets/projects/smgeag/logo-bicolor-light-card.webp" alt="Version bicolore sur fond clair" loading="lazy"><figcaption>Bicolore sur fond clair</figcaption></figure>
            <figure><img src="/assets/projects/smgeag/logo-bicolor-blue-card.webp" alt="Version bicolore sur fond bleu" loading="lazy"><figcaption>Bicolore sur fond bleu</figcaption></figure>
            <figure><img src="/assets/projects/smgeag/logo-mono-dark-card.webp" alt="Version monochrome sur fond sombre" loading="lazy"><figcaption>Monochrome</figcaption></figure>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--tinted smgeag-case-section--tinted">
          <div class="cist-section-heading">
            <span>Codes couleurs</span>
            <h3>Une famille de couleurs, une seule harmonie</h3>
            <p>La palette se tourne naturellement vers les nuances de bleu, accompagnées de deux gris riches qui jouent le rôle du noir et du blanc. Elle porte les valeurs de rigueur et d'expertise de la proposition.</p>
          </div>
          <div class="cist-palette cist-palette--primary smgeag-palette">
            <article style="--swatch:#171C26"><span class="cist-palette-main"></span><strong>Gris anthracite</strong><small>RGB 23 · 28 · 38<br>#171C26</small><div class="cist-tone-row"><i style="opacity:1"></i><i style="opacity:.8"></i><i style="opacity:.6"></i><i style="opacity:.4"></i><i style="opacity:.2"></i></div></article>
            <article style="--swatch:#BDBABF"><span class="cist-palette-main"></span><strong>Gris argent</strong><small>RGB 189 · 186 · 191<br>#BDBABF</small><div class="cist-tone-row"><i style="opacity:1"></i><i style="opacity:.8"></i><i style="opacity:.6"></i><i style="opacity:.4"></i><i style="opacity:.2"></i></div></article>
            <article style="--swatch:#173B59"><span class="cist-palette-main"></span><strong>Bleu de hussard</strong><small>RGB 23 · 59 · 89<br>#173B59</small><div class="cist-tone-row"><i style="opacity:1"></i><i style="opacity:.8"></i><i style="opacity:.6"></i><i style="opacity:.4"></i><i style="opacity:.2"></i></div></article>
            <article style="--swatch:#68A7DD"><span class="cist-palette-main"></span><strong>Bleu marine</strong><small>RGB 104 · 167 · 221<br>#68A7DD</small><div class="cist-tone-row"><i style="opacity:1"></i><i style="opacity:.8"></i><i style="opacity:.6"></i><i style="opacity:.4"></i><i style="opacity:.2"></i></div></article>
          </div>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading">
            <span>Univers typographique</span>
            <h3>Modernité et sobriété</h3>
          </div>
          <div class="cist-type-grid smgeag-type-grid">
            <article><span>Titre</span><strong>Nexa Bold</strong><p>Une sans serif moderne qui exprime le sérieux et donne aux messages une présence nette.</p></article>
            <article><span>Signature</span><strong class="smgeag-type-light">Nexa Light</strong><p>Une graisse plus légère pour la baseline « Eaux de Guadeloupe », lisible et équilibrée.</p></article>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--applications">
          <div class="cist-section-heading">
            <span>Mises en situation</span>
            <h3>Une présence visible et engageante</h3>
            <p>Le système place l'eau, la proximité et la confiance au premier plan. Il s'applique ici à des outils réellement utilisés sur le terrain : véhicule d'intervention, équipement technique, contrôle en laboratoire et inspection du réseau.</p>
          </div>
          <div class="smgeag-showcase-grid">
            <figure><img src="/assets/projects/smgeag/mockups/smgeag-vehicule-intervention.webp" alt="Mockup d'un véhicule d'intervention SMGEAG" loading="lazy"><figcaption>Véhicule d'intervention</figcaption></figure>
            <figure><img src="/assets/projects/smgeag/mockups/smgeag-equipement-terrain.webp" alt="Mockup des équipements terrain du SMGEAG" loading="lazy"><figcaption>Équipement terrain</figcaption></figure>
            <figure><img src="/assets/projects/smgeag/mockups/smgeag-controle-laboratoire.webp" alt="Mockup d'un contrôle de la qualité de l'eau en laboratoire SMGEAG" loading="lazy"><figcaption>Contrôle en laboratoire</figcaption></figure>
            <figure><img src="/assets/projects/smgeag/mockups/smgeag-controle-reseau.webp" alt="Mockup d'une inspection du réseau d'eau SMGEAG" loading="lazy"><figcaption>Inspection du réseau</figcaption></figure>
          </div>
        </section>
      </div>
    </div>`;
  document.body.appendChild(modal);
  initModalFocusTrap(modal);

  const dialog = modal.querySelector('.smgeag-case-dialog');
  const closeButton = modal.querySelector('.cist-case-close');
  let lastFocus = null;
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setModalBackgroundInert(modal, false);
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  const open = () => {
    lastFocus = document.activeElement;
    dialog.scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setModalBackgroundInert(modal, true);
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('click', (event) => { event.preventDefault(); open(); });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
  modal.querySelectorAll('[data-smgeag-close]').forEach((element) => element.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* ── LE PRESSING CASE STUDY ───────────────────────────────────
   SA Pressing devient Le Pressing — refonte identitaire 2022.
   ───────────────────────────────────────────────────────────── */
function initPressingProject() {
  const triggers = document.querySelectorAll('[data-pressing-project]');
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'cist-case-modal pressing-case-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="cist-case-backdrop pressing-case-backdrop" data-pressing-close></div>
    <div class="cist-case-dialog pressing-case-dialog" role="dialog" aria-modal="true" aria-labelledby="pressing-case-title">
      <button class="cist-case-close pressing-case-close" type="button" data-pressing-close aria-label="Fermer">&times;</button>
      <div class="cist-case-content">

        <header class="cist-case-hero pressing-case-hero">
          <div>
            <span class="cist-case-badge pressing-case-badge">Rebranding</span>
            <h2 id="pressing-case-title">Le Pressing</h2>
            <p>SA Pressing devient Le Pressing — une refonte complète qui installe cette enseigne guadeloupéenne comme la référence du pressing sur le territoire.</p>
            <span class="cist-case-meta pressing-case-meta">Logo · Système de marque · Couleurs · Typographie · Motifs · Applications</span>
          </div>
          <figure class="pressing-hero-logo pressing-hero-logo--svg">
            <img src="/assets/projects/le-pressing/identity/logo-white.svg" alt="Logo Le Pressing — identité graphique" loading="eager" decoding="async">
          </figure>
        </header>

        <section class="cist-case-section">
          <div class="cist-section-heading pressing-section-heading">
            <span>Dans les coulisses</span>
            <h3>De l'enseigne brute à la marque premium</h3>
            <p>SA Pressing, pressing guadeloupéen historique avec deux adresses — Jarry et Gosier — cherchait à s'imposer comme la référence de son secteur. Face à une concurrence sans identité forte, l'opportunité était là : créer une marque digne de son ambition.</p>
          </div>
          <div class="pressing-brief-grid">
            <article class="pressing-brief-card">
              <h4>Philosophie</h4>
              <ul><li>Premium</li><li>Professionnel</li><li>Efficacité</li><li>Convivialité</li></ul>
            </article>
            <article class="pressing-brief-card pressing-brief-card--accent">
              <h4>Orientation</h4>
              <ul><li>Adaptatif</li><li>Typographique</li><li>Sobre</li></ul>
            </article>
            <article class="pressing-brief-card pressing-brief-card--wide">
              <h4>Objectif</h4>
              <p>Créer une identité forte, premium et cohérente, revendiquant la référence du pressing sur le territoire guadeloupéen.</p>
            </article>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--tinted pressing-case-section--tinted">
          <div class="cist-section-heading pressing-section-heading">
            <span>Notre solution</span>
            <h3>Un signe typographique, une promesse cachée</h3>
            <p>Nous avons opté pour un logo typographique assurant une facilité de lecture et d'utilisation. Le point du «&nbsp;i&nbsp;» de «&nbsp;pressing&nbsp;» est remplacé par une étoile — un symbole discret qui affirme la position de l'enseigne&nbsp;: le numéro&nbsp;1 du pressing en Guadeloupe.</p>
          </div>
          <figure class="pressing-logo-feature">
            <img src="/assets/projects/le-pressing/charte/page-05.webp" alt="Logo Le pressing — Notre solution" loading="lazy" decoding="async">
          </figure>
          <figure class="pressing-concept-feature">
            <img src="/assets/projects/le-pressing/charte/page-06.webp" alt="Symbole caché : le i devient 1, numéro 1 du pressing en Guadeloupe" loading="lazy" decoding="async">
          </figure>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading pressing-section-heading">
            <span>Système de marque</span>
            <h3>Une identité pensée pour tous les supports</h3>
            <p>Le logo se décline en version mono sur fond sombre ou clair, et en quatre combinaisons couleur — chaque variante conserve la même rigueur typographique et le même impact visuel.</p>
          </div>
          <div class="pressing-systeme-grid">
            <figure><img src="/assets/projects/le-pressing/charte/page-08.webp" alt="Adaptabilité mono : Le pressing sur fond sombre et fond clair" loading="lazy" decoding="async"></figure>
            <figure><img src="/assets/projects/le-pressing/charte/page-09.webp" alt="Adaptabilité couleur : 4 combinaisons navy et or" loading="lazy" decoding="async"></figure>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--tinted pressing-case-section--tinted">
          <div class="cist-section-heading pressing-section-heading">
            <span>Couleurs &amp; Typographie</span>
            <h3>Deux couleurs, une seule police</h3>
            <p>Le bleu marine #133246 ancre la marque dans la sobriété et le professionnalisme. L'or #F5C832 apporte chaleur et prestige. Poppins regular et bold assurent une lisibilité parfaite sur tous les formats, du numérique à l'enseigne.</p>
          </div>
          <figure class="pressing-full-img">
            <img src="/assets/projects/le-pressing/charte/page-10.webp" alt="Couleurs et typographie Le Pressing : navy, or, Poppins" loading="lazy" decoding="async">
          </figure>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading pressing-section-heading">
            <span>Motifs</span>
            <h3>Un univers visuel qui se déploie</h3>
            <p>Un motif géométrique répétitif vient texturer l'espace de marque — déclinable sur fond blanc, navy ou or, il enrichit chaque support sans jamais concurrencer le logo.</p>
          </div>
          <figure class="pressing-full-img">
            <img src="/assets/projects/le-pressing/charte/page-11.webp" alt="Motifs Le Pressing : géométrique répétitif sur trois fonds" loading="lazy" decoding="async">
          </figure>
        </section>

        <section class="cist-case-section cist-case-section--tinted pressing-case-section--tinted">
          <div class="cist-section-heading pressing-section-heading">
            <span>Avant / Après</span>
            <h3>Les deux vitrines repensées</h3>
            <p>À Jarry comme au Gosier, l'enseigne brute cède la place à une façade habillée, structurée et reconnaissable.</p>
          </div>
          <p class="pressing-store-label">Jarry</p>
          <div class="pressing-avant-apres-grid">
            <figure class="pressing-aa-item">
              <img src="/assets/projects/le-pressing/avant-apres/avant-agnes.webp" alt="Avant — Façade SA Pressing Jarry" loading="lazy" decoding="async">
              <figcaption><span class="pressing-label pressing-label--avant">Avant</span>SA Pressing — Jarry</figcaption>
            </figure>
            <figure class="pressing-aa-item">
              <img src="/assets/projects/le-pressing/avant-apres/apres-jarry.webp" alt="Après — Façade Le Pressing Jarry" loading="lazy" decoding="async">
              <figcaption><span class="pressing-label pressing-label--apres">Après</span>Le Pressing — Jarry</figcaption>
            </figure>
          </div>
          <p class="pressing-store-label">Gosier</p>
          <div class="pressing-avant-apres-grid">
            <figure class="pressing-aa-item">
              <img src="/assets/projects/le-pressing/avant-apres/avant-gosier.webp" alt="Avant — Façade SA Pressing Gosier" loading="lazy" decoding="async">
              <figcaption><span class="pressing-label pressing-label--avant">Avant</span>SA Pressing — Gosier</figcaption>
            </figure>
            <figure class="pressing-aa-item">
              <img src="/assets/projects/le-pressing/avant-apres/apres-gosier.webp" alt="Après — Façade Le Pressing Gosier" loading="lazy" decoding="async">
              <figcaption><span class="pressing-label pressing-label--apres">Après</span>Le Pressing — Gosier</figcaption>
            </figure>
          </div>
        </section>

        <section class="cist-case-section">
          <div class="cist-section-heading pressing-section-heading">
            <span>Sur le terrain</span>
            <h3>L'identité en circulation</h3>
            <p>La nouvelle marque s'affiche sur les véhicules utilitaires — une présence mobile et reconnaissable sur tout le territoire guadeloupéen.</p>
          </div>
          <div class="pressing-avant-apres-grid">
            <figure class="pressing-aa-item pressing-aa-item--portrait">
              <img src="/assets/projects/le-pressing/terrain/van-face.webp" alt="Van Le Pressing — face avant avec la nouvelle identité graphique" loading="lazy" decoding="async">
            </figure>
            <figure class="pressing-aa-item">
              <img src="/assets/projects/le-pressing/terrain/van-lateral.webp" alt="Van Le Pressing — vue latérale en circulation" loading="lazy" decoding="async">
            </figure>
          </div>
        </section>

        <section class="cist-case-section cist-case-section--tinted pressing-case-section--tinted">
          <div class="cist-section-heading pressing-section-heading">
            <span>Applications</span>
            <h3>Le pressing en situation</h3>
            <p>La marque prend vie sur les supports du quotidien — tenue, papeterie, façade — avec une même rigueur graphique.</p>
          </div>
          <figure class="pressing-fullbleed pressing-fullbleed--contain">
            <img src="/assets/projects/le-pressing/mockups/second-store.webp" alt="Façade Le Pressing avec la nouvelle identité graphique" loading="lazy" decoding="async">
          </figure>
          <div class="pressing-apps-grid pressing-apps-grid--mockups">
            <figure><img src="/assets/projects/le-pressing/mockups/apron.webp" alt="Tablier Le Pressing — mockup textile" loading="lazy" decoding="async"></figure>
            <figure><img src="/assets/projects/le-pressing/mockups/business-card.webp" alt="Cartes de visite Le Pressing" loading="lazy" decoding="async"></figure>
            <figure><img src="/assets/projects/le-pressing/mockups/garment-cover.webp" alt="Housse à vêtements Le Pressing" loading="lazy" decoding="async"></figure>
            <figure><img src="/assets/projects/le-pressing/mockups/garment-tag.webp" alt="Étiquette Le Pressing" loading="lazy" decoding="async"></figure>
            <figure><img src="/assets/projects/le-pressing/mockups/letterhead.webp" alt="Papeterie Le Pressing — lettre à en-tête et carte de visite" loading="lazy" decoding="async"></figure>
            <figure><img src="/assets/projects/le-pressing/mockups/brand-card-front.webp" alt="Carte de marque Le Pressing sur fond navy" loading="lazy" decoding="async"></figure>
          </div>
        </section>

      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const open = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.pressing-case-close').focus();
  };
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('click', (event) => { event.preventDefault(); open(); });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
    });
  });
  modal.querySelectorAll('[data-pressing-close]').forEach((element) => element.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* ── BEFORE / AFTER MODAL ─────────────────────────────────────
   Used by project cards that provide data-before and data-after.
   The same component also supports multiple pairs separated by ||.
   ───────────────────────────────────────────────────────────── */
function initBeforeAfterModal() {
  const triggers = document.querySelectorAll('[data-before-after]');
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'ls-before-after-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="ls-before-after-backdrop" data-ba-close></div>
    <div class="ls-before-after-dialog" role="dialog" aria-modal="true" aria-label="Avant et après">
      <button class="ls-modal-close" data-ba-close aria-label="Fermer">&times;</button>
      <p class="ls-before-after-kicker">Notre savoir-faire</p>
      <h2 class="ls-before-after-title"></h2>
      <p class="ls-before-after-copy">Une même intention, deux étapes : nous révélons le potentiel d'une image et construisons une direction visuelle plus forte.</p>
      <div class="ls-before-after-grid">
        <figure><figcaption><span></span>Avant</figcaption><img class="ls-ba-before" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="Avant"></figure>
        <span class="ls-before-after-arrow" aria-hidden="true">&rarr;</span>
        <figure><figcaption><span></span>Après</figcaption><img class="ls-ba-after" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="Après"></figure>
      </div>
      <div class="ls-before-after-dots" aria-label="Choisir une comparaison"></div>
      <section class="ls-before-after-details">
        <h3 class="ls-before-after-details-title"></h3>
        <div class="ls-before-after-details-grid"></div>
      </section>
    </div>`;
  document.body.appendChild(modal);
  initModalFocusTrap(modal);

  const before = modal.querySelector('.ls-ba-before');
  const after = modal.querySelector('.ls-ba-after');
  const title = modal.querySelector('.ls-before-after-title');
  const kicker = modal.querySelector('.ls-before-after-kicker');
  const copy = modal.querySelector('.ls-before-after-copy');
  const dots = modal.querySelector('.ls-before-after-dots');
  const details = modal.querySelector('.ls-before-after-details');
  const detailsTitle = modal.querySelector('.ls-before-after-details-title');
  const detailsGrid = modal.querySelector('.ls-before-after-details-grid');
  let lastFocus = null;
  let pairs = [];
  let index = 0;

  const render = () => {
    const pair = pairs[index] || {};
    before.src = pair.before || '';
    after.src = pair.after || '';
    dots.innerHTML = pairs.map((_, i) => `<button type="button" class="${i === index ? 'active' : ''}" aria-label="Comparaison ${i + 1}" aria-current="${i === index ? 'true' : 'false'}"></button>`).join('');
  };
  const close = () => {
    modal.classList.remove('open');
    modal.classList.remove('contain-mode', 'has-details');
    modal.setAttribute('aria-hidden', 'true');
    setModalBackgroundInert(modal, false);
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  const open = (trigger) => {
    const beforeImages = (trigger.dataset.before || '').split(/\|\|?/).map(s => s.trim()).filter(Boolean);
    const afterImages = (trigger.dataset.after || '').split(/\|\|?/).map(s => s.trim()).filter(Boolean);
    pairs = beforeImages.map((src, i) => ({ before: src, after: afterImages[i] || afterImages[0] })).filter(p => p.after);
    if (!pairs.length) return;
    index = 0;
    title.textContent = trigger.dataset.projectTitle || 'Avant & Après';
    kicker.textContent = trigger.dataset.projectKicker || 'Notre savoir-faire';
    copy.textContent = trigger.dataset.projectCopy || "Une même intention, deux étapes : nous révélons le potentiel d'une image et construisons une direction visuelle plus forte.";
    modal.classList.toggle('contain-mode', trigger.dataset.beforeAfterFit === 'contain');

    const detailImages = (trigger.dataset.projectDetails || '').split('|').map(s => s.trim()).filter(Boolean);
    const detailLabels = (trigger.dataset.projectDetailsLabels || '').split('|').map(s => s.trim());
    const detailLayout = trigger.dataset.projectDetailsLayout || '';
    detailsTitle.textContent = trigger.dataset.projectDetailsTitle || 'Identité et déploiement';
    detailsGrid.replaceChildren();
    detailsGrid.className = 'ls-before-after-details-grid';
    if (detailLayout === 'pressing-showcase') detailsGrid.classList.add('is-pressing-showcase');
    detailImages.forEach((src, imageIndex) => {
      try {
        const url = new URL(src, window.location.href);
        if (url.origin !== window.location.origin) return;
        const image = document.createElement('img');
        image.src = url.href;
        image.alt = detailLabels[imageIndex] || `${detailsTitle.textContent} — visuel ${imageIndex + 1}`;
        image.loading = imageIndex === 0 ? 'eager' : 'lazy';
        if (detailLayout === 'pressing-showcase') {
          const figure = document.createElement('figure');
          const caption = document.createElement('figcaption');
          const marker = document.createElement('span');
          marker.setAttribute('aria-hidden', 'true');
          marker.textContent = '✦';
          caption.append(marker, document.createTextNode(detailLabels[imageIndex] || `Visuel ${imageIndex + 1}`));
          figure.append(image, caption);
          detailsGrid.appendChild(figure);
        } else {
          detailsGrid.appendChild(image);
        }
      } catch (_) {
        // Ignore malformed asset paths.
      }
    });
    const hasDetails = detailsGrid.children.length > 0;
    details.classList.toggle('visible', hasDetails);
    modal.classList.toggle('has-details', hasDetails);
    render();
    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setModalBackgroundInert(modal, true);
    document.body.style.overflow = 'hidden';
    modal.querySelector('.ls-modal-close').focus();
  };

  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('click', (event) => { event.preventDefault(); open(trigger); });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(trigger); }
    });
  });
  modal.querySelectorAll('[data-ba-close]').forEach((element) => element.addEventListener('click', close));
  modal.addEventListener('click', (event) => {
    if (event.target.closest('.ls-before-after-dots button')) {
      index = [...dots.children].indexOf(event.target);
      render();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight' && pairs.length > 1) { index = (index + 1) % pairs.length; render(); }
    if (event.key === 'ArrowLeft' && pairs.length > 1) { index = (index + pairs.length - 1) % pairs.length; render(); }
  });
}

/* ── CASE-STUDY CONTACT CTA ───────────────────────────────────
   The CTA is attached to the project trigger rather than the page:
   two projects on the same page therefore keep their own client name.
   Existing template footers are reused so a modal never gets a
   duplicated contact block. ─────────────────────────────────── */
function getPageCaseStudyContactMessage() {
  const page = window.location.pathname.split('/').pop() || '';
  const messages = {
    'photos.html': {
      title: client => `Un projet photo comme ${client} ?`,
      copy: 'Parlons de votre univers et imaginons ensemble les images qui le mettront en valeur.'
    },
    'charte-graphique.html': {
      title: client => `Une identité comme ${client} ?`,
      copy: 'Construisons une identité claire, singulière et prête à vivre sur tous vos supports.'
    },
    'catalogue.html': {
      title: client => `Un catalogue comme ${client} ?`,
      copy: 'Donnons à vos offres une composition lisible, attractive et cohérente avec votre marque.'
    },
    'social.html': {
      title: client => `Un projet social media comme ${client} ?`,
      copy: 'Imaginons une ligne éditoriale et des contenus qui font vivre votre marque au quotidien.'
    }
  };
  return messages[page] || {
    title: client => `Un projet comme ${client} ?`,
    copy: 'Parlons de vos objectifs et imaginons ensemble la réponse la plus juste.'
  };
}

function getCaseStudyContactMessage(trigger) {
  const fallback = getPageCaseStudyContactMessage();
  const cardTitle = trigger?.querySelector('h3')?.textContent?.trim();
  const client = trigger?.dataset.projectCtaClient
    || trigger?.dataset.projectTitle
    || cardTitle
    || 'votre marque';
  return {
    title: trigger?.dataset.projectCtaTitle || fallback.title(client),
    copy: trigger?.dataset.projectCtaCopy || fallback.copy
  };
}

function updateCaseStudyContactFooter(footer, message) {
  const title = footer.querySelector('strong');
  const copy = footer.querySelector('p');
  if (title) title.textContent = message.title;
  if (copy) copy.textContent = message.copy;
}

function applyCaseStudyContactCta(dialog, trigger) {
  if (!dialog || !trigger) return;
  const message = getCaseStudyContactMessage(trigger);
  const embeddedFooter = dialog.querySelector('.ls-modal-track .ls-case-contact-footer')
    || dialog.querySelector('.ls-case-contact-footer:not([data-case-contact-generated])');
  const generatedFooter = dialog.querySelector(':scope > .ls-case-contact-footer[data-case-contact-generated]');

  if (embeddedFooter) {
    if (generatedFooter) generatedFooter.remove();
    updateCaseStudyContactFooter(embeddedFooter, message);
    return;
  }

  const footer = generatedFooter || document.createElement('footer');
  if (!generatedFooter) {
    footer.className = 'ls-case-contact-footer';
    footer.dataset.caseContactGenerated = 'true';
    footer.innerHTML = `
      <span class="ls-case-contact-icon" aria-hidden="true">◎</span>
      <div><strong></strong><p></p></div>
      <a href="/pages/contact.html">Nous contacter <span aria-hidden="true">→</span></a>`;
    dialog.appendChild(footer);
  }
  updateCaseStudyContactFooter(footer, message);
}

function initCaseStudyContactCtas() {
  const assignments = [
    ['[data-marina-project]', '.marina-case-dialog'],
    ['[data-cist-project]', '.cist-case-dialog:not(.bonnes-case-dialog):not(.smgeag-case-dialog)'],
    ['[data-bonnes-epices-project]', '.bonnes-case-dialog'],
    ['[data-smgeag-project]', '.smgeag-case-dialog'],
    ['[data-so-class-project]', '.so-class-dialog'],
    ['[data-before-after]', '.ls-before-after-dialog'],
    ['[data-product-gallery]', '.product-gallery-dialog']
  ];

  assignments.forEach(([triggerSelector, dialogSelector]) => {
    const trigger = document.querySelector(triggerSelector);
    const dialog = document.querySelector(dialogSelector);
    applyCaseStudyContactCta(dialog, trigger);
  });
}

/* ── CASE-STUDY SCROLL-TO-TOP ─────────────────────────────────
   Long case-study dialogs (CIST, Bonnes Épices, SMGEAG, Marina,
   So Class) get their own in-panel back-to-top button, mirroring
   the page-level #scroll-top-btn but scoped to the dialog's own
   internal scroll container. ─────────────────────────────────── */
function initCaseScrollTopButtons() {
  const dialogs = document.querySelectorAll('.marina-case-dialog, .so-class-dialog, .cist-case-dialog');
  dialogs.forEach((dialog) => {
    const wrap = document.createElement('div');
    wrap.className = 'ls-case-scrolltop-wrap';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ls-case-scrolltop';
    btn.setAttribute('aria-label', 'Retour en haut de la fiche');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>';
    btn.addEventListener('click', () => dialog.scrollTo({ top: 0, behavior: 'smooth' }));
    wrap.appendChild(btn);
    dialog.appendChild(wrap);
    dialog.addEventListener('scroll', () => {
      btn.classList.toggle('visible', dialog.scrollTop > 400);
    }, { passive: true });
  });
}

/* ── PRODUCT GALLERY PICKER ──────────────────────────────────
   Opens a product selection first, then the shared image gallery
   handles the individual product photos.
   ───────────────────────────────────────────────────────────── */
function initProductGallery() {
  const triggers = document.querySelectorAll('[data-product-gallery]');
  const modal = document.querySelector('[data-product-gallery-modal]');
  if (!triggers.length || !modal) return;
  document.body.appendChild(modal);
  initModalFocusTrap(modal);

  const dialog = modal.querySelector('.product-gallery-dialog');
  const nav = modal.querySelector('.product-gallery-nav');
  let lastFocus = null;

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setModalBackgroundInert(modal, false);
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      lastFocus = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      setModalBackgroundInert(modal, true);
      document.body.style.overflow = 'hidden';
      modal.querySelector('.ls-modal-close').focus();
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger.click();
      }
    });
  });
  modal.querySelectorAll('.product-gallery-nav a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = modal.querySelector(link.getAttribute('href'));
      if (!target || !dialog) return;
      const offset = (nav?.offsetHeight || 0) + 18;
      dialog.scrollTo({ top: Math.max(0, target.offsetTop - offset), behavior: 'smooth' });
    });
  });
  modal.querySelectorAll('[data-product-gallery-close]').forEach((element) => element.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (link.closest('[data-product-gallery-modal]')) return;
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('ls-header')?.offsetHeight || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH - 16, behavior: 'smooth' });
    });
  });
}

/* ── LAZY IMAGES ── */
function initLazyImages() {
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
    const isCritical = Boolean(img.closest('.ls-header, .hero, .portfolio-hero, .ls-hero'));
    if (!isCritical && !img.hasAttribute('loading')) img.loading = 'lazy';
  });
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
        img.classList.add('loaded'); observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

/* ── PAGE TRANSITION ── light cream curtain on leave + soft fade-up on enter ── */
function initPageTransition() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Entrance: fade the main content up
  document.documentElement.classList.add('ls-page-anim');

  // Cream curtain with the cocotier
  const curtain = document.createElement('div');
  curtain.id = 'ls-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<img src="/assets/icons/ui/icon-ui-cocotier.svg" alt="" width="56" height="56">';
  document.body.appendChild(curtain);

  const isInternal = (a) => {
    const href = a.getAttribute('href');
    if (!href) return false;
    if (a.target === '_blank' || a.hasAttribute('download')) return false;
    if (/^(https?:)?\/\//i.test(href)) return false;        // external
    if (/^(mailto:|tel:|#)/i.test(href)) return false;       // protocols / anchors
    return /\.html(\?|#|$)/i.test(href);                      // internal .html page
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a');
    if (!a || !isInternal(a)) return;
    // ignore links to the current page
    if (a.href === window.location.href) return;
    e.preventDefault();
    const dest = a.href;
    curtain.classList.add('show');
    setTimeout(() => { window.location.href = dest; }, 430);
  });

  // Reset the curtain if the page is restored from the bfcache
  window.addEventListener('pageshow', (e) => { if (e.persisted) curtain.classList.remove('show'); });
}

/* ── SCROLL-TO-TOP ── */
function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;
  const footer = document.querySelector('.ls-footer');
  let footerVisible = false;
  const update = () => btn.classList.toggle('visible', window.scrollY > 400 && !footerVisible);
  window.addEventListener('scroll', update, { passive: true });
  if (footer && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      footerVisible = entries[0].isIntersecting;
      update();
    }, { threshold: 0.02 });
    observer.observe(footer);
  }
  update();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── STICKY BOTTOM BAR ── */
function renderStickyBar() {
  const html = `
<div class="ls-sticky-bar" id="ls-sticky-bar" aria-hidden="true">
  <div class="ls-sticky-bar-inner">
    <div class="ls-sticky-bar-info">
      <span class="ls-sticky-addr">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Baie-Mahault, Guadeloupe
      </span>
      <a href="mailto:regis.malotaux@latitudesud.gp">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
        regis.malotaux@latitudesud.gp
      </a>
      <a href="tel:+590590922948">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        +590 590 92 29 48
      </a>
    </div>
    <div class="ls-sticky-socials">
      <a href="https://www.instagram.com/latitudesud/" target="_blank" rel="noopener noreferrer" class="ls-sticky-social" aria-label="Instagram">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.4"/>
          <rect x="8.5" y="8.5" width="11" height="11" rx="3" stroke="currentColor" stroke-width="1.3" fill="none"/>
          <circle cx="14" cy="14" r="3" stroke="currentColor" stroke-width="1.3" fill="none"/>
          <circle cx="18" cy="10" r="0.9" fill="currentColor"/>
        </svg>
      </a>
      <a href="https://www.linkedin.com/company/latitudesud/" target="_blank" rel="noopener noreferrer" class="ls-sticky-social" aria-label="LinkedIn">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10 13v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="10" cy="10.5" r="1" fill="currentColor"/>
          <path d="M14 18v-3a2 2 0 0 1 4 0v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 13v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </a>
    </div>
  </div>
</div>
  `.trim();
  document.body.insertAdjacentHTML('beforeend', html);
}

function initStickyBar() {
  const bar    = document.getElementById('ls-sticky-bar');
  const btn    = document.getElementById('scroll-top-btn');
  const footer = document.querySelector('.ls-footer');
  if (!bar) return;

  let footerInView = false;
  const onScroll = () => {
    const show = window.scrollY > 350 && !footerInView;
    bar.classList.toggle('visible', show);
    bar.setAttribute('aria-hidden', String(!show));
    if (btn) btn.classList.toggle('ls-raised', show);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  if (footer && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver((entries) => {
      footerInView = entries[0].isIntersecting;
      onScroll();
    }, { rootMargin: '0px 0px -10% 0px' });
    footerObserver.observe(footer);
  }

  onScroll();
}

/* ── INIT ALL ──
   Header/footer are inserted synchronously above, so every target element
   already exists. We call the feature inits directly (NOT via
   requestAnimationFrame, which is throttled in background tabs and would
   otherwise delay reveals / filters / the modal until the tab is focused). */
function initComponents(activePage, opts) {
  opts = opts || {};
  /* Sticky bar is disabled by default for now. Set stickyBar: true to re-enable it. */
  const withStickyBar = opts.stickyBar === true;

  initHeroWaves(activePage);
  renderHeader(activePage);
  renderFooter();
  if (withStickyBar) renderStickyBar();
  initScrollReveal();
  initLogoStagger();
  initSmoothScroll();
  initLazyImages();
  initFilterTabs();
  initProjectModal();
  initSoClassProject();
  initMarinaProject();
  initCistProject();
  initBonnesEpicesProject();
  initSmgeagProject();
  initPressingProject();
  initBeforeAfterModal();
  initCaseStudyContactCtas();
  initCaseScrollTopButtons();
  initProductGallery();
  initScrollToTop();
  if (withStickyBar) initStickyBar();
  initPageTransition();
}
