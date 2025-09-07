<?php
// 文件路径: /Users/lijialin/Desktop/requests/backend/db/index.php

use Illuminate\Database\Capsule\Manager as Capsule;
use Ramsey\Uuid\Uuid;

// 引入 api.php，这将自动加载所有依赖和模型
require_once __DIR__ . '/api.php';

// 实例化数据库操作类
$api = new DbApi();

// --- 第 0 步：手动运行数据库迁移以创建表 ---
// 注意: 这部分代码在第一次成功运行后就可以注释掉了。
echo "--- 正在检查并创建数据库表... --- \n";
try {
    // 检查并创建 'users' 表
    if (!Capsule::schema()->hasTable('users')) {
        Capsule::schema()->create('users', function ($table) {
            $table->uuid('id')->primary();
            $table->string('phone_e164', 15)->nullable()->unique();
            $table->string('email', 255)->nullable()->unique();
            $table->date('birthday')->nullable();
            $table->string('username', 30)->unique();
            $table->string('avatar_url', 255)->nullable();
            $table->string('school', 100)->nullable();
            $table->string('city', 50)->nullable();
            $table->string('language', 10)->nullable();
            $table->timestamp('banned_until')->nullable();
            $table->timestamps();
        });
        echo " 'users' 表创建成功。\n";
    }

    // 检查并创建 'forum_posts' 表
    if (!Capsule::schema()->hasTable('forum_posts')) {
        Capsule::schema()->create('forum_posts', function ($table) {
            $table->uuid('id')->primary();
            $table->uuid('author_id');
            $table->string('title', 150);
            $table->text('content');
            $table->string('city', 50)->nullable();
            $table->string('province', 50)->nullable();
            $table->string('status')->default('active');
            $table->string('post_type');
            $table->json('tags')->nullable();
            $table->timestamps();
            $table->foreign('author_id')->references('id')->on('users');
            $table->index(['city', 'province', 'created_at', 'author_id']);
        });
        echo " 'forum_posts' 表创建成功。\n";
    }

    // 检查并创建 'market_listings' 表
    if (!Capsule::schema()->hasTable('market_listings')) {
        Capsule::schema()->create('market_listings', function ($table) {
            $table->uuid('id')->primary();
            $table->uuid('forum_post_id')->unique();
            $table->string('category');
            $table->integer('price')->nullable();
            $table->json('trade_methods')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
            $table->foreign('forum_post_id')->references('id')->on('forum_posts')->onDelete('cascade');
        });
        echo " 'market_listings' 表创建成功。\n";
    }

    // 检查并创建 'housing_listings' 表
    if (!Capsule::schema()->hasTable('housing_listings')) {
        Capsule::schema()->create('housing_listings', function ($table) {
            $table->uuid('id')->primary();
            $table->uuid('forum_post_id')->unique();
            $table->string('address')->nullable();
            $table->string('unit_number')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('housing_type');
            $table->integer('rent')->nullable();
            $table->string('rent_unit')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
            $table->foreign('forum_post_id')->references('id')->on('forum_posts')->onDelete('cascade');
        });
        echo " 'housing_listings' 表创建成功。\n";
    }

    // 检查并创建 'lfg_posts' 表
    if (!Capsule::schema()->hasTable('lfg_posts')) {
        Capsule::schema()->create('lfg_posts', function ($table) {
            $table->uuid('id')->primary();
            $table->uuid('forum_post_id')->unique();
            $table->string('topic', 100);
            $table->integer('people_needed')->nullable();
            $table->integer('total_expected')->nullable();
            $table->timestamps();
            $table->foreign('forum_post_id')->references('id')->on('forum_posts')->onDelete('cascade');
        });
        echo " 'lfg_posts' 表创建成功。\n";
    }
    
    // 检查并创建 'conversations' 表
    if (!Capsule::schema()->hasTable('conversations')) {
        Capsule::schema()->create('conversations', function ($table) {
            $table->uuid('id')->primary();
            $table->uuid('user_a');
            $table->uuid('user_b');
            $table->timestamp('last_msg_at');
            $table->timestamps();
            $table->unique(['user_a', 'user_b']);
            $table->foreign('user_a')->references('id')->on('users');
            $table->foreign('user_b')->references('id')->on('users');
        });
        echo " 'conversations' 表创建成功。\n";
    }
    
    // 检查并创建 'messages' 表
    if (!Capsule::schema()->hasTable('messages')) {
        Capsule::schema()->create('messages', function ($table) {
            $table->uuid('id')->primary();
            $table->uuid('conv_id');
            $table->uuid('sender_id');
            $table->text('content');
            $table->timestamps();
            $table->foreign('conv_id')->references('id')->on('conversations')->onDelete('cascade');
            $table->foreign('sender_id')->references('id')->on('users');
        });
        echo " 'messages' 表创建成功。\n";
    }
} catch (Exception $e) {
    echo "创建数据库表时出错： " . $e->getMessage() . "\n";
}
echo "--- 数据库表创建/检查完毕。 --- \n\n";

