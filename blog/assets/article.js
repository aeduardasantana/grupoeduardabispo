(function(){
var articles=window.GEB_TEST_ARTICLES||[];var params=new URLSearchParams(location.search);var slug=params.get("slug")||location.pathname.split("/").filter(Boolean).pop();var a=articles.find(function(x){return x.slug===slug;});var article=document.getElementById("artigo"),error=document.getElementById("erro-artigo");
function esc(v){return String(v||"").replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m];});}
function cats(x){var c=Array.isArray(x.categorias)?x.categorias:(x.categoria?[x.categoria]:[]);return c.filter(Boolean);}
function catsLabel(x){return cats(x).join(" · ");}
function articleUrl(x){return "./artigo.html?slug="+encodeURIComponent(x.slug);}function canonical(x){return "https://grupoeduardabispo.com.br/blog/artigo/"+x.slug+"/";}
function enhance(root){root.querySelectorAll("[data-geb-component]").forEach(function(sec){var type=sec.dataset.gebComponent;sec.classList.add("geb-component");sec.dataset.type=type;if(type==="cards"){sec.classList.add("cards-component");var nodes=[].slice.call(sec.children),current=null;sec.innerHTML="";nodes.forEach(function(n){if(/^H[2-4]$/.test(n.tagName)){current=document.createElement("div");current.className="mini-card";current.appendChild(n);sec.appendChild(current);}else{if(!current){current=document.createElement("div");current.className="mini-card";sec.appendChild(current);}current.appendChild(n);}});}if(type==="oferta")sec.classList.add("offer-component");if(type==="cta")sec.classList.add("cta-component");if(type==="cta"||type==="oferta"){var label="",url="";[].slice.call(sec.querySelectorAll("p")).forEach(function(p){var t=p.textContent.trim();if(t.indexOf("BOTÃO:")===0){label=t.replace(/^BOTÃO:\s*/,"");p.remove();}if(t.indexOf("LINK:")===0){url=t.replace(/^LINK:\s*/,"");p.remove();}});if(label&&url){var link=document.createElement("a");link.className="component-button";link.href=url;link.textContent=label;link.target="_blank";link.rel="noopener noreferrer";sec.appendChild(link);}}});}
function enhanceLinks(root){
  [].slice.call(root.querySelectorAll("p")).forEach(function(p){
    var a=p.querySelector("a");
    if(!a || p.textContent.trim()!==a.textContent.trim()) return;
    var href=a.getAttribute("href")||"";
    if(!/^https?:\/\//i.test(href)) return;

    var prev=p.previousElementSibling;
    var label="";
    if(prev && prev.tagName==="P"){
      var t=prev.textContent.trim();
      if(t.endsWith(":") && t.length<=90){
        label=t.replace(/:$/,"").trim();
        prev.remove();
      }
    }

    var host="";
    try{host=(new URL(href)).hostname.replace(/^www\./,"");}catch(e){}
    a.className="article-external-link";
    a.textContent=label || (host ? "Acessar "+host : "Acessar link");
    a.setAttribute("aria-label",(label || "Acessar link")+" (abre em nova aba)");
    p.classList.add("article-link-row");
  });
}
function related(){var ac=cats(a).map(function(c){return c.toLowerCase();});var rel=articles.filter(function(x){return x.slug!==a.slug&&(cats(x).some(function(c){return ac.indexOf(c.toLowerCase())!==-1;})||(x.tags||[]).some(function(t){return (a.tags||[]).indexOf(t)!==-1;}));}).slice(0,3);if(!rel.length)return;document.getElementById("relacionados").hidden=false;document.getElementById("lista-relacionados").innerHTML=rel.map(function(x){return '<article class="article-card"><p class="eyebrow">'+esc(catsLabel(x))+'</p><h3><a class="stretched" href="'+articleUrl(x)+'">'+esc(x.titulo)+'</a></h3><p>'+esc(x.resumo)+'</p><div class="card-meta">'+esc(x.dataPublicacao)+'</div></article>';}).join("");}
if(!a){error.hidden=false;document.title="Artigo não encontrado — Blog GEB";return;}article.hidden=false;document.getElementById("categoria").textContent=catsLabel(a);document.getElementById("titulo").textContent=a.titulo;var sub=document.getElementById("subtitulo");sub.textContent=a.subtitulo||"";sub.hidden=!a.subtitulo;document.getElementById("autor").textContent=a.autorPublico;document.getElementById("data").textContent=a.dataPublicacao;document.getElementById("tags").innerHTML=(a.tags||[]).map(function(t){return '<a class="tag" href="./?tag='+encodeURIComponent(t)+'">'+esc(t)+'</a>';}).join("");var body=document.getElementById("conteudo-artigo");body.innerHTML=a.conteudoHTML||"";
[].slice.call(body.children).forEach(function(el){
  if(el.tagName!=="P") return;
  var t=el.textContent.trim();
  if(t===a.titulo || /^Por\s+/i.test(t)) el.remove();
});
enhance(body);enhanceLinks(body);
var c=canonical(a);document.title=(a.tituloSEO||a.titulo)+" — Blog GEB";document.querySelector('meta[name="description"]').setAttribute("content",a.descricaoSEO||a.resumo||"");document.getElementById("canonical-link").setAttribute("href",c);document.getElementById("og-title").setAttribute("content",a.titulo);document.getElementById("og-description").setAttribute("content",a.descricaoSEO||a.resumo||"");document.getElementById("og-url").setAttribute("content",c);var ld=document.createElement("script");ld.type="application/ld+json";ld.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":a.titulo,"description":a.resumo,"datePublished":a.dataPublicacao.split("/").reverse().join("-"),"author":{"@type":"Organization","name":a.autorPublico},"publisher":{"@type":"Organization","name":"GEB — Grupo Eduarda Bispo"},"mainEntityOfPage":c});document.head.appendChild(ld);related();
})();