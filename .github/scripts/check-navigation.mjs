#!/usr/bin/env node
/**
 * Verificador estático do Bloco 02.
 * Na raiz do repositório: node .github/scripts/check-navigation.mjs
 * Não requer instalação, serviços externos ou acesso a dados pessoais.
 */
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const pages=[
 "index.html","o-geb/index.html","esg/index.html","areas/index.html",
 "empresarial/index.html","educacao/index.html","saude/index.html",
 "inclusao/index.html","tecnologia/index.html","parceiros/index.html",
 "carreiras/index.html","carreiras/vagas/index.html",
 "carreiras/candidatura/index.html","contato/index.html",
 "mapa-do-site/index.html","404.html"
];
const failures=[];
let passes=0;
function check(condition,description){if(condition){passes++;}else{failures.push(description)}}
function read(name){return fs.readFileSync(path.join(root,name),"utf8")}
const js=read("site.js"),css=read("styles.css");
try{new Function(js);check(true,"Sintaxe site.js")}catch{check(false,"Sintaxe site.js")}
for(const unit of ["initInstitutionalHeader","initInstitutionalFooter","initVLibras","initJobsPortal","geb-blog-institucional","showCareer","showMobile"]){
 check(js.includes(unit),"Componente JS: "+unit);
}
check(css.includes(".skip-link:focus"),"Estilo de salto acessível");
check(css.includes(".mobile-nav[hidden]"),"Nav escondida por atributo hidden");
check(css.includes(".nav-dropdown-menu[hidden]"),"Submenu escondido por atributo hidden");
for(const page of pages){
 const h=read(page),tag="<header class=\"site-header\">";
 check((h.match(/<header\b/gi)||[]).length===1,page+": cabeçalho único");
 check((h.match(/<footer\b/gi)||[]).length===1,page+": rodapé");
 check((h.match(/<main id="geb-main"/gi)||[]).length===1,page+": conteúdo principal");
 check((h.match(/<h1(?:\s|>)/gi)||[]).length===1,page+": um H1");
 check((h.match(/class="skip-link"/g)||[]).length===1,page+": link de salto");
 check((h.match(/id="geb-mobile-nav"/g)||[]).length===1,page+": nav mobile única");
 check(/site\.js\?v=20261023-trabalhe/.test(h)&&/styles\.css\?v=20261023-trabalhe/.test(h),page+": versão dos recursos");
 const header=h.slice(h.indexOf(tag),h.indexOf("</header>")+9);
 check(["O GEB","Áreas de atuação","Parcerias e Expansão","Trabalhe conosco","Contato"].every(n=>header.includes(">"+n+"<")),page+": navegação principal");
 check(!header.includes('href="/esg/"'),page+": ESG secundário");
 const links=[...h.matchAll(/href=["']([^"']+)["']/gi)].map(m=>m[1]);
 for(const href of links){
   if(/^http:\/\//i.test(href)||/^https:\/\/www\.geb(educacao|empresarial|inclusao)\./i.test(href)){
     check(false,page+": URL legada "+href);continue;
   }
   if(/^mailto:|^tel:|^#/.test(href))continue;
   try{
     const url=new URL(href,new URL(page==="index.html"?"/":"/"+page.replace(/index\.html$/,""),"https://grupoeduardabispo.com.br"));
     if(url.hostname!=="grupoeduardabispo.com.br")continue;
     const pathname=decodeURIComponent(url.pathname);
     let local=pathname.replace(/^\/+/,"");
     if(!local||local.endsWith("/"))local+="index.html";
     check(fs.existsSync(path.join(root,local)),page+": link interno inexistente "+href);
   }catch{check(false,page+": URL inválida "+href)}
 }
}
console.log("Verificações aprovadas: "+passes+" | Falhas: "+failures.length);
for(const line of failures)console.error("FALHA "+line);
if(failures.length)process.exitCode=1;
