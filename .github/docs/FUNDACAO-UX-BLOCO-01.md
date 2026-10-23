# GEB Institucional — Fundação visual e arquitetura (Bloco 01)

**Data:** 23/10/2026  
**Repositório:** `aeduardasantana/grupoeduardabispo`  
**Domínio canônico:** https://grupoeduardabispo.com.br/  
**Situação:** alterações de fundação registradas no GitHub; publicação em produção NÃO confirmada.

## 1. Regra de posicionamento

O GEB — Grupo Eduarda Bispo é uma **marca institucional que organiza e conecta frentes de atuação**, originadas da trajetória de sua fundadora, para atender pessoas, empresas e instituições.

- Não qualificar a marca como holding, conglomerado ou grupo de pessoas jurídicas independentes sem documentação jurídica que fundamente essa afirmação.
- O site institucional identifica capacidades permanentes e encaminha para as frentes especializadas. Não deve reproduzir catálogo comercial, condições de parceiros, tabela de preços, promoções, produtos individuais nem listas de vagas.
- Eduarda Bispo pode aparecer como fundadora e responsável pela direção estratégica; soluções do GEB não precisam depender de sua execução pessoal.
- Assuntos normativos e soluções especializadas de segurança do trabalho pertencem ao ambiente comercial e técnico do GEB Empresarial, não à identidade geral do grupo.
- GEB Tecnologia é a marca comercial da frente tecnológica; Compass Rose Systems é identificação técnica de desenvolvimento, publicação e entrega. Não criar uma segunda unidade institucional por causa do domínio técnico.
- Projetos pessoais, religiosos e sociais não migram automaticamente para a marca institucional.
- Uma área pode ser apresentada sem inventar faturamento, equipe, sede, certificados, indicadores ou resultados.

## 2. Arquitetura pública estável

| Camada | Destino | Responsabilidade editorial |
|---|---|---|
| Entrada institucional | `/` | Quem é o GEB, síntese de atuação, encaminhamentos, carreiras e parcerias |
| Identidade institucional | `/o-geb/` | Origem, fundamentos, funcionamento e visão de crescimento |
| Responsabilidade institucional | `/esg/` | Diretrizes e compromissos, separando intenção de evidência e resultado comprovado |
| Escolha da área | `/areas/` | Panorama das frentes, identificação por objetivo e links canônicos |
| Intermediação institucional | `/empresarial/`, `/educacao/`, `/saude/`, `/inclusao/`, `/tecnologia/` | Descrição permanente de capacidade e encaminhamento ao site especializado |
| Relações e expansão | `/parceiros/` | Modelos de parceria e público-alvo; condições de ofertas específicas no ambiente de GEB Parcerias |
| Talentos | `/carreiras/` | Apresentação da jornada profissional |
| Vagas | `/carreiras/vagas/` | Busca, classificação, estados e detalhes das oportunidades — camada dinâmica |
| Candidatura | `/carreiras/candidatura/` | ATS e consentimento; coleta orientada à vaga, dados pessoais protegidos |
| Atendimento | `/contato/` | Canal institucional e direcionamento por assunto |
| Acesso auxiliar | `/mapa-do-site/`, `/404.html` | Navegabilidade e recuperação |
| Publicação editorial | `https://blog.grupoeduardabispo.com.br/` | Fonte de artigos, categorias e atualização editorial; faixa integrada sem edição manual da home |
| Sites especializados | Subdomínios canônicos do GEB | Detalhamento comercial, equipes, parceiros, conteúdo e serviços da frente específica |

**Critério de permanência:** conteúdos capazes de mudar sem uma decisão institucional (preço, vaga, parceria, notícia, curso, produto, disponibilidade e condições de contratação) não devem ser codificados como promessa estática na home.

## 3. Fundação visual mantida

A identidade já aplicada utiliza composição editorial, preto e cinzas escuros, superfícies claras, acento dourado e tipografia Inter / Inter Tight. Manter essas escolhas sem importar uma nova biblioteca CSS ou iniciar um redesign.

**Tokens globais consolidados em um único `:root` no arquivo `styles.css`:**

- Base cromática: `--ink: #101010`; `--paper: #f5f2ec`; `--white: #ffffff`; `--gold: #b68a2d`; `--muted: #68635d`; `--line: rgba(16,16,16,.16)`.
- Tipografia: `--text: Inter` e `--display: Inter Tight`, com alternativas seguras.
- Superfícies: `--surface: #fff`; `--surface-soft: #eee9df`.
- Profundidade: `--shadow: 0 24px 70px rgba(16,16,16,.08)`.
- Contêiner e respiro lateral: `--max: 1380px`; `--pad: clamp(22px,4.5vw,68px)`.
- Reserva de foco para os próximos blocos: `--focus-color: #856a37`. Contraste e estados de interação deverão ser homologados posteriormente.

**Componentes existentes a preservar:** `site-header`, `desktop-nav`, `mobile-nav`, `site-footer--institutional`, `internal-hero`, `internal-hero-media`, cartões de atuação, links/CTAs, filtros de vagas e formulários ATS. As regras responsivas têm prioridade funcional sobre uma limpeza estética apressada.

## 4. Achados da auditoria do CSS

