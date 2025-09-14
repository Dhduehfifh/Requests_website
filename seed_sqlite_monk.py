# seed_sqlite_mock.py
# 作用：
# - 创建 SQLite 文件 cheese_mock.db
# - 建表（严格按你的 Schema）
# - 写入固定演示数据（每次运行结果一致，便于前后端对接）
#
# 用法：
#   python3 seed_sqlite_mock.py
#
# 生成后你可以直接启动 Flask（使用这个 DB 当“真库”）

import sqlite3
from pathlib import Path

DB_PATH = Path("cheese_mock.db")

DDL = r"""
PRAGMA foreign_keys = ON;

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

-- tags：标签字典
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

-- 索引建议
CREATE INDEX IF NOT EXISTS idx_posts_user   ON posts(user_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type   ON posts(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_likes_user   ON likes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fav_user     ON favorites(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follow_follower  ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follow_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_msg_conv     ON messages(conversation_id, created_at DESC);
"""

def reset_tables(conn: sqlite3.Connection):
    cur = conn.cursor()
    tables = [
        "conversation_participants", "messages", "conversations",
        "post_tags", "tags",
        "favorites", "likes", "comments", "post_images", "posts",
        "follows",
        "users"
    ]
    for t in tables:
        cur.execute(f"DELETE FROM {t};")
        cur.execute("DELETE FROM sqlite_sequence WHERE name=?", (t,))
    conn.commit()

