const LOGO="/assets/geb-institucional-logo.svg";
document.querySelectorAll("[data-geb-logo]").forEach(img=>img.src=LOGO);
document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
document.querySelectorAll("[data-menu-button]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const nav=document.querySelector("[data-mobile-nav]");
    const open=btn.getAttribute("aria-expanded")==="true";
    btn.setAttribute("aria-expanded",String(!open));
    if(nav) nav.hidden=open;
  });
});
document.querySelectorAll("[data-mobile-nav] a").forEach(a=>a.addEventListener("click",()=>{
  const nav=document.querySelector("[data-mobile-nav]");
  const btn=document.querySelector("[data-menu-button]");
  if(nav) nav.hidden=true;
  if(btn) btn.setAttribute("aria-expanded","false");
}));
(function initVLibras(){
  if(document.querySelector('[vw]')) return;
  const root=document.createElement('div');
  root.setAttribute('vw','');
  root.className='enabled';
  root.innerHTML='<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
  document.body.appendChild(root);
  const script=document.createElement('script');
  script.src='https://vlibras.gov.br/app/vlibras-plugin.js';
  script.onload=()=>{ if(window.VLibras) new window.VLibras.Widget('https://vlibras.gov.br/app'); };
  document.body.appendChild(script);
})();
(function initJobsPortal(){
 const list=document.querySelector('[data-jobs-list]'); if(!list) return;
 const cards=[...list.querySelectorAll('[data-job]')], search=document.querySelector('[data-job-search]'), area=document.querySelector('[data-job-area]'), type=document.querySelector('[data-job-type]'), count=document.querySelector('[data-jobs-count]'), empty=document.querySelector('[data-jobs-empty]'), clear=document.querySelector('[data-jobs-clear]');
 const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 function apply(){const q=norm(search?.value).trim(),a=area?.value||'',t=type?.value||'';let visible=0;cards.forEach(card=>{const hay=norm(card.dataset.search+' '+card.textContent),show=(!q||q.split(/\s+/).every(term=>hay.includes(term)))&&(!a||card.dataset.area===a)&&(!t||card.dataset.type===t);card.hidden=!show;if(show)visible++;});if(count)count.textContent=visible;if(empty)empty.hidden=visible!==0;}
 [search,area,type].forEach(el=>el&&el.addEventListener(el===search?'input':'change',apply)); clear?.addEventListener('click',()=>{if(search)search.value='';if(area)area.value='';if(type)type.value='';apply();search?.focus();}); apply();
})();
(function initCareersMenu(){
  const normalizeHref = href => (href || '').replace(/\/+$/,'');
  document.querySelectorAll('.desktop-nav').forEach(nav=>{
    const link=[...nav.querySelectorAll(':scope > a')].find(a=>/\/carreiras\/?$/.test(normalizeHref(a.getAttribute('href'))));
    if(!link || link.closest('.nav-dropdown')) return;
    const base=link.getAttribute('href').replace(/\/?$/,'/');
    const wrap=document.createElement('div');
    wrap.className='nav-dropdown';
    wrap.innerHTML='<a class="nav-dropdown-trigger" href="'+base+'">Carreiras <span aria-hidden="true">⌄</span></a><div class="nav-dropdown-menu"><a href="'+base+'">Conheça o ecossistema</a><a href="'+base+'vagas/">Vagas e oportunidades</a><a href="'+base+'candidatura/">Candidatura / Banco de Talentos</a></div>';
    link.replaceWith(wrap);
  });
  document.querySelectorAll('[data-mobile-nav]').forEach(nav=>{
    const link=[...nav.querySelectorAll(':scope > a')].find(a=>/\/carreiras\/?$/.test(normalizeHref(a.getAttribute('href'))));
    if(!link || nav.querySelector('.mobile-careers-links')) return;
    const base=link.getAttribute('href').replace(/\/?$/,'/');
    link.textContent='Carreiras';
    const group=document.createElement('div');
    group.className='mobile-careers-links';
    group.innerHTML='<a href="'+base+'">Conheça o ecossistema</a><a href="'+base+'vagas/">Vagas e oportunidades</a><a href="'+base+'candidatura/">Candidatura / Banco de Talentos</a>';
    link.insertAdjacentElement('afterend',group);
  });
})();
