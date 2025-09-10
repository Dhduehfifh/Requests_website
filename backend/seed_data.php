<?php
// seed_data.php — 添加测试数据到数据库
declare(strict_types=1);

require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/migrations.php';
migrate($pdo);
require_once __DIR__ . '/api/orm.php';

echo "Adding test data to database...\n";

// 创建测试用户
$testUsers = [
    [
        'username' => 'alice_student',
        'email' => 'alice@mohawkcollege.ca',
        'phone_e164' => '+14165551234',
        'city' => 'Hamilton',
        'school' => 'Mohawk College',
        'language' => 'en'
    ],
    [
        'username' => 'bob_international',
        'email' => 'bob@mohawkcollege.ca',
        'phone_e164' => '+14165551235',
        'city' => 'Hamilton',
        'school' => 'Mohawk College',
        'language' => 'en'
    ],
    [
        'username' => 'chen_xiaoya',
        'email' => 'chen@mohawkcollege.ca',
        'phone_e164' => '+14165551236',
        'city' => 'Hamilton',
        'school' => 'Mohawk College',
        'language' => 'zh'
    ],
    [
        'username' => 'mike_johnson',
        'email' => 'mike@mohawkcollege.ca',
        'phone_e164' => '+14165551237',
        'city' => 'Hamilton',
        'school' => 'Mohawk College',
        'language' => 'en'
    ],
    [
        'username' => 'sarah_wilson',
        'email' => 'sarah@mohawkcollege.ca',
        'phone_e164' => '+14165551238',
        'city' => 'Toronto',
        'school' => 'University of Toronto',
        'language' => 'en'
    ]
];

$userIds = [];
foreach ($testUsers as $userData) {
    try {
        $user = User::insert($userData);
        $userIds[] = $user['id'];
        echo "Created user: {$user['username']} ({$user['id']})\n";
    } catch (Exception $e) {
        echo "User {$userData['username']} already exists or error: {$e->getMessage()}\n";
        // 尝试查找现有用户
        $existing = User::list(['username' => $userData['username']]);
        if (!empty($existing)) {
            $userIds[] = $existing[0]['id'];
        }
    }
}

// 创建测试帖子
$testPosts = [
    [
        'author_id' => $userIds[0],
        'title' => 'Looking for study buddy for COMP-10205',
        'content' => 'Anyone interested in studying Data Structures and Algorithms together? We can meet at the library. Check out this helpful resource: https://leetcode.com/problemset/all/',
        'post_type' => 'lfg',
        'city' => 'Hamilton',
        'province' => 'ON',
        'tags' => ['study', 'DSA', 'COMP-10205'],
        'visibility' => 'public',
        'status' => 'active',
        'images' => []
    ],
    [
        'author_id' => $userIds[1],
        'title' => 'MacBook Pro 13" for Sale',
        'content' => 'Selling my MacBook Pro 13" (2020) in excellent condition. Perfect for students! More details here: https://www.apple.com/macbook-pro-13/',
        'post_type' => 'market',
        'city' => 'Hamilton',
        'province' => 'ON',
        'tags' => ['electronics', 'macbook', 'laptop'],
        'visibility' => 'public',
        'status' => 'active',
        'images' => []
    ],
    [
        'author_id' => $userIds[2],
        'title' => '寻找室友 - 爱干净安静的小伙伴',
        'content' => '寻找室友一起合租，要求爱干净、安静。房子位置很好，靠近学校。参考房源信息：https://www.rentals.ca/',
        'post_type' => 'housing',
        'city' => 'Hamilton',
        'province' => 'ON',
        'tags' => ['租房', '室友', '合租'],
        'visibility' => 'public',
        'status' => 'active',
        'images' => []
    ],
    [
        'author_id' => $userIds[3],
        'title' => 'Coffee Study Group - This Weekend',
        'content' => 'Join us for a coffee study session this Saturday! We\'ll meet at Tim Hortons. Here\'s the location: https://maps.google.com/?q=tim+hortons+hamilton',
        'post_type' => 'lfg',
        'city' => 'Hamilton',
        'province' => 'ON',
        'tags' => ['study', 'coffee', 'weekend'],
        'visibility' => 'public',
        'status' => 'active',
        'images' => []
    ],
    [
        'author_id' => $userIds[4],
        'title' => 'Textbook Exchange - Math 101',
        'content' => 'Selling Math 101 textbook, barely used. Also looking for Physics 201 book. Check the course requirements: https://www.mohawkcollege.ca/programs/mathematics',
        'post_type' => 'market',
        'city' => 'Toronto',
        'province' => 'ON',
        'tags' => ['textbook', 'math', 'exchange'],
        'visibility' => 'public',
        'status' => 'active',
        'images' => []
    ],
    [
        'author_id' => $userIds[0],
        'title' => 'Campus Event - International Students Meetup',
        'content' => 'Join our monthly meetup for international students! Great way to make friends. Event details: https://www.eventbrite.com/',
        'post_type' => 'lfg',
        'city' => 'Hamilton',
        'province' => 'ON',
        'tags' => ['event', 'international', 'meetup'],
        'visibility' => 'public',
        'status' => 'active',
        'images' => []
    ]
];

