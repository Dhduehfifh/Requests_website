<?php
// api.php — 仅 JSON 路由（无 HTML）。可在任意入口 include。
// 推荐：在你的入口脚本里 require 'config.php'; require 'migrations.php'; migrate($pdo); require 'orm.php'; require 'api.php';

declare(strict_types=1);

require_once __DIR__.'/config.php';
require_once __DIR__.'/migrations.php';
migrate($pdo);
require_once __DIR__.'/orm.php';
require_once __DIR__.'/validate.php';
require_once __DIR__.'/auth.php';

// --- SSE 推送：messages + prefetch（按 city） ---
function sse_stream(PDO $pdo){
  header('Content-Type: text/event-stream');
  header('Cache-Control: no-cache');
  header('Connection: keep-alive');
  header('X-Accel-Buffering: no'); // 禁用nginx缓冲

  $userId = $_GET['user_id'] ?? null;
  $startTime = time();
  $maxDuration = 25; // 25秒后自动断开

  while(true){
    if (connection_aborted()) break;
    if (time() - $startTime > $maxDuration) break;

    if ($userId) {
      try {
        // 最新消息（近10条）
        $sql="SELECT m.* FROM messages m
              JOIN conversations c ON c.id=m.conv_id
              WHERE c.user_a=:u OR c.user_b=:u
              ORDER BY m.created_at DESC LIMIT 10";
        $st=$pdo->prepare($sql); $st->execute([':u'=>$userId]); $rows=$st->fetchAll(PDO::FETCH_ASSOC);
        echo "event: messages\n";
        echo "data: ".json_encode(['type'=>'messages','data'=>$rows,'ts'=>now_iso()], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n\n";

        // 按用户城市预取帖子（8条）
        $st=$pdo->prepare("SELECT city FROM users WHERE id=:id"); $st->execute([':id'=>$userId]);
        $city=($r=$st->fetch(PDO::FETCH_ASSOC))?$r['city']:null;
        if ($city) {
          $st=$pdo->prepare("SELECT id,title,post_type,city,created_at FROM forum_posts WHERE city=:c AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 8");
          $st->execute([':c'=>$city]); $posts=$st->fetchAll(PDO::FETCH_ASSOC);
          echo "event: prefetch\n";
          echo "data: ".json_encode(['type'=>'prefetch','data'=>$posts,'ts'=>now_iso()], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n\n";
        }
      } catch (Exception $e) {
        echo "event: error\n";
        echo "data: ".json_encode(['type'=>'error','message'=>$e->getMessage()], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n\n";
        break;
      }
    }
    
    @ob_flush(); @flush();
    sleep(5); // 减少到5秒
  }
  
  echo "event: close\n";
  echo "data: {\"type\":\"close\"}\n\n";
  exit;
}

// --- 通用资源路由 ---
function handle_resource(string $name, string $class){
  $sg = segs();
  if (count($sg)<2 || $sg[0]!=='json' || $sg[1]!==$name) return false;
  $m = method();

  // GET /json/{resource}
  if ($m==='GET' && count($sg)===2) {
    ok($class::list($_GET));
  }

  // GET /json/{resource}/{id}
  if ($m==='GET' && count($sg)===3) {
    $id=$sg[2]; $row=$class::find($id); if(!$row) notfound(); ok($row);
  }

  // POST /json/{resource}
  if ($m==='POST' && count($sg)===2) {
    $b=read_json_body();
    try{ 
      $class::validate($b,true); 
      $row=$class::insert($b); 
      created($row); 
    }
    catch(ValidationException $e){ 
      bad($e->getMessage(), $e->getCode()); 
    }
    catch(Throwable $e){ 
      bad($e->getMessage()); 
    }
  }

  // PUT/PATCH /json/{resource}/{id}
  if (($m==='PUT'||$m==='PATCH') && count($sg)===3) {
    $id=$sg[2]; if(!$class::existsById($id)) notfound();
    $b=read_json_body(); $b['id']=$id;
    try{ 
      $class::validate($b,false); 
      $row=$class::updateById($id,$b); 
      ok($row); 
    }
    catch(ValidationException $e){ 
      bad($e->getMessage(), $e->getCode()); 
    }
    catch(Throwable $e){ 
      bad($e->getMessage()); 
    }
  }

  // DELETE /json/{resource}/{id}
  if ($m==='DELETE' && count($sg)===3) {
    $id=$sg[2]; if(!$class::existsById($id)) notfound();
    ok(['ok'=>$class::deleteById($id)]);
  }

  // 如果资源名匹配但没有命中具体分支
  bad('Bad request');
}

// --- 路由入口 ---
$sg = segs();
if (empty($sg) || $sg[0]!=='json') {
  json_out(['error'=>'Not Found','hint'=>'Use /json/* endpoints'],404);
}

if (method()==='GET' && path()==='/json/health') ok(['ok'=>true,'service'=>'json-api','time'=>now_iso()]);
if (method()==='GET' && path()==='/json/uml') {
  $uml = <<<PUML
@startuml
hide circle
skinparam classAttributeIconSize 0
class User { +id +phone_e164 +email +birthday +username +avatar_url +school +city +language +banned_until +created_at +updated_at }
class ForumPost { +id +author_id +title +content +city +province +tags +visibility +post_type +status +images +created_at +updated_at +deleted_at }
class ForumComment { +id +post_id +author_id +content +created_at +updated_at +deleted_at }
class MarketListing { +id +forum_post_id +category +price +trade_methods +created_at +updated_at }
class HousingListing { +id +forum_post_id +address +unit_number +city +province +postal_code +housing_type +housing_type_other +rent +rent_unit +created_at +updated_at }
class LfgPost { +id +forum_post_id +topic +people_needed +total_expected +online +created_at +updated_at }
class Conversation { +id +user_a +user_b +created_at +updated_at }
class Message { +id +conv_id +sender_id +content +images +ref_post_id +created_at +updated_at }
User "1" -- "0..*" ForumPost : writes >
ForumPost "1" -- "0..*" ForumComment : has >
ForumPost "1" -- "0..1" MarketListing : specializes >
ForumPost "1" -- "0..1" HousingListing : specializes >
ForumPost "1" -- "0..1" LfgPost : specializes >
User "1" -- "0..*" ForumComment : writes >
User "1" -- "0..*" Conversation : participates >
Conversation "1" -- "0..*" Message : contains >
@enduml
PUML;
  ok(['plantuml'=>$uml]);
}
if (method()==='GET' && path()==='/json/events') sse_stream($pdo);

// 获取认证token
function getAuthToken(): ?string {
  // 从Cookie获取
  if (isset($_COOKIE['auth_token'])) {
    return $_COOKIE['auth_token'];
  }
  
  // 从Authorization header获取
  $headers = getallheaders();
  if (isset($headers['Authorization'])) {
    $auth = $headers['Authorization'];
    if (preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
      return $matches[1];
    }
  }
  
  return null;
}

// 验证用户认证
function requireAuth(): array {
  $token = getAuthToken();
  if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit;
  }
  
  $user = Auth::getCurrentUser($token);
  if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid or expired token']);
    exit;
  }
  
  return $user;
}

// 认证端点
if (method()==='POST' && path()==='/json/auth/login') {
  $data = read_json_body();
  try {
    $result = Auth::login($data['username'], $data['password']);
    setcookie('auth_token', $result['token'], time() + 7*24*3600, '/', '', false, true);
    ok($result);
  } catch (Exception $e) {
    bad($e->getMessage());
  }
}

if (method()==='POST' && path()==='/json/auth/register') {
  $data = read_json_body();
  try {
    $result = Auth::register($data);
    setcookie('auth_token', $result['token'], time() + 7*24*3600, '/', '', false, true);
    ok($result);
  } catch (Exception $e) {
    bad($e->getMessage());
  }
}

if (method()==='POST' && path()==='/json/auth/logout') {
  $token = getAuthToken();
  if ($token) {
    Auth::logout($token);
  }
  setcookie('auth_token', '', time() - 3600, '/', '', false, true);
  ok(['message' => 'Logged out']);
}

if (method()==='GET' && path()==='/json/auth/me') {
  $user = requireAuth();
  ok($user);
}

// 点赞功能
if (method()==='POST' && preg_match('/^\/json\/posts\/([^\/]+)\/like$/', path(), $matches)) {
  $user = requireAuth();
  $postId = $matches[1];
  
  if (!$postId) {
    bad('Post ID required');
  }
  
  try {
    $stmt = $pdo->prepare("
      INSERT OR IGNORE INTO post_likes (id, post_id, user_id, created_at) 
      VALUES (lower(hex(randomblob(16))), ?, ?, datetime('now'))
    ");
    $stmt->execute([$postId, $user['id']]);
    
    // 获取点赞数
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?");
    $stmt->execute([$postId]);
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    ok(['liked' => true, 'count' => $count]);
  } catch (Exception $e) {
    bad($e->getMessage());
  }
}

if (method()==='DELETE' && preg_match('/^\/json\/posts\/([^\/]+)\/like$/', path(), $matches)) {
  $user = requireAuth();
  $postId = $matches[1];
  
  if (!$postId) {
    bad('Post ID required');
  }
  
  try {
    $stmt = $pdo->prepare("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?");
    $stmt->execute([$postId, $user['id']]);
    
    // 获取点赞数
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?");
    $stmt->execute([$postId]);
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    ok(['liked' => false, 'count' => $count]);
  } catch (Exception $e) {
    bad($e->getMessage());
  }
}

// 获取帖子点赞状态和数量
if (method()==='GET' && preg_match('/^\/json\/posts\/([^\/]+)\/likes$/', path(), $matches)) {
  $postId = $matches[1];
  
  if (!$postId) {
    bad('Post ID required');
  }
  
  try {
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?");
    $stmt->execute([$postId]);
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    $liked = false;
    $token = getAuthToken();
    if ($token) {
      $user = Auth::getCurrentUser($token);
      if ($user) {
        $stmt = $pdo->prepare("SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?");
        $stmt->execute([$postId, $user['id']]);
        $liked = $stmt->fetch() !== false;
      }
    }
    
    ok(['count' => $count, 'liked' => $liked]);
  } catch (Exception $e) {
    bad($e->getMessage());
  }
}

// 关注功能
if (method()==='POST' && preg_match('/^\/json\/users\/([^\/]+)\/follow$/', path(), $matches)) {
  $user = requireAuth();
  $targetUserId = $matches[1];
  
  if (!$targetUserId) {
    bad('User ID required');
  }
  
  if ($targetUserId === $user['id']) {
    bad('Cannot follow yourself');
  }
  
  try {
    $stmt = $pdo->prepare("
      INSERT OR IGNORE INTO user_follows (id, follower_id, following_id, created_at) 
      VALUES (lower(hex(randomblob(16))), ?, ?, datetime('now'))
    ");
    $stmt->execute([$user['id'], $targetUserId]);
    
    ok(['following' => true]);
  } catch (Exception $e) {
    bad($e->getMessage());
  }
}

if (method()==='DELETE' && preg_match('/^\/json\/users\/([^\/]+)\/follow$/', path(), $matches)) {
  $user = requireAuth();
  $targetUserId = $matches[1];
  
  if (!$targetUserId) {
    bad('User ID required');
  }
  
  try {
    $stmt = $pdo->prepare("DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?");
    $stmt->execute([$user['id'], $targetUserId]);
    
    ok(['following' => false]);
  } catch (Exception $e) {
    bad($e->getMessage());
  }
}

// 评论功能
if (method()==='POST' && preg_match('/^\/json\/posts\/([^\/]+)\/comments$/', path(), $matches)) {
  $user = requireAuth();
  $postId = $matches[1];
  
  $data = read_json_body();
  $data['post_id'] = $postId;
  $data['author_id'] = $user['id'];
  
  try {
    $comment = ForumComment::insert($data);
    ok($comment);
  } catch (Exception $e) {
    bad($e->getMessage());
  }
}

if (method()==='GET' && preg_match('/^\/json\/posts\/([^\/]+)\/comments$/', path(), $matches)) {
  $postId = $matches[1];
  
  try {
    $stmt = $pdo->prepare("
      SELECT c.*, u.username, u.avatar_url 
      FROM forum_comments c 
      JOIN users u ON c.author_id = u.id 
      WHERE c.post_id = ? AND c.deleted_at IS NULL 
      ORDER BY c.created_at ASC
    ");
    $stmt->execute([$postId]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    ok($comments);
  } catch (Exception $e) {
    bad($e->getMessage());
  }
}

// resources
if (handle_resource('users', User::class) !== false) exit;
if (handle_resource('posts', ForumPost::class) !== false) exit;
if (handle_resource('comments', ForumComment::class) !== false) exit;
if (handle_resource('market_listings', MarketListing::class) !== false) exit;
if (handle_resource('housing_listings', HousingListing::class) !== false) exit;
if (handle_resource('lfg_posts', LfgPost::class) !== false) exit;
if (handle_resource('conversations', Conversation::class) !== false) exit;
if (handle_resource('messages', Message::class) !== false) exit;

// fallback
json_out(['error'=>'Not found'],404);