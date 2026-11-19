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
