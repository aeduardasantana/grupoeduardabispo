<?php
/** Recepção de candidaturas GEB Valoriza. Requer PHP e envio de e-mail configurados no servidor. */
declare(strict_types=1);
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
function reply(int $code, string $message, bool $ok = false): void {
    http_response_code($code);
    $accept = (string)($_SERVER['HTTP_ACCEPT'] ?? '');
    if (stripos($accept, 'application/json') !== false) {
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    if ($ok) {
        header('Location: /valoriza/obrigado/', true, 303);
        exit;
    }
    header('Content-Type: text/html; charset=UTF-8');
    $safe = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    echo '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GEB Valoriza — Envio não concluído</title><main style="font:16px/1.65 Arial,sans-serif;max-width:650px;margin:10vh auto;padding:32px;color:#17211a"><h1>Não foi possível enviar sua candidatura.</h1><p>'.$safe.'</p><p>Volte à página para revisar as informações.</p><p><a href="/valoriza/#candidatura">Voltar à candidatura</a></p></main></html>';
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, 'Acesse a página GEB Valoriza para preencher o formulário.');
}
$origin = parse_url((string)($_SERVER['HTTP_ORIGIN'] ?? ''), PHP_URL_HOST);
if ($origin && !in_array(strtolower((string)$origin), ['grupoeduardabispo.com.br', 'www.grupoeduardabispo.com.br'], true)) {
    reply(403, 'Envio não autorizado a partir dessa origem.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 28000) {
    reply(413, 'As respostas ultrapassam o limite de tamanho do formulário.');
}
function field(string $key, int $limit = 4000): string {
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) return '';
    $value = trim(str_replace("\0", '', $value));
    return mb_length($value) > $limit ? '' : $value;
}
function mb_length(string $v): int {
    return function_exists('mb_strlen') ? mb_strlen($v, 'UTF-8') : strlen($v);
}
function has_min(string $v, int $minimum): bool {
    return mb_length($v) >= $minimum;
}
if (isset($_POST['pagina_pessoal']) && trim((string)$_POST['pagina_pessoal']) !== '') {
    reply(200, 'Mensagem recebida.', true);
}
$started = (int)field('iniciado', 20);
if ($started > 0 && time() - $started < 2) {
    reply(429, 'O envio foi muito rápido. Revise suas respostas e tente novamente.');
}
$values = [
    'empresa' => field('empresa', 130), 'segmento' => field('segmento', 140),
    'cidade' => field('cidade', 90), 'uf' => field('uf', 2),
    'rede' => field('rede', 300), 'responsavel' => field('responsavel', 130),
    'papel' => field('papel', 100), 'email' => field('email', 254),
    'telefone' => field('telefone', 24), 'historia' => field('historia', 4000),
    'desafios' => field('desafios', 2500), 'diferenca' => field('diferenca', 2200),
    'porque' => field('porque', 2500),
];
if (!has_min($values['empresa'], 2) || !has_min($values['segmento'], 2) || !has_min($values['cidade'], 2) ||
    !in_array($values['uf'], ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'], true) ||
    !has_min($values['rede'], 3) || !has_min($values['responsavel'], 3) || !has_min($values['papel'], 3) ||
    !filter_var($values['email'], FILTER_VALIDATE_EMAIL) || !has_min($values['historia'], 100) ||
    !has_min($values['desafios'], 60) || !has_min($values['diferenca'], 60) || !has_min($values['porque'], 100)) {
    reply(422, 'Preencha os campos obrigatórios e desenvolva sua história nas quatro perguntas do formulário.');
}
if (($_POST['antecedencia_aceite'] ?? '') !== 'sim' || ($_POST['representacao_aceite'] ?? '') !== 'sim' ||
    ($_POST['privacidade_aceite'] ?? '') !== 'sim') {
    reply(422, 'Confirme as declarações obrigatórias para apresentar sua candidatura.');
}
if (preg_match('/[\r\n]/', $values['email']) || preg_match('/[\r\n]/', $values['responsavel'])) {
    reply(422, 'Confira os dados de contato.');
}
// Limite básico por origem sem guardar informações pessoais do candidato.
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$ratePath = sys_get_temp_dir() . '/geb_valoriza_rate_' . hash('sha256', $ip . '|' . __FILE__);
$rate = @fopen($ratePath, 'c+');
if ($rate) {
    flock($rate, LOCK_EX);
    $record = json_decode((string)stream_get_contents($rate), true);
    if (!is_array($record) || (int)($record['at'] ?? 0) < time() - 3600) $record = ['at' => time(), 'count' => 0];
    if ((int)$record['count'] >= 3) {
        flock($rate, LOCK_UN); fclose($rate);
        reply(429, 'Limite de tentativas alcançado. Tente novamente mais tarde.');
    }
    $record['count']++;
    ftruncate($rate, 0); rewind($rate);
    fwrite($rate, json_encode($record)); fflush($rate);
    flock($rate, LOCK_UN); fclose($rate);
}
$labels = [
    'empresa' => 'Empresa', 'segmento' => 'Atividade', 'cidade' => 'Cidade', 'uf' => 'UF',
    'rede' => 'Rede social', 'responsavel' => 'Responsável', 'papel' => 'Vínculo com a empresa',
    'email' => 'E-mail', 'telefone' => 'Telefone', 'historia' => 'Como começou',
    'desafios' => 'Desafios', 'diferenca' => 'Diferença para clientes/comunidade',
    'porque' => 'Por que merece o patrocínio',
];
$body = "GEB VALORIZA — NOVA CANDIDATURA\nRecebida em: " . gmdate('Y-m-d H:i:s') . " UTC\n";
$body .= "Prazo de envio de materiais: 35 dias antes da publicação (aceito).\n";
$body .= "Comunicacoes de marketing: " . (($_POST['marketing_aceite'] ?? '') === 'sim' ? 'opt-in' : 'nao autorizado') . "\n\n";
foreach ($labels as $key => $label) {
    $body .= strtoupper($label) . "\n" . $values[$key] . "\n\n";
}
$subject = 'GEB Valoriza - Candidatura recebida';
$headers = [
    'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8',
    'From: GEB Valoriza <contato@grupoeduardabispo.com.br>',
    'Reply-To: ' . $values['email'],
    'X-Auto-Response-Suppress: All',
];
$sent = @mail('contato@grupoeduardabispo.com.br', $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    error_log('GEB Valoriza: envio de notificacao recusado pelo servidor.');
    reply(503, 'O servidor não conseguiu concluir o envio agora. Suas respostas permanecem nesta página; tente novamente mais tarde.');
}
reply(200, 'Candidatura enviada. Nossa equipe fará a análise conforme as condições do programa.', true);
