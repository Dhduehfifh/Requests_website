//generate and rearranged by gpt
下面是按你给的“说法/字段名/注释风格”整理好的路由与数据结构（SQLite 表）文档。
说明：不写具体后端实现代码，但字段/URL/Method/入参出参都和真实后端路由保持一致“可落地”。

⸻

用户域（User Domain）

1) 用户信息（进入主页前置拉取）
	•	url: user/${user_id}/mainpage
	•	type: [POST]
	•	uploads:
	•	user_id (string)    // 访问者 id
	•	guest_id (string)   // 被访问的主页用户 id
	•	downloads:
	•	userid (string)
	•	posts (int)         // 发帖总数
	•	likes (int)         // 点赞总数（该用户收到的）
	•	fans (int)          // 粉丝数（followers）
	•	following (int)     // 关注数
	•	rent_post (int)
	•	secondhand_post (int)
	•	normal_post (int)   // 校园论坛
	•	confession_post (int) // 匿名告白
	•	achevements (string) // 保持你的拼写
	•	notes:
	•	进入用户主页的时候先 fetch 这个接口，然后赋值。
	•	同时后端验证用户，需要先登录（未登录则返回 401/403）。

⸻

2) 最近贴文（主页滚动加载）
	•	url: user/${user_id}/Recent_Posts
	•	type: [POST]
	•	uploads:
	•	user_id (string)
	•	guest_id (string)   // 和上面一样，如果相同则直接显示所有信息
	•	（可选）cursor (string) // 翻页用，第一次可不带
	•	downloads:
	•	list of posts（一次性 fetch 只会返回五个，滚动向下会接着 fetch）：
	•	type (string)           // 贴文类型：rent | secondhand | teamup | rideshare | forum | confession
	•	title (string)
	•	description (string)
	•	post_likes (int)
	•	comment_numbers (int)
	•	time (string)
	•	abstract (int)          // 摘要字数或摘要类型标识（按你用法返回）
	•	liked (bool)            // 当前访问者是否点赞过
	•	url (string)            // 点击跳转的链接
	•	next_cursor (string?)     // 没有更多可以为空或不返回

⸻

3) Edit Profile（编辑个人资料）
	•	url: user/${user_id}/Edit_Profile
	•	type: [POST]
	•	downloads（进入页面的时候 fetch 这个 url，然后根据这些写 placeholder）：
	•	username (string)      // 用户名
	•	name (string)          // 真名（考虑去掉也可以保留）
	•	resume (string)
	•	contect (string)       // 保留你的命名（联系信息）
	•	phone (string)
	•	city (string)
	•	school (string?)
	•	major (string?)
	•	grade (string)         // 年级
	•	birthday (date)
	•	hobbies (listof(string)) // 都用 # 开头
	•	notes:
	•	填充 placeholder → 前端把修改后的内容再 POST 回这个接口，保存即完成编辑。

⸻

4) My Collection（我的收藏）
	•	url: user/${user_id}/Collections
	•	type: [GET]
	•	returns: listof（收藏项）
	•	type (string)                 // 贴文类型（六种之一）
	•	title (string)
	•	url (string)                  // 点击可跳转
	•	describe (string)             // 简述
	•	location (list) of string     // 按先后顺序放位置信息（如 城市/校区/楼栋）
	•	time (time)                   // 时间
	•	detail (string)               // 会同时返回多少钱和/或多少人，用特殊符号分割（例如 “¥2800/月|3人”）
	•	notes:
	•	这部分删除（你上面写了“Saved 这部分删除”——如果暂时不要，就先不接）。
	•	若保留，此处为最终“返回长相”。

⸻

5) Settings（设定）
	•	url: user/${user_id}/Settings
	•	type: [POST]
	•	uploads（表单）：
	•	visibility (listof(string)) // visibale contexts（主要用于检查是否返回信息）
	•	language (string)           // zh|en|…（方便后面接入翻译）
	•	（通知部分：让 iOS/Android 系统原生设置代理，不在这里控制）
	•	downloads:
	•	保存结果 OK/FAIL（简单返回即可）

