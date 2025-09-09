<?php
// index.php — JSON-only gateway (no HTML).
// All routes under /json/* are proxied to /api/* (api.replacement.php).
// Example: GET /json/posts   → forwards to   GET /api/posts
//          POST /json/posts  → forwards to   POST /api/posts
//          GET /json/health  → served locally

declare(strict_types=1);

// -------- Basic Helpers --------
function json_out($data, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function is_json_route(string $path): bool {
  return strncmp($path, '/json/', 6) === 0;
}

function allow_cors(): void {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id');
}

// Build absolute URL to local /api/* with same host & scheme
function build_api_url(string $jsonPath): string {
  $apiPath = preg_replace('#^/json/#', '/api/', $jsonPath);
  $qs = $_SERVER['QUERY_STRING'] ?? '';
  $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
  $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
  return $scheme . '://' . $host . $apiPath . ($qs ? ('?' . $qs) : '');
}

function forward_to_api(string $method, string $jsonPath): void {
  $url = build_api_url($jsonPath);

  $headers = [
    'Content-Type: application/json'
  ];
  // Pass-through auth headers if present
  if (!empty($_SERVER['HTTP_X_USER_ID']))    $headers[] = 'X-User-Id: '    . $_SERVER['HTTP_X_USER_ID'];
  if (!empty($_SERVER['HTTP_AUTHORIZATION']))$headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];

  // Prefer cURL for better compatibility
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,   // to parse status code
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_TIMEOUT        => 60,
  ]);

  if (in_array($method, ['POST','PUT','PATCH','DELETE'], true)) {
    $body = file_get_contents('php://input') ?: '';
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
  }

  $raw = curl_exec($ch);
  if ($raw === false) {
    $err = curl_error($ch);
    curl_close($ch);
    json_out(['error' => 'Upstream error', 'detail' => $err], 502);
  }

  $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE) ?: 200;
  $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE) ?: 0;
  $respHeaders = substr($raw, 0, $headerSize);
  $respBody    = substr($raw, $headerSize);
  curl_close($ch);

  // Ensure JSON output even if upstream returns plain text
  $decoded = json_decode($respBody, true);
  if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
    $decoded = ['raw' => $respBody];
  }

  json_out($decoded, $status);
}

// -------- Router --------
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if (is_json_route($path)) {
  allow_cors();
  if ($method === 'OPTIONS') { http_response_code(204); exit; }

  // Local JSON endpoints (no upstream needed)
  if ($path === '/json/health') {
    json_out([
      'ok'       => true,
      'service'  => 'json-gateway',
      'time'     => gmdate('c'),
      'version'  => '1.0.0'
    ]);
  }
  if ($path === '/json/version') {
    json_out([
      'gateway'  => 'index.php',
      'api_proxy'=> '/api/*',
      'commit'   => getenv('COMMIT_SHA') ?: null
    ]);
  }

  // Proxy everything else under /json/* → /api/*
  $allowed = ['GET','POST','PUT','PATCH','DELETE'];
  if (!in_array($method, $allowed, true)) {
    json_out(['error' => 'Method Not Allowed'], 405);
  }
  forward_to_api($method, $path);
  exit;
}

// Any non-/json path → 404 JSON (no HTML here)
json_out(['error' => 'Not Found', 'hint' => 'Use /json/* endpoints'], 404);