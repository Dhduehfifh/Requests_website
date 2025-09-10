<?php
// index.php — Main API entry point
declare(strict_types=1);

// Set CORS headers for development
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit;
}

// Enable CORS for development (disable in production)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include required files
require_once __DIR__ . '/../api/config.php';
require_once __DIR__ . '/../api/migrations.php';
require_once __DIR__ . '/../api/orm.php';
require_once __DIR__ . '/../api/validate.php';
require_once __DIR__ . '/../api/api.php';
