const LOGO="/assets/geb-institucional-logo.svg";

/* Componente de navegação única do GEB Institucional — Bloco 02. */
(function initInstitutionalHeader(){
  const header=document.querySelector(".site-header");
  if(!header)return;
  const path=(location.pathname||"/").replace(/index\.html$/,"");
  const section=()=>{
    if(path.startsWith("/o-geb")||path.startsWith("/esg"))return "o-geb";
    if(["/areas","/empresarial","/educacao","/saude","/inclusao","/tecnologia"].some(p=>path.startsWith(p)))return "areas";
    if(path.startsWith("/parceiros"))return "parceiros";
    if(path.startsWith("/carreiras"))return "carreiras";
    if(path.startsWith("/contato"))return "contato";
    return "";
  };
  const current=section();
  const active=(id,target)=>current===id?' class="is-active" aria-current="'+(path===target?"page":"location")+'"':"";
  const careerCurrent=current==="carreiras";
  header.innerHTML=[
    '<a class="brand" href="/" aria-label="GEB, página inicial"><img src="'+LOGO+'" alt="GEB | Grupo Eduarda Bispo"></a>',
    '<nav class="desktop-nav" aria-label="Navegação principal">',
    '<a href="/o-geb/"'+active("o-geb","/o-geb/")+'>O GEB</a>',
    '<a href="/areas/"'+active("areas","/areas/")+'>Áreas de atuação</a>',
    '<a href="/parceiros/"'+active("parceiros","/parceiros/")+'>Parcerias e Expansão</a>',
    '<div class="nav-dropdown" data-careers-dropdown>',
    '<a href="/carreiras/" class="nav-dropdown-main'+(careerCurrent?' is-active':'')+'"'+(careerCurrent?' aria-current="'+(path==="/carreiras/"?'page':'location')+'"':'')+'>Carreiras</a>',
    '<button type="button" class="nav-dropdown-toggle" data-careers-toggle aria-expanded="false" aria-controls="geb-careers-subnav" aria-label="Mostrar opções de Carreiras"><span aria-hidden="true">⌄</span></button>',
    '<div class="nav-dropdown-menu" id="geb-careers-subnav" data-careers-subnav hidden>',
    '<a href="/carreiras/">Carreiras no GEB</a>',
    '<a href="/carreiras/vagas/"'+(path==="/carreiras/vagas/"?' aria-current="page"':'')+'>Vagas e oportunidades</a>',
    '<a href="/carreiras/candidatura/"'+(path==="/carreiras/candidatura/"?' aria-current="page"':'')+'>Candidatura / Banco de Talentos</a>',
    '</div></div>',
    '<a href="/contato/"'+active("contato","/contato/")+'>Contato</a>',
    '</nav>',
    '<button class="menu-button" data-menu-button type="button" aria-controls="geb-mobile-nav" aria-expanded="false" aria-label="Abrir menu principal">Menu</button>'
  ].join("");
  let mobile=document.querySelector("[data-mobile-nav]");
  if(!mobile){
    mobile=document.createElement("nav");
    mobile.className="mobile-nav";
    mobile.setAttribute("data-mobile-nav","");
    header.insertAdjacentElement("afterend",mobile);
  }
  mobile.id="geb-mobile-nav";
  mobile.setAttribute("aria-label","Navegação móvel");
  mobile.hidden=true;
  mobile.innerHTML=[
    '<a href="/o-geb/"'+active("o-geb","/o-geb/")+'>O GEB</a>',
    '<a href="/areas/"'+active("areas","/areas/")+'>Áreas de atuação</a>',
    '<a href="/parceiros/"'+active("parceiros","/parceiros/")+'>Parcerias e Expansão</a>',
    '<a href="/carreiras/"'+active("carreiras","/carreiras/")+'>Carreiras</a>',
    '<div class="mobile-careers-links">',
    '<a href="/carreiras/vagas/"'+(path==="/carreiras/vagas/"?' aria-current="page"':'')+'>Vagas e oportunidades</a>',
    '<a href="/carreiras/candidatura/"'+(path==="/carreiras/candidatura/"?' aria-current="page"':'')+'>Candidatura / Banco de Talentos</a>',
    '</div>',
    '<a href="/contato/"'+active("contato","/contato/")+'>Contato</a>'
  ].join("");
  const button=header.querySelector("[data-menu-button]");
  const career=header.querySelector("[data-careers-dropdown]");
  const careerButton=header.querySelector("[data-careers-toggle]");
  const careerMenu=header.querySelector("[data-careers-subnav]");
  function showCareer(open){
    careerMenu.hidden=!open;
    career.dataset.open=String(!!open);
    careerButton.setAttribute("aria-expanded",String(!!open));
    careerButton.setAttribute("aria-label",open?"Ocultar opções de Carreiras":"Mostrar opções de Carreiras");
  }
  function showMobile(open,returnFocus=false){
    mobile.hidden=!open;
    document.body.classList.toggle("geb-mobile-menu-open",!!open);
    button.setAttribute("aria-expanded",String(!!open));
    button.setAttribute("aria-label",open?"Fechar menu principal":"Abrir menu principal");
    button.textContent=open?"Fechar":"Menu";
    if(open)mobile.querySelector("a")?.focus();
    else if(returnFocus)button.focus();
  }
  careerButton.addEventListener("click",()=>showCareer(careerMenu.hidden));
  career.addEventListener("pointerenter",()=>{
    if(window.matchMedia("(hover: hover) and (pointer: fine)").matches)showCareer(true);
  });
  career.addEventListener("pointerleave",()=>{
    if(!career.contains(document.activeElement))showCareer(false);
  });
  career.addEventListener("focusin",()=>showCareer(true));
  career.addEventListener("focusout",event=>{
    if(!career.contains(event.relatedTarget))showCareer(false);
  });
  button.addEventListener("click",()=>showMobile(mobile.hidden));
  mobile.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>showMobile(false)));
  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape")return;
    if(!mobile.hidden){event.preventDefault();showMobile(false,true);}
    else if(!careerMenu.hidden){event.preventDefault();showCareer(false);careerButton.focus();}
  });
  document.addEventListener("pointerdown",event=>{
    if(!career.contains(event.target))showCareer(false);
    if(!mobile.hidden&&!mobile.contains(event.target)&&!button.contains(event.target))showMobile(false);
  });
  window.addEventListener("resize",()=>{
    if(window.innerWidth>980&&!mobile.hidden)showMobile(false);
  });
  showCareer(false);
  showMobile(false);
})();

