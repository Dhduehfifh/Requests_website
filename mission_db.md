SQLite 表结构

说明：
	•	所有时间字段统一用 TEXT 保存 ISO8601（SQLite 习惯用法），也可用 INTEGER 保存时间戳。
	•	外键有效需 PRAGMA foreign_keys = ON;。
	•	字段命名尽量保持和你描述一致（包括 achevements、contect、sender_phpto、unreaded_msg 等）。


-- users：用户基本表
CREATE TABLE IF NOT EXISTS users (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  username          TEXT    NOT NULL UNIQUE,
  email             TEXT    UNIQUE,
  password_hash     TEXT,
  name              TEXT,                  -- 真名（可空）
  resume            TEXT,
  contect           TEXT,                  -- 联系方式（按你的拼写）
  phone             TEXT,
  city              TEXT,
  school            TEXT,
  major             TEXT,
  grade             TEXT,                  -- 年级
  birthday          TEXT,                  -- ISO8601
  hobbies_json      TEXT,                  -- ["#羽毛球","#摄影"] 直接存 JSON 文本
  avatar            TEXT,                  -- 头像 URL
  achevements       TEXT,                  -- 保持你的拼写
  created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  is_active         INTEGER NOT NULL DEFAULT 1
);

-- follows：关注关系
CREATE TABLE IF NOT EXISTS follows (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  follower_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(follower_id, following_id)
);

-- posts：贴文主表（六种类型统一在一张表）
-- type: rent | secondhand | teamup | rideshare | forum | confession
CREATE TABLE IF NOT EXISTS posts (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type             TEXT    NOT NULL,
  title            TEXT    NOT NULL,
  content          TEXT    NOT NULL,
  slug             TEXT,                       -- 可用于短链
  like_count       INTEGER NOT NULL DEFAULT 0,
  favorite_count   INTEGER NOT NULL DEFAULT 0,
  comment_count    INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  status           TEXT    NOT NULL DEFAULT 'active'   -- active | closed | deleted
);

-- post_images：贴文图片（list of url，通过 order_index 控制顺序）
CREATE TABLE IF NOT EXISTS post_images (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  image_url    TEXT    NOT NULL,
  order_index  INTEGER NOT NULL DEFAULT 0
);

-- comments：评论（扁平或树状，靠 parent_id 构建关系）
CREATE TABLE IF NOT EXISTS comments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id    INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  content      TEXT    NOT NULL,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- likes：点赞（只对帖子点赞，不对评论点赞，如后续需要可拓展 comment_id）
CREATE TABLE IF NOT EXISTS likes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, post_id)
);

-- favorites：收藏（我的收藏）
CREATE TABLE IF NOT EXISTS favorites (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, post_id)
);

-- tags：标签字典（也可直接省略，用 post_tags 直接存 tag 文本）
CREATE TABLE IF NOT EXISTS tags (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL UNIQUE
);

-- post_tags：贴文-标签 多对多
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- conversations：会话
CREATE TABLE IF NOT EXISTS conversations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  type        TEXT NOT NULL DEFAULT 'private'    -- private | group
);

-- conversation_participants：会话参与者
CREATE TABLE IF NOT EXISTS conversation_participants (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id  INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at        TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(conversation_id, user_id)
);

-- messages：消息
CREATE TABLE IF NOT EXISTS messages (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id  INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content          TEXT    NOT NULL,
  message_type     TEXT    NOT NULL DEFAULT 'text',  -- text | image | file
  created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- chat_list 辅助视图（可选）：用于消息页面 list of 10 的预览（最新消息 + 未读数）
-- 实际可用 SQL 聚合或在后端聚合，这里只给思路，不强制



这个用python的sqlite3 写，然后这个东西暂时不要写curd，这里面有些要求比较复杂，主要就是捋清楚这些表之间的关系