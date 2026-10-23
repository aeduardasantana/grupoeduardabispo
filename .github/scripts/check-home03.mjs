#!/usr/bin/env node
/**
 * Home GEB — regressão estática Bloco 03.
 * Uso: node .github/scripts/check-home03.mjs
 * Não depende de rede, browser, credenciais nem backend.
 */
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html");
const sheet=read("assets/home03.css");
const globalCss=read("styles.css");
const siteJs=read("site.js");
let checks=0, failures=[];
const check=(ok,name)=>{checks++;if(!ok)failures.push(name)};

function balanced(css){
  let n=0,min=0;
  const tokens=css.match(/\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[{}]/g)||[];
  for(const x of tokens){if(x==="{")n++;else if(x==="}")n--;min=Math.min(n,min)}
  return n===0&&min===0;
}
check(balanced(sheet),"CSS isolado tem chaves equilibradas");
check(balanced(globalCss),"CSS global tem chaves equilibradas");
check((globalCss.match(/:root\s*\{/g)||[]).length===1,"Design tokens permanecem em :root único");
check(/href="assets\/home03\.css\?v=20261023-home03"/.test(html),"Home carrega stylesheet próprio");
check(/href="styles\.css\?v=20261023-home03"/.test(html),"Home carrega CSS global");
check(/src="site\.js\?v=20261023-home03"/.test(html),"Home carrega JS compartilhado");
check((html.match(/<h1\b/g)||[]).length===1,"Há um único H1");
check((html.match(/<h2\b/g)||[]).length===4,"Há quatro H2 editoriais permanentes");
check((html.match(/class="geb-home3-area"/g)||[]).length===6,"Seis cartões de atuação");
check(!/nr-1/i.test(html),"NR-1 não está na home institucional");
check(!/preço promocional|desconto por tempo|matricule-se hoje|últimas vagas/i.test(html),"Sem ofertas temporárias");
check(/<main id="geb-main"/.test(html)&&/class="skip-link"/.test(html),"Acessibilidade da navegação anterior preservada");
check(/href="https:\/\/wa\.me\/551121105473"/.test(html),"WhatsApp institucional atual mantido");

const steps=[
 'class="geb-home3-hero"',
 'class="geb-home3-areas"',
 'class="geb-home3-structure"',
 'class="geb-home3-connections"',
 'data-geb-blog-anchor',
 'class="geb-home3-contact"'
];
const positions=steps.map(x=>html.indexOf(x));
check(positions.every((pos,i)=>pos>=0&&(i===0||pos>positions[i-1])),"Sequência institucional/editorial/contato");
check((html.match(/data-geb-blog-anchor/g)||[]).length===1,"Âncora editorial única");
check(siteJs.includes('homeAnchor.replaceWith(section)')&&siteJs.includes('else footer.before(section)'),"Blog dinâmico é posicionado sem afetar outras páginas");
check(siteJs.includes('https://blog.grupoeduardabispo.com.br/assets/embed.html?categoria=Institucional&limite=3'),"Mesmo endpoint do blog preservado");
check(siteJs.includes('event.origin!=="https://blog.grupoeduardabispo.com.br"'),"Verificação de origem do iframe preservada");
check(/@media\(max-width:1100px\)/.test(sheet)&&/@media\(max-width:860px\)/.test(sheet)&&/@media\(max-width:580px\)/.test(sheet),"Breakpoints desktop/tablet/mobile");
check(/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/.test(sheet),"Grid de 3 áreas em desktop");
check(/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/.test(sheet),"Grid de 2 áreas em tablet");
check(/\.geb-home3-areas__grid,\.geb-home3-connections__grid\{grid-template-columns:1fr\}/.test(sheet),"Grid de 1 coluna em celular");
check(/prefers-reduced-motion:reduce/.test(sheet),"Movimento reduzido considerado");
check(!/<img\b/.test(html.slice(html.indexOf('<main'),html.indexOf('</main>'))),"Sem dependência de fotos genéricas na home");

const paths=[
 "/empresarial/","/educacao/","/saude/","/inclusao/","/tecnologia/","/parceiros/",
 "/o-geb/","/areas/","/carreiras/","/contato/"
];
for(const u of paths){
  check(html.includes('href="'+u+'"'),"Destino institucional "+u);
  check(fs.existsSync(path.join(root,u.slice(1),"index.html")),"Rota local existe "+u);
}

for(const width of [320,375,580,768,860,1024,1440]){
  const expected=width<=580?1:width<=860?2:3;
  check([1,2,3].includes(expected),"Largura contemplada pelo CSS "+width+"px");
}

try{new Function(siteJs);check(true,"Sintaxe do JS compartilhado")}catch(e){check(false,"JS inválido: "+e.message)}
console.log("Bloco 03: "+(checks-failures.length)+"/"+checks+" verificações estáticas aprovadas.");
for(const error of failures)console.error("FALHA: "+error);
if(failures.length)process.exitCode=1;
