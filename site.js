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


(function initInstitutionalFooter(){
  const footer=document.querySelector('.site-footer');
  if(!footer) return;

  footer.classList.add('site-footer--institutional');
  footer.innerHTML=`
    <div class="footer-shell">
      <div class="footer-primary">
        <div class="footer-identity">
          <a class="footer-logo" href="/" aria-label="GEB, início">
            <img src="/assets/geb-institucional-logo.svg" alt="GEB | Grupo Eduarda Bispo">
          </a>
          <p>Estrutura institucional que conecta e fortalece frentes especializadas, projetos, conteúdos e oportunidades.</p>
          <a class="footer-top-link" href="#top" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Voltar ao topo ↑</a>
        </div>

        <nav class="footer-nav-group" aria-label="Institucional">
          <strong>Institucional</strong>
          <a href="/o-geb/">O GEB</a>
          <a href="/areas/">Atuação</a>
          <a href="/impacto/">Impacto institucional</a>\n          <a href="/parceiros/">Parcerias e Expansão</a>
          <a href="/carreiras/">Carreiras</a>
        </nav>

        <nav class="footer-nav-group" aria-label="Frentes do GEB">
          <strong>Atuação atual</strong>
          <a href="/empresarial/">GEB Empresarial</a>
          <a href="/educacao/">GEB Educação</a>
          <a href="/saude/">GEB Saúde</a>
          <a href="/inclusao/">GEB Inclusão</a>
          <a href="/tecnologia/">GEB Tecnologia</a>
        </nav>

        <nav class="footer-nav-group" aria-label="Conteúdo e oportunidades">
          <strong>Conexões</strong>
          <a href="/carreiras/vagas/">Vagas e oportunidades</a>
          <a href="/carreiras/candidatura/">Candidatura</a>
          <a href="/contato/">Contato</a>
        </nav>
      </div>

      <div class="footer-contact-band">
        <div>
          <span>Contato institucional</span>
          <a href="mailto:contato@grupoeduardabispo.com.br">contato@grupoeduardabispo.com.br</a>
        </div>
        <div>
          <span>WhatsApp</span>
          <a href="https://wa.me/551121105473" target="_blank" rel="noopener">(11) 2110-5473</a>
        </div>
        <div class="footer-contact-note">
          <span>GEB | Grupo Eduarda Bispo</span>
          <p>Estrutura institucional que conecta frentes especializadas.</p>
        </div>
      </div>

      <div class="footer-legal">
        <p>© <span data-year></span> GEB | Grupo Eduarda Bispo. Todos os direitos reservados.</p>
        <div>
          <a href="/contato/">Contato</a>
          <span aria-hidden="true">•</span>
          <a href="/carreiras/">Carreiras</a>
        </div>
      </div>
    </div>
  `;

  footer.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();