// --- 以下是原来的测试脚本，无需修改 ---
echo "--- 开始测试 --- \n\n";

// --- 第 1 步：创建用户 ---
echo "1. 正在创建测试用户...\n";
$user = new \App\Models\User();
$user->id = Uuid::uuid4()->toString();
$user->username = 'tester_' . uniqid();
$user->email = 'testuser_' . uniqid() . '@example.com';
$user->save();
$authorId = $user->id;
echo "用户创建成功，ID: " . $authorId . "\n\n";

// --- 第 2 步：创建三种不同类型的帖子 ---
echo "2. 正在创建三种不同类型的帖子...\n";

// 创建一个普通论坛帖
$generalPostData = [
    'title' => '我的第一篇普通论坛帖',
    'content' => '这是我发布的第一个通用帖子。',
    'post_type' => 'general',
    'city' => 'Toronto',
    'province' => 'ON',
    'tags' => ['hello-world', '测试'],
];
$generalPost = $api->createPost($authorId, $generalPostData);
echo "普通帖创建成功，ID: " . $generalPost['id'] . "\n";

// 创建一个市场帖子
$marketPostData = [
    'title' => '出售二手笔记本电脑',
    'content' => '自用笔记本，九成新，运行流畅。',
    'post_type' => 'market',
    'city' => 'Vancouver',
    'province' => 'BC',
    'tags' => ['二手', '电脑', 'MacBook'],
    'price' => 1500,
    'category' => 'electronics',
    'trade_methods' => ['meetup', 'shipping'],
];
$marketPost = $api->createPost($authorId, $marketPostData);
echo "市场帖创建成功，ID: " . $marketPost['id'] . "\n";

// 创建一个房源帖子
$housingPostData = [
    'title' => 'Downtown 一室一厅公寓出租',
    'content' => '近地铁站，交通便利。',
    'post_type' => 'housing',
    'city' => 'Montreal',
    'province' => 'QC',
    'tags' => ['出租', '公寓'],
    'rent' => 1800,
    'housing_type' => 'apartment',
    'rent_unit' => 'month',
];
$housingPost = $api->createPost($authorId, $housingPostData);
echo "房源帖创建成功，ID: " . $housingPost['id'] . "\n\n";

// --- 第 3 步：查询一个帖子并验证信息 ---
echo "3. 正在查询市场帖子信息...\n";
$retrievedPost = $api->getPost($marketPost['id']);
if ($retrievedPost) {
    echo "查询成功，标题: " . $retrievedPost['title'] . "\n";
    echo "价格: " . $retrievedPost['market_listing']['price'] . " 加元\n";
    echo "发布者: " . $retrievedPost['author']['username'] . "\n\n";
} else {
    echo "查询失败。\n\n";
}

// --- 第 4 步：更新一个帖子 ---
echo "4. 正在更新市场帖子的价格...\n";
$updateData = [
    'content' => '价格可议，急售。',
    'market_listing' => [
        'price' => 1400,
    ]
];
$updatedPost = $api->updatePost($marketPost['id'], $updateData);
if ($updatedPost) {
    echo "更新成功，新价格: " . $updatedPost['market_listing']['price'] . " 加元\n\n";
} else {
    echo "更新失败。\n\n";
}

// --- 第 5 步：搜索帖子 ---
echo "5. 正在搜索所有城市为 'Vancouver' 的帖子...\n";
$searchResults = $api->searchPosts([
    'city' => 'Vancouver'
]);
echo "找到 " . count($searchResults) . " 个帖子。\n\n";

// --- 第 6 步：删除一个帖子 ---
echo "6. 正在删除普通论坛帖...\n";
$isDeleted = $api->deletePost($generalPost['id']);
if ($isDeleted) {
    echo "帖子删除成功。\n";
} else {
    echo "帖子删除失败。\n";
}

echo "\n--- 测试结束 --- \n";