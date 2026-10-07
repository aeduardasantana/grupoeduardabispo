# Blog GEB — Front-end v2

## URL final definida
https://blog.grupoeduardabispo.com.br/

## Estado atual
- Front-end em ambiente de teste.
- Sem implantação pública.
- API Apps Script v2 validada, mas ainda sem implantação.
- Os dados em `assets/test-data.js` são fixtures de teste para validar interface e componentes antes da integração pública com a API.

## Estrutura
- `index.html`: página inicial, categorias, tags e busca.
- `artigo.html`: artigo individual, relacionados, SEO e componentes editoriais.
- `assets/styles.css`: padrão visual responsivo.
- `assets/app.js`: listagem, busca e filtros.
- `assets/article.js`: artigo, componentes, relacionados, canonical, Open Graph e JSON-LD.
- `assets/test-data.js`: três artigos legados + um artigo v2 de teste.
- `.htaccess`: rotas amigáveis para Locaweb/Apache.
- `404.html`: estado de página não encontrada.

## Rotas planejadas
- `/`
- `/artigo/{slug}/`
- `/categoria/{categoria}/`
- `/tag/{tag}/`

No ambiente de teste, `artigo.html?slug=...` funciona diretamente.

## Componentes editoriais validados no fixture v2
- DESTAQUE
- REFLEXAO
- CARDS
- OFERTA
- CTA
- AVISO
- FONTE
- ASSINATURA

## Próximo passo técnico
No Bloco 7, após implantação homologada da API, substituir a fonte de fixtures pelo endpoint público e publicar a pasta `blog/` como raiz do subdomínio `blog.grupoeduardabispo.com.br`.

Não criar implantação pública durante o Bloco 4.
