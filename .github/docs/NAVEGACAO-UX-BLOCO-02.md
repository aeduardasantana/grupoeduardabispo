# GEB Institucional — Bloco 02: Navegação Global

Data da execução: **23 de outubro de 2026**.  
Repositório: \`aeduardasantana/grupoeduardabispo\`.  
Domínio institucional: https://grupoeduardabispo.com.br/

## Decisões de arquitetura e UX
- Cinco entradas no cabeçalho: **O GEB**, **Áreas de atuação**, **Parcerias e Expansão**, **Carreiras** e **Contato**.
- **ESG** mantida em \`/esg/\` como item secundário do rodapé institucional, sem concorrência no primeiro nível.
- **Blog GEB** acessível no rodapé, com a faixa editorial dinâmica preservada; não se cria outro blog dentro deste repositório.
- Áreas do rodapé levam primeiro às LPs institucionais internas; cada LP encaminha ao respectivo subdomínio especializado.
- Menu complementar de Carreiras acessível por botão nativo, com \`aria-controls\`, \`aria-expanded\` e estados de foco, hover e seleção.
- Menu mobile com controle de abrir/fechar, Escape, gerenciamento básico de foco e bloqueio da rolagem de fundo. O foco de Tab circula entre os links e o controle de fechamento enquanto o menu estiver aberto.
- Nas 16 páginas públicas, inclusão do atalho **Ir para o conteúdo principal** e identificação estável de \`main#geb-main\`.
- Cabeçalho estático de referência preservado em cada página; JavaScript compartilha cabeçalho, menu mobile e rodapé. O componente final é gerado pela função \`initInstitutionalHeader\` e \`initInstitutionalFooter\` de \`site.js\`.
- URLs antigas com prefixo HTTP e variantes \`www\` de subdomínios conhecidos foram substituídas por HTTPS e host canônico.
- Nenhum texto comercial, oferta, serviço de outra marca ou conteúdo do ATS foi reescrito neste bloco.

## Arquivos alterados
- \`site.js\`: componente compartilhado de navegação; estados do submenu e mobile; link de retorno ao topo corrigido para o conteúdo existente; rodapé e links das áreas.
- \`styles.css\`: regras não destrutivas de foco, áreas de toque, menu mobile, dropdown e movimento reduzido, aplicadas após os estilos legados.
- Todas as **16 páginas HTML** públicas da árvore do repositório: cabeçalho de referência, menu móvel, atalho de teclado, ID de conteúdo, versões dos assets e normalização pontual de links.
- Este documento e o verificador \`.github/scripts/check-navigation.mjs\` (não transferidos ao público pelo workflow FTP atual).

## Testes realizados
**Leitura integral dos arquivos GitHub e verificação estática:**
- **16/16 páginas** com \`header\`, \`main#geb-main\`, \`footer\`, link de salto, nav mobile e referências versionadas a \`site.js\` / \`styles.css\`.
- **16/16 páginas** com exatamente um H1, sem links internos apontando para rotas inexistentes na árvore local.
- Nenhuma referência HTTP ou variante \`www\` legada conhecida entre os links de páginas.
- **13/13 cenários de comportamento simulados em V8**: menu com cinco opções, hierarquia secundária de ESG, estado ativo de Carreiras, menu fechado inicialmente, abertura por clique, bloqueio de rolagem, ciclo de Tab, Escape e retorno de foco, controle do submenu, Escape no submenu, abertura/fechamento por hover e fechamento ao redimensionar.
- JavaScript interpretado sintaticamente sem erros; os módulos VLibras, painel de vagas, rodapé e integração editorial continuam no \`site.js\`.
- A integração \`carreiras/ats-form.js\`, a lógica de publicação e os repositórios das frentes não foram alterados.

## Restrições da validação
Esses testes **não constituem homologação de navegador real**. A tentativa de abrir a home publicada pelo serviço de consulta retornou erro 502; alguns endereços especializados não puderam ser consultados pelo serviço. Isso **não comprova indisponibilidade dos sites** e não permite declarar publicação.

## Pendências antes de homologar em produção
1. Conferir a navegação em navegador real (hover, clique, Tab, Shift+Tab, Space, Enter, Escape, foco e leitura de tela).
2. Testar largura de 320, 375, 768, 1024 e 1440 px, menu longo e CSS efetivamente carregado.
3. Validar destino HTTPS e redirecionamentos no servidor dos domínios externos.
4. Testar sem dados pessoais reais a página de vagas, o ATS e a faixa automática do Blog GEB.
5. Confirmar conclusão do deploy manual da Locaweb, versão atual do JS/CSS e eventuais problemas de cache.
6. Em caso de falha, corrigir sobre a base do Bloco 02; **não passar adiante problemas de menu ou atalhos**.

**Situação:** código atualizado e testes estáticos/simulados aprovados; publicação e testes de navegador ainda pendentes.
