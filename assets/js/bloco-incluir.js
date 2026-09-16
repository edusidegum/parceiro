/* LGPD -> GA4/GTM · reveal fallback · progresso fallback · video facade */
(function () {
  'use strict';
  var GTM_ID='SEU_GTM_ID', GA4_ID='SEU_GA4_ID', POLITICA='/parceiro/politica.html', CHAVE='parceiro_lgpd';
  function ler(){try{return localStorage.getItem(CHAVE)}catch(e){return null}}
  function gravar(v){try{localStorage.setItem(CHAVE,v)}catch(e){}}
  function ligar(){
    if(document.getElementById('gtm-script'))return;
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.id='gtm-script';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer',GTM_ID);
    var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id='+GA4_ID;document.head.appendChild(g);
    window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',GA4_ID,{anonymize_ip:true});
  }

/* Dropdown do menu (padrão principal) */
(function(){'use strict';var drop=document.querySelector('.drop');if(!drop)return;var btn=drop.querySelector('button');btn.addEventListener('click',function(e){e.stopPropagation();var open=drop.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false');});document.addEventListener('click',function(e){if(!drop.contains(e.target)){drop.classList.remove('open');btn.setAttribute('aria-expanded','false');}});})();
  /* Dropdown do menu (padrão principal) */

  
  var c=ler();
  if(c==='aceito'){ligar()}
  else if(c!=='recusado'){
    var b=document.createElement('div');b.id='lgpd-banner';b.className='lgpd-banner';b.setAttribute('role','dialog');b.setAttribute('aria-label','Consentimento de cookies');
    b.innerHTML='<span>Uso cookies pra entender as visitas e melhorar a página. Detalhes na <a href="'+POLITICA+'">Política de Privacidade</a>. Pode recusar sem problema.</span><span style="display:flex;gap:.6rem;flex-wrap:wrap"><button class="btn-aceitar" type="button" data-a="1">Aceitar</button><button class="btn-recusar" type="button" data-a="0">Recusar</button></span>';
    document.body.appendChild(b);
    b.querySelector('[data-a="1"]').addEventListener('click',function(){gravar('aceito');b.remove();ligar()});
    b.querySelector('[data-a="0"]').addEventListener('click',function(){gravar('recusado');b.remove()});
  }
  document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');

  var suporta=function(p){return window.CSS&&CSS.supports&&CSS.supports(p)};

  /* Reveal fallback */
  if(!suporta('animation-timeline: view()')){
    var alvos=document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window&&alvos.length){
      var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');obs.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -10% 0px'});
      alvos.forEach(function(el){obs.observe(el)});
    } else {
      alvos.forEach(function(el){el.classList.add('in-view')});
    }
  }

  /* Progresso fallback */
  var bar=document.getElementById('progresso');
  if(bar&&!suporta('animation-timeline: scroll()')){
    var tick=false;
    function up(){tick=false;var h=document.documentElement,m=h.scrollHeight-h.clientHeight,p=m>0?h.scrollTop/m:0;bar.style.transform='scaleX('+p.toFixed(4)+')'}
    window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(up)}},{passive:true});up();
  }

  /* Video facade: só no clique carrega o iframe do YouTube */
  document.querySelectorAll('.video-facade').forEach(function(btn){
    btn.addEventListener('click',function(){
      var id=btn.getAttribute('data-video');if(!id)return;
      var f=document.createElement('iframe');
      f.src='https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0';
      f.title=btn.getAttribute('aria-label')||'Vídeo';
      f.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      f.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
      f.setAttribute('allowfullscreen','');
      btn.replaceWith(f);
    });
  });
})();