- Arquivo original auditado: **91.150 caracteres**.
- Existiam **dois blocos `:root`** com tokens complementares. Foram reunidos em um único ponto, sem alterar os valores anteriores.
- A inspeção textual identificou aproximadamente **831 blocos de declaração** e **148 seletores repetidos** ao longo da folha; **46 blocos `@media`**. Esses números são indicadores heurísticos de manutenção, não medidas de regras inválidas.
- Entre os seletores reestilizados em etapas diferentes aparecem `.internal-hero`, `.internal-hero-media`, `.site-footer--expanded`, `.home-opening__visual` e `.geb-showcase-hero__panel`.
- **Não remover seletores repetidos automaticamente:** parte dos casos ocorre dentro de media queries, sob especificidades distintas ou como sobrescritas intencionais.
- Há estruturas de home de gerações anteriores que devem ser classificadas como usadas/legadas antes de qualquer exclusão. Uma ausência no HTML da home não comprova inutilização em JS, páginas internas ou estados condicionais.
- Não foi introduzido CSS novo para alterar dimensão de header, botões ou layout das páginas, pois isso pertence aos Blocos 02 a 04.
- A home continha dois grafos `application/ld+json` com o mesmo conjunto de identificadores institucionais. Foi preservado o grafo mais completo e excluído o redundante.

## 5. Dependências funcionais — NÃO quebrar

1. `site.js`: renderização de cabeçalho, menu móvel e rodapé compartilhados, ano dinâmico, ativação de VLibras, filtros da página de vagas e faixa de três artigos do blog.
2. `carreiras/ats-form.js`: formulário do ATS, candidatura, parametrização por vaga, envio e geração de currículo; não foi modificado neste bloco.
3. `assets/blog-strip.css`: apresentação da faixa editorial integrada; preservar origem do iframe, comunicação de altura e tratamento de erros.
4. `.github/workflows/deploy.yml`: fluxo de deploy **manual** por `workflow_dispatch`; não foi acionado nem editado.
5. `.htaccess`, `robots.txt`, `sitemap.xml` e `404.html`: manter comportamento até verificação de rotas, redirecionamentos e hospedagem.
6. `README.md` e documentos em `.github/docs` não fazem parte da interface pública. O workflow exclui arquivos da pasta `.github` e o `README.md` da transferência FTP.

## 6. Fronteira entre blocos

- **Bloco 01 (este):** identificar dependências, unificar tokens, reduzir redundância comprovada e registrar arquitetura/design.
- **Bloco 02:** corrigir menu/cabeçalho/rodapé, estados acessíveis e links HTTP legados. Até lá, não pressupor links canônicos perfeitos.
- **Bloco 03:** ajustar home, ordem de leitura, narrativa e apresentação das áreas.
- **Bloco 04:** melhorar `/areas/` e páginas de intermediação para os braços especializados; uniformizar heros em moldura.
- **Bloco 05:** consolidar `/o-geb/`, `/esg/` e `/parceiros/`.
- **Bloco 06:** melhorar visibilidade real de vagas e filtros.
- **Bloco 07:** revisar UX, necessidade de dados pessoais, consentimento e integridade dos envios do ATS.
- **Bloco 08:** orientar contato conforme assunto sem impedir atendimento geral.
- **Bloco 09:** validar responsividade, navegação por teclado, VLibras, movimento reduzido, desempenho e contraste em navegadores.
- **Bloco 10:** teste ponta a ponta, revisão de redirects/SEO, status do deploy e homologação em produção.

## 7. Verificações, limites e pendências

**Validação estática esperada:** arquivos obrigatórios existentes; um `:root`; tokens únicos; `index.html` com um grafo JSON-LD válido e identificadores institucionais; páginas com estrutura `main` e título principal; elementos dependentes de `site.js` presentes; nenhum arquivo do ATS modificado.

**Ainda não homologado:** resultado visual em navegador real, largura/altura dos componentes em dispositivos, performance real, acessibilidade com tecnologia assistiva, integração ATS com backend, leitura dinâmica do blog, status do servidor de produção e execução do deploy.

A conferência automatizável está em `.github/scripts/check-foundation.mjs`; execute na raiz do repositório com `node .github/scripts/check-foundation.mjs` em ambiente com Node.js, sem instalar dependências. A revisão posterior deve comparar o resultado do código com a versão efetivamente hospedada.

**Observação:** alterações foram feitas diretamente na branch padrão do GitHub, mas o workflow de publicação é manual. Commit não é evidência de site publicado.


## 8. Evidência de verificação após as alterações

Conferência realizada diretamente sobre os arquivos atualizados no GitHub, por leitura remota e checagens estáticas equivalentes às regras do verificador:

- **16/16 rotas verificadas**: presença de `header`, `main`, `footer` e exatamente um `h1`; todas referenciam `site.js`.
- **28/28 verificações adicionais aprovadas**: um bloco global `:root`, 14 tokens únicos, um bloco JSON-LD válido com WebSite e Organization canônicos, presença dos módulos de navegação, rodapé, acessibilidade, vagas e blog em `site.js`, documentação, README e workflow manual.
- **Arquivos de negócio não alterados**: `carreiras/ats-form.js` e fluxo de deploy permaneceram intactos. O SHA do arquivo ATS conferido é `d4f551b572f0f54dbd041a2116744f2bab793715`.
- **Escopo do diff antes desta atualização documental:** `styles.css`, `index.html`, `README.md`, `.github/docs/FUNDACAO-UX-BLOCO-01.md` e `.github/scripts/check-foundation.mjs`. Nenhuma página especializada ou arquivo do ATS foi modificado.

**Limite da evidência:** o script Node versionado não foi executado em um clone local; sua lógica de verificação foi aplicada à leitura dos arquivos GitHub. Não foi realizado teste visual de navegador, teste de formulário com backend, auditoria Lighthouse ou confirmação de deploy. Essas verificações permanecem para os próximos blocos e para homologação final.
