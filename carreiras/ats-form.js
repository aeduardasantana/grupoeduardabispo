(() => {
  const ATS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbygU5XWV9PD7IzAlFWHYPlFrPi5AeBwGItB9VSs3QN9DCOuYyqzQepBw7mX2HQ4Ou8c/exec';
  const form = document.querySelector('[data-ats-form]');
  if (!form) return;

  const status = document.querySelector('[data-ats-status]');
  const submit = form.querySelector('button[type="submit"]');
  const vagaSelect = form.querySelector('[name="vaga"]');
  const negocioVisual = form.querySelector('[name="negocioVisual"]');
  const negocioHidden = form.querySelector('[name="negocio"]');
  const areaVisual = form.querySelector('[name="areaProfissionalVisual"]');
  const areaHidden = form.querySelector('[name="areaProfissional"]');
  const negocioNote = document.querySelector('[data-negocio-note]');
  const areaNote = document.querySelector('[data-area-note]');
  const cnhSelect = form.querySelector('[name="possuiCnh"]');
  const cnhCategoryWrap = document.querySelector('[data-cnh-category]');

  const VAGA_MAP = {
    'Consultor Comercial - Empresarial': { negocio: 'GEB Empresarial', area: 'Comercial' },
    'Consultor Comercial - Educação': { negocio: 'GEB Educação', area: 'Comercial' },
    'Consultor Comercial - Saúde': { negocio: 'GEB Saúde', area: 'Comercial' },
    'Consultor Comercial - Inclusão': { negocio: 'GEB Inclusão', area: 'Comercial' },
    'Banco de Talentos': null
  };

  document.querySelectorAll('[data-apply-job]').forEach(btn => {
    btn.addEventListener('click', () => {
      const vaga = btn.dataset.applyJob || '';
      vagaSelect.value = vaga;
      syncOpportunity();
      document.querySelector('#candidatura')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => form.querySelector('[name="nome"]')?.focus(), 450);
    });
  });

  function syncOpportunity() {
    const mapped = VAGA_MAP[vagaSelect.value];

    if (mapped) {
      negocioVisual.value = mapped.negocio;
      areaVisual.value = mapped.area;
      negocioHidden.value = mapped.negocio;
      areaHidden.value = mapped.area;
      negocioVisual.disabled = true;
      areaVisual.disabled = true;
      negocioNote.textContent = 'Definido automaticamente pela vaga.';
      areaNote.textContent = 'Definida automaticamente pela vaga.';
      return;
    }

    negocioVisual.disabled = false;
    areaVisual.disabled = false;

    if (vagaSelect.value === 'Banco de Talentos') {
      negocioVisual.value = '';
      areaVisual.value = '';
      negocioHidden.value = '';
      areaHidden.value = '';
      negocioNote.textContent = 'Escolha o negócio de interesse.';
      areaNote.textContent = 'Escolha a área profissional de interesse.';
    } else {
      negocioHidden.value = negocioVisual.value;
      areaHidden.value = areaVisual.value;
      negocioNote.textContent = '';
      areaNote.textContent = '';
    }
  }

  negocioVisual.addEventListener('change', () => {
    if (!negocioVisual.disabled) negocioHidden.value = negocioVisual.value;
  });

  areaVisual.addEventListener('change', () => {
    if (!areaVisual.disabled) areaHidden.value = areaVisual.value;
  });

  vagaSelect.addEventListener('change', syncOpportunity);

  function syncCnh() {
    const has = cnhSelect.value === 'Sim';
    cnhCategoryWrap.hidden = !has;
    const field = cnhCategoryWrap.querySelector('select');
    field.required = has;
    if (!has) field.value = '';
  }
  cnhSelect.addEventListener('change', syncCnh);
  syncCnh();
  const query = new URLSearchParams(window.location.search);
  const queryVaga = query.get('vaga');
  if (queryVaga && [...vagaSelect.options].some(option => option.value === queryVaga || option.textContent === queryVaga)) {
    vagaSelect.value = queryVaga;
    syncOpportunity();
  }

  function addRepeatItem(container, type) {
    const index = container.querySelectorAll('.ats-repeat-item').length + 1;
    const item = document.createElement('div');
    item.className = 'ats-repeat-item';

    const templates = {
      formacao: `
        <div class="ats-repeat-head"><strong>Formação ${index}</strong><button type="button" class="ats-remove">Remover</button></div>
        <div class="ats-grid ats-grid-2">
          <label><span>Nível</span><select data-field="nivel"><option value="">Selecione</option><option>Ensino Fundamental</option><option>Ensino Médio</option><option>Técnico</option><option>Graduação</option><option>Pós-graduação</option><option>Mestrado</option><option>Doutorado</option><option>Outro</option></select></label>
          <label><span>Curso</span><input data-field="curso" type="text" maxlength="120"></label>
          <label><span>Instituição</span><input data-field="instituicao" type="text" maxlength="140"></label>
          <label><span>Situação</span><select data-field="situacao"><option value="">Selecione</option><option>Concluído</option><option>Cursando</option><option>Trancado</option><option>Incompleto</option></select></label>
          <label><span>Ano de início</span><input data-field="anoInicio" type="number" min="1950" max="2100"></label>
          <label><span>Ano de conclusão</span><input data-field="anoConclusao" type="number" min="1950" max="2100"></label>
        </div>`,
      curso: `
        <div class="ats-repeat-head"><strong>Curso complementar ${index}</strong><button type="button" class="ats-remove">Remover</button></div>
        <div class="ats-grid ats-grid-2">
          <label><span>Curso / certificação</span><input data-field="nome" type="text" maxlength="140"></label>
          <label><span>Instituição</span><input data-field="instituicao" type="text" maxlength="140"></label>
          <label><span>Carga horária</span><input data-field="cargaHoraria" type="text" maxlength="50" placeholder="Ex.: 40h"></label>
          <label><span>Ano</span><input data-field="ano" type="number" min="1950" max="2100"></label>
        </div>`,
      experiencia: `
        <div class="ats-repeat-head"><strong>Experiência ${index}</strong><button type="button" class="ats-remove">Remover</button></div>
        <div class="ats-grid ats-grid-2">
          <label><span>Empresa</span><input data-field="empresa" type="text" maxlength="140"></label>
          <label><span>Cargo / função</span><input data-field="cargo" type="text" maxlength="120"></label>
          <label><span>Início</span><input data-field="inicio" type="date"></label>
          <label><span>Fim</span><input data-field="fim" type="date"></label>
        </div>
        <label class="ats-check-inline"><input data-field="atual" type="checkbox" value="Sim"><span>Trabalho atualmente nesta empresa</span></label>
        <label><span>Principais atividades</span><textarea data-field="atividades" rows="3" maxlength="900"></textarea></label>`
    };

    item.innerHTML = templates[type];

    const currentEmployment = item.querySelector('[data-field="atual"]');
    const endDate = item.querySelector('[data-field="fim"]');
    if (currentEmployment && endDate) {
      const syncCurrentEmployment = () => {
        endDate.disabled = currentEmployment.checked;
        if (currentEmployment.checked) endDate.value = '';
      };
      currentEmployment.addEventListener('change', syncCurrentEmployment);
      syncCurrentEmployment();
    }

    item.querySelector('.ats-remove').addEventListener('click', () => item.remove());
    container.appendChild(item);
  }

  document.querySelectorAll('[data-add-repeat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.addRepeat;
      const container = document.querySelector(`[data-repeat="${type}"]`);
      addRepeatItem(container, type);
    });
  });

  function collectGlobalMulti(name) {
    const group = document.querySelector(`[data-global-multi="${name}"]`);
    if (!group) return '';
    return [...group.querySelectorAll('input[type="checkbox"]:checked')]
      .map(input => input.value)
      .join('; ');
  }

  function collectRepeat(type) {
    return [...document.querySelectorAll(`[data-repeat="${type}"] .ats-repeat-item`)]
      .map(item => {
        const obj = {};
        item.querySelectorAll('[data-field]').forEach(field => {
          obj[field.dataset.field] = field.type === 'checkbox'
            ? (field.checked ? 'Sim' : 'Não')
            : field.value.trim();
        });
        item.querySelectorAll('[data-multi-field]').forEach(group => {
          obj[group.dataset.multiField] = [...group.querySelectorAll('input[type="checkbox"]:checked')]
            .map(input => input.value)
            .join('; ');
        });
        return obj;
      })
      .filter(obj => Object.values(obj).some(v => v && v !== 'Não'));
  }

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Não foi possível ler o currículo.'));
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.readAsDataURL(file);
    });
  }

  function setStatus(message, kind = '') {
    status.textContent = message;
    status.className = 'ats-status' + (kind ? ' ' + kind : '');
    status.hidden = !message;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    setStatus('');

    if (!form.reportValidity()) return;

    const file = form.querySelector('[name="curriculo"]').files[0] || null;
    if (file && file.type !== 'application/pdf') {
      setStatus('O currículo próprio deve estar em PDF.', 'error');
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setStatus('O currículo próprio deve ter no máximo 5 MB.', 'error');
      return;
    }

    if (!ATS_ENDPOINT) {
      setStatus('O formulário está pronto, mas a integração do ATS ainda precisa da URL pública do Google Apps Script.', 'warning');
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Enviando candidatura...';

    try {
      const fd = new FormData(form);
      fd.delete('curriculo');
      const params = new URLSearchParams();

      for (const [key, value] of fd.entries()) params.append(key, String(value));

      params.set('formacoes', JSON.stringify(collectRepeat('formacao')));
      params.set('cursos', JSON.stringify(collectRepeat('curso')));
      params.set('experiencias', JSON.stringify(collectRepeat('experiencia')));
      params.set('experienciaModelos', collectGlobalMulti('experienciaModelos'));
      params.set('experienciaRegimes', collectGlobalMulti('experienciaRegimes'));
      params.set('interesseModelos', collectGlobalMulti('interesseModelos'));
      params.set('interesseRegimes', collectGlobalMulti('interesseRegimes'));
      if (file) {
        params.set('curriculoNome', file.name);
        params.set('curriculoMime', file.type);
        params.set('curriculoBase64', await fileToBase64(file));
      } else {
        params.set('curriculoNome', '');
        params.set('curriculoMime', '');
        params.set('curriculoBase64', '');
      }
      params.set('origem', 'Site institucional - Carreiras');
      params.set('consentimento', 'sim');

      const response = await fetch(ATS_ENDPOINT, {
        method: 'POST',
        body: params
      });

      const raw = await response.text();
      let data;

      try {
        data = JSON.parse(raw);
      } catch (_) {
        const looksHtml = /<!doctype html|<html/i.test(raw);
        if (looksHtml) {
          throw new Error('O Google Apps Script devolveu uma página HTML em vez da resposta do ATS. Verifique se a implantação está como Aplicativo da Web, executando como você e acessível por qualquer pessoa.');
        }
        throw new Error('Resposta inválida do ATS: ' + raw.slice(0, 180));
      }

      if (!data.ok) throw new Error(data.message || 'Não foi possível registrar a candidatura.');

      form.reset();
      document.querySelectorAll('.ats-repeat-list').forEach(el => el.innerHTML = '');
      syncCnh();
      syncOpportunity();
      setStatus(`Candidatura recebida. Protocolo: ${data.id}`, 'success');
    } catch (err) {
      setStatus(err.message || 'Ocorreu um erro ao enviar sua candidatura.', 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Enviar candidatura';
    }
  });
})();