# 搭子计划 - 功能需求说明书

## 项目概述

**搭子计划**是一个面向都市年轻人的交友社区平台，主要功能包括：

1. **线下活动发布平台** - 仅限认证的合作单位或主理人发布活动
2. **线上快速轻社交** - 用户发布动态、展示个人主页、私信搭讪留言

平台旨在帮助年轻人在城市中找到志同道合的伙伴，参与各类线下活动（运动、户外、美食、看展、游戏、旅行、读书、音乐等），并通过轻量级的社交功能建立线上联系。

## 用户角色

| 角色 | 描述 | 关键权限 |
|------|------|----------|
| **普通用户** | 未认证的注册用户 | 浏览活动/动态、报名免费活动、发布动态、关注/私信、个人资料编辑 |
| **实名认证用户** | 完成实名认证的用户 | 普通用户权限 + 个人主页显示实名认证标识 |
| **合作认证用户** | 完成合作认证的合作商户或主理人 | 实名认证权限 + 发布收费活动、活动管理、收入结算 |
| **平台管理员** | 平台运营管理人员 | 用户管理、活动审核、认证审核、内容管理、数据统计 |

## 功能模块

### 前端用户端（移动端优先）

#### 1. 首页
- **城市定位与切换**：默认定位当前城市，支持手动切换
- **搜索功能**：关键词搜索活动、用户、动态
- **轮播 Banner**：运营活动、重要通知、特色推荐
- **分类导航**：运动、户外、饭搭子、游戏、看展、旅行、读书、音乐等分类
- **推荐搭子**：基于地理位置、兴趣标签推荐潜在匹配用户
- **热门活动流**：按最新、最近距离筛选活动卡片列表
- **底部导航栏**：首页、发现、发布、消息、我的

#### 2. 发现/探索
- **活动分类浏览**：按分类查看活动列表
- **搭子推荐列表**：更多推荐用户，支持筛选（性别、兴趣、距离）
- **动态广场**：用户发布的动态流，支持点赞、评论

#### 3. 发布功能
- **发布动态**：文字、图片、位置、话题、可见范围设置
- **发布活动**（仅限合作认证用户）：
  - 活动封面图上传
  - 活动标题、详细描述
  - 活动时间、地点选择（地图集成）
  - 人数限制设置
  - 费用类型（免费、AA制、定额收费）
  - 活动分类、标签
  - 报名表单定制（可选）

#### 4. 活动详情与报名
- **活动详情展示**：封面图、标题、描述、时间地点、费用、标签、发起人信息
- **报名流程**：
  - 免费活动：直接报名
  - 收费活动：支付流程（微信支付/支付宝）
  - 报名表单填写（姓名、联系方式、备注）
- **参与者列表**：查看已报名用户（仅对活动发起人和参与者可见）
- **活动分享**：分享到微信、朋友圈等

#### 5. 个人主页
- **个人信息展示**：头像、昵称、认证标识、等级、积分、个人简介、兴趣标签
- **社交数据**：关注数、粉丝数、发布动态数、参与活动数
- **内容标签页**：
  - 动态：用户发布的动态（图片墙形式）
  - 活动：用户发布的活动 / 用户报名的活动
- **互动功能**：关注/取消关注、私信、分享主页
- **编辑资料**：修改头像、昵称、简介、标签、背景图等

#### 6. 消息系统
- **私信列表**：最近聊天会话，未读消息提示
- **聊天界面**：文本消息、表情、图片发送，在线状态显示
- **私信限制策略**：
  - 未互相关注：只能互相留言一次
  - 单方面关注：只能被关注方发送多条消息
  - 互相关注：畅聊无限制
- **通知中心**：
  - 系统通知（活动状态变更、报名成功、支付成功等）
  - 社交通知（被关注、动态被点赞、评论、回复等）

#### 7. 我的页面
- **个人资料快捷入口**：头像、昵称、等级、积分
- **功能入口**：
  - 我的动态
  - 我的活动（我发布的 / 我报名的）
  - 我的收藏
  - 我的订单
  - 我的钱包（余额、充值、提现、交易记录）
  - 我的认证（实名认证、合作认证）
  - 设置（账号安全、隐私设置、通知设置、关于我们）

