//genreate and rearranged by chat gpt
好嘞～我把**“路由 + 推送/搜索算法 + JSON 长相 + 任务（离线/定时）”**这一整块，按你的说法和命名习惯整理成一份可直接抄用的说明。重心放在 URL 与 JSON，算法只讲“怎么写”的思路（够你先落地）。

⸻

推送 / 搜索 · 接口与格式（按你的语言风格）

URL 模板（便于拼装）

{
  "url_templates": {
    "base": "https://cheese.app",
    "post": "/p/{id}-{slug}",          "post_desc": "slug 可空，空则 /p/{id}",
    "user": "/u/{id}",
    "avatar_fallback": "https://cdn.cheese.app/avatars/{id}.jpg",
    "post_cover": "https://cdn.cheese.app/post-covers/{id}.jpg",
    "post_image": "https://cdn.cheese.app/post-images/{post_id}/{order}.jpg"
  }
}

通用返回“卡片”长相（列表统一）

{
  "PostCard": {
    "type": "rent | secondhand | teamup | rideshare | forum | confession",
    "post_id": 123,
    "url": "https://cheese.app/p/123-ubc-租房",
    "title": "UBC 附近一居室",
    "description": "简要描述/摘要",
    "cover": "https://cdn.cheese.app/post-covers/123.jpg",
    "likes": 10,
    "comments": 3,
    "time": "2025-09-12T10:20:00Z",
    "liked": false
  }
}

list of URL 模式：凡是返回列表的接口，都支持 mode=urls，直接给

{ "items": ["https://cheese.app/p/123-...","https://cheese.app/p/456-..."], "next_cursor": "" }

默认 mode=rich 返回 PostCard[]。

⸻

一、推荐 / 推送（线上接口）

1) 首页 Feed（混合）
	•	GET feed/home?user_id={uid}&cursor={c?}&limit={n?}&scene=home&mode=rich
	•	returns

{
  "items": [
    { "type": "post", "data": { /* PostCard */ } }
  ],
  "next_cursor": ""
}

	•	怎么写（简版逻辑）
	•	召回（多路并发）：
	•	热门（近7天按 likes/comments 排）
	•	同校/同城（user.school/city 命中）
	•	主题标签（按 post_tags 命中）
	•	相似作者（关注的人+常互动作者）
	•	冷启动（新用户：全站热门 + 同校 + 随机探索）
	•	精排（先写轻量打分）：
	•	score = ctr估计(简单逻辑) + 新鲜度加权 + 关系加分(是否关注/同校)
	•	规则：去重、作者间隔、同类配额上限、多样性、5% 探索位。
	•	分页：键集分页 (score,id) → next_cursor 不透明串。

⸻

2) 猜你喜欢（更“个性化”）
	•	GET recommend/{user_id}?cursor={c?}&limit=10&mode=rich
	•	returns

{
  "items": [
    {
      "type": "rent",
      "title": "UBC 整租",
      "pic": "https://cdn.cheese.app/post-covers/987.jpg",
      "likes": 8,
      "time": "2025-09-12T09:00:00Z",
      "url": "https://cheese.app/p/987-...-ubc"
    }
  ],
  "next_cursor": ""
}

	•	怎么写（简版逻辑）
	•	召回：
	•	用户最近互动过的标签、作者、学校/城市 → 找相似帖
	•	协同（起步：共同点赞/收藏的用户→他们也喜欢的帖）
	•	精排：
	•	特征：同校/同城/最近是否看过/互动强度/新鲜度/热门度
	•	打分：线性/树模型都行，没模型就规则分先顶上
	•	规则：上面同 Feed。

⸻

3) 用户最近贴文
	•	POST user/{user_id}/Recent_Posts
uploads: user_id, guest_id, cursor?
returns：一次 5 条，滚动继续

{
  "items": [
    {
      "type": "forum",
      "title": "课程推荐",
      "description": "xxxx",
      "post_likes": 3,
      "comment_numbers": 1,
      "time": "2025-09-10T12:00:00Z",
      "abstract": 120,
      "liked": false,
      "url": "https://cheese.app/p/321-..."
    }
  ],
  "next_cursor": ""
}

	•	怎么写
	•	guest_id 的 posts 按 created_at desc + 键集分页
	•	liked 由当前 user_id 与 likes 表关联得出。

⸻

4) 热门动态
	•	GET hotsopt/{user_id}?cursor={c?}&limit=10

{
  "items": [
    { "type":"teamup","title":"一起做课设","description":"...","likes":22,"comments":6,"url":"..."}
  ],
  "next_cursor": ""
}

	•	怎么写
	•	排序：30 天窗口内 hot = a*likes + b*comments + c*收藏 + 新帖加权
	•	支持 type=rent|... 过滤可选。

⸻

二、搜索（线上接口）

5) 搜索栏目（模糊 + 标签）
	•	POST search/{user_id}
	•	uploads

{
  "q": "温哥华 租房",
  "tags": ["租房","UBC"],
  "types": ["rent","forum"],   // 可选，不传就全类型
  "order": "relevance|time|hot",
  "cursor": "",
  "limit": 5
}

	•	returns（每次 5 条）

