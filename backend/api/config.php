<?php
// config.php — 全局配置 + 公共函数（无 HTML）
// ENV: DB_SQLITE=./data.db  （可选，默认 ./data.db）

declare(strict_types=1);

// ---------- JSON 帮助 ----------
function json_out($data, int $status=200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
  exit;
}
function ok($d){ json_out($d,200); }
function created($d){ json_out($d,201); }
function bad($m){ json_out(['error'=>$m],400); }
function notfound(){ json_out(['error'=>'Not found'],404); }

// ---------- 工具 ----------
function now_iso(): string { return gmdate('Y-m-d\TH:i:s\Z'); }
function uuidv4(): string {
  $d=random_bytes(16);
  $d[6]=chr((ord($d[6])&0x0f)|0x40);
  $d[8]=chr((ord($d[8])&0x3f)|0x80);
  return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($d),4));
}
function read_json_body(): array {
  $raw=file_get_contents('php://input')?:'';
  $j=json_decode($raw,true);
  return is_array($j)?$j:[];
}
function path(): string { return parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/'; }
function method(): string { return $_SERVER['REQUEST_METHOD'] ?? 'GET'; }
function segs(): array { $p=trim(path(),'/'); return $p?explode('/',$p):[]; }

// ---------- CORS ----------
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

// ---------- SQLite 连接 ----------
$DB_FILE = getenv('DB_SQLITE') ?: (__DIR__ . '/data.db');
try {
  $pdo = new PDO('sqlite:' . $DB_FILE);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->exec('PRAGMA foreign_keys = ON;');
  $pdo->exec('PRAGMA journal_mode = WAL;');
} catch (Throwable $e) {
  json_out(['error'=>'DB connect failed','detail'=>$e->getMessage(),'file'=>$DB_FILE],500);
}