#### 8. 认证体系
- **实名认证**：上传身份证正反面，人工审核，用于增加信任度
- **合作认证**：
  - 合作商户：营业执照、门店照片等
  - 主理人：过往活动经验、个人简介等
  - 认证通过后获得发布活动权限

#### 9. 钱包与支付
- **余额查询**：当前可用余额
- **充值功能**：微信支付/支付宝充值
- **提现功能**：合作认证用户可将活动收入提现至银行卡
- **交易记录**：收入、支出明细

#### 10. 订单管理
- **订单列表**：按状态筛选（待支付、已支付、已取消、已退款）
- **订单详情**：活动信息、支付金额、支付时间、订单状态

### 后台管理端（Web）

#### 1. 仪表盘
- **数据概览**：注册用户数、活动数、订单数、交易总额、日活/月活
- **近期数据图表**：趋势分析

#### 2. 用户管理
- **用户列表**：搜索、筛选（认证状态、注册时间）
- **用户详情**：查看用户信息、封禁/解封、重置密码
- **认证审核**：实名认证、合作认证的审核与驳回

#### 3. 活动管理
- **活动列表**：搜索、筛选（状态、分类、时间）
- **活动审核**：新活动上架审核（合作认证用户发布的活动需审核）
- **活动操作**：编辑、下架、推荐置顶

#### 4. 内容管理
- **动态管理**：用户发布的动态审核、删除违规内容
- **评论管理**：评论审核、删除

#### 5. 订单管理
- **订单列表**：查看所有订单，支持退款操作
- **对账管理**：订单与支付渠道对账

#### 6. 财务管理
- **交易流水**：所有充值、支付、退款、提现记录
- **提现审核**：合作认证用户的提现申请审核与打款
- **财务报表**：收入统计、分成结算

#### 7. 运营管理
- **Banner 管理**：首页轮播图配置
- **分类管理**：活动分类的增删改查
- **推荐管理**：推荐搭子、推荐活动的运营配置
- **通知推送**：向全体或特定用户推送系统通知

#### 8. 系统设置
- **基础设置**：平台名称、Logo、客服信息
- **权限管理**：管理员角色与权限分配
- **日志管理**：操作日志、安全日志

## 核心业务流程

### 1. 用户注册与登录流程
- 手机号验证码注册/登录
- 微信快捷登录（可选）
- 首次登录后完善个人资料（昵称、头像、兴趣标签）

### 2. 活动发布与参与流程
```
合作认证用户发布活动：
  1. 进入发布页面，选择“发活动”
  2. 填写活动信息（标题、描述、时间、地点、人数、费用等）
  3. 提交审核（后台管理员审核）
  4. 审核通过后上架，用户可见

普通用户报名活动：
  1. 浏览活动详情
  2. 点击“报名”
  3. 若为免费活动，直接报名成功
  4. 若为收费活动，进入支付流程
  5. 支付成功即报名成功，收到系统通知
```

### 3. 动态发布与互动流程
```
用户发布动态：
  1. 进入发布页面，选择“发动态”
  2. 编辑文字、添加图片、选择位置/话题
  3. 设置可见范围（公开、仅粉丝、私密）
  4. 发布成功后出现在个人主页和动态广场

其他用户互动：
  1. 点赞/取消点赞
  2. 评论/回复评论
  3. 分享动态
```

### 4. 私信沟通流程
```
用户A想联系用户B：
  1. 进入用户B的主页，点击“私信”
  2. 根据关注关系：
     - 若未互相关注：只能发送一条留言，等待对方回复
     - 若单方面关注：关注方只能发送一条留言
     - 若互相关注：畅聊无限制
  3. 消息实时推送（WebSocket）
```

### 5. 认证申请流程
```
实名认证：
  1. 进入“我的认证”页面
  2. 上传身份证正反面照片
  3. 提交后等待人工审核（1-3个工作日）
  4. 审核通过后个人主页显示橙色认证标识

合作认证：
  1. 选择认证类型（合作商户/主理人）
  2. 上传相关资质材料
  3. 提交后等待人工审核（1-3个工作日）
  4. 审核通过后获得发布活动权限，个人主页显示蓝色认证标识
```

