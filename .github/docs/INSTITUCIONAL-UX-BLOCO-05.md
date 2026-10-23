# GEB Institucional — Bloco 05 · Narrativa institucional

**Data:** 23/10/2026  
**Repositório:** `aeduardasantana/grupoeduardabispo`  
**Rotas:** `/o-geb/`, `/esg/` e `/parceiros/`

## Posicionamento adotado

O GEB é a marca institucional que organiza e desenvolve atuações em negócios, educação, saúde, inclusão e tecnologia, originadas da trajetória de Eduarda Bispo, sua fundadora. A identidade institucional permite participação de profissionais, equipes e parceiros em entregas, sem pressupor que toda execução dependa pessoalmente da fundadora. A palavra "Grupo" não significa holding ou múltiplas empresas juridicamente independentes.

**Restrições:** não declarar números, políticas, certificações, filiações ou resultados não comprovados. Não colocar produtos, preços, cursos e parceiros comerciais específicos no institucional; não apresentar a NR-1 fora do GEB Empresarial.

## /o-geb/ — decisões editoriais

- Hero: explica o que é o GEB, sem frases genéricas de expansão.
- Natureza: uma marca institucional com frentes especializadas, sem sugerir holding.
- Atuação: seis caminhos atuais por categoria, com direcionamento a cada LP interna.
- Origem e direção: Eduarda como fundadora, origem intelectual e responsável por visão estratégica; possibilidade de participação de outras pessoas nas entregas.
- Modelo organizacional: processos, pessoas e tecnologia como fundamentos de estrutura, não como indicadores de escala concretizada.
- Desenvolvimento: crescimento condicionado à coerência, execução e responsabilidades.

## /esg/ — decisões editoriais

- Princípios ambientais, sociais e de governança separados em três cartões.
- Compromissos apresentados como direção de desenvolvimento, sem afirmar que todas as políticas já foram formalizadas.
- Resultados explicitamente condicionados a documentação verificável.
- Mantidas as referências públicas à Rede Brasil do Pacto Global, aos Dez Princípios do UN Global Compact e aos 17 ODS da ONU, com ressalva de que referência não representa adesão, filiação, certificação, endosso ou reconhecimento.
- Retirada do conteúdo ESG a menção operacional específica a riscos psicossociais, tema da frente Empresarial.

## /parceiros/ — decisões editoriais

- Público: empreendedores, empresários, empresas, instituições de ensino, outras organizações, profissionais e especialistas.
- Seis modalidades institucionais: ampliação de portfólio, formação, projetos conjuntos, representação, rede de especialistas e relações institucionais.
- Programas e marcas comerciais antes nomeados na página institucional (universidade corporativa, bolsa de estudo, estruturação de centro e telemedicina comercial) **não foram apresentados como ofertas ativas nesta página**. Sua elegibilidade e disponibilidade devem ser verificadas no ambiente especializado.
- Direcionamento comercial configurado para `https://gebparcerias.grupoeduardabispo.com.br/`. Esse endereço é o destino planejado para a frente; **a acessibilidade externa do domínio não foi confirmada pela consulta pública**. A confirmação DNS, HTTPS e conteúdo de destino faz parte da homologação.
- CTA secundário leva a `/contato/`, mantendo uma via institucional mesmo se o ambiente especializado estiver em preparação.

## Interface e acessibilidade

- Novo CSS exclusivo: `assets/institutional05.css`, utilizando tokens de `styles.css`, sem alterar outros braços.
- Hierarquia consistente: breadcrumbs, hero, título único (H1), painéis e cartões, áreas escuras e claras, chamada final e links de retorno ao institucional.
- Hero tipográfico institucional de O GEB e ESG, sem fotografias artificiais; a foto contextual já aprovada em Parcerias foi preservada.
- Breakpoints CSS: 1100, 860 e 580 px, layouts de 3/2/1 colunas e estilo para movimento reduzido.
- Cabeçalho, menu mobile, rodapé, Blog GEB, VLibras e ATS continuam implementados pelo `site.js` existente, sem modificações.
- Cada página possui URL canônica HTTPS própria e links externos com `rel="noopener noreferrer"`.

## Arquivos

1. `o-geb/index.html`
2. `esg/index.html`
3. `parceiros/index.html`
4. `assets/institutional05.css`
5. `.github/scripts/check-institutional05.mjs`
6. `.github/workflows/deploy.yml` — novo passo de teste estático antes do FTP, preservando o disparo controlado
7. `.github/docs/INSTITUCIONAL-UX-BLOCO-05.md` — este relatório
8. `README.md`
9. `.github/deploy-now.txt` — acionamento pontual da publicação após os testes

## Validação

Na inspeção direta do código pelo conector GitHub, 163 verificações estáticas passaram sem erro: hierarquia HTML, IDs e rótulos, rotas internas existentes, navegação, CSS responsivo, módulos compartilhados e regras de conteúdo. O verificador em `.github/scripts/check-institutional05.mjs` permite repetição em Node.js e foi incorporado ao workflow de deploy.

**Não foram realizados** testes visuais em navegador real nem testes com leitor de telas. A aprovação do workflow confirma sua execução e o upload FTP, não substitui uma inspeção visual do domínio publicado.

## Pendências de homologação

- Renderização real em 320, 375, 768, 1024 e 1440 px; verificar espaçamento, título e foco.
- Abrir todas as rotas após o deploy e verificar cache de CSS, VLibras, faixa editorial e navegação mobile.
- Validar `gebparcerias.grupoeduardabispo.com.br` externamente (DNS, HTTPS, página de destino).
- Confirmar acesso aos links de Pacto Global e ONU após a publicação.
- Conferir eventuais inconsistências de conteúdo sobre compromissos ESG frente a evidências institucionais futuras.

**Nota:** commits e publicação são estados distintos; confirmar o resultado do GitHub Actions e o domínio antes de declarar que a versão está online.
