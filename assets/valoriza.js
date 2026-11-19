/* Formulário GEB Valoriza: validação amigável, envio com tratamento de falhas e sem WhatsApp. */
(()=>{
  'use strict';
  const form=document.getElementById('vz-form');
  if(!form)return;
  const status=document.getElementById('vz-response');
  const button=document.getElementById('vz-send');
  const started=document.getElementById('vz-iniciado');
  if(started)started.value=String(Math.floor(Date.now()/1000));
  const setStatus=(message,error=false)=>{
    if(!status)return;
    status.textContent=message;
    status.hidden=false;
    status.style.borderLeftColor=error?'#a02e2e':'#477657';
  };
  for(const item of form.querySelectorAll('input,select,textarea')){
    item.addEventListener('input',()=>item.removeAttribute('aria-invalid'));
    item.addEventListener('change',()=>item.removeAttribute('aria-invalid'));
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const invalid=[...form.querySelectorAll('input,select,textarea')].filter(el=>!el.checkValidity());
    if(invalid.length){
      invalid.forEach(el=>el.setAttribute('aria-invalid','true'));
      invalid[0].focus();
      invalid[0].reportValidity();
      setStatus('Confira os campos obrigatórios. Nas perguntas sobre sua história, conte um pouco mais para que possamos conhecer seu negócio.',true);
      return;
    }
    if(status)status.hidden=true;
    button.disabled=true;
    const original=button.innerHTML;
    button.textContent='Enviando sua história…';
    try{
      const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'},credentials:'same-origin',redirect:'follow'});
      const data=await response.json().catch(()=>null);
      if(response.ok&&data?.ok){location.assign('/valoriza/obrigado/');return;}
      throw new Error(data?.message||'Não foi possível concluir a candidatura. Confira seus dados e tente novamente.');
    }catch(error){
      setStatus(error.message||'Não foi possível enviar. Verifique sua conexão e tente novamente.',true);
      button.disabled=false;
      button.innerHTML=original;
      status?.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  });
})();


/* Compartilhamento opcional do GEB Valoriza — sem coleta de dados pessoais. */
(()=>{
  'use strict';
  const url='https://grupoeduardabispo.com.br/valoriza/';
  const title='GEB Valoriza — sua história merece ser vista';
  const message=[
    'Olha o que encontrei!',
    '',
    'Você conhece alguém que trabalha todos os dias para fazer seu negócio acontecer e merece ter sua história reconhecida?',
    '',
    'O GEB Valoriza vai selecionar empresas brasileiras para receber 6 meses de apoio à presença digital, patrocinados pelo GEB e executados pelo GEB Tecnologia: edição de artes estáticas e agendamento de até 20 publicações por mês.',
    '',
    'Conheça o programa e conte a história do negócio:',
    url,
    '',
    'Compartilhe com quem merece essa oportunidade! A candidatura passa por seleção.'
  ].join('\\n');
  const feedback=(button,content)=>{
    const box=button.closest('.vz-share, .vz-share-end');
    const status=box?.querySelector('[data-vz-share-feedback]');
    if(status){status.textContent=content;status.hidden=false;}
  };
  const fallbackCopy=(value)=>{
    const field=document.createElement('textarea');
    field.value=value;
    field.setAttribute('readonly','');
    field.style.cssText='position:fixed;left:-9999px;top:0;width:1px;height:1px;';
    document.body.append(field);
    field.focus();field.select();
    let copied=false;
    try{copied=document.execCommand('copy');}catch(_){copied=false;}
    field.remove();
    return copied;
  };
  for(const button of document.querySelectorAll('[data-vz-share-copy]')){
    button.addEventListener('click',async()=>{
      let copied=false;
      if(navigator.clipboard?.writeText){
        try{await navigator.clipboard.writeText(message);copied=true;}catch(_){copied=false;}
      }
      if(!copied)copied=fallbackCopy(message);
      feedback(button,copied?'Convite copiado! Cole a mensagem no aplicativo que preferir.':'Não foi possível copiar automaticamente. Copie o endereço desta página para compartilhar.');
    });
  }
  if(typeof navigator.share==='function'){
    for(const button of document.querySelectorAll('[data-vz-share-native]')){
      button.hidden=false;
      button.addEventListener('click',async()=>{
        try{
          await navigator.share({title,text:message.replace(url,'').trim(),url});
          feedback(button,'O compartilhamento foi aberto.');
        }catch(error){
          if(error?.name!=='AbortError')feedback(button,'Não foi possível abrir o compartilhamento. Use o botão para copiar o convite.');
        }
      });
    }
  }
})();