### 6. 支付与结算流程
```
收费活动支付：
  1. 用户报名收费活动，选择支付方式
  2. 调用第三方支付接口（微信/支付宝）
  3. 支付成功后生成订单，活动报名成功
  4. 资金进入平台托管账户

活动完成结算：
  1. 活动发起人点击“完成活动”
  2. 系统将托管资金扣除平台服务费后转入发起人钱包
  3. 发起人可申请提现至银行卡
  4. 平台审核提现申请并打款
```

## 非功能性需求

### 1. 性能需求
- 页面加载时间：首屏加载 < 2秒
- 接口响应时间：95%的请求 < 200ms
- 同时在线用户数：支持10,000人并发
- 活动报名高峰期：支持每秒100个报名请求

### 2. 安全需求
- 用户密码加密存储（bcrypt）
- 敏感数据传输加密（HTTPS）
- 支付接口防重放攻击
- 防止SQL注入、XSS攻击
- 实名认证信息脱敏存储
- 个人隐私数据访问控制

### 3. 可用性需求
- 移动端适配：iOS/Android主流机型，响应式设计
- 浏览器兼容：Chrome、Safari、微信内置浏览器
- 离线功能：部分页面缓存，网络恢复后同步
- 错误处理：友好的错误提示，异常情况降级方案

### 4. 可维护性需求
- 模块化设计，前后端分离
- 清晰的代码结构和注释
- 完善的日志记录系统
- 自动化测试覆盖核心功能
- 持续集成/持续部署流程

### 5. 可扩展性需求
- 微服务架构，支持水平扩展
- 数据库分库分表方案
- 缓存策略（Redis）
- 消息队列（异步处理）

## 未来扩展功能（二期）

1. **智能匹配算法**：基于用户兴趣、行为数据推荐更精准的搭子
2. **社群功能**：用户创建/加入兴趣社群，群聊、社群活动
3. **活动模板**：合作认证用户可保存活动模板，快速发布
4. **活动回顾**：活动结束后发布图文回顾，参与者评价
5. **积分体系**：用户行为积分，积分兑换优惠券、礼品
6. **会员体系**：付费会员享受专属权益（优先报名、专属活动等）
7. **多城市扩展**：支持全国主要城市，城市首页定制
8. **国际化**：支持多语言，拓展海外市场

## 附录

### 数据字典

