#!/usr/bin/env node
// Bloco 05 — verificação estática antes da publicação.
import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const files=["o-geb/index.html","esg/index.html","parceiros/index.html"];
const css=read("assets/institutional05.css"),site=read("site.js");
const failures=[];let checks=0;
function assert(ok,desc){checks++;if(!ok)failures.push(desc)}
function balanced(styles){let n=0,min=0;for(const m of styles.matchAll(/\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[{}]/g)){if(m[0]==="{")n++;else if(m[0]==="}")n--;min=Math.min(min,n)}return n===0&&min===0}
assert(balanced(css),"CSS com sintaxe equilibrada");
for(const px of [1100,860,580])assert(css.includes("@media(max-width:"+px+"px)"),"Breakpoint "+px);
assert(css.includes("prefers-reduced-motion:reduce"),"Movimento reduzido");
try{new Function(site);assert(true,"JavaScript compartilhado válido")}catch{assert(false,"JavaScript compartilhado inválido")}
for(const marker of ["initInstitutionalHeader","initInstitutionalFooter","initVLibras","initJobsPortal","geb-blog-institucional"])assert(site.includes(marker),"Integração "+marker);
for(const file of files){
 const html=read(file),rootPath=file.replace("index.html","");
 assert((html.match(/<h1\b/gi)||[]).length===1,file+": H1 único");
 assert((html.match(/<main\b/gi)||[]).length===1,file+": main único");
 assert((html.match(/<header\b/gi)||[]).length===1,file+": header único");
 assert((html.match(/<footer\b/gi)||[]).length===1,file+": footer único");
 assert(html.includes('id="geb-main"')&&html.includes('class="skip-link"'),file+": navegação acessível");
 assert(html.includes('href="../assets/institutional05.css?v=20261023-b05"'),file+": CSS escopado");
 assert(html.includes('src="../site.js?v=20261023-nav02"'),file+": JS compartilhado");
 assert(html.includes('rel="canonical" href="https://grupoeduardabispo.com.br/'+rootPath+'"'),file+": canônico");
 assert(html.includes('href="/areas/"')&&html.includes('href="/contato/"'),file+": acesso institucional");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert(ids.length===new Set(ids).size,file+": IDs únicos");
 for(const match of html.matchAll(/aria-labelledby="([^"]+)"/g))assert(ids.includes(match[1]),file+": âncora rotulada "+match[1]);
 for(const match of html.matchAll(/href="([^"]+)"/g)){
  const href=match[1];
  assert(!href.startsWith("http://"),file+": link não seguro");
  if(href.startsWith("/")&&!href.startsWith("//")){
   const local=href.slice(1).split(/[?#]/,1)[0];
   if(local)assert(fs.existsSync(path.join(root,local.endsWith("/")?local+"index.html":local)),file+": link interno "+href);
  }else if(href.startsWith("#"))assert(ids.includes(href.slice(1)),file+": link de âncora "+href);
 }
}
const about=read("o-geb/index.html");
assert(about.includes("Eduarda Bispo")&&about.includes("fundadora"),"Origem da marca e fundadora");
assert(about.includes("juridicamente independentes")&&about.includes("profissionais, equipes e parceiros"),"Natureza sem pressupor holding");
const esg=read("esg/index.html");
assert(esg.includes("não representa adesão, filiação, certificação, endosso"),"Ressalva sobre referências ESG");
assert(esg.includes("RESULTADO")||esg.includes("RESULTADO".toLowerCase())||esg.includes("RESULTADOS")||esg.includes("Evidência demonstrável"),"Resultados separados de intenções");
assert(esg.includes("https://sdgs.un.org/goals"),"Fontes ESG preservadas");
const partners=read("parceiros/index.html");
assert(partners.includes("https://gebparcerias.grupoeduardabispo.com.br/"),"Encaminhamento à frente Parcerias");
assert((partners.match(/class="geb-story__card"/g)||[]).length===6,"Seis modalidades");
assert(!/Médico Agora|Gratus|Programa de Bolsas de Estudo/.test(partners),"Catálogo dinâmico ausente");
for(const file of files)assert(!/NR-1/.test(read(file)),"NR-1 não fora do Empresarial");
console.log("Bloco 05: "+(checks-failures.length)+"/"+checks+" verificações aprovadas.");
for(const f of failures)console.error("FALHA: "+f);
if(failures.length)process.exitCode=1;
