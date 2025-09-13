用户信息
url user/${user_id}/mainpage, type = [POST]
uploads:
user_id string
guest_id string
downloads:
userid
posts: int
likes:int
fans: int
following: int
rent_post:int
secondhand_post:int
normal_post: int
confession_post: int
achevements:string
进入用户主页的时候先fetch这些信息然后赋值
同时后端验证用户，需要先登陆


最近贴文：
url user/${user_id}/Recent_Posts, type = [POST]
uploads:
user_id string
guest_id string
和上面的一样，如果相同则直接显示所有信息
一次性fetch只会返回五个，滚动向下会接着fetch
download 
list of posts:
type:string
title:string
description:string
post_likes:int
comment_numbers:int
time:string
abstract：int
liked: bool
url:string
需要把这一整个卡片点击的时候跳转到这个url里面去

Saved
这部分删除

Edit Profile
编辑个人资料：
url user/${user_id}/Edit_Profile, type = [POST]
download:
username: string //用户名
name:string //真名（考虑去掉）
resume:string
contect:string
phone:string
city: string
school:string?
major:string?
grade:string //年级
birthday:date
hobbies: listof(string)//都用#开头
进入页面的时候fetch这个url，然后会返回这些，然后根据这些写placeholder
写完placeholder之后把text area更改完的数据提交上去就行，点击编辑资料完成编辑

My Collection
我的收藏：
url user/${user_id}/Collections, type = [GET]
返回listof
type: string
title: string
url:string
describe:string
location(is a list) string//根据先后顺序确定
time: time
detail: string(会同时返回多少钱和/或多少人，用特殊符号分割)
这个的url也需要做成链接到别的地方去

Settings
设定
url user/${user_id}/Settings, type = [POST]
实际上这个可能更简单一点，就是提交表单
通知部分直接让苹果和安卓的设置直接代理
visibility: listof(visibale contexts) //主要是为了检查是否返回一些信息的时候用的
位置分享去掉，然后把这些隐私管理的都给做成长表单
launguage: string(主要是为了方便后面做检查然后接入翻译)

消息页面
//这里上面的活动改成普通
url：user/${user_id}/Chat type = [GET]
return list of 10
type:string
chat_username: string
chat_url:string
//这个chat_url需要时点一下这一整个card就可以的
unreaded_msg:int
newest_msg:string
这个的分类也需要在上面点击分类

随便进去一个聊天
//这个上面的电话和视频去掉
url: user/${user_id}/Chat/${oppo_user_id}
return list of 30
type: string (sent, received)
context:
如果是sent，代表我方发送的，如果是received，则代表我方接收的


广场
//去掉今日新帖和活跃用户这个部分，直接开始探索服务
//上面加一个textarea，时刻提交，作为搜索栏

热门动态：
url: hotsopt/${user_id}
return listof 10
type: string(这个string的类型只有那五个，所有涉及到post的type只有这几个)
title:string
description: string
likes: int
comments:int

搜索栏目：
url: search/${user_id} method: [POST]
每fetch一次，返回list of 5
content: string
//这里后端需要添加上模糊搜索算法（by tags）
剩下的这些东西也都是类似这个搜索算法，但是是预先写好的query出来帖子type
在这里需要说一下这六种帖子（前面可能说错啦是六种不是五种）
租房，二手， 组队，拼车，校园论坛，匿名告白
这个搜索url里面是需要带tag的

猜你喜欢

url recommend/${user_id} method: [GET]
return list of 10
type: string
title: string
pic: string(url)
likes: int
time: datetime(前端自己转时间戳)


帖子详情模板
url post/${post_id}/${user_id} method: [GET]
return
sender_name: string
sender_phpto: string(url)
title: string
detail:string
likes: int
comments: int
剩下的就是评论我就不知道怎么滤清关系啦






