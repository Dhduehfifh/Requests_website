<?php
// 文件路径: /Users/lijialin/Desktop/requests/backend/db/api.php

// 1. 引入必要的 Composer 自动加载文件
require __DIR__ . '/vendor/autoload.php';

// 2. 模拟 Laravel 的 base_path() 函数
if (!function_exists('base_path')) {
    function base_path($path = '')
    {
        // 返回项目的根目录路径
        return __DIR__ . ($path ? DIRECTORY_SEPARATOR . ltrim($path, DIRECTORY_SEPARATOR) : $path);
    }
}

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Ramsey\Uuid\Uuid;

// 3. 引入所有模型和枚举文件
require_once __DIR__ . '/Models/User.php';
require_once __DIR__ . '/Models/ForumPost.php';
require_once __DIR__ . '/Models/ForumComment.php';
require_once __DIR__ . '/Models/MarketListing.php';
require_once __DIR__ . '/Models/HousingListing.php';
require_once __DIR__ . '/Models/LfgPost.php';
require_once __DIR__ . '/Models/Conversation.php';
require_once __DIR__ . '/Models/Message.php';

// 4. 初始化 Eloquent ORM
$capsule = new Capsule;

$databasePath = __DIR__ . '/app.db';
// 在连接之前，检查并创建数据库文件
if (!file_exists($databasePath)) {
    touch($databasePath);
}

$capsule->addConnection([
    'driver'    => 'sqlite',
    'database'  => $databasePath,
    'prefix'    => '',
]);
$capsule->setEventDispatcher(new Dispatcher(new Container));
$capsule->setAsGlobal();
$capsule->bootEloquent();

// 5. 定义数据库操作类
class DbApi {

    public function createPost(string $authorId, array $data): array {
        $post = new \App\Models\ForumPost();
        $post->id = Uuid::uuid4()->toString();
        $post->author_id = $authorId;
        $post->title = $data['title'];
        $post->content = $data['content'];
        $post->post_type = $data['post_type'];
        $post->city = $data['city'] ?? null;
        $post->province = $data['province'] ?? null;
        $post->tags = json_encode($data['tags'] ?? []);
        $post->save();

        switch ($post->post_type) {
            case 'market':
                $listing = new \App\Models\MarketListing();
                $listing->id = Uuid::uuid4()->toString();
                $listing->forum_post_id = $post->id;
                $listing->price = $data['price'] ?? null;
                $listing->category = $data['category'];
                $listing->save();
                break;
            case 'housing':
                $listing = new \App\Models\HousingListing();
                $listing->id = Uuid::uuid4()->toString();
                $listing->forum_post_id = $post->id;
                $listing->rent = $data['rent'] ?? null;
                $listing->housing_type = $data['housing_type'];
                $listing->save();
                break;
            case 'lfg':
                $listing = new \App\Models\LfgPost();
                $listing->id = Uuid::uuid4()->toString();
                $listing->forum_post_id = $post->id;
                $listing->topic = $data['topic'];
                $listing->save();
                break;
        }

        return $post->fresh()->toArray();
    }

    public function getPost(string $postId): ?array {
        $post = \App\Models\ForumPost::with(['author', 'marketListing', 'housingListing', 'lfgPost'])
            ->find($postId);
        return $post ? $post->toArray() : null;
    }

    public function updatePost(string $postId, array $data): ?array {
        $post = \App\Models\ForumPost::find($postId);
        if (!$post) {
            return null;
        }

        $post->fill($data);
        $post->save();

        switch ($post->post_type) {
            case 'market':
                if (isset($data['market_listing'])) {
                    $post->marketListing->fill($data['market_listing'])->save();
                }
                break;
            case 'housing':
                if (isset($data['housing_listing'])) {
                    $post->housingListing->fill($data['housing_listing'])->save();
                }
                break;
            case 'lfg':
                if (isset($data['lfg_post'])) {
                    $post->lfgPost->fill($data['lfg_post'])->save();
                }
                break;
        }

        return $post->fresh()->toArray();
    }

    public function deletePost(string $postId): bool {
        $post = \App\Models\ForumPost::find($postId);
        if (!$post) {
            return false;
        }
        return $post->delete();
    }

    public function searchPosts(array $query): array {
        $posts = \App\Models\ForumPost::query();

        if (isset($query['post_type'])) {
            $posts->where('post_type', $query['post_type']);
        }

        if (isset($query['keyword'])) {
            $posts->where(function ($q) use ($query) {
                $q->where('title', 'like', '%' . $query['keyword'] . '%')
                  ->orWhere('content', 'like', '%' . $query['keyword'] . '%');
            });
        }

        if (isset($query['tag'])) {
            $posts->whereJsonContains('tags', $query['tag']);
        }

        if (isset($query['city'])) {
            $posts->where('city', $query['city']);
        }
        if (isset($query['province'])) {
            $posts->where('province', $query['province']);
        }

        if (isset($query['price_min']) || isset($query['price_max'])) {
            $posts->whereHas('marketListing', function ($q) use ($query) {
                if (isset($query['price_min'])) {
                    $q->where('price', '>=', $query['price_min']);
                }
                if (isset($query['price_max'])) {
                    $q->where('price', '<=', $query['price_max']);
                }
            });
        }
        
        $posts->orderBy('created_at', 'desc');
        $results = $posts->with(['author', 'marketListing', 'housingListing', 'lfgPost'])->get();

        return $results->toArray();
    }
}