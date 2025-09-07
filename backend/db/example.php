<?php
// 文件路径: /Users/lijialin/Desktop/requests/backend/db/example.php

// 引入数据库API
require_once __DIR__ . '/api.php';

// 实例化API类
$api = new DbApi();

// ===================================
// 步骤一：创建新用户和帖子
// ===================================

// 创建一个新用户
$user = new \App\Models\User();
$user->id = \Ramsey\Uuid\Uuid::uuid4()->toString();
$user->username = 'demo_user_' . uniqid();
$user->email = 'demo_user_' . uniqid() . '@example.com';
$user->save();
$authorId = $user->id;

echo "创建了一个新用户，ID: " . $authorId . "\n\n";

// 创建一个市场帖子
$marketPostData = [
    'title' => '出售一个全新的演示商品',
    'content' => '这是一个用于演示CRUD操作的商品。',
    'post_type' => 'market',
    'city' => 'Toronto',
    'province' => 'ON',
    'tags' => ['演示', '测试'],
    'price' => 200,
    'category' => 'electronics',
    'trade_methods' => ['meetup'],
];

$newPost = $api->createPost($authorId, $marketPostData);
$postId = $newPost['id'];

echo "创建了一个市场帖子，ID: " . $postId . "\n";
echo "帖子标题: " . $newPost['title'] . "\n\n";


// ===================================
// 步骤二：读取帖子信息
// ===================================

echo "正在读取ID为 {$postId} 的帖子...\n";
$post = $api->getPost($postId);

if ($post) {
    echo "读取成功，标题是: " . $post['title'] . "\n";
    echo "价格是: " . $post['market_listing']['price'] . " 加元\n";
    echo "发布者是: " . $post['author']['username'] . "\n\n";
} else {
    echo "帖子未找到。\n\n";
}


// ===================================
// 步骤三：更新帖子信息
// ===================================

echo "正在更新帖子 {$postId} 的价格...\n";
$updateData = [
    'title' => '这是一个更新后的演示帖子',
    'market_listing' => [
        'price' => 150, // 价格从200降到150
    ]
];
$updatedPost = $api->updatePost($postId, $updateData);

if ($updatedPost) {
    echo "更新成功，新标题: " . $updatedPost['title'] . "\n";
    echo "新价格: " . $updatedPost['market_listing']['price'] . " 加元\n\n";
} else {
    echo "更新失败。\n\n";
}

// ===================================
// 步骤四：搜索帖子
// ===================================

echo "正在搜索所有城市为 'Toronto' 的帖子...\n";
$searchResults = $api->searchPosts([
    'city' => 'Toronto',
    'post_type' => 'market'
]);

echo "找到 " . count($searchResults) . " 个结果。\n\n";


// ===================================
// 步骤五：删除帖子
// ===================================

echo "正在删除帖子 {$postId}...\n";
$isDeleted = $api->deletePost($postId);

if ($isDeleted) {
    echo "帖子删除成功。\n\n";
} else {
    echo "帖子删除失败。\n\n";
}