# GEB ATS — Google Apps Script

## Arquitetura

Site institucional → formulário de candidatura → Apps Script → Google Sheets + Google Drive.

### IDs já configurados
- Planilha: `GEB - ATS | Candidatos`
- Pasta raiz: `ATS GEB`
- Pasta de currículos: `01 - Currículos`

## O que o backend faz
1. Valida os campos obrigatórios.
2. Aceita apenas PDF de até 5 MB.
3. Cria uma pasta por vaga dentro de Currículos.
4. Salva o PDF original.
5. Gera um protocolo único.
6. Registra os dados na aba CANDIDATOS.
7. Salva o link do currículo no Drive.
8. Envia confirmação ao candidato.
9. Envia aviso interno ao GEB.

## Publicação
No Google Apps Script:
1. Cole o conteúdo de `Code.gs`.
2. Implantar → Nova implantação → Aplicativo da Web.
3. Executar como: você.
4. Quem pode acessar: qualquer pessoa.
5. Copie a URL `/exec`.
6. Essa URL será adicionada ao formulário do site.

## Observação
O formulário deve enviar os dados como `application/x-www-form-urlencoded`, incluindo o currículo em Base64, para evitar preflight/CORS desnecessário em site estático.
