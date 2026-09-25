const ATS = {
  SPREADSHEET_ID: '1UO5OPjbJUZz6CtvP8FWEQD3qhc9HRpx-CUy7n09n_tU',
  SHEET_CANDIDATOS: 'CANDIDATOS',
  SHEET_VAGAS: 'VAGAS',
  ROOT_FOLDER_ID: '1qKks6SQVaCMQ0TN1kjOwoSh80RnCsNP8',
  CURRICULOS_FOLDER_ID: '14UVA48qly8B0zWIoJEmCmjTzFNhzV0Pi',
  MAX_FILE_BYTES: 5 * 1024 * 1024,
  ALLOWED_MIME_TYPES: ['application/pdf']
};

function doGet() {
  return jsonResponse_({ ok: true, service: 'GEB ATS', version: '1.0.0' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    const p = e && e.parameter ? e.parameter : {};
    if (p.website) return jsonResponse_({ ok: true }); // honeypot

    validateRequired_(p);
    validateConsent_(p);

    const file = saveResume_(p);
    const id = createCandidateId_();
    const now = new Date();

    const ss = SpreadsheetApp.openById(ATS.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ATS.SHEET_CANDIDATOS);
    if (!sheet) throw new Error('Aba CANDIDATOS não encontrada.');

    const row = [
      id,
      now,
      clean_(p.vaga),
      clean_(p.area),
      clean_(p.nome),
      clean_(p.dataNascimento),
      clean_(p.email),
      clean_(p.telefone),
      clean_(p.cidade),
      clean_(p.uf),
      clean_(p.possuiCnh),
      clean_(p.categoriaCnh),
      clean_(p.linkedin),
      clean_(p.escolaridade),
      clean_(p.curso),
      clean_(p.instituicao),
      clean_(p.situacaoFormacao),
      clean_(p.ultimoCargo),
      clean_(p.empresaRecente),
      clean_(p.tempoExperiencia),
      clean_(p.disponibilidade),
      clean_(p.pretensaoSalarial),
      clean_(p.modeloTrabalho),
      clean_(p.resumo),
      file.url,
      'Recebido',
      'SIM',
      clean_(p.origem || 'Site institucional'),
      ''
    ];

    sheet.appendRow(row);

    appendChildRows_(ss, id, p);

    try {
      sendCandidateReceipt_(p, id);
      sendInternalNotice_(p, id, file.url);
    } catch (mailError) {
      console.error('Falha no e-mail:', mailError);
    }

    return jsonResponse_({
      ok: true,
      id,
      message: 'Candidatura recebida com sucesso.'
    });

  } catch (error) {
    console.error(error);
    return jsonResponse_({
      ok: false,
      message: error.message || 'Não foi possível registrar a candidatura.'
    });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function appendChildRows_(ss, candidateId, p) {
  const formacoes = parseJsonArray_(p.formacoes);
  const cursos = parseJsonArray_(p.cursos);
  const experiencias = parseJsonArray_(p.experiencias);

  appendRows_(ss.getSheetByName('FORMACAO'), formacoes.map(item => [
    candidateId,
    clean_(item.nivel),
    clean_(item.curso),
    clean_(item.instituicao),
    clean_(item.situacao),
    clean_(item.anoInicio),
    clean_(item.anoConclusao),
    clean_(item.observacoes)
  ]));

  appendRows_(ss.getSheetByName('CURSOS'), cursos.map(item => [
    candidateId,
    clean_(item.nome),
    clean_(item.instituicao),
    clean_(item.cargaHoraria),
    clean_(item.ano),
    clean_(item.certificado),
    clean_(item.observacoes)
  ]));

  appendRows_(ss.getSheetByName('EXPERIENCIAS'), experiencias.map(item => [
    candidateId,
    clean_(item.empresa),
    clean_(item.cargo),
    clean_(item.inicio),
    clean_(item.fim),
    clean_(item.atual),
    clean_(item.atividades),
    clean_(item.segmento),
    clean_(item.observacoes)
  ]));
}

function appendRows_(sheet, rows) {
  if (!sheet || !rows || !rows.length) return;
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function parseJsonArray_(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function validateRequired_(p) {
  const required = {
    vaga: 'Vaga',
    nome: 'Nome completo',
    email: 'E-mail',
    telefone: 'Telefone',
    cidade: 'Cidade',
    uf: 'UF',
    escolaridade: 'Escolaridade',
    disponibilidade: 'Disponibilidade',
    curriculoNome: 'Currículo',
    curriculoBase64: 'Arquivo do currículo',
    curriculoMime: 'Tipo do arquivo'
  };

  Object.keys(required).forEach(key => {
    if (!String(p[key] || '').trim()) {
      throw new Error('Campo obrigatório: ' + required[key] + '.');
    }
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(p.email))) {
    throw new Error('Informe um e-mail válido.');
  }
}

function validateConsent_(p) {
  if (String(p.consentimento || '').toLowerCase() !== 'sim') {
    throw new Error('É necessário aceitar o tratamento dos dados para participar do processo seletivo.');
  }
}

function saveResume_(p) {
  const mime = String(p.curriculoMime || '');
  if (ATS.ALLOWED_MIME_TYPES.indexOf(mime) === -1) {
    throw new Error('Envie o currículo em PDF.');
  }

  const raw = String(p.curriculoBase64 || '').replace(/^data:.*?;base64,/, '');
  const bytes = Utilities.base64Decode(raw);

  if (bytes.length > ATS.MAX_FILE_BYTES) {
    throw new Error('O currículo deve ter no máximo 5 MB.');
  }

  const vaga = safeName_(p.vaga || 'Banco de Talentos');
  const root = DriveApp.getFolderById(ATS.CURRICULOS_FOLDER_ID);
  const folder = getOrCreateFolder_(root, vaga);

  const timestamp = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyyMMdd-HHmmss');
  const candidate = safeName_(p.nome || 'Candidato');
  const filename = candidate + ' - ' + vaga + ' - ' + timestamp + '.pdf';

  const blob = Utilities.newBlob(bytes, mime, filename);
  const file = folder.createFile(blob);

  return {
    id: file.getId(),
    url: file.getUrl(),
    name: filename
  };
}

function getOrCreateFolder_(parent, name) {
  const folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

function createCandidateId_() {
  const stamp = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyyMMdd');
  const suffix = Utilities.getUuid().split('-')[0].toUpperCase();
  return 'GEB-' + stamp + '-' + suffix;
}

function clean_(value) {
  return String(value == null ? '' : value).trim().replace(/[\u0000-\u001F\u007F]/g, ' ');
}

function safeName_(value) {
  const clean = clean_(value)
    .replace(/[\\/:*?"<>|#%{}~&]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.substring(0, 90) || 'Sem nome';
}

function sendCandidateReceipt_(p, id) {
  MailApp.sendEmail({
    to: clean_(p.email),
    subject: 'GEB - Candidatura recebida - ' + clean_(p.vaga),
    htmlBody:
      '<p>Olá, ' + htmlEscape_(p.nome) + '.</p>' +
      '<p>Recebemos sua candidatura para <strong>' + htmlEscape_(p.vaga) + '</strong>.</p>' +
      '<p>Protocolo: <strong>' + id + '</strong>.</p>' +
      '<p>O envio do currículo não representa garantia de convocação ou contratação.</p>' +
      '<p>GEB</p>',
    name: 'GEB - Carreiras'
  });
}

function sendInternalNotice_(p, id, resumeUrl) {
  MailApp.sendEmail({
    to: 'contato@grupoeduardabispo.com.br',
    subject: 'ATS - NOVA CANDIDATURA - ' + clean_(p.vaga),
    htmlBody:
      '<p><strong>Nova candidatura recebida.</strong></p>' +
      '<p>Protocolo: ' + id + '<br>' +
      'Vaga: ' + htmlEscape_(p.vaga) + '<br>' +
      'Nome: ' + htmlEscape_(p.nome) + '<br>' +
      'E-mail: ' + htmlEscape_(p.email) + '<br>' +
      'Telefone: ' + htmlEscape_(p.telefone) + '</p>' +
      '<p><a href="' + resumeUrl + '">Abrir currículo no Drive</a></p>',
    name: 'GEB - ATS'
  });
}

function htmlEscape_(value) {
  return clean_(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}