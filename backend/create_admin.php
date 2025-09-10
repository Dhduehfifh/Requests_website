<?php
// create_admin.php — 创建默认管理员用户
declare(strict_types=1);

require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/migrations.php';
migrate($pdo);
require_once __DIR__ . '/api/auth.php';

echo "Creating admin user...\n";

try {
    // 检查是否已存在admin用户
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute(['admin123']);
    
    if ($stmt->fetch()) {
        echo "Admin user already exists\n";
        exit;
    }
    
    // 创建admin用户
    $passwordHash = Auth::hashPassword('password');
    $stmt = $pdo->prepare("
        INSERT INTO users (id, username, email, password_hash, created_at, updated_at) 
        VALUES (lower(hex(randomblob(16))), ?, ?, ?, datetime('now'), datetime('now'))
    ");
    $stmt->execute(['admin123', 'admin@example.com', $passwordHash]);
    
    $userId = $pdo->lastInsertId();
    echo "Admin user created with ID: {$userId}\n";
    echo "Username: admin123\n";
    echo "Password: password\n";
    
} catch (Exception $e) {
    echo "Error creating admin user: " . $e->getMessage() . "\n";
}
