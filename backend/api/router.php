<?php
// 文件路径: /Users/lijialin/Desktop/requests/backend/db/router.php

use Illuminate\Database\Capsule\Manager as Capsule;
use Ramsey\Uuid\Uuid;

// 引入数据库API，并确保数据库表已存在
require_once __DIR__ . '/api.php';
$api = new DbApi();

// 获取当前请求的路径
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($requestUri, '/');
$parts = explode('/', $path);

// 获取请求方法 (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];

// 路由分发
switch ($parts[0]) {
    case '':
        // 返回首页 HTML 文件
        header('Content-Type: text/html; charset=utf-8');
        echo file_get_contents(__DIR__ . '/home.html'); // 假设你有一个 home.html
        break;

    case 'about':
        // 返回静态 HTML 文件
        header('Content-Type: text/html; charset=utf-8');
        echo file_get_contents(__DIR__ . '/about.html');
        break;

    case 'api':
        // ===========================================
        // JSON API 路由 (以 posts 为例)
        // ===========================================
        if (isset($parts[1]) && $parts[1] === 'posts') {
            // /api/posts/search: 搜索帖子
            if (isset($parts[2]) && $parts[2] === 'search' && $method === 'GET') {
                $query = $_GET;
                $results = $api->searchPosts($query);
                jsonResponse(['data' => $results]);
            }
            // /api/posts: 创建新帖子
            elseif (!isset($parts[2]) && $method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                if (!$input || !isset($input['author_id'])) {
                    jsonResponse(['error' => 'Invalid input'], 400);
                } else {
                    $newPost = $api->createPost($input['author_id'], $input);
                    jsonResponse(['data' => $newPost]);
                }
            }
            // /api/posts/{id} 的操作
            elseif (isset($parts[2]) && Uuid::isValid($parts[2])) {
                $postId = $parts[2];
                // GET: 获取单个帖子
                if ($method === 'GET') {
                    $post = $api->getPost($postId);
                    if ($post) {
                        jsonResponse(['data' => $post]);
                    } else {
                        jsonResponse(['error' => 'Post not found'], 404);
                    }
                }
                // PUT/PATCH: 更新帖子
                elseif ($method === 'PUT' || $method === 'PATCH') {
                    $input = json_decode(file_get_contents('php://input'), true);
                    $updatedPost = $api->updatePost($postId, $input);
                    if ($updatedPost) {
                        jsonResponse(['data' => $updatedPost]);
                    } else {
                        jsonResponse(['error' => 'Update failed or post not found'], 404);
                    }
                }
                // DELETE: 删除帖子
                elseif ($method === 'DELETE') {
                    $isDeleted = $api->deletePost($postId);
                    if ($isDeleted) {
                        jsonResponse(['message' => 'Post deleted successfully']);
                    } else {
                        jsonResponse(['error' => 'Delete failed or post not found'], 404);
                    }
                }
            }
        }
        break;

    default:
        // 404 Not Found
        header("HTTP/1.0 404 Not Found");
        echo "<h1>404 Not Found</h1>";
        break;
}

/**
 * 助手函数：返回 JSON 响应
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}