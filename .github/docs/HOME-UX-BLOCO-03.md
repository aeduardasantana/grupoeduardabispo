# GEB — Bloco 03: UX e design da página inicial

**Data:** 23/10/2026  
**Repositório:** \`aeduardasantana/grupoeduardabispo\`  
**Página:** https://grupoeduardabispo.com.br/  
**Status:** alterado no GitHub; a publicação em produção não está confirmada.

## Objetivo editorial

Construir uma primeira experiência que explique o GEB sem depender de catálogo, de campanhas promocionais ou da trajetória pessoal da fundadora como argumento principal. O visitante deve identificar a marca, entender os públicos atendidos e encontrar rapidamente um caminho correspondente à sua necessidade.

Mensagem da abertura:

> **Soluções para negócios, pessoas e instituições.**  
> O GEB integra soluções empresariais, educação, saúde, inclusão e tecnologia em uma única marca, com parcerias que ampliam possibilidades de atuação.

A marca é institucional, não uma declaração de existência de holding ou diversas pessoas jurídicas. A NR-1 é um tema especializado do GEB Empresarial e não compõe a home geral.

## Ordem de leitura da home

1. **Abertura institucional** — H1, explicação objetiva, ações para \`/areas/\` e \`/o-geb/\`. O painel visual usa composição tipográfica GEB com CSS, sem imagens de banco genéricas ou contadores artificiais.
2. **Áreas de atuação** — grade única de seis cartões: Empresarial, Educação, Saúde, Inclusão, Tecnologia e Parcerias. Títulos e descrições breves com acesso às respectivas páginas institucionais internas. Os seis links que antes apareciam novamente no painel de abertura foram removidos.
3. **Estrutura e proposta** — organização de frentes sob uma identidade institucional, com três princípios editoriais e encaminhamento a \`/o-geb/\`.
4. **Carreiras e Parcerias** — dois caminhos distintos com seus públicos e CTAs próprios.
5. **Blog GEB** — a seção já existente de três artigos mais recentes da editoria Institucional, carregada dinamicamente do Blog GEB e apresentada antes do contato. Sem JavaScript, resta um link acessível de fallback.
6. **Contato institucional** — encaminhamento para \`/contato/\` e WhatsApp institucional já existente.
7. **Rodapé global** — o componente compartilhado do Bloco 02 continua montado por \`site.js\` e inclui ESG e Blog GEB.

## Design e componentes

- Preservados: \`Inter\`, \`Inter Tight\`, cores de base \`--paper\`, \`--ink\`, \`--gold\`, fundos claros, painéis escuros e faixas editoriais com hierarquia tipográfica.
- Novo CSS escopado em \`assets/home03.css\`, carregado após \`styles.css\`, para não criar dependências nas LPs, páginas do ATS ou outras rotas.
- Componentes: abertura com painel tipográfico; cartões de áreas; faixa institucional; cartões de oportunidades; contato final; CTAs com estados hover/focus; configurações \`prefers-reduced-motion\`.
- Responsividade definida em 1100, 860 e 580 px. Grade de áreas 3 colunas em desktop, 2 colunas em tablet e 1 coluna em celular.
- O Blog GEB mantém o mesmo iframe, URL oficial, política de origem da mensagem e CSS \`assets/blog-strip.css\`; a lógica dinâmica substitui somente \`[data-geb-blog-anchor]\` na home. Em outras páginas conserva o comportamento anterior junto ao rodapé.
- \`styles.css\` recebeu uma correção pontual: uma regra de Carreiras que terminava com uma chave de fechamento solta foi delimitada por \`@media(max-width:620px)\`, restaurando o equilíbrio sintático sem eliminar declarações.

## Arquivos alterados

- \`index.html\`: conteúdo editorial, estrutura e nova referência de CSS/JS.
- \`assets/home03.css\`: estilo da home isolado, responsivo, acessível e sem imagens.
- \`site.js\`: ajuste mínimo de ponto de montagem da faixa dinâmica do blog, com fallback original.
- \`styles.css\`: correção pontual de uma media query legada mal delimitada.
- \`.github/scripts/check-home03.mjs\`: verificações estáticas reutilizáveis de estrutura, links, integração, hierarquia e media queries.
- \`.github/docs/HOME-UX-BLOCO-03.md\`: este relatório.
- \`README.md\`: link para a documentação e o teste.

## Testes efetuados no código

Verificar via leitura atual do repositório GitHub:
- existência de um único \`h1\`, quatro \`h2\`, seis cartões de áreas e ordem editorial correta;
- preservação de IDs, menu global, link de salto, rodapé global, logotipo e destino oficial de contato;
- caminhos para as seis LPs e para áreas institucionais;
- código do Blog GEB intacto quanto a endpoint, política de origem e iframe;
- folhas CSS válidas quanto a chaves e com regras para larguras 320, 375, 580, 768, 860, 1024 e 1440 px;
- código de \`site.js\` sintaticamente válido.

O repositório inclui \`.github/scripts/check-home03.mjs\`, executável com \`node .github/scripts/check-home03.mjs\` na raiz; esse script **não depende de rede, navegador ou backend**.

## Pendências de homologação

1. Inspecionar o layout em navegador real nos tamanhos 320, 375, 768, 1024 e 1440 px: quebras de linha, foco, cartões, animações, contraste e possível overflow.
2. Testar o iframe do Blog GEB em produção e a comunicação de altura com a origem permitida.
3. Validar links externos e subdomínios por HTTPS após publicação.
4. Conferir menu global e rodapé após cache busting, em todos os dispositivos.
5. Confirmar publicação na Locaweb. O workflow de deploy é manual e não foi executado neste bloco.
6. Verificar comportamento sem JavaScript e com tecnologia assistiva.

**Importante:** mudança confirmada no GitHub não significa implantação confirmada no domínio.