document.querySelectorAll("[data-geb-logo]").forEach(img=>img.src=LOGO);
document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());

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
          <p>Estrutura institucional para desenvolver negócios, pessoas, conhecimento e novas possibilidades.</p>
          <a class="footer-top-link" href="#geb-main">Voltar ao topo ↑</a>
        </div>

        <nav class="footer-nav-group" aria-label="Institucional">
          <strong>Institucional</strong>
          <a href="/o-geb/">O GEB</a>
          <a href="/esg/">ESG</a>
          <a href="/areas/">Áreas de atuação</a>
          <a href="/parceiros/">Parcerias e Expansão</a>
          <a href="/carreiras/">Carreiras</a>
        </nav>

        <nav class="footer-nav-group" aria-label="Áreas de atuação do GEB">
          <strong>Áreas de atuação</strong>
          <a href="/empresarial/">GEB Empresarial</a>
          <a href="/educacao/">GEB Educação</a>
          <a href="/saude/">GEB Saúde</a>
          <a href="/inclusao/">GEB Inclusão</a>
          <a href="/tecnologia/">GEB Tecnologia</a>
        </nav>

        <nav class="footer-nav-group" aria-label="Conexões">
          <strong>Conexões</strong>
          <a href="/carreiras/vagas/">Vagas e oportunidades</a>
          <a href="/carreiras/candidatura/">Candidatura</a>
          <a href="/contato/">Contato</a>
          <a href="https://blog.grupoeduardabispo.com.br/" target="_blank" rel="noopener">Blog GEB | Grupo Eduarda Bispo</a>
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
          <p>Estrutura institucional preparada para evoluir com novas frentes, relações e oportunidades.</p>
        </div>
      </div>

      <div class="footer-legal">
        <p>© <span data-year></span> GEB | Grupo Eduarda Bispo. Todos os direitos reservados.</p>
        <div>
          <span>Desenvolvido por <a href="https://gebtecnologia.grupoeduardabispo.com.br/" target="_blank" rel="noopener noreferrer">Compass Rose Systems · GEB Tecnologia</a></span>
        </div>
      </div>
    </div>
  `;

  footer.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();


/* Blog GEB Institucional: faixa nas páginas públicas, fora dos fluxos de candidatura. */
(function(){
  "use strict";
  const path=location.pathname.replace(/\/index\.html$/,"/").replace(/\/+$/,"/")||"/";
  if(path==="/404.html"||path.startsWith("/carreiras/candidatura/")||document.getElementById("geb-blog-institucional"))return;
  const footer=document.querySelector("footer");
  if(!footer)return;
  const style=document.createElement("link");style.rel="stylesheet";style.href="/assets/blog-strip.css?v=20261015";document.head.append(style);
  const section=document.createElement("section");section.className="geb-blog-institucional";section.id="geb-blog-institucional";section.setAttribute("aria-labelledby","geb-blog-institucional-title");
  const wrap=document.createElement("div");wrap.className="geb-blog-institucional__wrap";
  const head=document.createElement("div");head.className="geb-blog-institucional__head";
  const intro=document.createElement("div");
  const kicker=document.createElement("span");kicker.className="geb-blog-institucional__kicker";kicker.textContent="BLOG GEB · INSTITUCIONAL";
  const title=document.createElement("h2");title.id="geb-blog-institucional-title";title.className="geb-blog-institucional__title";title.textContent="Ideias que conectam nossas frentes";
  const lead=document.createElement("p");lead.className="geb-blog-institucional__lead";lead.textContent="Leia os três artigos mais recentes sobre o GEB, sua atuação e o desenvolvimento de novas possibilidades.";
  intro.append(kicker,title,lead);
  const all=document.createElement("a");all.className="geb-blog-institucional__all";all.href="https://blog.grupoeduardabispo.com.br/?categoria=Institucional";all.textContent="Ver todos os artigos institucionais →";
  head.append(intro,all);
  const frame=document.createElement("iframe");frame.className="geb-blog-institucional__frame";frame.title="Três artigos recentes da categoria Institucional no Blog GEB";frame.src="https://blog.grupoeduardabispo.com.br/assets/embed.html?categoria=Institucional&limite=3";frame.loading="lazy";frame.referrerPolicy="strict-origin-when-cross-origin";
  wrap.append(head,frame);section.append(wrap);footer.before(section);
  window.addEventListener("message",event=>{
    if(event.origin!=="https://blog.grupoeduardabispo.com.br"||event.source!==frame.contentWindow)return;
    const data=event.data;
    if(!data||data.type!=="geb-blog-embed-height")return;
    const h=Number(data.height);
    if(Number.isFinite(h)&&h>=100&&h<=2500){const px=Math.ceil(h)+"px";if(frame.style.height!==px)frame.style.height=px;}
  });
})();