#### 1. 用户表 (users)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 用户ID，唯一标识 | 主键，UUID或雪花算法生成 |
| phone | string | 手机号 | 唯一，加密存储 |
| password_hash | string | 密码哈希 | bcrypt加密 |
| nickname | string | 昵称 | 2-20字符 |
| avatar_url | string | 头像URL | 可空，默认头像 |
| gender | enum | 性别 | male/female/other/secret |
| birthday | date | 出生日期 | 可空，用于计算年龄 |
| age | integer | 年龄 | 计算字段，可缓存 |
| mbti | string(4) | MBTI人格类型 | 可空，如INTP、ENFJ等 |
| zodiac | string | 星座 | 可空，根据生日计算 |
| blood_type | string(2) | 血型 | 可空，A/B/O/AB |
| height | integer | 身高(cm) | 可空 |
| weight | integer | 体重(kg) | 可空 |
| hometown | string | 家乡 | 可空 |
| current_city | string | 当前城市 | 默认定位城市 |
| occupation | string | 职业 | 可空 |
| education | string | 学历 | 可空 |
| school | string | 学校 | 可空 |
| company | string | 公司 | 可空 |
| bio | text | 个人简介 | 可空，500字以内 |
| tags | json | 兴趣标签数组 | 如["运动","美食","旅行"] |
| real_name | string | 真实姓名 | 可空，实名认证后填写 |
| id_card_number | string | 身份证号 | 加密存储，实名认证用 |
| real_name_verified | boolean | 实名认证状态 | 默认false |
| real_name_verified_at | datetime | 实名认证时间 | 可空 |
| cooperation_verified | boolean | 合作认证状态 | 默认false |
| cooperation_verified_at | datetime | 合作认证时间 | 可空 |
| role | enum | 角色 | user/merchant/host/admin，默认user |
| level | integer | 用户等级 | 默认1，最大99 |
| exp | integer | 经验值 | 默认0 |
| points | integer | 积分 | 默认0，可消费 |
| wallet_balance | decimal(10,2) | 钱包余额 | 默认0.00 |
| following_count | integer | 关注数 | 冗余计数，提高查询性能 |
| followers_count | integer | 粉丝数 | 冗余计数 |
| moments_count | integer | 动态数 | 冗余计数 |
| activities_published_count | integer | 发布活动数 | 冗余计数 |
| activities_joined_count | integer | 参与活动数 | 冗余计数 |
| last_login_at | datetime | 最后登录时间 | 可空 |
| last_active_at | datetime | 最后活跃时间 | 可空 |
| status | enum | 账号状态 | active/inactive/banned/deleted，默认active |
| is_online | boolean | 在线状态 | 默认false |
| latitude | decimal(10,6) | 纬度 | 可空，用于距离计算 |
| longitude | decimal(10,6) | 经度 | 可空 |
| geohash | string | 地理哈希 | 可空，用于附近的人查询 |
| privacy_settings | json | 隐私设置 | JSON对象，存储各项隐私设置 |
| notification_settings | json | 通知设置 | JSON对象 |
| arg_0 | string | 扩展字段0 | 备用，可存储任意字符串 |
| arg_1 | string | 扩展字段1 | 备用 |
| arg_2 | string | 扩展字段2 | 备用 |
| arg_3 | string | 扩展字段3 | 备用 |
| arg_4 | string | 扩展字段4 | 备用 |
| arg_5 | integer | 扩展字段5 | 备用，整数类型 |
| arg_6 | integer | 扩展字段6 | 备用 |
| arg_7 | decimal(10,2) | 扩展字段7 | 备用，金额类型 |
| arg_8 | boolean | 扩展字段8 | 备用，布尔类型 |
| arg_9 | json | 扩展字段9 | 备用，JSON类型 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 2. 管理员表 (admins)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 管理员ID | 主键 |
| username | string | 用户名 | 唯一 |
| password_hash | string | 密码哈希 | bcrypt加密 |
| email | string | 邮箱 | 唯一，可空 |
| phone | string | 手机号 | 唯一，可空 |
| real_name | string | 真实姓名 | 可空 |
| avatar_url | string | 头像URL | 可空 |
| role | enum | 角色 | super_admin/admin/auditor/operator，默认operator |
| permissions | json | 权限列表 | JSON数组，存储具体权限标识 |
| department | string | 部门 | 可空 |
| last_login_at | datetime | 最后登录时间 | 可空 |
| last_login_ip | string | 最后登录IP | 可空 |
| status | enum | 状态 | active/inactive/banned，默认active |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| arg_2 | string | 扩展字段2 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 3. 活动表 (activities)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 活动ID | 主键 |
| title | string | 活动标题 | 非空，5-50字符 |
| description | text | 活动描述 | 可空，详细说明 |
| short_description | string | 简短描述 | 可空，用于列表展示 |
| category_id | string | 分类ID | 外键关联categories表 |
| subcategory_id | string | 子分类ID | 可空，外键 |
| cover_image | string | 封面图URL | 非空 |
| images | json | 活动图片数组 | 可空，JSON数组 |
| start_time | datetime | 开始时间 | 非空 |
| end_time | datetime | 结束时间 | 非空 |
| location | string | 地点名称 | 非空 |
| address | string | 详细地址 | 可空 |
| latitude | decimal(10,6) | 纬度 | 可空 |
| longitude | decimal(10,6) | 经度 | 可空 |
| city | string | 城市 | 非空 |
| district | string | 区县 | 可空 |
| max_participants | integer | 最大参与人数 | 非空，最小1 |
| current_participants | integer | 当前报名人数 | 默认0 |
| min_participants | integer | 最小成团人数 | 默认1 |
| price_type | enum | 费用类型 | free/aa/fixed，默认free |
| price_amount | decimal(10,2) | 费用金额 | 默认0.00，AA制时为人均费用 |
| deposit_amount | decimal(10,2) | 定金金额 | 默认0.00，可空 |
| fee_percentage | decimal(5,2) | 平台服务费百分比 | 默认5.00，如5% |
| status | enum | 状态 | draft/pending/reviewing/recruiting/full/completed/cancelled，默认draft |
| visibility | enum | 可见性 | public/private/followers_only，默认public |
| organizer_id | string | 组织者用户ID | 外键关联users表 |
| organizer_type | enum | 组织者类型 | user/merchant/host，默认user |
| tags | json | 活动标签数组 | 可空，JSON数组 |
| requirements | json | 报名要求 | 可空，JSON对象，如年龄限制、性别要求等 |
| preparation | text | 活动准备 | 可空，需要准备的物品等 |
| notes | text | 注意事项 | 可空 |
| cancel_reason | string | 取消原因 | 可空，活动取消时填写 |
| reviewed_by | string | 审核人ID | 可空，外键关联admins表 |
| reviewed_at | datetime | 审核时间 | 可空 |
| review_notes | string | 审核备注 | 可空 |
| view_count | integer | 浏览数 | 默认0 |
| collect_count | integer | 收藏数 | 默认0 |
| share_count | integer | 分享数 | 默认0 |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| arg_2 | string | 扩展字段2 | 备用 |
| arg_3 | integer | 扩展字段3 | 备用 |
| arg_4 | json | 扩展字段4 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |
| published_at | datetime | 发布时间 | 可空，审核通过后设置 |
| deleted_at | datetime | 删除时间 | 可空，软删除 |

