<?php
// migrations.php — SQLite IF NOT EXISTS 自动建表
declare(strict_types=1);

/** @var PDO $pdo */
function migrate(PDO $pdo): void {
  // users
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  phone_e164 TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  birthday TEXT,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  school TEXT,
  city TEXT,
  language TEXT CHECK (language IN ('zh','en')) DEFAULT 'en',
  banned_until TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
SQL);

  // user_sessions
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  last_access TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
SQL);

  // forum_posts
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS forum_posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  city TEXT,
  province TEXT,
  tags TEXT NOT NULL,           -- JSON string
  visibility TEXT NOT NULL CHECK (visibility IN ('public','friends','private')) DEFAULT 'public',
  post_type TEXT NOT NULL CHECK (post_type IN ('general','market','housing','lfg')),
  status TEXT NOT NULL CHECK (status IN ('active','closed','deleted')) DEFAULT 'active',
  images TEXT NOT NULL,         -- JSON string
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_type ON forum_posts(post_type);
SQL);

  // forum_comments
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS forum_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_comments_post ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON forum_comments(author_id);
SQL);

  // market_listings (1:1)
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS market_listings (
  id TEXT PRIMARY KEY,
  forum_post_id TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('electronics','furniture','home_appliances','vehicles','books','fashion','sports','entertainment','digital','other')),
  price REAL NOT NULL,
  trade_methods TEXT NOT NULL,   -- JSON
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (forum_post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_market_post ON market_listings(forum_post_id);
SQL);

  // housing_listings (1:1)
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS housing_listings (
  id TEXT PRIMARY KEY,
  forum_post_id TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  unit_number TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  housing_type TEXT NOT NULL CHECK (housing_type IN ('house','apartment','condo','townhouse','other')),
  housing_type_other TEXT,
  rent REAL NOT NULL,
  rent_unit TEXT NOT NULL CHECK (rent_unit IN ('year','month','week','day')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (forum_post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_housing_post ON housing_listings(forum_post_id);
SQL);

  // lfg_posts (1:1)
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS lfg_posts (
  id TEXT PRIMARY KEY,
  forum_post_id TEXT NOT NULL UNIQUE,
  topic TEXT NOT NULL,
  people_needed INTEGER,
  total_expected INTEGER,
  online INTEGER NOT NULL CHECK (online IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (forum_post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_lfg_post ON lfg_posts(forum_post_id);
SQL);

  // conversations
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  user_a TEXT NOT NULL,
  user_b TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(user_a, user_b),
  FOREIGN KEY (user_a) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_b) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_conv_a ON conversations(user_a);
CREATE INDEX IF NOT EXISTS idx_conv_b ON conversations(user_b);
SQL);

  // messages
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conv_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT NOT NULL,   -- JSON
  ref_post_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (conv_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ref_post_id) REFERENCES forum_posts(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conv_id);
CREATE INDEX IF NOT EXISTS idx_msg_sender ON messages(sender_id);
SQL);

  // post_likes
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS post_likes (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON post_likes(user_id);
SQL);

  // user_follows
  $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS user_follows (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON user_follows(following_id);
SQL);
}