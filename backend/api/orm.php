<?php
// orm.php — Tiny ORM + Entities + Validation （SQLite JSON字段使用 TEXT 存 JSON）

declare(strict_types=1);

/** @var PDO $pdo */
abstract class Model {
  protected static PDO $pdo;
  protected static string $table = '';
  protected static array $pk = ['id'];
  protected static array $fillable = [];
  protected static array $jsonFields = [];
  protected static array $allowedOrder = ['created_at','updated_at','id'];

  public static function setPDO(PDO $pdo){ static::$pdo = $pdo; }

  public static function find(string $id){
    $tbl=static::$table; $pk=static::$pk[0];
    $st=static::$pdo->prepare("SELECT * FROM {$tbl} WHERE {$pk}=:id LIMIT 1");
    $st->execute([':id'=>$id]); $r=$st->fetch(PDO::FETCH_ASSOC);
    return $r?:null;
  }
  public static function existsById(string $id): bool { return (bool) static::find($id); }

  public static function insert(array $data){
    $data = static::prepare($data,true);
    $cols=array_keys($data);
    $ph=array_map(fn($k)=>":$k",$cols);
    $sql="INSERT INTO ".static::$table." (".implode(',',$cols).") VALUES (".implode(',',$ph).")";
    $st=static::$pdo->prepare($sql);
    $params=[]; foreach($cols as $i=>$k){ $params[$ph[$i]]=$data[$k]; }
    $st->execute($params);
    return $data;
  }

  public static function updateById(string $id, array $data){
    $data = static::prepare($data,false);
    if (empty($data)) return static::find($id);
    $sets=[]; $params=[':id'=>$id];
    foreach($data as $k=>$v){ $sets[]="$k=:$k"; $params[":$k"]=$v; }
    $pk=static::$pk[0];
    $sql="UPDATE ".static::$table." SET ".implode(',',$sets)." WHERE {$pk}=:id";
    $st=static::$pdo->prepare($sql); $st->execute($params);
    return static::find($id);
  }

  public static function deleteById(string $id): bool {
    $tbl=static::$table; $pk=static::$pk[0];
    $st=static::$pdo->prepare("DELETE FROM {$tbl} WHERE {$pk}=:id");
    return $st->execute([':id'=>$id]);
  }

  public static function list(array $q): array {
    $where=[]; $params=[];
    $filters = array_diff_key($q, array_flip(['limit','offset','order','dir']));
    foreach($filters as $k=>$v){
      if ($v === '' || $v === null) continue;
      $where[] = "$k = :$k"; $params[":$k"]=$v;
    }
    $sql="SELECT * FROM ".static::$table;
    if ($where) $sql.=" WHERE ".implode(' AND ',$where);
    $order = in_array(($q['order']??'created_at'), static::$allowedOrder, true) ? ($q['order']??'created_at') : 'created_at';
    $dir   = strtolower($q['dir']??'desc') === 'asc' ? 'asc' : 'desc';
    $sql  .= " ORDER BY {$order} {$dir}";
    $limit = max(1, min(200, (int)($q['limit']??20)));
    $offset= max(0, (int)($q['offset']??0));
    $sql  .= " LIMIT {$limit} OFFSET {$offset}";
    $st=static::$pdo->prepare($sql); $st->execute($params);
    return $st->fetchAll(PDO::FETCH_ASSOC);
  }

  protected static function prepare(array $data, bool $creating): array {
    $clean=[];
    foreach(static::$fillable as $k){
      if (array_key_exists($k,$data)) {
        $v=$data[$k];
        if (in_array($k, static::$jsonFields, true)) $v=json_encode($v, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
        $clean[$k]=$v;
      }
    }
    $now=now_iso();
    if ($creating) {
      if (in_array('id', static::$fillable) && empty($clean['id'])) $clean['id']=uuidv4();
      if (in_array('created_at', static::$fillable) && empty($clean['created_at'])) $clean['created_at']=$now;
    }
    if (in_array('updated_at', static::$fillable)) $clean['updated_at']=$now;
    return $clean;
  }
}

// -------------------- 实体 + 校验 --------------------
class User extends Model {
  protected static string $table='users';
  protected static array  $fillable=['id','phone_e164','email','birthday','username','avatar_url','school','city','language','banned_until','created_at','updated_at'];
  protected static array  $jsonFields=[];
  protected static array  $allowedOrder=['created_at','updated_at','id','username','city'];

