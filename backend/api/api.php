<?php
// api.php — 仅 JSON 路由（无 HTML）。可在任意入口 include。
// 推荐：在你的入口脚本里 require 'config.php'; require 'migrations.php'; migrate($pdo); require 'orm.php'; require 'api.php';

declare(strict_types=1);

require_once __DIR__.'/config.php';
require_once __DIR__.'/migrations.php';
migrate($pdo);
require_once __DIR__.'/orm.php';

// --- SSE 推送：messages + prefetch（按 city） ---
function sse_stream(PDO $pdo){
  header('Content-Type: text/event-stream');
  header('Cache-Control: no-cache');
  header('Connection: keep-alive');

  $userId = $_GET['user_id'] ?? null;

  while(true){
    if (connection_aborted()) break;

    if ($userId) {
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
    }
    @ob_flush(); @flush();
    sleep(8);
  }
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
    try{ $class::validate($b,true); $row=$class::insert($b); created($row); }
    catch(Throwable $e){ bad($e->getMessage()); }
  }

  // PUT/PATCH /json/{resource}/{id}
  if (($m==='PUT'||$m==='PATCH') && count($sg)===3) {
    $id=$sg[2]; if(!$class::existsById($id)) notfound();
    $b=read_json_body(); $b['id']=$id;
    try{ $class::validate($b,false); $row=$class::updateById($id,$b); ok($row); }
    catch(Throwable $e){ bad($e->getMessage()); }
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