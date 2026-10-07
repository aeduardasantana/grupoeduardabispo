(function(){
var articles=window.GEB_TEST_ARTICLES||[];var params=new URLSearchParams(location.search);
var categoria=params.get("categoria")||"",tag=params.get("tag")||"",q=params.get("q")||"";
var lista=document.getElementById("lista-artigos"),vazio=document.getElementById("estado-vazio"),busca=document.getElementById("busca"),limpar=document.getElementById("limpar-filtros"),titulo=document.getElementById("titulo-lista"),contexto=document.getElementById("contexto-lista");
function esc(v){return String(v||"").replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m];});}
function norm(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();}
function url(a){return "./artigo.html?slug="+encodeURIComponent(a.slug);}
function card(a){return '<article class="article-card"><p class="eyebrow">'+esc(a.categoria)+'</p><h3><a class="stretched" href="'+url(a)+'">'+esc(a.titulo)+'</a></h3><p>'+esc(a.resumo)+'</p><div class="tag-list">'+(a.tags||[]).slice(0,3).map(function(t){return '<a class="tag" href="./?tag='+encodeURIComponent(t)+'">'+esc(t)+'</a>';}).join("")+'</div><div class="card-meta">'+esc(a.autorPublico)+' · '+esc(a.dataPublicacao)+'</div></article>';}
function render(){var nq=norm(q);var out=articles.filter(function(a){if(categoria&&norm(a.categoria)!==norm(categoria))return false;if(tag&&!(a.tags||[]).some(function(t){return norm(t)===norm(tag);}))return false;if(nq){var hay=norm([a.titulo,a.resumo,a.categoria,(a.tags||[]).join(" ")].join(" "));if(hay.indexOf(nq)===-1)return false;}return true;});lista.innerHTML=out.map(card).join("");vazio.hidden=out.length>0;limpar.hidden=!(categoria||tag||q);if(categoria){contexto.textContent="Categoria";titulo.textContent=categoria;}else if(tag){contexto.textContent="Tag";titulo.textContent=tag;}else if(q){contexto.textContent="Busca";titulo.textContent='Resultados para “'+q+'”';}else{contexto.textContent="Últimos conteúdos";titulo.textContent="Conteúdos recentes";}}
document.getElementById("btn-buscar").addEventListener("click",function(){q=busca.value.trim();categoria="";tag="";history.replaceState(null,"","./"+(q?"?q="+encodeURIComponent(q):""));render();});
busca.addEventListener("keydown",function(e){if(e.key==="Enter")document.getElementById("btn-buscar").click();});
limpar.addEventListener("click",function(){categoria=tag=q="";busca.value="";history.replaceState(null,"","./");render();});
render();
})();