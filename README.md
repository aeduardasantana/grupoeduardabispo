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
