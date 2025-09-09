<?php
// index.php — JSON-only gateway (no HTML).
// Run: API_ORIGIN=http://127.0.0.1:9000 php -S 127.0.0.1:8000 index.php
declare(strict_types=1);

$API_ORIGIN = getenv('API_ORIGIN') ?: 'http://127.0.0.1:9000';
$JSON_PREFIX = '/json/';

function json_out($data, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}
function allow_cors(): void {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id');
}
function is_json_route(string $path, string $prefix): bool {
  return strncmp($path, $prefix, strlen($prefix)) === 0;
}
function build_api_url(string $apiOrigin, string $jsonPath, string $jsonPrefix): string {
  $apiPath = '/api/' . ltrim(substr($jsonPath, strlen($jsonPrefix)), '/');
  $qs = $_SERVER['QUERY_STRING'] ?? '';
  return rtrim($apiOrigin, '/') . $apiPath . ($qs ? ('?' . $qs) : '');
}
function forward_to_api(string $method, string $url): void {
  $headers = ['Content-Type: application/json'];
  if (!empty($_SERVER['HTTP_X_USER_ID']))     $headers[] = 'X-User-Id: ' . $_SERVER['HTTP_X_USER_ID'];
  if (!empty($_SERVER['HTTP_AUTHORIZATION'])) $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];

  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_TIMEOUT        => 60,
  ]);
  if (in_array($method, ['POST','PUT','PATCH','DELETE'], true)) {
    $body = file_get_contents('php://input') ?: '';
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
  }
  $raw = curl_exec($ch);
  if ($raw === false) { $err = curl_error($ch); curl_close($ch); json_out(['error'=>'Upstream error','detail'=>$err], 502); }
  $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE) ?: 200;
  $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE) ?: 0;
  $respBody = substr($raw, $headerSize);
  curl_close($ch);

  $decoded = json_decode($respBody, true);
  if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) $decoded = ['raw' => $respBody];
  json_out($decoded, $status);
}

$path   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if (is_json_route($path, $JSON_PREFIX)) {
  allow_cors();
  if ($method === 'OPTIONS') { http_response_code(204); exit; }

  if ($path === $JSON_PREFIX.'health')  json_out(['ok'=>true,'service'=>'json-gateway','time'=>gmdate('c'),'version'=>'1.0.1']);
  if ($path === $JSON_PREFIX.'version') json_out(['gateway'=>'index.php','api_origin'=>getenv('API_ORIGIN') ?: null]);

  $allowed = ['GET','POST','PUT','PATCH','DELETE'];
  if (!in_array($method, $allowed, true)) json_out(['error'=>'Method Not Allowed'], 405);

  $url = build_api_url($API_ORIGIN, $path, $JSON_PREFIX);
  forward_to_api($method, $url);
  exit;
}

json_out(['error'=>'Not Found','hint'=>'Use /json/* endpoints'], 404);