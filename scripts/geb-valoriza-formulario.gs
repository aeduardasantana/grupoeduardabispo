/**
 * GEB VALORIZA — FORMULÁRIO DE CANDIDATURA
 * Execute UMA VEZ criarFormularioGEBValoriza() em Extensões > Apps Script
 * da planilha "GEB VALORIZA — Candidaturas e Acompanhamento (Restrito)".
 *
 * O código cria um Google Forms vinculado à planilha, cria um registro
 * gerencial em Acompanhamento e avisa o e-mail institucional.
 * As respostas completas ficam na aba criada automaticamente pelo Forms.
 *
 * NÃO implantar como Web App /exec: este script usa FormApp para construir
 * um formulário nativo e evitar dependência do PHP e problemas de CORS.
 */

const GEB_VALORIZA = Object.freeze({
  PASTA_DRIVE: '1mSTmwqJd2lpAlxpqamSQycQEM8yTES_b',
  E_MAIL_AVISO: 'contato@grupoeduardabispo.com.br',
  ABA_GESTAO: 'Acompanhamento',
  PROP_ID_FORM: 'GEB_VALORIZA_FORM_ID',
  FUSO: 'America/Sao_Paulo'
});

/**
 * Cria (ou recupera) o formulário, vincula respostas e instala o gatilho.
 * A execução é idempotente: repetir não deve criar cópias do mesmo formulário.
 */
function criarFormularioGEBValoriza() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  if (!planilha) throw new Error('Abra a planilha do GEB Valoriza e acesse Extensões > Apps Script.');

  const props = PropertiesService.getScriptProperties();
  let formulario;
  const existente = props.getProperty(GEB_VALORIZA.PROP_ID_FORM);
  if (existente) {
    formulario = FormApp.openById(existente);
  } else {
    formulario = FormApp.create('GEB Valoriza — Conte a história do seu negócio', true);
    props.setProperty(GEB_VALORIZA.PROP_ID_FORM, formulario.getId());
  }
  props.setProperty('GEB_VALORIZA_SPREADSHEET_ID', planilha.getId());

  formulario.setTitle('GEB Valoriza — Conte a história do seu negócio');
  formulario.setDescription(
    'Por trás de cada empresa existe uma história que merece ser conhecida. ' +
    'Candidate seu negócio a seis meses de valorização digital patrocinada pelo GEB, ' +
    'com edição de artes estáticas e agendamento de até 20 publicações por mês ' +
    'pelo GEB Tecnologia. A inscrição não garante a seleção. ' +
    'Conheça as condições em https://grupoeduardabispo.com.br/valoriza/ . ' +
    'Não envie senhas, documentos pessoais nem dados de clientes.'
  );
  formulario.setCollectEmail(false);
  formulario.setLimitOneResponsePerUser(false);
  formulario.setAllowResponseEdits(false);
  formulario.setShowLinkToRespondAgain(false);
  formulario.setPublishingSummary(false);
  formulario.setProgressBar(true);
  formulario.setConfirmationMessage(
    'Sua história foi recebida pelo GEB Valoriza. A candidatura será analisada. ' +
    'O envio não garante contemplação. O contato será pelo e-mail informado.'
  );

  // Só adiciona perguntas quando a estrutura ainda está vazia.
  if (formulario.getItems().length === 0) montarPerguntasValoriza_(formulario);

  // As respostas ficam no Google Forms e em uma aba gerada automaticamente na planilha.
  let destino;
  try { destino = formulario.getDestinationId(); } catch (erro) { destino = ''; }
  if (destino !== planilha.getId()) {
    formulario.setDestination(FormApp.DestinationType.SPREADSHEET, planilha.getId());
  }

  const aba = planilha.getSheetByName(GEB_VALORIZA.ABA_GESTAO);
  if (!aba) throw new Error('A aba Acompanhamento não foi encontrada na planilha.');

  const jaTemGatilho = ScriptApp.getProjectTriggers().some(g =>
    g.getHandlerFunction() === 'registrarCandidaturaGEBValoriza'
  );
  if (!jaTemGatilho) {
    ScriptApp.newTrigger('registrarCandidaturaGEBValoriza')
      .forForm(formulario)
      .onFormSubmit()
      .create();
  }

  // Quando possível, armazena o formulário na pasta institucional do programa.
  try {
    DriveApp.getFileById(formulario.getId())
      .moveTo(DriveApp.getFolderById(GEB_VALORIZA.PASTA_DRIVE));
  } catch (erro) {
    console.warn('O formulário foi criado, mas não foi possível movê-lo de pasta: ' + erro);
  }

  if (formulario.supportsAdvancedResponderPermissions()) {
    formulario.setPublished(true);
  }
  formulario.setAcceptingResponses(true);

  const links = {
    formulario_para_respostas: formulario.getPublishedUrl(),
    formulario_para_edicao: formulario.getEditUrl(),
    planilha: planilha.getUrl(),
    formulario_id: formulario.getId()
  };
  console.log('GEB VALORIZA — LINKS GERADOS:\n' + JSON.stringify(links, null, 2));
  return links;
}

