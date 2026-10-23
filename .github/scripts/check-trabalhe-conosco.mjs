#!/usr/bin/env node
/**
 * GEB — regressão da navegação Trabalhe conosco (recrutamento próprio).
 * Executar na raiz: node .github/scripts/check-trabalhe-conosco.mjs
 */
import fs from "node:fs";
import path from "node:path";
const read=p=>fs.readFileSync(path.join(process.cwd(),p),"utf8");
const pages=["index.html","o-geb/index.html","esg/index.html","areas/index.html",
  "empresarial/index.html","educacao/index.html","saude/index.html",
  "inclusao/index.html","tecnologia/index.html","parceiros/index.html",
  "carreiras/index.html","carreiras/vagas/index.html","carreiras/candidatura/index.html",
  "contato/index.html","mapa-do-site/index.html","404.html"];
let checks=0;const errors=[];
const test=(good,label)=>{checks++;if(!good)errors.push(label)};
for(const file of pages){
 const html=read(file);
 const header=html.slice(html.indexOf('<header class="site-header">'),html.indexOf('</header>')+9);
 const mobile=html.slice(html.indexOf('<nav class="mobile-nav"'),html.indexOf('</nav>',html.indexOf('<nav class="mobile-nav"'))+6);
 test(header.includes('href="/carreiras/">Trabalhe conosco</a>'),file+": cabeçalho Trabalhe conosco");
 test(mobile.includes('href="/carreiras/">Trabalhe conosco</a>'),file+": menu móvel Trabalhe conosco");
 test(/site\.js\?v=20261023-trabalhe/.test(html),file+": recurso compartilhado atualizado");
 test(!/GEB\s+Carreiras\b/.test(html),file+": não inventar marca GEB Carreiras");
}
const home=read("index.html");
test(home.includes("TRABALHE CONOSCO · GEB"),"Home apresenta Trabalhe conosco");
test(home.includes("do próprio GEB"),"Home explica destinação do recrutamento");
test(!home.includes("Seu próximo passo profissional pode começar aqui."),"Home sem chamada genérica antiga");
const career=read("carreiras/index.html");
test(career.includes("Não somos um portal de vagas de outras empresas."),"Trabalhe conosco esclarece escopo próprio");
test(career.includes('href="/areas/"'),"Caminho para conhecer as áreas não é auto-link");
test(career.includes('href="vagas/"')&&career.includes('href="candidatura/"'),"Fluxos preservados");
const jobs=read("carreiras/vagas/index.html");
test(jobs.includes("exclusivamente oportunidades de atuação vinculadas ao Grupo Eduarda Bispo"),"Oportunidades próprias do GEB");
test((jobs.match(/data-job\s+data-area=/g)||[]).length===7,"Sete descrições de atuação preservadas");
test(jobs.includes("data-jobs-list")&&jobs.includes("data-job-search")&&jobs.includes("data-job-area"),"Busca e filtros preservados");
test(jobs.includes('href="../candidatura/?vagaId='),"Candidatura específica preservada");
const application=read("carreiras/candidatura/index.html");
for(const field of ['data-ats-form','data-vaga-select','name="vagaId"','name="negocioVisual"','name="consentimentoVisual"','src="../ats-form.js"']){
 test(application.includes(field),"ATS inalterado: "+field);
}
test(application.includes("processos seletivos futuros"),"Banco de Talentos contextualizado");
const site=read("site.js");
try{new Function(site);test(true,"Sintaxe do JS")}catch{test(false,"Sintaxe do JS")}
test(site.includes(">Trabalhe conosco</a>"),"Header dinâmico Trabalhe conosco");
test(site.includes(">Vagas do GEB</a>"),"Menu de oportunidades internas");
for(const lib of ["initJobsPortal","initVLibras","initInstitutionalFooter","geb-blog-institucional"]){
 test(site.includes(lib),"Preservado módulo: "+lib);
}
const siteMap=read("mapa-do-site/index.html");
test(siteMap.includes("Recrutamento e candidaturas para atuar no GEB"),"Mapa de site classifica adequadamente");
console.log("Trabalhe conosco — "+(checks-errors.length)+"/"+checks+" verificações aprovadas.");
for(const error of errors)console.error("FALHA: "+error);
if(errors.length)process.exitCode=1;
