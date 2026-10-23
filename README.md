# GEB — Grupo Eduarda Bispo

Site institucional do GEB.

## Posicionamento

**GEB integra soluções empresariais, educação, saúde, inclusão e tecnologia em uma única marca.**

O site institucional apresenta a marca, suas áreas de atuação, parcerias, carreiras e canais de contato. Conteúdo editorial permanece no Blog GEB e ofertas comerciais são aprofundadas nos ambientes de cada frente.

## Princípios

- Institucional e durável: não depender de atualizações constantes.
- GEB é a marca; as áreas são caminhos de atuação.
- Não apresentar o GEB como holding, conglomerado ou conjunto de empresas quando isso não corresponder à realidade jurídica.
- Produtos específicos não precisam aparecer no institucional.
- GEB Tecnologia é a marca comercial da frente tecnológica; Compass Rose Systems identifica o ambiente técnico de desenvolvimento e entrega, sem criar outra frente institucional.
- Blog, páginas comerciais e ambientes especializados permanecem separados do institucional.


## URLs oficiais

- Home institucional do GEB: https://grupoeduardabispo.com.br/
- Entrega corporativa / GEB Empresarial: https://gebempresarial.grupoeduardabispo.com.br/
- Blog oficial do GEB: https://blog.grupoeduardabispo.com.br/
- Não utilizar ambientes legados como destinos institucionais.

## Governança de UX e arquitetura

A fundação visual, os limites de escopo e o plano de validação dos Blocos 01 a 10 estão documentados em [`.github/docs/FUNDACAO-UX-BLOCO-01.md`](.github/docs/FUNDACAO-UX-BLOCO-01.md). A página institucional não é catálogo de ofertas: conteúdo dinâmico pertence aos sites especializados, ao portal de vagas ou ao Blog GEB. O CSS compartilha um único `:root`; regras legadas e responsivas são preservadas até sua verificação por página.

### Navegação Global — Bloco 02

O padrão de cabeçalho, menus, rodapé, navegação acessível e URLs canônicas está documentado em [`.github/docs/NAVEGACAO-UX-BLOCO-02.md`](.github/docs/NAVEGACAO-UX-BLOCO-02.md). Para repetir a verificação estática das 16 páginas, execute `node .github/scripts/check-navigation.mjs` na raiz do repositório. O resultado da implantação pública exige homologação separada.

### Página inicial — Bloco 03

A nova experiência institucional da home, os seis caminhos de atuação, o layout responsivo e a integração automática do Blog GEB estão descritos em [`.github/docs/HOME-UX-BLOCO-03.md`](.github/docs/HOME-UX-BLOCO-03.md). O CSS isolado está em `assets/home03.css` e a conferência estática pode ser repetida com `node .github/scripts/check-home03.mjs`. A validação visual e a implantação no domínio ainda dependem de homologação.

### Áreas de atuação — Bloco 04

O diretório institucional e as páginas de Empresarial, Educação, Saúde, Inclusão e Tecnologia utilizam a fundação visual compartilhada de [`.github/docs/AREAS-UX-BLOCO-04.md`](.github/docs/AREAS-UX-BLOCO-04.md), com o CSS escopado `assets/areas04.css` e o teste estático `node .github/scripts/check-areas04.mjs`. Os destinos comerciais ficam nos subdomínios especializados; produção e visualização real requerem homologação separada.

### Narrativa institucional — Bloco 05

As páginas de [O GEB](/o-geb/), ESG e Parcerias e Expansão seguem a arquitetura documentada em [`.github/docs/INSTITUCIONAL-UX-BLOCO-05.md`](.github/docs/INSTITUCIONAL-UX-BLOCO-05.md). O layout está em `assets/institutional05.css`. Para verificar a integridade das páginas antes da publicação, execute `node .github/scripts/check-institutional05.mjs`. As condições comerciais atualizadas ficam no GEB Parcerias e nos ambientes especializados.

## Trabalhe conosco — recrutamento do GEB

A rota `/carreiras/` identifica a **área de recrutamento e seleção do próprio GEB**, e **não** uma nova frente institucional, uma marca chamada “GEB Carreiras” ou um portal de emprego de terceiros. Os perfis listados em `/carreiras/vagas/` se destinam a possibilidades de atuação nas frentes e projetos do próprio GEB; `/carreiras/candidatura/` é o formulário do ATS, com Banco de Talentos para processos seletivos compatíveis.

Na apresentação pública, usar **Trabalhe conosco** como o nome da seção, inclusive no cabeçalho, rodapé e página inicial. Manter as URLs e os campos de dados do ATS para preservar as integrações existentes. O teste de regressão é `node .github/scripts/check-trabalhe-conosco.mjs`.
