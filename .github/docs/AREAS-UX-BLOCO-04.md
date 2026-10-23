# Bloco 04 — Experiência das Áreas de Atuação

**Data:** 23 de outubro de 2026  
**Repositório:** `aeduardasantana/grupoeduardabispo`  
**Escopo:** `/areas/`, `/empresarial/`, `/educacao/`, `/saude/`, `/inclusao/` e `/tecnologia/`  
**Status:** alterações executadas no GitHub. Publicação em produção e testes visuais reais não confirmados.

## Decisões institucionais

1. O GEB permanece uma marca institucional integradora; suas frentes não são apresentadas como empresas juridicamente independentes.
2. O diretório `/areas/` apresenta as cinco frentes especializadas e o encaminhamento institucional para `/parceiros/`. Parcerias e Expansão tem página própria e será aprimorada no Bloco 05.
3. Cada página especializada descreve, na ordem: finalidade, público atendido, capacidades principais, destino especializado e retorno ao institucional.
4. Conteúdo específico e mutável (curso, condições de teleatendimento, produto, contrato, preço, disponibilidade) permanece nos ambientes próprios. Sem catálogos replicados.
5. Os assuntos de NR-1 e diagnóstico de fatores psicossociais foram mantidos somente na frente Empresarial.
6. GEB Tecnologia é a marca comercial; Compass Rose Systems é o ambiente técnico de desenvolvimento e entrega, não uma nova área do grupo.
7. Inclusão mantém Libras, capacitação, acessibilidade comunicacional e projetos; nenhuma oferta ou CTA de e-mail foi inventada.

## Arquitetura de interface

- **Breadcrumbs**: Início → Áreas de atuação → Frente, com links funcionais de retorno.
- **Hero compartilhado**: título único (H1), descrição sintética, CTA para site especializado e CTA para `/areas/`.
- **Moldura das imagens**: fotografia contextual diferente em cada página, proporção 6:5 no desktop e no mobile, tratamento uniforme de borda, espaçamento, legenda, recorte e sombra. `width`/`height` definidos, `alt` contextual e prioridade de carregamento no hero.
- **Públicos atendidos**: introdução e painel de três contextos relevantes.
- **Capacidades**: três cartões para mostrar o campo da frente sem replicar catálogo de serviços.
- **Próximo passo**: reforça o destino externo HTTPS, abre em nova aba com `rel="noopener noreferrer"` e mantém o contato institucional acessível.
- **Rodapé**: componente compartilhado de `site.js`, com acesso ao Blog GEB. Faixa editorial dinâmica e VLibras permanecem intocados.
- **SEO**: cada página recebeu `canonical` explícito no domínio institucional, título e descrição próprios.
- **CSS escopado**: `assets/areas04.css` depende dos tokens do `styles.css` e afeta apenas as seis páginas. Responsividade em 1120, 850 e 580 px; grids progressivos em três, duas e uma colunas.

## Imagens

| Rota | Tema | Fonte |
|---|---|---|
| `/areas/` | Trabalho colaborativo | Unsplash, foto já presente na rota |
| `/empresarial/` | Reunião e planejamento | Unsplash, foto já presente na rota |
| `/educacao/` | Aprendizagem em grupo | Unsplash, foto já presente na rota |
| `/saude/` | Teleconsulta por computador | Pexels, fotografia gratuita identificada no acervo, ID 7195084 |
| `/inclusao/` | Comunicação por língua de sinais | Pexels, foto já presente na rota |
| `/tecnologia/` | Componentes de tecnologia digital | Unsplash, foto já presente na rota |

Foram verificados os `src` de cada hero no código: **6 URLs diferentes**, sem repetir imagens com outras páginas públicas do mesmo repositório no momento da auditoria. A renderização em navegador, disponibilidade da CDN e eventuais licenças/atribuições aplicáveis devem ser conferidas antes da homologação.

## Arquivos modificados

- `areas/index.html` — diretório de seis áreas com cartões completos e introdução adequada.
- `empresarial/index.html` — públicos, gestão, processos, liderança e riscos psicossociais.
- `educacao/index.html` — formação profissional, acadêmica e corporativa.
- `saude/index.html` — separação entre telessaúde, psicoterapia e acessibilidade.
- `inclusao/index.html` — Libras, interpretação, capacitação e acessibilidade comunicacional.
- `tecnologia/index.html` — sistemas, automação e experiências digitais.
- `assets/areas04.css` — design system e responsividade compartilhada.
- `.github/scripts/check-areas04.mjs` — teste estático reutilizável.
- `.github/docs/AREAS-UX-BLOCO-04.md` — este documento.
- `README.md` — vínculo da documentação e testes.

## Verificações estáticas concluídas

- **234 verificações aprovadas** durante a execução: integridade HTML básica, um H1 por página, breadcrumbs e retornos, CSS e JS globais, descrições, seis imagens diferentes, destinos canônicos, links internos com rotas existentes, duas saídas HTTPS para cada site especializado, três capacidades e públicos por frente, CSS responsivo e movimento reduzido.
- Complementarmente, imagens das outras dez páginas públicas foram inspecionadas no código para procurar repetição; não houve conflito com as seis imagens desta etapa.
- O Bloco 04 não modificou `site.js`, `styles.css`, o ATS, a home, os subdomínios especializados nem o workflow de deploy.

O script `node .github/scripts/check-areas04.mjs` foi registrado para repetir verificações estáticas em ambiente Node, sem rede nem dependências. A execução desse script no ambiente real do repositório ainda não foi realizada; a checagem equivalente ocorreu por leitura de arquivos no conector GitHub.

## Encaminhamentos externos

Destinos escritos e auditados nos arquivos:

- `https://gebempresarial.grupoeduardabispo.com.br/`
- `https://gebeducacao.grupoeduardabispo.com.br/`
- `https://gebsaude.grupoeduardabispo.com.br/`
- `https://gebinclusao.grupoeduardabispo.com.br/`
- `https://gebtecnologia.grupoeduardabispo.com.br/`

O serviço de consulta pública retornou conteúdo legível de **GEB Educação**. Para Empresarial, Saúde, Inclusão e Tecnologia, as consultas não tiveram resultado conclusivo; isso não prova indisponibilidade. Não foi possível verificar a navegação real dos destinos finais por navegador.

## Pendências de homologação

1. Acessar as seis páginas com navegador real, conferir imagens, cabeçalhos, fontes, alinhamentos, molduras, altura dos heros e transições.
2. Testar especificamente resoluções de 320, 375, 768, 1024 e 1440 pixels, navegação por teclado, leitores de tela e comportamento de foco.
3. Validar redirecionamentos e status HTTPS de cada site especializado, inclusive no celular.
4. Testar faixa do Blog GEB, menu e VLibras em cada rota após publicação.
5. Confirmar o deploy manual do workflow FTP/Locaweb. A atualização no GitHub não implica publicação.
6. Evoluir `/parceiros/` no **Bloco 05**, mantendo a mesma coerência institucional.

**Conclusão:** Bloco 04 concluído no código e na validação estática; publicação e homologação visual pendentes.
