#!/usr/bin/env node
/**
 * GEB Bloco 04 — teste estático da experiência das áreas.
 * Executar na raiz: node .github/scripts/check-areas04.mjs
 * Não requer dependências, acesso externo ou dados reais.
 */
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const routeNames=["areas","empresarial","educacao","saude","inclusao","tecnologia"];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const css=read("assets/areas04.css");
const js=read("site.js");
const failures=[];
let passed=0;
function test(ok,label){if(ok)passed++;else failures.push(label);}
const pictures=[];
const hosted={
  empresarial:"https://gebempresarial.grupoeduardabispo.com.br/",
  educacao:"https://gebeducacao.grupoeduardabispo.com.br/",
  saude:"https://gebsaude.grupoeduardabispo.com.br/",
  inclusao:"https://gebinclusao.grupoeduardabispo.com.br/",
  tecnologia:"https://gebtecnologia.grupoeduardabispo.com.br/"
};

for(const route of routeNames){
 const filename=route+"/index.html";
 const html=read(filename);
 test((html.match(/<h1\b/gi)||[]).length===1,filename+": H1 único");
 test((html.match(/<header\b/gi)||[]).length===1,filename+": cabeçalho único");
 test((html.match(/<footer\b/gi)||[]).length===1,filename+": rodapé único");
 test((html.match(/<main\b/gi)||[]).length===1,filename+": main único");
 test(/class="skip-link"/.test(html)&&/id="geb-main"/.test(html),filename+": navegação acessível");
 test(/href="\.\.\/assets\/areas04\.css\?v=20261023-areas04"/.test(html),filename+": CSS escopado");
 test(/src="\.\.\/site\.js\?v=20261023-trabalhe"/.test(html),filename+": menu e blog compartilhados");
 test(html.includes('rel="canonical" href="https://grupoeduardabispo.com.br/'+route+'/'),filename+": URL canônica");
 test(html.includes('aria-label="Você está em"')&&html.includes('href="/"'),filename+": retorno a home");
 test(html.includes('href="/areas/"')||route==="areas",filename+": retorno ao diretório");
 test(html.includes('href="/contato/"'),filename+": contato institucional");
 test(html.includes('class="geb-front-hero__visual"'),filename+": moldura visual");
 test(!/href="http:\/\//.test(html),filename+": links HTTPS");

 const image=html.match(/<figure class="geb-front-hero__visual">[\s\S]*?<img src="([^"]+)" alt="([^"]+)"/i);
 test(Boolean(image)&&image[2].length>24,filename+": foto com descrição contextual");
 if(image)pictures.push(image[1]);

 const hrefs=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
 for(const link of hrefs){
   if(link.startsWith("/")){
     const pathname=link.split(/[?#]/,1)[0];
     const local=pathname.replace(/^\/+/,"")+(pathname.endsWith("/")?"index.html":"");
     test(fs.existsSync(path.join(root,local)),filename+": rota interna "+link);
   }else if(link.startsWith("#")){
     test(html.includes('id="'+link.slice(1)+'"'),filename+": âncora "+link);
   }
 }

 if(route==="areas"){
   test((html.match(/class="geb-areas-card"/g)||[]).length===6,filename+": seis cartões");
   for(const r of ["empresarial","educacao","saude","inclusao","tecnologia","parceiros"]){
     test(html.includes('href="/'+r+'/'),filename+": cartão "+r);
   }
 }else{
   test((html.match(/class="geb-front-capability"/g)||[]).length===3,filename+": três cartões de capacidade");
   test((html.match(/<li>/g)||[]).length===3,filename+": três públicos atendidos");
   test(html.split(hosted[route]).length-1===2,filename+": dois CTAs para o site especializado");
 }
 test(route==="empresarial"||!/NR-1/i.test(html),filename+": NR-1 confinado ao Empresarial");
}
test(new Set(pictures).size===6,"Seis imagens exclusivas no diretório e nas cinco frentes");
test(css.includes("aspect-ratio:6/5"),"Proporção única de moldura");
for(const width of ["1120","850","580"]){
 test(css.includes("@media(max-width:"+width+"px)"),"Breakpoint "+width);
}
test(css.includes("grid-template-columns:repeat(3,minmax(0,1fr))"),"Grid desktop");
test(css.includes("grid-template-columns:repeat(2,minmax(0,1fr))"),"Grid tablet");
test(css.includes("grid-template-columns:1fr"),"Grid mobile");
test(css.includes("prefers-reduced-motion:reduce"),"Movimento reduzido");
function balanced(styles){
 let n=0,min=0;
 for(const m of styles.matchAll(/\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[{}]/g)){
   if(m[0]==="{")n++;else if(m[0]==="}")n--;
   min=Math.min(min,n);
 }
 return n===0&&min===0;
}
test(balanced(css),"Chaves CSS equilibradas");
try{new Function(js);test(true,"JavaScript compartilhado válido")}catch{test(false,"JavaScript compartilhado inválido")}
test(js.includes("initVLibras")&&js.includes("initInstitutionalFooter")&&js.includes("geb-blog-institucional"),"Módulos compartilhados preservados");
console.log("Bloco 04: "+passed+" testes aprovados; "+failures.length+" falhas.");
for(const error of failures)console.error("FALHA "+error);
if(failures.length)process.exitCode=1;
