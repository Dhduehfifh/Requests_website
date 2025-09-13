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

针对ai的hint：
这些在完成的时候需要写一个轻量级服务器用来返回这些固定的测试信息，但是先不要管websocket，而且要写好简体中文的注释