{
  "items": [
    {
      "type": "rent",
      "title": "UBC 附近房源",
      "description": "步行到校...",
      "likes": 12,
      "comments": 4,
      "time": "2025-09-11T07:00:00Z",
      "url": "https://cheese.app/p/654-ubc-租房"
    }
  ],
  "next_cursor": ""
}

	•	怎么写（起步到进阶）
	•	起步版：title LIKE ? OR content LIKE ? + post_tags tag in (?)
	•	排序：order=relevance → 命中词计分（title>content>tags）；time → 新到旧；hot → 热度
	•	进阶：建 tsvector（如果后面迁 PG）/ 关键词分词；再上语义检索（embedding + 相似度）。

⸻

三、用户信息 / 资料（补足）

6) 用户主页基信息
	•	POST user/{user_id}/mainpage
uploads：user_id（访问者），guest_id（主页）
downloads

{
  "userid": "guest_id",
  "posts": 33,
  "likes": 88,
  "fans": 12,
  "following": 20,
  "rent_post": 5,
  "secondhand_post": 2,
  "normal_post": 24,
  "confession_post": 2,
  "achevements": "老熟人/活跃用户/..."
}

7) 编辑资料
	•	POST user/{user_id}/Edit_Profile
	•	downloads（进入页面先取，用作 placeholder；保存仍走 POST）

{
  "username":"Alice",
  "name":"李xx",
  "resume":"个人简介..",
  "contect":"wechat:xxxx",
  "phone":"1234567",
  "city":"Vancouver",
  "school":"UBC",
  "major":"CS",
  "grade":"大三",
  "birthday":"2003-03-03",
  "hobbies":["#羽毛球","#摄影"]
}


⸻

四、消息（聊天）

8) 消息页列表（最近会话）
	•	GET user/{user_id}/Chat?cursor={c?}&limit=10

{
  "items": [
    {
      "type":"normal",
      "chat_username":"tom",
      "chat_url":"https://cheese.app/dm/777",
      "unreaded_msg":2,
      "newest_msg":"有空看下房吗？",
      "time":"2025-09-12T09:00:00Z"
    }
  ],
  "next_cursor":""
}

9) 进入某个聊天
	•	GET user/{user_id}/Chat/{oppo_user_id}?cursor={c?}&limit=30

{
  "items": [
    { "type":"sent","context":"你好！","time":"2025-09-12T08:59:00Z" },
    { "type":"received","context":"嗨～","time":"2025-09-12T09:00:00Z" }
  ],
  "next_cursor":""
}


⸻

任务（离线 / 定时）怎么写（给你目录和职责）

不写代码，直接给你任务名 + 做什么 + 触发时机，你照此落地就行。

A. 推荐相关
	•	tasks/reco/rebuild_recall
	•	做什么：重建召回素材（热门榜单、标签倒排、相似作者表、（可选）embedding/FAISS 索引）
	•	触发：每 6 小时 / 手动
	•	tasks/reco/retrain_rank
	•	做什么：重训精排模型（或规则参数），样本=曝光/点击/点赞/收藏/停留时长
	•	触发：每日凌晨 / 手动
	•	tasks/reco/refresh_counters
	•	做什么：回填 posts.like_count/favorite_count/comment_count
	•	触发：每小时
	•	tasks/reco/snapshot_metrics
	•	做什么：离线报表（CTR、完读率、各类目占比、多样性）
	•	触发：每日

B. 搜索相关
	•	tasks/search/rebuild_index
	•	做什么：重建文本倒排/关键词索引（或 FTS 索引）；刷新 tag 词频
	•	触发：每日 / 大批量内容更新后
	•	tasks/search/warm_cache
	•	做什么：预热常见搜索（top N 关键词、学校/城市标签组合）
	•	触发：每晚

C. 聊天/系统
	•	tasks/chat/cleanup
	•	做什么：清理过期会话缓存、未读计数对账
	•	触发：每日

以上任务都可以对应一个管理路由（只内部用）：
POST /admin/run/{task_name} → {"ok":true,"task":"..."}

⸻

小抄：各接口“最重要字段”概览
	•	列表统一：items: PostCard[] 或 items: URL[]（mode=rich|urls）+ next_cursor
	•	搜索上传：q + tags[] + types[]? + order? + cursor? + limit?
	•	推荐/Feed 不需要上传太多，靠 user_id 做画像即可
	•	时间统一字符串（ISO8601），前端负责格式化/时间戳

⸻

“怎么实现”的最短建议（一天能跑起来的那种）
	•	召回：SQL 就能先做
	•	热门：近 N 天 ORDER BY (likes*3+comments*2+favorites) DESC
	•	同校/同城：WHERE school=... OR city=...
	•	标签：JOIN post_tags 命中
	•	关注作者：JOIN follows → 取 following_id 的帖子
	•	精排：先写规则分

score = 1.0*热门归一化 + 0.5*同校匹配 + 0.5*同城匹配 + 0.3*标签重合
        + 0.2*是否关注作者 + 0.2*新鲜度分 + ε探索(5%)


	•	去重/多样性：同作者间隔、同类配额、随机打散尾部10%
	•	搜索：LIKE + post_tags IN (...) 起步；order=relevance 就给“标题命中>正文命中>标签命中”的权重
	•	分页：都用 cursor（"{sortkey}_{last_id}"），避免深度 offset
	•	list of URL：后端统一拼 url，前端直接当链接点

⸻

如果你要，我可以把这份接口集再复制到一个 canvas 专门用来拷贝粘贴到你的接口文档里；或者把每个路由对应的Flask handler 壳子（只 jsonify 返回上述结构）一次性给你，前端就能先连起来跑通页面。