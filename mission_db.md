SQLite 表结构

说明：
	•	所有时间字段统一用 TEXT 保存 ISO8601（SQLite 习惯用法），也可用 INTEGER 保存时间戳。
	•	外键有效需 PRAGMA foreign_keys = ON;。
	•	字段命名尽量保持和你描述一致（包括 achevements、contect、sender_phpto、unreaded_msg 等）。


-- users：用户基本表
CREATE TABLE IF NOT EXISTS users (
  id               INTEGER PRIMARY KEY,                             -- 用户ID
  username         TEXT    NOT NULL COLLATE NOCASE UNIQUE,          -- 用户名，不可空，大小写不敏感唯一
  email            TEXT    COLLATE NOCASE UNIQUE,                   -- 邮箱，大小写不敏感唯一（ASCII）
  password_hash    TEXT    NOT NULL,                                -- 密码（加密），不可空
  phone            TEXT    UNIQUE,                                  -- 手机号，唯一
  city             TEXT,                                            -- 城市
  school           TEXT,                                            -- 学校
  major            TEXT,                                            -- 专业
  birthday         TEXT,                                            -- 生日，存 ISO 日期 "YYYY-MM-DD"
  description      TEXT,                                            -- 描述
  avatar_url       TEXT,                                            -- 头像
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),  --ISO-8601格式
  updated_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  is_active        INTEGER NOT NULL DEFAULT 1,

  -- 检查is_active是否为boolean
  CHECK (is_active IN (0,1)),
  -- 检查生日格式
  CHECK (birthday IS NULL OR strftime('%Y-%m-%d', birthday) = birthday),
  -- 检查手机号内容及长度
  CHECK (phone IS NULL OR (phone GLOB '+[0-9]*' AND length(phone) BETWEEN 9 AND 16))

  -- 维护 updated_at
  DROP TRIGGER IF EXISTS trg_users_touch_updated_at;
  CREATE TRIGGER trg_users_touch_updated_at
  AFTER UPDATE ON users
  BEGIN
    UPDATE users
    SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
    WHERE id = OLD.id;
  END;
);


-- follows：关注关系
CREATE TABLE IF NOT EXISTS follows (
  id            INTEGER PRIMARY KEY,
  follower_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(follower_id, following_id),
  -- 保证两者不相等
  CHECK (follower_id <> following_id)
);
-- 索引
CREATE INDEX IF NOT EXISTS idx_follows_follower  ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);


CREATE TABLE IF NOT EXISTS posts (
  id               INTEGER PRIMARY KEY,                                      -- 帖子ID
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- 外键，指向用户ID
  type             TEXT    NOT NULL,                                         -- 帖子类型
  title            TEXT    NOT NULL,                                         -- 标题
  content          TEXT    NOT NULL,                                         -- 内容
  slug             TEXT    COLLATE NOCASE UNIQUE,                            -- 可用于短链
  like_count       INTEGER NOT NULL DEFAULT 0,                               -- 点赞数
  favorite_count   INTEGER NOT NULL DEFAULT 0,                               -- 收藏数
  comment_count    INTEGER NOT NULL DEFAULT 0,                               -- 回复数
  created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  status           TEXT    NOT NULL DEFAULT 'active'                         -- active | closed | deleted
);
-- 自动更新时间戳
DROP TRIGGER IF EXISTS trg_posts_touch_updated_at;
CREATE TRIGGER trg_posts_touch_updated_at
AFTER UPDATE ON posts
BEGIN
  UPDATE posts
  SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
  WHERE id = OLD.id;
END;


-- post_images：贴文图片（list of url，通过 order_index 控制顺序）
CREATE TABLE IF NOT EXISTS post_images (
  id           INTEGER PRIMARY KEY,
  post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  image_url    TEXT    NOT NULL,
  order_index  INTEGER NOT NULL DEFAULT 0,

  -- 检查长度
  CHECK (length(trim(image_url)) > 0),
  CHECK (order_index >= 0),
  -- 检查重复
  UNIQUE(post_id, order_index),
  UNIQUE(post_id, image_url)
);


-- comments：评论（扁平或树状，靠 parent_id 构建关系）
CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY,
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id  INTEGER,    -- 可为 NULL（顶级评论）
  content    TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),

  -- 检查
  CHECK (length(trim(content)) > 0),
  CHECK (parent_id IS NULL OR parent_id <> id),

  -- 复合外键：父评论必须是同一帖下的评论；删父评级联删子评
  FOREIGN KEY (post_id, parent_id) REFERENCES comments(post_id, id) ON DELETE CASCADE,

  -- 为了支持上面的复合外键，被引用列需要唯一
  UNIQUE(post_id, id)
);
-- 索引
CREATE INDEX IF NOT EXISTS idx_comments_post_created
  ON comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_parent
  ON comments(post_id, parent_id, created_at);

