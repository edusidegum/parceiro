/* ═══════════════════════════════════════════════════════════
   bloco-incluir.js — Ecossistema Parceiro
   1) LGPD: só liga GA4/GTM após aceitar
   2) Reveal por dobra (fallback p/ Safari/Firefox)
   3) Proteção anti-cópia (condicional)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GTM_ID   = 'SEU_GTM_ID';
  var GA4_ID   = 'SEU_GA4_ID';
  var POLITICA = '/parceiro/politica.html';
  var CHAVE    = 'parceiro_lgpd';
  var hasJs = false;

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
  hasJs = true;

  function ler() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravar(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  function ligarRastreio() {
    if (document.getElementById('gtm-script')) return;
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
      j.id = 'gtm-script'; j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', GTM_ID);

    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(g);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_ID, { anonymize_ip: true });
  }

  /* ── Reveal por dobra: só roda em navegadores sem scroll-driven ── */
  window.requestAnimationFrame(function () {
    var suporta = window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()');
    if (suporta || !document.querySelector('.box')) return;

    var alvos = document.querySelectorAll('.box');
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    alvos.forEach(function (el) { obs.observe(el); });
  });

  function banner() {
    var b = document.createElement('div');
    b.id = 'lgpd-banner';
    b.className = 'lgpd-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Consentimento de cookies');
    b.innerHTML =
      '<span>Uso cookies pra entender de onde vem o acesso e melhorar a página. ' +
      'Os detalhes estão na <a href="' + POLITICA + '">Política de Privacidade</a>. ' +
      'Se preferir, pode recusar sem problema.</span>' +
      '<span style="display:flex;gap:.6rem;flex-wrap:wrap">' +
      '<button class="btn-aceitar" type="button" data-acao="aceitar">Aceitar</button>' +
      '<button class="btn-recusar" type="button" data-acao="recusar">Recusar</button>' +
      '</span>';
    document.body.appendChild(b);

    b.querySelector('[data-acao="aceitar"]').addEventListener('click', function () {
      gravar('aceito'); b.remove(); ligarRastreio();
    });
    b.querySelector('[data-acao="recusar"]').addEventListener('click', function () {
      gravar('recusado'); b.remove();
    });
  }

  var c = ler();
  if (c === 'aceito') { ligarRastreio(); }
  else if (c === 'recusado') { /* segue sem rastreio */ }
  else { banner(); }

  /* ── Proteção anti-cópia, só se a página pedir ── */
  if (document.querySelector('meta[name="protecao-copia"]')) {
    var p = document.createElement('script');
    p.src = '/parceiro/assets/js/bloco-protecao.js';
    p.defer = true;
    document.body.appendChild(p);
  }

  void hasJs;
})();
