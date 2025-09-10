<?php
// Authentication utilities
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/orm.php';

class Auth {
    private static $pdo;
    
    public static function init($pdo) {
        self::$pdo = $pdo;
    }
    
    // Generate secure session token
    public static function generateToken(): string {
        return bin2hex(random_bytes(32));
    }
    
    // Hash password
    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_DEFAULT);
    }
    
    // Verify password
    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
    
    // Create session
    public static function createSession(string $userId, string $token): bool {
        try {
            $stmt = self::$pdo->prepare("
                INSERT INTO user_sessions (user_id, token, expires_at, created_at) 
                VALUES (?, ?, datetime('now', '+7 days'), datetime('now'))
            ");
            return $stmt->execute([$userId, $token]);
        } catch (Exception $e) {
            error_log("Session creation failed: " . $e->getMessage());
            return false;
        }
    }
    
    // Validate session
    public static function validateSession(string $token): ?array {
        try {
            $stmt = self::$pdo->prepare("
                SELECT s.user_id, s.expires_at, u.username, u.email 
                FROM user_sessions s 
                JOIN users u ON s.user_id = u.id 
                WHERE s.token = ? AND s.expires_at > datetime('now')
            ");
            $stmt->execute([$token]);
            $session = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($session) {
                // Update last access
                $updateStmt = self::$pdo->prepare("
                    UPDATE user_sessions 
                    SET last_access = datetime('now') 
                    WHERE token = ?
                ");
                $updateStmt->execute([$token]);
            }
            
            return $session;
        } catch (Exception $e) {
            error_log("Session validation failed: " . $e->getMessage());
            return null;
        }
    }
    
    // Login user
    public static function login(string $username, string $password): array {
        try {
            // Find user by username or email
            $stmt = self::$pdo->prepare("
                SELECT id, username, email, password_hash 
                FROM users 
                WHERE username = ? OR email = ?
            ");
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user || !self::verifyPassword($password, $user['password_hash'])) {
                throw new Exception('Invalid credentials');
            }
            
            // Generate session token
            $token = self::generateToken();
            if (!self::createSession($user['id'], $token)) {
                throw new Exception('Failed to create session');
            }
            
            return [
                'user_id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'token' => $token
            ];
        } catch (Exception $e) {
            throw new Exception('Login failed: ' . $e->getMessage());
        }
    }
    
    // Register user
    public static function register(array $userData): array {
        try {
            // Validate required fields
            $required = ['username', 'email', 'password'];
            foreach ($required as $field) {
                if (empty($userData[$field])) {
                    throw new Exception("Field {$field} is required");
                }
            }
            
            // Check if username or email already exists
            $stmt = self::$pdo->prepare("
                SELECT id FROM users 
                WHERE username = ? OR email = ?
            ");
            $stmt->execute([$userData['username'], $userData['email']]);
            if ($stmt->fetch()) {
                throw new Exception('Username or email already exists');
            }
            
            // Hash password
            $passwordHash = self::hashPassword($userData['password']);
            
            // Create user
            $stmt = self::$pdo->prepare("
                INSERT INTO users (username, email, password_hash, created_at, updated_at) 
                VALUES (?, ?, ?, datetime('now'), datetime('now'))
            ");
            $stmt->execute([
                $userData['username'],
                $userData['email'],
                $passwordHash
            ]);
            
            $userId = self::$pdo->lastInsertId();
            
            // Create session
            $token = self::generateToken();
            if (!self::createSession($userId, $token)) {
                throw new Exception('Failed to create session');
            }
            
            return [
                'user_id' => $userId,
                'username' => $userData['username'],
                'email' => $userData['email'],
                'token' => $token
            ];
        } catch (Exception $e) {
            throw new Exception('Registration failed: ' . $e->getMessage());
        }
    }
    
    // Logout user
    public static function logout(string $token): bool {
        try {
            $stmt = self::$pdo->prepare("
                DELETE FROM user_sessions WHERE token = ?
            ");
            return $stmt->execute([$token]);
        } catch (Exception $e) {
            error_log("Logout failed: " . $e->getMessage());
            return false;
        }
    }
    
    // Get current user from token
    public static function getCurrentUser(string $token): ?array {
        $session = self::validateSession($token);
        return $session ? [
            'id' => $session['user_id'],
            'username' => $session['username'],
            'email' => $session['email']
        ] : null;
    }
}

// Initialize auth with PDO
Auth::init($pdo);