#### 4. 动态表 (moments)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 动态ID | 主键 |
| user_id | string | 发布者ID | 外键关联users表 |
| content | text | 动态内容 | 非空，1-500字 |
| images | json | 图片URL数组 | 可空，JSON数组，最多9张 |
| video_url | string | 视频URL | 可空 |
| video_cover | string | 视频封面 | 可空 |
| location | string | 位置信息 | 可空 |
| latitude | decimal(10,6) | 纬度 | 可空 |
| longitude | decimal(10,6) | 经度 | 可空 |
| topic | string | 话题 | 可空，如#周末去哪玩# |
| visibility | enum | 可见范围 | public/followers/private，默认public |
| is_top | boolean | 是否置顶 | 默认false |
| likes_count | integer | 点赞数 | 默认0 |
| comments_count | integer | 评论数 | 默认0 |
| shares_count | integer | 分享数 | 默认0 |
| view_count | integer | 浏览数 | 默认0 |
| reported_count | integer | 被举报次数 | 默认0 |
| status | enum | 状态 | normal/hidden/deleted/under_review，默认normal |
| reviewed_by | string | 审核人ID | 可空，外键关联admins表 |
| reviewed_at | datetime | 审核时间 | 可空 |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| arg_2 | json | 扩展字段2 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |
| deleted_at | datetime | 删除时间 | 可空，软删除 |