⸻

消息域（Chat / DM）

6) 消息页面（列表）
	•	url: user/${user_id}/Chat
	•	type: [GET]
	•	returns: list of 10
	•	type (string)                  // 普通类型
	•	chat_username (string)         // 对方昵称
	•	chat_url (string)              // 点这一整个 card 跳转
	•	unreaded_msg (int)             // 保持你的命名
	•	newest_msg (string)
	•	notes:
	•	这个的分类（按联系人/按时间）也需要支持在上面点击切换。

7) 进入一个聊天（会话内消息）
	•	url: user/${user_id}/Chat/${oppo_user_id}
	•	type: [GET]
	•	returns: list of 30
	•	type (string)   // sent | received
	•	context (string) // 文本内容（或后续图片/文件时另加字段）
	•	notes:
	•	电话/视频去掉。
	•	可选支持 cursor 翻页（向上/向下拉历史）。

⸻

广场域（Explore / Feed / 搜索）

8) 热门动态（hotsopt）
	•	url: hotsopt/${user_id}
	•	type: [GET]
	•	returns: listof 10
	•	type (string)        // 六种之一：租房 rent / 二手 secondhand / 组队 teamup / 拼车 rideshare / 校园论坛 forum / 匿名告白 confession
	•	title (string)
	•	description (string)
	•	likes (int)
	•	comments (int)

9) 搜索栏目（支持 tags 模糊）
	•	url: search/${user_id}
	•	method: [POST]
	•	uploads:
	•	q (string)           // 搜索关键字（textarea 实时提交）
	•	tags (listof(string)) // 需要带 tag
	•	（可选）cursor (string)
	•	returns: 每 fetch 一次，返回 list of 5
	•	content (string)     // 命中内容摘要
	•	（其余字段按“热门动态/最近贴文”统一）

10) 猜你喜欢（Recommend）
	•	url: recommend/${user_id}
	•	method: [GET]
	•	returns: list of 10
	•	type (string)
	•	title (string)
	•	pic (string, url)
	•	likes (int)
	•	time (datetime)  // 前端自己转时间戳

⸻

帖子域（Post）

11) 帖子详情模板
	•	url: post/${post_id}/${user_id}
	•	method: [GET]
	•	return:
	•	sender_name (string)
	•	sender_phpto (string, url)   // 保持你的拼写（photo）
	•	title (string)
	•	detail (string)
	•	likes (int)
	•	comments (int)
	•	comments_list（建议补充，用于清晰关系）：
	•	comment_id (int)
	•	parent_id (int|null)  // 楼中楼
	•	user_name (string)
	•	user_avatar (url)
	•	content (string)
	•	time (string)
	•	notes:
	•	“评论怎么滤清关系”：用 parent_id 建立树结构；前端可扁平展示或递归展示。

⸻

SQLite 表结构（只给表与字段，尽量贴近你的语言）

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

常用索引（建议）

CREATE INDEX IF NOT EXISTS idx_posts_user   ON posts(user_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type   ON posts(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_likes_user   ON likes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fav_user     ON favorites(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follow_follower  ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follow_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_msg_conv     ON messages(conversation_id, created_at DESC);


⸻

说明与约定
	•	list of urls：统一由后端路由拼好 URL（基址 + path），前端直接渲染为可点击链接。
	•	分页：按你的“每次返回 5/10/30”约定；可使用 cursor（后端生成），前端原样带回。
	•	六种帖子类型：租房（rent），二手（secondhand），组队（teamup），拼车（rideshare），校园论坛（forum），匿名告白（confession）。
	•	搜索：search/${user_id} 里带 q 与 tags (list)，后端做模糊/按标签召回即可。
	•	登录校验：涉及隐私（主页数据、聊天、编辑资料）一律需要登录态校验。
	•	字段拼写：保持你原本写的命名（achevements、contect、sender_phpto、unreaded_msg）。

⸻

如果你想要，我可以把这份路由“模拟数据返回”的 Flask 蓝本也给你（直接 jsonify 出这些字段），你就能一边前端接收渲染、一边迭代真实查询。