def seed_data(conn: sqlite3.Connection):
    cur = conn.cursor()

    # users
    users = [
        (1, "alice", "alice@example.com", "pbkdf2:sha256:***", "Alice Lee",
         "UBC CS 学生", "wechat: alice123", "111-222-3333", "Vancouver", "UBC", "CS", "大三",
         "2003-03-03", '["#羽毛球","#摄影"]', "https://cdn.cheese.app/avatars/1.jpg", "老熟人/活跃用户",
         "2025-09-10T10:00:00Z", "2025-09-10T10:00:00Z", 1),

        (2, "tom", "tom@example.com", "pbkdf2:sha256:***", "Tom Wang",
         "经济学在读", "wechat: tomwang", "222-333-4444", "Vancouver", "UBC", "Econ", "大二",
         "2004-05-05", '["#篮球","#吉他"]', "https://cdn.cheese.app/avatars/2.jpg", "新晋活跃",
         "2025-09-10T10:00:00Z", "2025-09-10T10:00:00Z", 1),

        (3, "mia", "mia@example.com", "pbkdf2:sha256:***", "Mia Chen",
         "多伦多留学生", "wechat: miami", "333-444-5555", "Toronto", "UofT", "Math", "大四",
         "2002-11-11", '["#电影","#咖啡"]', "https://cdn.cheese.app/avatars/3.jpg", "内容达人",
         "2025-09-10T10:00:00Z", "2025-09-10T10:00:00Z", 1),
    ]
    cur.executemany("""
        INSERT INTO users
        (id,username,email,password_hash,name,resume,contect,phone,city,school,major,grade,birthday,
         hobbies_json,avatar,achevements,created_at,updated_at,is_active)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, users)

    # follows（tom 关注 alice；mia 关注 alice & tom）
    follows = [
        (1, 2, 1, "2025-09-10T11:00:00Z"),  # tom -> alice
        (2, 3, 1, "2025-09-10T11:05:00Z"),  # mia -> alice
        (3, 3, 2, "2025-09-10T11:06:00Z"),  # mia -> tom
    ]
    cur.executemany("""
        INSERT INTO follows (id, follower_id, following_id, created_at)
        VALUES (?,?,?,?)
    """, follows)

    # posts（六种类型各来点）
    posts = [
        # id, user_id, type, title, content, slug, like_count, favorite_count, comment_count, created_at, updated_at, status
        (101, 1, "rent",       "UBC 附近一居室", "步行到校，拎包入住", "ubc-租房", 12, 5, 3, "2025-09-11T08:00:00Z", "2025-09-11T12:00:00Z", "active"),
        (102, 1, "forum",      "课程推荐贴",     "CPSC 110/210 经验分享", "课程推荐", 7, 2, 1, "2025-09-12T09:00:00Z", "2025-09-12T09:30:00Z", "active"),
        (103, 2, "secondhand", "显示器转让",     "九成新 27 寸，含支架", "二手-显示器", 20, 12, 9, "2025-09-10T10:00:00Z", "2025-09-10T10:00:00Z", "active"),
        (104, 2, "teamup",     "周末羽毛球组队", "黄金以上来！", "羽毛球-组队", 9, 3, 2, "2025-09-12T18:00:00Z", "2025-09-12T18:30:00Z", "active"),
        (105, 3, "rideshare",  "多伦多→滑铁卢拼车", "周五 3 PM 出发", "拼车-多伦多-滑铁卢", 4, 1, 0, "2025-09-13T08:00:00Z", "2025-09-13T08:00:00Z", "active"),
        (106, 3, "confession", "匿名告白",       "喜欢你的微笑", "匿名-告白", 3, 0, 0, "2025-09-12T22:00:00Z", "2025-09-12T22:00:00Z", "active"),
    ]
    cur.executemany("""
        INSERT INTO posts
        (id,user_id,type,title,content,slug,like_count,favorite_count,comment_count,created_at,updated_at,status)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    """, posts)

    # post_images（封面 + 多图）
    post_images = [
        (1, 101, "https://cdn.cheese.app/post-images/101/0.jpg", 0),
        (2, 101, "https://cdn.cheese.app/post-images/101/1.jpg", 1),
        (3, 103, "https://cdn.cheese.app/post-images/103/0.jpg", 0),
        (4, 104, "https://cdn.cheese.app/post-images/104/0.jpg", 0),
        (5, 105, "https://cdn.cheese.app/post-images/105/0.jpg", 0),
    ]
    cur.executemany("""
        INSERT INTO post_images (id, post_id, image_url, order_index)
        VALUES (?,?,?,?)
    """, post_images)

    # tags & post_tags
    tags = [
        (1, "租房"), (2, "UBC"), (3, "二手"),
        (4, "羽毛球"), (5, "拼车"), (6, "匿名"), (7, "论坛")
    ]
    cur.executemany("INSERT INTO tags (id, name) VALUES (?,?)", tags)

    post_tags = [
        (101, 1), (101, 2),           # 租房 + UBC
        (102, 7),                     # 论坛
        (103, 3),                     # 二手
        (104, 4),                     # 羽毛球
        (105, 5),                     # 拼车
        (106, 6)                      # 匿名
    ]
    cur.executemany("INSERT INTO post_tags (post_id, tag_id) VALUES (?,?)", post_tags)

    # comments（含楼中楼）
    comments = [
        (10001, 101, 2, None,   "请问允许宠物吗？", "2025-09-11T09:00:00Z"),  # tom -> 租房帖
        (10002, 101, 1, 10001, "可小型犬，需押金", "2025-09-11T09:15:00Z"),  # alice 回复
        (10003, 103, 3, None,   "还有保修吗？",   "2025-09-10T11:00:00Z"),  # mia -> 二手
    ]
    cur.executemany("""
        INSERT INTO comments (id, post_id, user_id, parent_id, content, created_at)
        VALUES (?,?,?,?,?,?)
    """, comments)

    # likes（点赞）
    likes = [
        (1, 2, 101, "2025-09-11T09:05:00Z"),  # tom 点赞 alice 的租房帖
        (2, 3, 101, "2025-09-11T09:06:00Z"),  # mia 点赞 alice 的租房帖
        (3, 1, 103, "2025-09-10T10:30:00Z"),  # alice 点赞 tom 的二手帖
    ]
    cur.executemany("""
        INSERT INTO likes (id, user_id, post_id, created_at)
        VALUES (?,?,?,?)
    """, likes)

    # favorites（收藏）
    favorites = [
        (1, 2, 101, "2025-09-11T10:00:00Z"),  # tom 收藏 alice 的租房帖
        (2, 1, 103, "2025-09-10T10:40:00Z"),  # alice 收藏 tom 的二手帖
    ]
    cur.executemany("""
        INSERT INTO favorites (id, user_id, post_id, created_at)
        VALUES (?,?,?,?)
    """, favorites)

    # conversations & participants
    conversations = [
        (777, "2025-09-12T08:59:00Z", "2025-09-12T09:01:00Z", "private"),  # alice <-> tom
        (778, "2025-09-12T22:10:00Z", "2025-09-12T22:12:00Z", "private"),  # tom <-> mia
    ]
    cur.executemany("""
        INSERT INTO conversations (id, created_at, updated_at, type)
        VALUES (?,?,?,?)
    """, conversations)

    participants = [
        (1, 777, 1, "2025-09-12T08:59:00Z"),
        (2, 777, 2, "2025-09-12T08:59:00Z"),
        (3, 778, 2, "2025-09-12T22:10:00Z"),
        (4, 778, 3, "2025-09-12T22:10:00Z"),
    ]
    cur.executemany("""
        INSERT INTO conversation_participants (id, conversation_id, user_id, joined_at)
        VALUES (?,?,?,?)
    """, participants)

    # messages
    messages = [
        (5001, 777, 1, "你好，在看房吗？", "text", "2025-09-12T08:59:00Z"),  # alice -> tom
        (5002, 777, 2, "嗨，有空看一下这间房吗？", "text", "2025-09-12T09:00:00Z"), # tom -> alice
        (5003, 777, 1, "可以，下午？", "text", "2025-09-12T09:01:00Z"),         # alice -> tom
        (5004, 778, 2, "嗨，周末打球？", "text", "2025-09-12T22:11:00Z"),      # tom -> mia
        (5005, 778, 3, "好啊！", "text", "2025-09-12T22:12:00Z"),               # mia -> tom
    ]
    cur.executemany("""
        INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at)
        VALUES (?,?,?,?,?,?)
    """, messages)

    conn.commit()

def main():
    # 重新生成
    if DB_PATH.exists():
        DB_PATH.unlink()
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(DDL)
    reset_tables(conn)
    seed_data(conn)
    conn.close()
    print(f"✅ 完成：{DB_PATH.resolve()} 已初始化并写入固定演示数据。")

if __name__ == "__main__":
    main()