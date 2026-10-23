#!/usr/bin/env node
// Verificação estática do Bloco 01. Sem bibliotecas externas ou acesso à rede.
// Executar da raiz: node .github/scripts/check-foundation.mjs
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd(), errors=[], checks=[];
function read(file){
  try {return fs.readFileSync(path.join(root,file),'utf8');}
  catch {errors.push('Arquivo não encontrado: '+file);return '';}
}
function check(ok,message){checks.push({ok:!!ok,message});if(!ok)errors.push(message);}
const routes=[
 'index.html','o-geb/index.html','esg/index.html','areas/index.html',
 'empresarial/index.html','educacao/index.html','saude/index.html',
 'inclusao/index.html','tecnologia/index.html','parceiros/index.html',
 'carreiras/index.html','carreiras/vagas/index.html',
 'carreiras/candidatura/index.html','contato/index.html',
 'mapa-do-site/index.html','404.html'
];
const css=read('styles.css'), js=read('site.js'), home=read('index.html');
read('carreiras/ats-form.js');
check((css.match(/:root\s*\{/g)||[]).length===1,'CSS deve conter exatamente um bloco :root.');
for(const key of ['ink','paper','white','gold','line','muted','max','pad','display','text','surface','surface-soft','shadow','focus-color']){
 const regex=new RegExp('--'+key+'\\s*:','g');
 check((css.match(regex)||[]).length===1,'Token CSS ausente ou duplicado: --'+key);
}
const jsons=[...home.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
check(jsons.length===1,'Home precisa ter exatamente um JSON-LD institucional.');
if(jsons.length===1){
  try{
    const data=JSON.parse(jsons[0][1]);
    const ids=(data['@graph']||[]).map(item=>item['@id']);
    check(ids.includes('https://grupoeduardabispo.com.br/#organization'),'JSON-LD sem Organization canônica.');
    check(ids.includes('https://grupoeduardabispo.com.br/#website'),'JSON-LD sem WebSite canônico.');
  }catch{check(false,'JSON-LD da home é inválido.');}
}
for(const route of routes){
  const html=read(route);
  if(!html) continue;
  check(/<main(?:\s|>)/i.test(html),'Página sem <main>: '+route);
  check((html.match(/<h1(?:\s|>)/gi)||[]).length===1,'A página deve conter exatamente um H1: '+route);
  check(/<header(?:\s|>)/i.test(html)&&/<footer(?:\s|>)/i.test(html),'Página sem header ou footer: '+route);
}
for(const keyword of ['initInstitutionalHeader','initInstitutionalFooter','initVLibras','data-jobs-list','geb-blog-institucional']){
 check(js.includes(keyword),'Dependência funcional não identificada em site.js: '+keyword);
}
check(fs.existsSync(path.join(root,'.github/workflows/deploy.yml')),'Workflow de publicação não encontrado.');
for(const item of checks){process.stdout.write((item.ok?'OK   ':'FALHA')+' '+item.message+'\n');}
process.stdout.write('\n'+(checks.length-errors.length)+'/'+checks.length+' verificações estáticas aprovadas.\n');
if(errors.length){process.exitCode=1;}