  public static function validate(array $d, bool $creating=true){
    validate_user_data($d, $creating);
    
    // Check uniqueness constraints
    foreach (['phone_e164','email','username'] as $u) {
      if (!empty($d[$u])) {
        $sql="SELECT id FROM users WHERE {$u}=:v";
        $params=[':v'=>$d[$u]];
        if (!$creating && !empty($d['id'])) { $sql.=" AND id<>:id"; $params[':id']=$d['id']; }
        $st=self::$pdo->prepare($sql); $st->execute($params);
        if ($st->fetch()) throw new Exception("$u must be unique");
      }
    }
  }
}

class ForumPost extends Model {
  protected static string $table='forum_posts';
  protected static array  $fillable=['id','author_id','title','content','city','province','tags','visibility','post_type','status','images','created_at','updated_at','deleted_at'];
  protected static array  $jsonFields=['tags','images'];
  protected static array  $allowedOrder=['created_at','updated_at','id','author_id','status','post_type'];

  public static function validate(array $d, bool $creating=true){
    validate_forum_post_data($d, $creating);
    
    if ($creating && empty($d['author_id'])) throw new Exception('author_id required');
    if (!empty($d['author_id']) && !User::existsById($d['author_id'])) throw new Exception('author_id not exists');
  }
}

class ForumComment extends Model {
  protected static string $table='forum_comments';
  protected static array  $fillable=['id','post_id','author_id','content','created_at','updated_at','deleted_at'];
  public static function validate(array $d, bool $creating=true){
    if ($creating){ if (empty($d['post_id'])||empty($d['author_id'])) throw new Exception('post_id, author_id required'); }
    if (!empty($d['post_id']) && !ForumPost::existsById($d['post_id'])) throw new Exception('post_id not exists');
    if (!empty($d['author_id']) && !User::existsById($d['author_id'])) throw new Exception('author_id not exists');
  }
}

class MarketListing extends Model {
  protected static string $table='market_listings';
  protected static array  $fillable=['id','forum_post_id','category','price','trade_methods','created_at','updated_at'];
  protected static array  $jsonFields=['trade_methods'];
  protected static array  $allowedOrder=['created_at','updated_at','id','forum_post_id','price','category'];
  public static function validate(array $d, bool $creating=true){
    validate_market_listing_data($d, $creating);
    
    if ($creating && empty($d['forum_post_id'])) throw new Exception('forum_post_id required');
    if (!empty($d['forum_post_id']) && !ForumPost::existsById($d['forum_post_id'])) throw new Exception('forum_post_id not exists');
    
    // 业务约束示例：非 digital 的类目，父帖子必须有 city
    if (!empty($d['category']) && $d['category']!=='digital' && !empty($d['forum_post_id'])){
      $p = ForumPost::find($d['forum_post_id']);
      if ($p && empty($p['city'])) throw new Exception('city required on ForumPost when category!=digital');
    }
  }
}

class HousingListing extends Model {
  protected static string $table='housing_listings';
  protected static array  $fillable=['id','forum_post_id','address','unit_number','city','province','postal_code','housing_type','housing_type_other','rent','rent_unit','created_at','updated_at'];
  public static function validate(array $d, bool $creating=true){
    $types=['house','apartment','condo','townhouse','other'];
    $units=['year','month','week','day'];
    if ($creating && empty($d['forum_post_id'])) throw new Exception('forum_post_id required');
    if (!empty($d['forum_post_id']) && !ForumPost::existsById($d['forum_post_id'])) throw new Exception('forum_post_id not exists');
    if (isset($d['housing_type']) && !in_array($d['housing_type'],$types,true)) throw new Exception('housing_type invalid');
    if (isset($d['rent_unit']) && !in_array($d['rent_unit'],$units,true)) throw new Exception('rent_unit invalid');
    if (isset($d['rent']) && !is_numeric($d['rent'])) throw new Exception('rent must be numeric');
    if (!empty($d['housing_type']) && $d['housing_type']==='other' && empty($d['housing_type_other'])) throw new Exception('housing_type_other required when housing_type=other');
  }
}

class LfgPost extends Model {
  protected static string $table='lfg_posts';
  protected static array  $fillable=['id','forum_post_id','topic','people_needed','total_expected','online','created_at','updated_at'];
  public static function validate(array $d, bool $creating=true){
    if ($creating && empty($d['forum_post_id'])) throw new Exception('forum_post_id required');
    if (!empty($d['forum_post_id']) && !ForumPost::existsById($d['forum_post_id'])) throw new Exception('forum_post_id not exists');
    if (isset($d['online']) && !in_array((int)$d['online'], [0,1], true)) throw new Exception('online must be boolean');
    if (array_key_exists('online',$d) && !$d['online'] && !empty($d['forum_post_id'])){
      $p = ForumPost::find($d['forum_post_id']);
      if ($p && (empty($p['city']) || empty($p['province']))) throw new Exception('city+province required on ForumPost when online=false');
    }
  }
}

class Conversation extends Model {
  protected static string $table='conversations';
  protected static array  $fillable=['id','user_a','user_b','created_at','updated_at'];
  protected static array  $allowedOrder=['created_at','updated_at','id','user_a','user_b'];
  public static function validate(array $d, bool $creating=true){
    if ($creating && (empty($d['user_a'])||empty($d['user_b']))) throw new Exception('user_a, user_b required');
    if (!empty($d['user_a']) && !User::existsById($d['user_a'])) throw new Exception('user_a not exists');
    if (!empty($d['user_b']) && !User::existsById($d['user_b'])) throw new Exception('user_b not exists');
    if (!empty($d['user_a']) && !empty($d['user_b']) && $d['user_a']===$d['user_b']) throw new Exception('user_a != user_b');
    // 唯一会话（无序对）
    if (!empty($d['user_a']) && !empty($d['user_b'])) {
      $sql="SELECT id FROM conversations WHERE (user_a=:a AND user_b=:b) OR (user_a=:b AND user_b=:a)";
      $st=self::$pdo->prepare($sql); $st->execute([':a'=>$d['user_a'],':b'=>$d['user_b']]);
      $row=$st->fetch(PDO::FETCH_ASSOC);
      if ($row && ($creating || $row['id']!==($d['id']??null))) throw new Exception('conversation pair must be unique');
    }
  }
}

class Message extends Model {
  protected static string $table='messages';
  protected static array  $fillable=['id','conv_id','sender_id','content','images','ref_post_id','created_at','updated_at'];
  protected static array  $jsonFields=['images'];
  public static function validate(array $d, bool $creating=true){
    validate_message_data($d, $creating);
    
    if ($creating && (empty($d['conv_id'])||empty($d['sender_id'])||empty($d['content']))) throw new Exception('conv_id, sender_id, content required');
    if (!empty($d['conv_id']) && !Conversation::existsById($d['conv_id'])) throw new Exception('conv_id not exists');
    if (!empty($d['sender_id']) && !User::existsById($d['sender_id'])) throw new Exception('sender_id not exists');
    if (!empty($d['ref_post_id']) && !ForumPost::existsById($d['ref_post_id'])) throw new Exception('ref_post_id not exists');
  }
}

// 绑定 PDO（外部需在引入前设置 $pdo）
User::setPDO($pdo); ForumPost::setPDO($pdo); ForumComment::setPDO($pdo);
MarketListing::setPDO($pdo); HousingListing::setPDO($pdo); LfgPost::setPDO($pdo);
Conversation::setPDO($pdo); Message::setPDO($pdo);