/** Constrói os campos com as mesmas perguntas da landing page do GEB. */
function montarPerguntasValoriza_(f) {
  const titulo = (t, ajuda) => f.addSectionHeaderItem().setTitle(t).setHelpText(ajuda || '');
  const simples = (t, obrigatorio = true, ajuda = '') =>
    f.addTextItem().setTitle(t).setHelpText(ajuda).setRequired(obrigatorio);
  const longo = (t, ajuda) =>
    f.addParagraphTextItem().setTitle(t).setHelpText(ajuda || '').setRequired(true);
  const lista = (t, opcoes) =>
    f.addListItem().setTitle(t).setChoiceValues(opcoes).setRequired(true);
  const aceite = (t) =>
    f.addCheckboxItem().setTitle(t).setChoiceValues(['Sim, confirmo']).setRequired(true);

  titulo('01 — SOBRE A EMPRESA', 'Queremos conhecer seu negócio e onde ele atua.');
  simples('Nome do negócio');
  simples('O que sua empresa faz?');
  simples('Cidade');
  lista('Estado (UF)', ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT',
    'MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']);
  simples('Rede social da empresa', true, 'Informe @perfil ou URL; nunca forneça senhas.');

  titulo('02 — QUEM CONTA ESSA HISTÓRIA?', 'Preencha seus dados para que o GEB possa informar o andamento.');
  simples('Seu nome');
  lista('Sua relação com a empresa', ['Proprietário(a)','Sócio(a)','Administrador(a)',
    'Responsável autorizado','Outro vínculo autorizado']);
  const email = f.addTextItem().setTitle('E-mail para contato').setRequired(true);
  email.setValidation(FormApp.createTextValidation()
    .requireTextIsEmail().setHelpText('Informe um endereço de e-mail válido.').build());
  simples('Telefone para contato (opcional)', false);

  titulo('03 — A HISTÓRIA QUE MERECE SER CONTADA',
    'Escreva com suas próprias palavras. Histórias verdadeiras têm mais valor do que textos publicitários.');
  longo('Como seu negócio começou?',
    'O que inspirou a ideia, quem participou e como foram os primeiros passos?');
  longo('Quais desafios você precisou enfrentar para continuar?',
    'Conte as dificuldades e o que motivou sua empresa a seguir em frente.');
  longo('Que diferença sua empresa faz para os clientes ou para a comunidade?',
    'Qual problema resolve? Que contribuição seu trabalho oferece?');
  longo('Por que sua empresa merece seis meses de valorização digital patrocinada pelo GEB?',
    'Como esse apoio ajudaria a mostrar sua história e organizar as publicações?');

  titulo('04 — COMPROMISSOS DO PROGRAMA',
    'O GEB patrocina. O GEB Tecnologia executa. A empresa mantém a autoria e aprova o que será publicado.');
  aceite('Se contemplada, minha empresa fornecerá todos os textos, imagens, informações e vídeos prontos de cada postagem com pelo menos 35 dias corridos de antecedência da data de publicação.');
  aceite('Confirmo que tenho autorização para inscrever esta empresa e fornecer as informações apresentadas.');
  aceite('Li as informações de privacidade em https://grupoeduardabispo.com.br/valoriza/#privacidade e sei que a candidatura não garante a contemplação.');
  f.addMultipleChoiceItem()
    .setTitle('Deseja receber comunicações comerciais futuras sobre soluções do GEB? (opcional)')
    .setChoiceValues(['Sim, autorizo','Não autorizo'])
    .setRequired(false);
}

/**
 * Gatilho instalável onFormSubmit do Google Forms.
 * Salva dados essenciais na aba Acompanhamento. A história completa já fica
 * preservada no formulário e na aba de respostas criada pelo próprio Google.
 */
function registrarCandidaturaGEBValoriza(e) {
  if (!e || !e.response) throw new Error('Esta função é acionada pelo envio do Google Forms.');
  const idPlanilha = PropertiesService.getScriptProperties().getProperty('GEB_VALORIZA_SPREADSHEET_ID');
  if (!idPlanilha) throw new Error('Execute criarFormularioGEBValoriza() primeiro.');

  const resposta = e.response;
  const respostaId = resposta.getId() || Utilities.getUuid();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const aba = SpreadsheetApp.openById(idPlanilha).getSheetByName(GEB_VALORIZA.ABA_GESTAO);
    if (!aba) throw new Error('Aba Acompanhamento inexistente.');
    const fim = aba.getLastRow();
    if (fim >= 2 && aba.getRange(2, 1, fim - 1, 1)
      .createTextFinder(respostaId).matchEntireCell(true).findNext()) return;

    const dados = {};
    resposta.getItemResponses().forEach(item => {
      dados[item.getItem().getTitle()] = String(item.getResponse() || '').trim();
    });
    const safe = text => {
      const s = String(text || '').replace(/[\r\n]+/g, ' ').slice(0, 500);
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };
    const protocolo = 'GEBV-' + Utilities.formatDate(new Date(), GEB_VALORIZA.FUSO, 'yyyyMMdd') +
      '-' + Utilities.getUuid().slice(0, 6).toUpperCase();
    const empresa = safe(dados['Nome do negócio']);
    const email = safe(dados['E-mail para contato']);
    aba.appendRow([
      respostaId,
      protocolo,
      resposta.getTimestamp() || new Date(),
      empresa,
      safe(dados['O que sua empresa faz?']),
      safe(dados['Cidade']) + '/' + safe(dados['Estado (UF)']),
      safe(dados['Seu nome']),
      email,
      safe(dados['Rede social da empresa']),
      'Recebida', '', '', '', '', ''
    ]);
    // Notificação é acessória; se falhar, a candidatura continua salva.
    try {
      MailApp.sendEmail({
        to: GEB_VALORIZA.E_MAIL_AVISO,
        subject: 'GEB Valoriza — nova candidatura ' + protocolo,
        body: 'Uma candidatura foi registrada com sucesso.\n' +
          'Protocolo: ' + protocolo + '\n' +
          'Empresa: ' + empresa + '\n' +
          'E-mail: ' + email + '\n' +
          'Acesse a planilha restrita do GEB Valoriza para analisar.\n' +
          SpreadsheetApp.openById(idPlanilha).getUrl()
      });
    } catch (erroMail) {
      console.warn('Candidatura registrada, mas a notificação por e-mail falhou: ' + erroMail);
    }
  } finally {
    lock.releaseLock();
  }
}