#### 5. 订单表 (orders)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 订单ID | 主键 |
| order_no | string | 订单编号 | 唯一，业务流水号 |
| user_id | string | 用户ID | 外键关联users表 |
| activity_id | string | 活动ID | 外键关联activities表 |
| activity_title | string | 活动标题 | 冗余存储，避免联查 |
| organizer_id | string | 活动组织者ID | 冗余存储 |
| amount | decimal(10,2) | 支付金额 | 非空 |
| original_amount | decimal(10,2) | 原价金额 | 可空，优惠前金额 |
| discount_amount | decimal(10,2) | 优惠金额 | 默认0.00 |
| payment_method | enum | 支付方式 | wechat/alipay/bank/balance，默认wechat |
| payment_status | enum | 支付状态 | pending/paid/refunded/failed/cancelled，默认pending |
| payment_time | datetime | 支付时间 | 可空 |
| payment_transaction_id | string | 支付交易ID | 可空，第三方支付返回 |
| refund_amount | decimal(10,2) | 退款金额 | 默认0.00 |
| refund_reason | string | 退款原因 | 可空 |
| refund_time | datetime | 退款时间 | 可空 |
| refund_transaction_id | string | 退款交易ID | 可空 |
| participants | integer | 报名人数 | 默认1 |
| contact_name | string | 联系人姓名 | 非空 |
| contact_phone | string | 联系人电话 | 非空 |
| contact_email | string | 联系人邮箱 | 可空 |
| notes | text | 备注 | 可空，用户填写 |
| checkin_status | enum | 签到状态 | not_checked_in/checked_in，默认not_checked_in |
| checkin_time | datetime | 签到时间 | 可空 |
| checkin_by | string | 签到操作人 | 可空，组织者ID |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| arg_2 | decimal(10,2) | 扩展字段2 | 备用 |
| arg_3 | json | 扩展字段3 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 6. 消息表 (messages)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 消息ID | 主键 |
| conversation_id | string | 会话ID | 索引，用于分组查询 |
| sender_id | string | 发送者ID | 外键关联users表 |
| receiver_id | string | 接收者ID | 外键关联users表 |
| message_type | enum | 消息类型 | text/image/video/location/notification，默认text |
| content | text | 消息内容 | 非空，文本内容或资源描述 |
| image_url | string | 图片URL | 可空 |
| video_url | string | 视频URL | 可空 |
| location_data | json | 位置数据 | 可空，JSON对象{lat,lng,name} |
| is_read | boolean | 是否已读 | 默认false |
| read_at | datetime | 阅读时间 | 可空 |
| is_delivered | boolean | 是否送达 | 默认false |
| delivered_at | datetime | 送达时间 | 可空 |
| deleted_by_sender | boolean | 发送者删除 | 默认false |
| deleted_by_receiver | boolean | 接收者删除 | 默认false |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 7. 会话表 (conversations)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 会话ID | 主键 |
| user1_id | string | 用户1ID | 外键关联users表 |
| user2_id | string | 用户2ID | 外键关联users表 |
| last_message_id | string | 最后消息ID | 可空，外键关联messages表 |
| last_message_content | string | 最后消息内容 | 可空，冗余存储 |
| last_message_time | datetime | 最后消息时间 | 可空 |
| unread_count_user1 | integer | 用户1未读消息数 | 默认0 |
| unread_count_user2 | integer | 用户2未读消息数 | 默认0 |
| is_blocked | boolean | 是否被屏蔽 | 默认false |
| blocked_by | string | 屏蔽者ID | 可空 |
| blocked_at | datetime | 屏蔽时间 | 可空 |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | json | 扩展字段1 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 8. 分类表 (categories)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 分类ID | 主键 |
| name | string | 分类名称 | 非空，如"运动" |
| icon | string | 图标名称 | 可空，对应图标库名称 |
| color | string | 主题颜色 | 可空，十六进制颜色码 |
| sort_order | integer | 排序序号 | 默认0，越小越靠前 |
| parent_id | string | 父分类ID | 可空，用于多级分类 |
| is_active | boolean | 是否启用 | 默认true |
| description | string | 分类描述 | 可空 |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 9. 关注关系表 (follows)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 关系ID | 主键 |
| follower_id | string | 关注者ID | 外键关联users表 |
| followed_id | string | 被关注者ID | 外键关联users表 |
| mutual | boolean | 是否互相关注 | 默认false |
| notifications_enabled | boolean | 是否接收通知 | 默认true |
| notes | string | 备注 | 可空，如"朋友"、"同事"等 |
| arg_0 | string | 扩展字段0 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 10. 钱包流水表 (wallet_transactions)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 流水ID | 主键 |
| user_id | string | 用户ID | 外键关联users表 |
| transaction_no | string | 交易流水号 | 唯一 |
| type | enum | 交易类型 | recharge/withdrawal/income/expense/refund，默认recharge |
| amount | decimal(10,2) | 交易金额 | 非空，正数为收入，负数为支出 |
| balance_before | decimal(10,2) | 交易前余额 | 非空 |
| balance_after | decimal(10,2) | 交易后余额 | 非空 |
| related_order_id | string | 关联订单ID | 可空，外键关联orders表 |
| related_activity_id | string | 关联活动ID | 可空，外键关联activities表 |
| description | string | 交易描述 | 非空，如"活动报名"、"余额充值"等 |
| status | enum | 状态 | pending/completed/failed，默认pending |
| failed_reason | string | 失败原因 | 可空 |
| processed_at | datetime | 处理时间 | 可空 |
| processed_by | string | 处理人 | 可空，管理员ID或系统 |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| arg_2 | json | 扩展字段2 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 11. 通知表 (notifications)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 通知ID | 主键 |
| user_id | string | 用户ID | 外键关联users表，接收者 |
| sender_id | string | 发送者ID | 可空，外键关联users表或system |
| sender_type | enum | 发送者类型 | user/system/admin，默认system |
| type | enum | 通知类型 | like/comment/follow/activity_update/order_update/system，默认system |
| title | string | 通知标题 | 非空 |
| content | text | 通知内容 | 非空 |
| related_type | string | 关联类型 | 可空，如moment/activity/order等 |
| related_id | string | 关联ID | 可空 |
| is_read | boolean | 是否已读 | 默认false |
| read_at | datetime | 阅读时间 | 可空 |
| action_url | string | 操作链接 | 可空，点击跳转链接 |
| priority | integer | 优先级 | 默认0，越大优先级越高 |
| expires_at | datetime | 过期时间 | 可空 |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 12. 认证申请表 (verification_applications)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 申请ID | 主键 |
| user_id | string | 用户ID | 外键关联users表 |
| application_type | enum | 申请类型 | real_name/cooperation，非空 |
| role | enum | 申请角色 | merchant/host，合作认证时必填 |
| status | enum | 申请状态 | pending/approved/rejected，默认pending |
| id_card_front | string | 身份证正面照片 | 可空 |
| id_card_back | string | 身份证反面照片 | 可空 |
| business_license | string | 营业执照照片 | 可空 |
| store_photos | json | 门店照片数组 | 可空，JSON数组 |
| experience_proof | json | 经验证明材料 | 可空，JSON数组 |
| additional_materials | json | 附加材料 | 可空，JSON数组 |
| reject_reason | string | 拒绝原因 | 可空 |
| reviewed_by | string | 审核人ID | 可空，外键关联admins表 |
| reviewed_at | datetime | 审核时间 | 可空 |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| arg_2 | json | 扩展字段2 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 13. 系统配置表 (system_configs)

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | string | 配置ID | 主键 |
| config_key | string | 配置键 | 唯一，如"site.name" |
| config_value | text | 配置值 | 非空 |
| config_type | enum | 配置类型 | string/number/boolean/json，默认string |
| description | string | 配置描述 | 可空 |
| group | string | 配置分组 | 可空，如"site"、"payment"等 |
| is_public | boolean | 是否公开 | 默认false，前端可读取 |
| sort_order | integer | 排序序号 | 默认0 |
| arg_0 | string | 扩展字段0 | 备用 |
| arg_1 | string | 扩展字段1 | 备用 |
| created_at | datetime | 创建时间 | 非空 |
| updated_at | datetime | 更新时间 | 非空 |

#### 扩展字段说明

所有表的`arg_0`-`arg_9`字段为预留扩展字段，用途包括：
- `arg_0`-`arg_4`: 字符串类型，存储文本、标识符等
- `arg_5`-`arg_6`: 整数类型，存储数字、状态码等
- `arg_7`: 金额类型，存储额外金额信息
- `arg_8`: 布尔类型，存储开关状态
- `arg_9`: JSON类型，存储结构化数据

这样设计可以在不修改表结构的情况下，快速实现新功能或存储临时数据。

---

*文档版本：v1.0*
*更新日期：2026-03-09*
*下一步：基于此需求说明书进行技术选型与系统设计*