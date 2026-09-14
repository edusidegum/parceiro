/* ═════════════════════════════════════════════════════════
   bloco-incluir.js — Ecossistema Parceiro
   Funções: consentimento LGPD (explícito) → GA4 + GTM,
   proteção anti-cópia condicional. Footer é ESTÁTICO no HTML
   (crawler/GEO enxergam — Vs5.3). Zero JS síncrono no LCP.
   ═════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Constantes centrais (alterar oportunamente) ── */
  var GTM_ID = 'SEU_GTM_ID';          // substituir pelo Container ID real
  var GA4_ID = 'SEU_GA4_ID';          // substituir pelo Measurement ID real
  var POLITICA_URL = 'https://edusidegum.github.io/parceiro/politica.html';
  var STORAGE_KEY = 'parceiro_lgpd_consent';

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  function loadTracking() {
    if (document.getElementById('gtm-script')) return;
    /* GTM */
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
      j.id = 'gtm-script'; j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', GTM_ID);
    /* GA4 */
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_ID, { anonymize_ip: true });
  }

  function removeBanner() {
    var b = document.getElementById('lgpd-banner');
    if (b) b.remove();
  }

  function showBanner() {
    var b = document.createElement('div');
    b.id = 'lgpd-banner';
    b.className = 'lgpd-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Consentimento de cookies');
    b.innerHTML =
      '<span>Este site utiliza cookies para melhorar sua experiência e analisar fontes de acesso, conforme nossa ' +
      '<a href="' + POLITICA_URL + '" target="_blank" rel="noopener">Política de Privacidade (LGPD)</a>. ' +
      'Ao aceitar, você consente com o uso de cookies de análise (GA4/GTM).</span>' +
      '<span style="display:flex;gap:.6rem">' +
      '<button class="btn-aceitar" type="button" data-acao="aceitar">Aceitar</button>' +
      '<button class="btn-recusar" type="button" data-acao="recusar">Rejeitar</button>' +
      '</span>';
    document.body.appendChild(b);

    b.querySelector('[data-acao="aceitar"]').addEventListener('click', function () {
      setConsent('aceito'); removeBanner(); loadTracking();
    });
    b.querySelector('[data-acao="recusar"]').addEventListener('click', function () {
      setConsent('rejeitado'); removeBanner();
    });
  }

  /* ── Inicialização: só rastreia após consentimento explícito ── */
  var consent = getConsent();
  if (consent === 'aceito') { loadTracking(); }
  else if (consent === 'rejeitado') { /* sem tracking */ }
  else { showBanner(); }

  /* ── Proteção anti-cópia (condicional, via meta) ── */
  if (document.querySelector('meta[name="protecao-copia"]')) {
    var p = document.createElement('script');
    p.src = 'assets/js/bloco-protecao.js';
    p.defer = true;
    document.body.appendChild(p);
  }

  /* ── Profundidade de rolagem: fosco → piano ── */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      document.body.classList.toggle('is-deep', h > 0 && y / h > 0.35);
      /* Parallax por box */
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var boxes = document.querySelectorAll('[data-parallax]');
        for (var i = 0; i < boxes.length; i++) {
          var el = boxes[i];
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.08;
          var r = el.getBoundingClientRect();
          var off = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
          el.style.transform = 'translateY(' + off.toFixed(1) + 'px)';
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Dark background transitions on load */
  document.documentElement.style.background = getComputedStyle(document.body).backgroundColor;
})();