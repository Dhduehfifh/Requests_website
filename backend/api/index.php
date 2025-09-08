<?php
// 文件路径: /Users/lijialin/Desktop/requests/backend/db/index.php

// 引入数据库API，并确保数据库表已存在
require_once __DIR__ . '/api.php';
$api = new DbApi();

// 获取当前请求的路径
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($requestUri, '/');
$parts = explode('/', $path);

// 路由分发
if ($parts[0] === 'posts') {
    // 处理 /posts/{id} 的请求
    if (isset($parts[1]) && Uuid::isValid($parts[1])) {
        $postId = $parts[1];
        $post = $api->getPost($postId);

        // 如果帖子存在，返回 HTML 页面
        if ($post) {
            header('Content-Type: text/html; charset=utf-8');
            echo "<h1>" . htmlspecialchars($post['title']) . "</h1>";
            echo "<p>作者: " . htmlspecialchars($post['author']['username']) . "</p>";
            echo "<p>" . nl2br(htmlspecialchars($post['content'])) . "</p>";
            // ... 其他 HTML 内容
            exit;
        }
    }
} elseif ($parts[0] === 'api' && $parts[1] === 'posts') {
    // 处理 /api/posts/search 的 JSON API 请求
    if (isset($parts[2]) && $parts[2] === 'search') {
        // 从GET请求中获取查询参数
        $query = $_GET; 
        
        $searchResults = $api->searchPosts($query);

        // 返回 JSON 格式的数据
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['data' => $searchResults]);
        exit;
    }
}

// 默认情况：返回一个 404 Not Found
header("HTTP/1.0 404 Not Found");
echo "<h1>404 Not Found</h1>";