-- 触发器：新增评论
DROP TRIGGER IF EXISTS trg_comments_inc_count;
CREATE TRIGGER trg_comments_inc_count
AFTER INSERT ON comments
BEGIN
  UPDATE posts
  SET comment_count = comment_count + 1
  WHERE id = NEW.post_id;
END;

-- 触发器：删除评论
DROP TRIGGER IF EXISTS trg_comments_dec_count;
CREATE TRIGGER trg_comments_dec_count
AFTER DELETE ON comments
BEGIN
  UPDATE posts
  SET comment_count = CASE WHEN comment_count > 0 THEN comment_count - 1 ELSE 0 END
  WHERE id = OLD.post_id;
END;


-- likes：帖子点赞
DROP TABLE IF EXISTS likes;
CREATE TABLE IF NOT EXISTS likes (
  id         INTEGER PRIMARY KEY,  -- SQLite 无需 AUTOINCREMENT
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(user_id, post_id)
);

-- 自动维护 posts.like_count
DROP TRIGGER IF EXISTS trg_likes_inc_count;
CREATE TRIGGER trg_likes_inc_count
AFTER INSERT ON likes
BEGIN
  UPDATE posts
  SET like_count = like_count + 1
  WHERE id = NEW.post_id;
END;

DROP TRIGGER IF EXISTS trg_likes_dec_count;
CREATE TRIGGER trg_likes_dec_count
AFTER DELETE ON likes
BEGIN
  UPDATE posts
  SET like_count = CASE WHEN like_count > 0 THEN like_count - 1 ELSE 0 END
  WHERE id = OLD.post_id;
END;

DROP TABLE IF EXISTS favorites;
CREATE TABLE IF NOT EXISTS favorites (
  id         INTEGER PRIMARY KEY,  -- SQLite 无需 AUTOINCREMENT
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(user_id, post_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- 自动维护 posts.favorite_count
DROP TRIGGER IF EXISTS trg_favorites_inc_count;
CREATE TRIGGER trg_favorites_inc_count
AFTER INSERT ON favorites
BEGIN
  UPDATE posts
  SET favorite_count = favorite_count + 1
  WHERE id = NEW.post_id;
END;

DROP TRIGGER IF EXISTS trg_favorites_dec_count;
CREATE TRIGGER trg_favorites_dec_count
AFTER DELETE ON favorites
BEGIN
  UPDATE posts
  SET favorite_count = CASE WHEN favorite_count > 0 THEN favorite_count - 1 ELSE 0 END
  WHERE id = OLD.post_id;
END;


-- tags：标签字典（也可直接省略，用 post_tags 直接存 tag 文本）
CREATE TABLE IF NOT EXISTS tags (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL COLLATE NOCASE UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (name = trim(name) AND length(name) BETWEEN 1 AND 50)
);


-- post_tags：帖子-标签 多对多
CREATE TABLE IF NOT EXISTS post_tags (
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id     INTEGER NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (post_id, tag_id)  -- 组合主键防重复
);
-- 索引
CREATE INDEX IF NOT EXISTS idx_post_tags_tag
  ON post_tags(tag_id, created_at);


-- conversations：会话
DROP TABLE IF EXISTS conversations;
CREATE TABLE IF NOT EXISTS conversations (
  id         INTEGER PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  type       TEXT NOT NULL DEFAULT 'private',   -- private | group
  CHECK (type IN ('private','group'))
);
-- 触发器：手动更新会话本身字段时，自动刷新 updated_at
DROP TRIGGER IF EXISTS trg_conversations_touch_updated_at;
CREATE TRIGGER trg_conversations_touch_updated_at
AFTER UPDATE ON conversations
BEGIN
  UPDATE conversations
  SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
  WHERE id = OLD.id;
END;


-- conversation_participants：会话参与者（MVP）
CREATE TABLE IF NOT EXISTS conversation_participants (
  id               INTEGER PRIMARY KEY,
  conversation_id  INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(conversation_id, user_id)
);

-- messages：消息（MVP一致化）
CREATE TABLE IF NOT EXISTS messages (
  id               INTEGER PRIMARY KEY,  -- SQLite 无需 AUTOINCREMENT
  conversation_id  INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content          TEXT    NOT NULL,
  message_type     TEXT    NOT NULL DEFAULT 'text',  -- text | image | file
  created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),

  CHECK (length(trim(content)) > 0),
  CHECK (message_type IN ('text','image','file'))
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_messages_conv_created  ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender_created ON messages(sender_id, created_at);

-- 有新消息时刷新会话的 updated_at（会话列表按最新活跃排序）
DROP TRIGGER IF EXISTS trg_messages_touch_conversation;
CREATE TRIGGER trg_messages_touch_conversation
AFTER INSERT ON messages
BEGIN
  UPDATE conversations
  SET updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
END;
