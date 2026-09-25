const ATS = {
  SPREADSHEET_ID: '1UO5OPjbJUZz6CtvP8FWEQD3qhc9HRpx-CUy7n09n_tU',
  SHEET_CANDIDATOS: 'CANDIDATOS',
  SHEET_VAGAS: 'VAGAS',
  ROOT_FOLDER_ID: '1qKks6SQVaCMQ0TN1kjOwoSh80RnCsNP8',
  CURRICULOS_FOLDER_ID: '14UVA48qly8B0zWIoJEmCmjTzFNhzV0Pi',
  MAX_FILE_BYTES: 5 * 1024 * 1024,
  ALLOWED_MIME_TYPES: ['application/pdf'],
  TIMEZONE: 'America/Sao_Paulo'
};

function doGet() {
  return jsonResponse_({
    ok: true,
    service: 'GEB ATS',
    version: '2.0.0'
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(20000);

    const p = e && e.parameter ? e.parameter : {};
    if (p.website) return jsonResponse_({ ok: true });

    validateRequired_(p);
    validateConsent_(p);

    const id = createCandidateId_();
    const now = new Date();

    const ss = SpreadsheetApp.openById(ATS.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ATS.SHEET_CANDIDATOS);
    if (!sheet) throw new Error('Aba CANDIDATOS não encontrada.');

    const folder = getCandidateFolder_(p.vaga);

    const generatedResume = generateGebResumePdf_(p, id, folder);
    const originalResume = saveOriginalResume_(p, id, folder);

    const row = [
      id,
      now,
      clean_(p.vaga),
      clean_(p.negocio),
      clean_(p.areaProfissional),
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
      generatedResume.url,
      originalResume.url,
      'Recebido',
      'SIM',
      clean_(p.origem || 'Site institucional - Carreiras'),
      ''
    ];

    sheet.appendRow(row);
    appendChildRows_(ss, id, p);

    try {
      sendCandidateReceipt_(p, id);
      sendInternalNotice_(p, id, generatedResume.url, originalResume.url);
    } catch (mailError) {
      console.error('Falha no envio de e-mail:', mailError);
    }

    return jsonResponse_({
      ok: true,
      id,
      generatedResumeUrl: generatedResume.url,
      originalResumeUrl: originalResume.url,
      message: 'Candidatura recebida com sucesso.'
    });

  } catch (error) {
    console.error(error);
    return jsonResponse_({
      ok: false,
      message: error.message || 'Não foi possível registrar a candidatura.'
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {}
  }
}

function validateRequired_(p) {
  const required = {
    vaga: 'Vaga',
    negocio: 'Negócio GEB',
    areaProfissional: 'Área profissional',
    nome: 'Nome completo',
    dataNascimento: 'Data de nascimento',
    email: 'E-mail',
    telefone: 'Telefone',
    cidade: 'Cidade',
    uf: 'UF',
    possuiCnh: 'CNH',
    escolaridade: 'Escolaridade',
    disponibilidade: 'Disponibilidade'
  };

  Object.keys(required).forEach(key => {
    if (!String(p[key] || '').trim()) {
      throw new Error('Campo obrigatório: ' + required[key] + '.');
    }
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(p.email))) {
    throw new Error('Informe um e-mail válido.');
  }

  if (String(p.possuiCnh) === 'Sim' && !String(p.categoriaCnh || '').trim()) {
    throw new Error('Informe a categoria da CNH.');
  }
}

function validateConsent_(p) {
  if (String(p.consentimento || '').toLowerCase() !== 'sim') {
    throw new Error(
      'É necessário aceitar o tratamento dos dados para participar do processo seletivo.'
    );
  }
}

function getCandidateFolder_(vaga) {
  const root = DriveApp.getFolderById(ATS.CURRICULOS_FOLDER_ID);
  return getOrCreateFolder_(root, safeName_(vaga || 'Banco de Talentos'));
}

function generateGebResumePdf_(p, candidateId, folder) {
  const candidate = safeName_(p.nome || 'Candidato');
  const vaga = safeName_(p.vaga || 'Banco de Talentos');
  const filename =
    'CURRÍCULO GEB - ' +
    candidate.toUpperCase() +
    ' - ' +
    vaga.toUpperCase() +
    ' - ' +
    candidateId +
    '.pdf';

  const tempDoc = DocumentApp.create(
    'TEMP - CURRÍCULO GEB - ' + candidateId
  );

  const body = tempDoc.getBody();

  const title = body.appendParagraph(clean_(p.nome).toUpperCase());
  title.setHeading(DocumentApp.ParagraphHeading.TITLE);

  const subtitle = body.appendParagraph(
    [clean_(p.vaga), clean_(p.negocio), clean_(p.areaProfissional)]
      .filter(Boolean)
      .join(' | ')
  );
  subtitle.setBold(true);

  body.appendHorizontalRule();

  addSection_(body, 'DADOS PESSOAIS E CONTATO', [
    ['Data de nascimento', formatDateText_(p.dataNascimento)],
    ['E-mail', clean_(p.email)],
    ['Telefone / WhatsApp', clean_(p.telefone)],
    ['Cidade / UF', [clean_(p.cidade), clean_(p.uf)].filter(Boolean).join(' / ')],
    ['CNH', formatCnh_(p)],
    ['LinkedIn / Portfólio', clean_(p.linkedin)]
  ]);

  addSection_(body, 'FORMAÇÃO PRINCIPAL', [
    ['Escolaridade', clean_(p.escolaridade)],
    ['Curso / Formação', clean_(p.curso)],
    ['Instituição', clean_(p.instituicao)],
    ['Situação', clean_(p.situacaoFormacao)]
  ]);

  const formacoes = parseJsonArray_(p.formacoes);
  if (formacoes.length) {
    addArraySection_(
      body,
      'OUTRAS FORMAÇÕES',
      formacoes,
      item => [
        clean_(item.nivel),
        clean_(item.curso),
        clean_(item.instituicao),
        clean_(item.situacao),
        formatPeriodYears_(item.anoInicio, item.anoConclusao)
      ].filter(Boolean).join(' | ')
    );
  }

  const cursos = parseJsonArray_(p.cursos);
  if (cursos.length) {
    addArraySection_(
      body,
      'CURSOS COMPLEMENTARES',
      cursos,
      item => [
        clean_(item.nome),
        clean_(item.instituicao),
        clean_(item.cargaHoraria),
        clean_(item.ano)
      ].filter(Boolean).join(' | ')
    );
  }

  addSection_(body, 'EXPERIÊNCIA PROFISSIONAL - RESUMO', [
    ['Último cargo / função', clean_(p.ultimoCargo)],
    ['Empresa mais recente', clean_(p.empresaRecente)],
    ['Tempo total de experiência', clean_(p.tempoExperiencia)]
  ]);

  const experiencias = parseJsonArray_(p.experiencias);
  if (experiencias.length) {
    const heading = body.appendParagraph('EXPERIÊNCIAS PROFISSIONAIS');
    heading.setHeading(DocumentApp.ParagraphHeading.HEADING2);

    experiencias.forEach(item => {
      const cargoEmpresa = [
        clean_(item.cargo),
        clean_(item.empresa)
      ].filter(Boolean).join(' — ');

      if (cargoEmpresa) {
        const p1 = body.appendParagraph(cargoEmpresa);
        p1.setBold(true);
      }

      const periodo = formatExperiencePeriod_(item);
      if (periodo) body.appendParagraph(periodo);

      const modelos = clean_(item.modelosTrabalho);
      if (modelos) body.appendParagraph('Modelo de trabalho: ' + modelos);

      const regimes = clean_(item.regimesContratacao);
      if (regimes) body.appendParagraph('Regime de contratação: ' + regimes);

      const atividades = clean_(item.atividades);
      if (atividades) body.appendParagraph(atividades);

      body.appendParagraph('');
    });
  }

  addSection_(body, 'DISPONIBILIDADE E PERFIL', [
    ['Disponibilidade', clean_(p.disponibilidade)],
    ['Modelo de trabalho de interesse', clean_(p.modeloTrabalho)],
    ['Pretensão salarial', clean_(p.pretensaoSalarial)]
  ]);

  if (clean_(p.resumo)) {
    const heading = body.appendParagraph('RESUMO PROFISSIONAL');
    heading.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph(clean_(p.resumo));
  }

  body.appendHorizontalRule();
  const footer = body.appendParagraph(
    'Currículo gerado pelo GEB ATS | Protocolo: ' + candidateId
  );
  footer.setFontSize(8);
  footer.setForegroundColor('#666666');

  tempDoc.saveAndClose();

  const tempFile = DriveApp.getFileById(tempDoc.getId());
  const pdfBlob = tempFile.getBlob().getAs(MimeType.PDF).setName(filename);
  const pdfFile = folder.createFile(pdfBlob);

  tempFile.setTrashed(true);

  return {
    id: pdfFile.getId(),
    url: pdfFile.getUrl(),
    name: filename
  };
}

function saveOriginalResume_(p, candidateId, folder) {
  const base64 = String(p.curriculoBase64 || '').trim();

  if (!base64) {
    return {
      id: '',
      url: '',
      name: ''
    };
  }

  const mime = String(p.curriculoMime || '');
  if (ATS.ALLOWED_MIME_TYPES.indexOf(mime) === -1) {
    throw new Error('O currículo original deve estar em PDF.');
  }

  const bytes = Utilities.base64Decode(
    base64.replace(/^data:.*?;base64,/, '')
  );

  if (bytes.length > ATS.MAX_FILE_BYTES) {
    throw new Error('O currículo original deve ter no máximo 5 MB.');
  }

  const candidate = safeName_(p.nome || 'Candidato');
  const vaga = safeName_(p.vaga || 'Banco de Talentos');

  const filename =
    'CURRÍCULO ORIGINAL - ' +
    candidate.toUpperCase() +
    ' - ' +
    vaga.toUpperCase() +
    ' - ' +
    candidateId +
    '.pdf';

  const blob = Utilities
    .newBlob(bytes, mime, filename);

  const file = folder.createFile(blob);

  return {
    id: file.getId(),
    url: file.getUrl(),
    name: filename
  };
}

function appendChildRows_(ss, candidateId, p) {
  const formacoes = parseJsonArray_(p.formacoes);
  const cursos = parseJsonArray_(p.cursos);
  const experiencias = parseJsonArray_(p.experiencias);

  appendRows_(
    ss.getSheetByName('FORMACAO'),
    formacoes.map(item => [
      candidateId,
      clean_(item.nivel),
      clean_(item.curso),
      clean_(item.instituicao),
      clean_(item.situacao),
      clean_(item.anoInicio),
      clean_(item.anoConclusao),
      clean_(item.observacoes)
    ])
  );

  appendRows_(
    ss.getSheetByName('CURSOS'),
    cursos.map(item => [
      candidateId,
      clean_(item.nome),
      clean_(item.instituicao),
      clean_(item.cargaHoraria),
      clean_(item.ano),
      clean_(item.certificado),
      clean_(item.observacoes)
    ])
  );

  appendRows_(
    ss.getSheetByName('EXPERIENCIAS'),
    experiencias.map(item => [
      candidateId,
      clean_(item.empresa),
      clean_(item.cargo),
      clean_(item.inicio),
      clean_(item.fim),
      clean_(item.atual),
      clean_(item.modelosTrabalho),
      clean_(item.regimesContratacao),
      clean_(item.atividades),
      clean_(item.segmento),
      clean_(item.observacoes)
    ])
  );
}

function appendRows_(sheet, rows) {
  if (!sheet || !rows || !rows.length) return;

  sheet
    .getRange(
      sheet.getLastRow() + 1,
      1,
      rows.length,
      rows[0].length
    )
    .setValues(rows);
}

function addSection_(body, title, entries) {
  const filtered = entries.filter(item => item[1]);

  if (!filtered.length) return;

  const heading = body.appendParagraph(title);
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  filtered.forEach(item => {
    const paragraph = body.appendParagraph('');
    paragraph.appendText(item[0] + ': ').setBold(true);
    paragraph.appendText(item[1]);
  });
}

function addArraySection_(body, title, items, formatter) {
  const lines = items.map(formatter).filter(Boolean);
  if (!lines.length) return;

  const heading = body.appendParagraph(title);
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  lines.forEach(line => {
    body.appendListItem(line);
  });
}

function formatDateText_(value) {
  const clean = String(value || '').trim();
  if (!clean) return '';

  const parts = clean.split('-');
  if (parts.length === 3) {
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  return clean;
}

function formatCnh_(p) {
  if (String(p.possuiCnh) === 'Sim') {
    return 'Possui CNH - Categoria ' + clean_(p.categoriaCnh);
  }

  return 'Não possui CNH';
}

function formatPeriodYears_(start, end) {
  const a = clean_(start);
  const b = clean_(end);
  if (!a && !b) return '';
  if (a && b) return a + ' - ' + b;
  return a || b;
}

function formatExperiencePeriod_(item) {
  const start = clean_(item.inicio);
  const current = clean_(item.atual) === 'Sim';
  const end = current ? 'Atual' : clean_(item.fim);

  if (!start && !end) return '';
  if (start && end) return start + ' - ' + end;

  return start || end;
}

function getOrCreateFolder_(parent, name) {
  const folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

function createCandidateId_() {
  const stamp = Utilities.formatDate(
    new Date(),
    ATS.TIMEZONE,
    'yyyyMMdd'
  );

  const suffix = Utilities
    .getUuid()
    .split('-')[0]
    .toUpperCase();

  return 'GEB-' + stamp + '-' + suffix;
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

function clean_(value) {
  return String(value == null ? '' : value)
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, ' ');
}

function safeName_(value) {
  const valueClean = clean_(value)
    .replace(/[\\/:*?"<>|#%{}~&]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  return valueClean.substring(0, 90) || 'Sem nome';
}

function sendCandidateReceipt_(p, id) {
  MailApp.sendEmail({
    to: clean_(p.email),
    subject:
      'GEB - Candidatura recebida - ' +
      clean_(p.vaga),

    htmlBody:
      '<p>Olá, ' + htmlEscape_(p.nome) + '.</p>' +
      '<p>Recebemos sua candidatura para <strong>' +
      htmlEscape_(p.vaga) +
      '</strong>.</p>' +
      '<p>Protocolo: <strong>' +
      id +
      '</strong>.</p>' +
      '<p>Seus dados foram registrados e um currículo padronizado do GEB foi gerado automaticamente.</p>' +
      '<p>O cadastro não representa garantia de convocação ou contratação.</p>' +
      '<p>GEB</p>',

    name: 'GEB - Carreiras'
  });
}

function sendInternalNotice_(
  p,
  id,
  generatedResumeUrl,
  originalResumeUrl
) {
  let links =
    '<p><a href="' +
    generatedResumeUrl +
    '">Abrir Currículo GEB</a></p>';

  if (originalResumeUrl) {
    links +=
      '<p><a href="' +
      originalResumeUrl +
      '">Abrir Currículo Original</a></p>';
  }

  MailApp.sendEmail({
    to: 'contato@grupoeduardabispo.com.br',
    subject:
      'ATS - NOVA CANDIDATURA - ' +
      clean_(p.vaga),

    htmlBody:
      '<p><strong>Nova candidatura recebida.</strong></p>' +
      '<p>Protocolo: ' +
      id +
      '<br>' +
      'Vaga: ' +
      htmlEscape_(p.vaga) +
      '<br>' +
      'Negócio: ' +
      htmlEscape_(p.negocio) +
      '<br>' +
      'Área profissional: ' +
      htmlEscape_(p.areaProfissional) +
      '<br>' +
      'Nome: ' +
      htmlEscape_(p.nome) +
      '<br>' +
      'E-mail: ' +
      htmlEscape_(p.email) +
      '<br>' +
      'Telefone: ' +
      htmlEscape_(p.telefone) +
      '</p>' +
      links,

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