/* ═════════════════════════════════════════════════════════
   bloco-protecao.js — anti-cópia básico (v1.1, Vs5.3)
   Padrão p/ projetos de terceiros. consciente da limitação.
   Guarda prefers-reduced-motion. SEM back-button hijack.
   ═════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Bloqueia menu de contexto apenas sobre imagens (básico) */
  document.addEventListener('contextmenu', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  });

  /* Aviso discreto no console (dissuasão de curiosos) */
  console.log('%cConteúdo protegido. Uso sujeito à licença BSL — Eduardo Sidegum.', 'color:#2E8B57;font-size:11px');
})();