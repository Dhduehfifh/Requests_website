<?php
// events.php — 仅 SSE（可选）
declare(strict_types=1);
require_once __DIR__.'/config.php';
require_once __DIR__.'/migrations.php';
migrate($pdo);

// 这里直接用 api.php 里的 sse_stream 实现（复制过来）：
function sse_stream(PDO $pdo){
  header('Content-Type: text/event-stream');
  header('Cache-Control: no-cache');
  header('Connection: keep-alive');

  $userId = $_GET['user_id'] ?? null;
  while(true){
    if (connection_aborted()) break;
    if ($userId) {
      $sql="SELECT m.* FROM messages m JOIN conversations c ON c.id=m.conv_id
            WHERE c.user_a=:u OR c.user_b=:u
            ORDER BY m.created_at DESC LIMIT 10";
      $st=$pdo->prepare($sql); $st->execute([':u'=>$userId]); $rows=$st->fetchAll(PDO::FETCH_ASSOC);
      echo "event: messages\n";
      echo "data: ".json_encode(['type'=>'messages','data'=>$rows,'ts'=>now_iso()], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n\n";

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

sse_stream($pdo);