$postIds = [];
foreach ($testPosts as $postData) {
    try {
        $post = ForumPost::insert($postData);
        $postIds[] = $post['id'];
        echo "Created post: {$post['title']} ({$post['id']})\n";
    } catch (Exception $e) {
        echo "Error creating post: {$e->getMessage()}\n";
    }
}

// 创建市场列表
$marketListings = [
    [
        'forum_post_id' => $postIds[1], // MacBook Pro post
        'category' => 'electronics',
        'price' => 1200.00,
        'trade_methods' => ['meetup', 'pickup']
    ],
    [
        'forum_post_id' => $postIds[4], // Textbook post
        'category' => 'books',
        'price' => 50.00,
        'trade_methods' => ['meetup', 'delivery']
    ]
];

foreach ($marketListings as $listingData) {
    try {
        $listing = MarketListing::insert($listingData);
        echo "Created market listing: {$listing['id']}\n";
    } catch (Exception $e) {
        echo "Error creating market listing: {$e->getMessage()}\n";
    }
}

// 创建对话和消息
$conversations = [
    [
        'user_a' => $userIds[0],
        'user_b' => $userIds[1]
    ],
    [
        'user_a' => $userIds[0],
        'user_b' => $userIds[2]
    ],
    [
        'user_a' => $userIds[1],
        'user_b' => $userIds[3]
    ]
];

$convIds = [];
foreach ($conversations as $convData) {
    try {
        $conv = Conversation::insert($convData);
        $convIds[] = $conv['id'];
        echo "Created conversation: {$conv['id']}\n";
    } catch (Exception $e) {
        echo "Error creating conversation: {$e->getMessage()}\n";
    }
}

// 创建测试消息
$testMessages = [
    [
        'conv_id' => $convIds[0],
        'sender_id' => $userIds[1],
        'content' => 'Hi! I saw your post about studying DSA. I\'m interested in joining!',
        'images' => [],
        'ref_post_id' => $postIds[0]
    ],
    [
        'conv_id' => $convIds[0],
        'sender_id' => $userIds[0],
        'content' => 'Great! When would you like to meet?',
        'images' => []
    ],
    [
        'conv_id' => $convIds[1],
        'sender_id' => $userIds[2],
        'content' => '你好！我看到你在找室友，我很有兴趣了解更多信息。',
        'images' => []
    ],
    [
        'conv_id' => $convIds[2],
        'sender_id' => $userIds[3],
        'content' => 'Is the MacBook still available? I can meet this weekend.',
        'images' => [],
        'ref_post_id' => $postIds[1]
    ]
];

foreach ($testMessages as $messageData) {
    try {
        $message = Message::insert($messageData);
        echo "Created message: {$message['id']}\n";
    } catch (Exception $e) {
        echo "Error creating message: {$e->getMessage()}\n";
    }
}

echo "Test data seeding completed!\n";
echo "Users created: " . count($userIds) . "\n";
echo "Posts created: " . count($postIds) . "\n";
echo "Conversations created: " . count($convIds) . "\n";
