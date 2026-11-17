# 常聚 · Gatherly 演示版实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付"常聚"熟人组局小程序的仿壳 H5 演示版——一条可连贯演示的主线闭环（建圈→提案→表态→定案→聚会→散场→记录→AA→再组局），含四个武器、四个高光与次线功能轻量版。

**Architecture:** 纯静态 HTML/CSS/JS，零构建、零网络依赖，沿用搭子计划技术栈（本地 tailwind.css + lucide UMD + `window.GlobalData` mock + localStorage 持久化）。纯逻辑（推荐/轮值/账本/游戏）抽成独立 js 引擎，node 原生 `node:test` + vm 沙箱测试（沿用 `搭子计划/dumpling-page.test.cjs` 模式）；页面为 375 宽移动端视口 + 小程序式外壳（胶囊 + 三 tab tabbar）。

**Tech Stack:** HTML5 + CSS（Tailwind 静态产物 + 自定义 theme.css）+ vanilla JS；测试用 node:test + vm（无依赖）；图片/图标全部本地。

**Spec:** `D:\GitHub\DEMO\常聚\docs\superpowers\specs\2026-11-17-changju-design.md`

## Global Constraints

- 零网络依赖：所有 CSS/JS/图标/图片本地引用，**禁止任何 http/https 外链**（page-smoke 测试强制）
- 375px 宽移动端视口；页面模板：`<link rel="stylesheet" href="tailwind.css">` + `<script src="vendor/lucide.min.js"></script>` + `<link rel="stylesheet" href="theme.css">`
- 品牌：常聚 · Gatherly；SLOGAN「常聚常伴，圈子不散」；温情文案——提醒是思念（附上次合影）、账本不催债
- 主题：平面清淡（奶油底 `#FBF7F0`、暖橙主色 `#E8965A`、深褐文字 `#3D3229`、苔绿辅色 `#7A8B6F`、米灰卡底 `#FFFFFF` 低饱和、无渐变无阴影），`body.cj-theme` 作用域（参考 `搭子计划/dumpling-theme.css` 写法）
- 城市=北京（一圈一城）；"我"=圈主 `u1`；其余圈友为 mock 账号，其行为只经"演示控制"触发
- 隐私底线：成员位置/消费档位仅推荐引擎内部使用，任何页面输出不得出现
- 无构建：`npm test` = 依次 `node xxx.test.cjs`（沿用搭子计划 package.json 模式）
- 持久化：`window.GlobalData` 运行时状态写 localStorage（key 前缀 `cj.`），页面加载时恢复

## Review Focus

| # | 输入/失效模式 | 期望行为 | 挂靠任务 |
|---|---|---|---|
| 1 | 债务合并：链式 A→B→C 与环式 A→B→C→A | 结算清单转账笔数最少且账目平 | Task 4 `settle.test.cjs`（consolidate_chain / consolidate_cycle / consolidate_balanced） |
| 2 | 时间矩阵平票、部分人未表态 | 平票取最早候选；未表态者不计入分母；全部未表态→无最佳、状态保持待定 | Task 2 `computeBestTime` 用例 |
| 3 | 轮值边界：顺延最后一位回卷；抽签抽中未出席者；节律恰好等于边界天数 | 回卷到 joinOrder=1；抽中未出席者合法；`daysSince >= 节律天数` 触发提醒 | Task 3 `rotation.test.cjs` |
| 4 | 空态：无上次聚会 / 无节律 / 时间轴与年度回顾为空 | 提醒不触发（due:false）；空态页面渲染占位文案不报错 | Task 3 + Task 14 + Task 16 flow 用例 |
| 5 | 隐私泄漏：页面 HTML 或引擎输出含成员 position/spendTier/姓名与位置关联 | 推荐结果只含商户公开字段；页面渲染快照不含成员级隐私字段值 | Task 2 输出形状断言 + Task 16 flow 渲染快照断言 |

---

### Task 1: 脚手架 + 数据基座（data.js）

**Files:**
- Create: `D:\GitHub\DEMO\常聚\package.json`
- Create: `D:\GitHub\DEMO\常聚\data.js`
- Create: `D:\GitHub\DEMO\常聚\data.test.cjs`
- Copy: `搭子计划/tailwind.css` → `常聚/tailwind.css`；`搭子计划/vendor/lucide.min.js` → `常聚/vendor/lucide.min.js`
- Copy images: `搭子计划/images/avatar-1~12.png`、`cover-1~20.png`、`act-a12/a15/a21/a23/a25/a26.jpg`、`moment-1~8.jpg` → `常聚/images/`

**Interfaces:**
- Produces: `window.GlobalData`，结构如下（后续所有任务消费，字段名即接口）：

```js
window.GlobalData = {
  city: '北京',
  user: { id:'u1', name:'阿Sun', avatarUrl:'images/avatar-1.png' },
  circles: [{
    id, name, type, city:'北京', createdAt, ownerId:'u1',
    members: [{ id, name, avatarUrl, joinOrder, tags:[], position:{district}, work:{type,district}, spendTier:'economy'|'mid'|'premium' }],
    hostId, rhythm: {unit:'week',n:2}|null, lastGatheringId:null|id, proposalId:null|id
  }],
  venues: [{ id, name, city:'北京', district, businessArea, category, spendTier, rating, tags:[], cover, isPartner, coupon:null|{title} }],
  projects: [{ id, name, category, season:[], tags:[] }],
  proposals: [{ id, circleId, proposerId, projectId, venueIds:[], timeCandidates:[], votes:{time:{},venue:{}}, status:'open'|'decided', deadline }],
  gatherings: [{ id, circleId, title, summary, projectId, venueId, time, attendees:[], photos:[], buyMode:'aa'|'random'|'host', payerId:null, billId:null }],
  bills: [{ id, gatheringId, entries:[{id,title,amount,payerId,participants:[]}], settled:{} }],
  notifications: [{ id, circleId, type:'rhythm'|'respond'|'miss', text, read }]
}
```

- 数据内容要求（演示支撑，Mock 必填）：3 个圈子——`c1` 周五麻将局（进行中提案，供主线演示）、`c2` 老同学（刚散场、待结算账单、供 AA/散场演示）、`c3` 周末球局（久未聚+超过节律，供提醒演示）；成员 8-10 人（joinOrder 连续从 1 起，至少 3 人带 work 字段差异）；商户 12+（含 2 个 isPartner:true 带 coupon，覆盖 麻将馆/餐厅/球馆/户外 4 类，district 覆盖朝阳/海淀/东城/西城）；项目库 12+（category 覆盖 饭局/球局/麻将/户外/看展/K歌）；聚会历史 3-4 场（c1/c2 各至少 1 场含 photos/buyMode）；提案 1 条（c1，status:'open'）。

- [ ] **Step 1: 写失败测试** `data.test.cjs`（复制 `搭子计划/dumpling-page.test.cjs` 的 vm 沙箱头 40 行加载 data.js），用例：
  - `schema_venues_complete`：每个 venue 有 city==='北京'、district、businessArea、spendTier、category 非空
  - `schema_circles_members_joinOrder`：每圈 members 的 joinOrder 为 1..n 连续无重复；hostId ∈ member ids；ownerId==='u1'
  - `schema_refs_resolve`：proposals/gatherings/bills 引用的 circleId/projectId/venueId/billId 均存在
  - `schema_mock_quota`：圈子数>=3、venues>=12 且 isPartner>=2、projects>=12、gatherings>=3、存在 status:'open' 的提案
- [ ] **Step 2: 运行确认失败**：`node data.test.cjs` → FAIL（data.js 不存在）
- [ ] **Step 3: 实现 data.js**（结构按上表；`window.GlobalData = {...}` 全局声明，同搭子计划 data.js 风格）
- [ ] **Step 4: 运行确认通过**：`node data.test.cjs` → PASS
- [ ] **Step 5: Commit** `feat: 常聚数据基座与工程脚手架（data.js + 本地资产）`

### Task 2: 推荐引擎 recommend.js

**Files:**
- Create: `D:\GitHub\DEMO\常聚\recommend.js`、`D:\GitHub\DEMO\常聚\recommend.test.cjs`

**Interfaces:**
- Consumes: Task 1 的 venues/projects/circles 结构
- Produces（挂 `window.Recommend`，纯函数不碰 DOM/localStorage）：
```js
Recommend.recommendProjects({projects, memberTags, lastProjectIds, season}) -> [projectId×3]  // 命中成员共同 tag 多者优先；排除 lastProjectIds；同分取 projects 顺序在前者；结果不满 3 时用 projects 顺序补足
Recommend.recommendVenues({venues, members, project, lastVenueId}) -> [venueId×3]  // 候选=category 匹配 project.category；排序=商圈覆盖成员 district 数（中间地带）> spendTier 与成员档位众数一致 > rating；排除 lastVenueId
Recommend.suggestTimes({members, count=3}) -> ['YYYY-MM-DD HH:mm'×3]  // 规则：白班成员多→工作日 19:00 起；晚班多→周末午间；count 不足按固定模板补
Recommend.buildProposal({circle, projectId, venues, times, proposerId}) -> proposal 对象（字段同 Task 1 schema，status:'open'）
Recommend.computeBestTime({timeVotes, timeCandidates}) -> {winnerIndex, tied:[], attendance}  // attendance[候选]=可出席人数；平票取最早候选（tied 记录并列项）；全部未表态→winnerIndex:null
```
- 隐私：`recommendVenues` 内部使用 members.position/spendTier，**返回值只含 venueId 数组**。

- [ ] **Step 1: 写失败测试**：`recommend.test.cjs`（require 后 vm 加载 recommend.js，data 用测试内联小样本）
  - `projects_avoid_last_and_match_tags`：lastProjectIds 内项目不出现；tag 命中多者排前
  - `venues_midpoint_tier_and_avoid_last`：构造 3 成员两商圈场景，断言命中多数商圈者排前；lastVenueId 被排除
  - `times_rules_and_count`：白班多数→工作日晚间；count=3 固定
  - `bestTime_tie_picks_earliest`：两个时间并列最高→winnerIndex 取较早者、tied 长度 2
  - `bestTime_all_absent`：全部未表态→winnerIndex:null
  - `output_no_member_privacy`：`recommendVenues` 与 `buildProposal` 返回值 JSON.stringify 不含任何成员 position/district/spendTier 值
- [ ] **Step 2: 运行确认失败**：`node recommend.test.cjs` → FAIL
- [ ] **Step 3: 实现 recommend.js**（每函数一个纯函数，排序用稳定比较，不修改入参）
- [ ] **Step 4: 运行确认通过**：`node recommend.test.cjs` → PASS
- [ ] **Step 5: Commit** `feat: 常聚智能提案推荐引擎`

### Task 3: 轮值引擎 rotation.js

**Files:**
- Create: `D:\GitHub\DEMO\常聚\rotation.js`、`D:\GitHub\DEMO\常聚\rotation.test.cjs`

**Interfaces:**
- Produces（挂 `window.Rotation`，纯函数）：
```js
Rotation.initialHost(circle) -> ownerId
Rotation.drawNextHost({memberIds, rng}) -> memberId  // 范围=全体圈友（含未出席者）；rng 注入 ()=>[0,1)
Rotation.passHost({members, currentHostId}) -> memberId  // 顺延=joinOrder 下一位，末尾回卷到 joinOrder 最小值
Rotation.checkRhythm({circle, lastGatheringTime, now}) -> {due, daysSince}  // 无 rhythm 或无 lastGatheringTime→due:false；daysSince>=节律天数→due:true（边界等于也触发）
Rotation.buildReminderText({circle, gathering}) -> string  // 含"已 X 天没聚"+ 上次聚会照片文件名引用（无上次→不含照片句）
```

- [ ] **Step 1: 写失败测试**：`rotation.test.cjs`
  - `initial_host_is_owner`：initialHost==='u1'
  - `draw_includes_non_attendees_and_respects_rng`：memberIds 含未出席者仍可被抽中；rng=()=>0.5 结果确定
  - `pass_wraps_to_first_joinOrder`：currentHostId 为最大 joinOrder 成员→返回 joinOrder 最小成员
  - `rhythm_due_at_exact_boundary`：节律 14 天、daysSince===14→due:true；13→due:false
  - `rhythm_no_config_or_no_last`：rhythm:null 或 lastGatheringTime:null→due:false
  - `reminder_has_photo_reference`：有上次聚会→文案含照片文件名；无→不含
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现 rotation.js**
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚轮值张罗引擎`

### Task 4: AA 账本引擎 settle.js

**Files:**
- Create: `D:\GitHub\DEMO\常聚\settle.js`、`D:\GitHub\DEMO\常聚\settle.test.cjs`

**Interfaces:**
- Produces（挂 `window.Settle`，纯函数，不可变返回新对象）：
```js
Settle.addEntry(bill, entry) -> bill  // entry={title,amount,payerId,participants}
Settle.computeShares({entries, memberIds}) -> {userId: {pay, receive}}  // pay=该人垫付总额，receive=该人应摊总额（按每笔 participants 平分）
Settle.consolidate(balances) -> [{from,to,amount}]  // 最少转账笔数：收付两列贪心对冲；余额全 0→[]
Settle.drawPayer({memberIds, rng}) -> memberId
Settle.billState({bill, settled}) -> 'pending'|'partial'|'settled'  // 无任何已结清标记→pending；全员结清→settled；其余 partial
```

- [ ] **Step 1: 写失败测试**：`settle.test.cjs`
  - `shares_split_and_select`：一笔 300 元 3 人参与→每人 receive 100、payer pay 300；按人勾选只摊参与者
  - `consolidate_chain`：A 应付 100 给 B、B 应付 100 给 C → 1 笔 [A→C,100]
  - `consolidate_cycle`：A→B 100、B→C 100、C→A 100 → 净额全 0 → []
  - `consolidate_minimal_count`：5 人多边债务→笔数<=人数-1 且总账平
  - `drawPayer_respects_rng`、`billState_three_states`
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现 settle.js**
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚AA账本引擎（债务合并/三态）`

### Task 5: 曲水流觞引擎 liushang.js

**Files:**
- Create: `D:\GitHub\DEMO\常聚\liushang.js`、`D:\GitHub\DEMO\常聚\liushang.test.cjs`

**Interfaces:**
- Produces（挂 `window.Liushang`，纯函数，rng 注入）：
```js
Liushang.driftDuration({rng, min=8000, max=20000}) -> ms  // 均匀分布
Liushang.stopIndex({memberCount, rng}) -> int  // [0, memberCount)
Liushang.drawCard({rng}) -> {type, text}  // type ∈ 'truth'|'dare'|'act'|'poem'；每种至少 4 张卡（文案内容实现时定，要求温情不低俗）
```

- [ ] **Step 1: 写失败测试**：`liushang.test.cjs`
  - `duration_within_range_for_edge_rng`：rng=()=>0 得 min、()=>0.999 得 max
  - `stopIndex_bounds_and_rng`：范围合法；rng 固定则结果固定
  - `drawCard_four_types_exist`：连抽 200 次覆盖 4 类型；type 恒 ∈ 合法集
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现 liushang.js**（觞令卡文案：真心话/大冒险/表演/吟诗，温情向）
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚曲水流觞游戏引擎`

### Task 6: 应用外壳（theme.css + common.js + index.html 圈子列表）

**Files:**
- Create: `D:\GitHub\DEMO\常聚\theme.css`、`D:\GitHub\DEMO\常聚\common.js`、`D:\GitHub\DEMO\常聚\index.html`、`D:\GitHub\DEMO\常聚\page-smoke.test.cjs`

**Interfaces:**
- Produces（`window.Common` 与 `window.Demo`，后续所有页面消费）：
```js
Common.renderShell(title)        // 顶部：状态栏占位(28px)+标题+胶囊按钮样式（右侧胶囊 "··· ⊙" 纯样式）
Common.renderTabbar(active)      // 3 tab：圈子(index.html)/消息(message.html)/我的(me.html)，图标 lucide users/bell/user
Common.showToast(msg)
Common.showWechatNotice({title, body})  // 模拟微信服务通知浮层（右上滑入，3s 自动消失）
Common.save()/Common.load()      // GlobalData 运行时状态 ↔ localStorage('cj.data')（仅持久化 proposals/gatherings/bills/notifications/hostId/lastGatheringId 等可变字段）
Demo.toggle()                    // 演示控制面板（fixed 右下悬浮钮→展开：模拟圈友表态/推进时间+24h/重置演示）
Demo.advanceTime(hours)          // 虚拟时钟推进（存 localStorage 'cj.clock'），影响投票截止/节律计算
Demo.simulateVotes(proposalId)   // mock 圈友按预置响应填 votes
Demo.reset()                     // 清空 cj.* 恢复初始快照
```
- index.html：圈子列表页（tab=圈子）——顶部"北京"定位条（点击 Toast"多城市能力预留"）；圈子卡片列表（名称/类型/成员头像堆叠/节律状态"已 X 天没聚"或"提案进行中"/当值张罗头像角标）；空态占位；点卡片→circle.html?id=。

- [ ] **Step 1: 写失败测试**：`page-smoke.test.cjs`（node 直接跑，不依赖页面渲染）
  - `no_external_links`：扫描 `常聚/*.html` 全部文本，断言无 `http://`、`https://` 字样
  - `assets_resolved`：扫描 html 中 `href="..."`/`src="..."` 本地引用，断言文件存在（vendor/lucide.min.js、tailwind.css、theme.css、images/* 均在本目录）
  - `shell_functions_render`：vm 沙箱加载 common.js，断言 window.Common/window.Demo 五函数类型为 function
- [ ] **Step 2: 运行确认失败**：`node page-smoke.test.cjs` → FAIL
- [ ] **Step 3: 实现 theme.css（`body.cj-theme` 作用域：奶油底/暖橙主色/卡片无阴影描边暖灰、.cj-btn/.cj-card/.cj-chip/.cj-tabbar/.cj-shell 工具类，色值见 Global Constraints）+ common.js + index.html**
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚应用外壳与圈子列表页`

### Task 7: 模拟微信聊天 wechat.html（演示入口）

**Files:**
- Create: `D:\GitHub\DEMO\常聚\wechat.html`、`D:\GitHub\DEMO\常聚\wechat.test.cjs`

**Interfaces:**
- Consumes: Task 6 的 Common/Demo；GlobalData.circles
- 页面：微信式深色聊天列表（"周五麻将局"群聊含未读红点）→ 群聊页：聊天记录 + 一条"常聚小程序卡片"消息（卡片=奶油底、Logo"常聚"、文案「常聚常伴，圈子不散」、小字"群友 6 人已加入"）→ 点卡片进入 index.html；页脚提示条"模拟微信外壳·演示入口"

- [ ] **Step 1: 写失败测试**：`wechat.test.cjs`（vm 沙箱按 dumpling-page 模式提取内联脚本执行渲染）
  - `card_renders_with_brand`：渲染 HTML 含"常聚常伴，圈子不散"与"常聚"卡片标题
  - `card_click_goes_circle`：模拟点击触发跳转函数，断言目标为 `index.html`（断言 window.location 赋值调用）
  - `slogan_and_member_count`：卡片文案含"已加入"人数（取 GlobalData c1 成员数）
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现 wechat.html**
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚模拟微信外壳入口页`

### Task 8: 建圈流程 create.html

**Files:**
- Create: `D:\GitHub\DEMO\常聚\create.html`、`D:\GitHub\DEMO\常聚\create.test.cjs`

**Interfaces:**
- Consumes: Common、GlobalData、`Rotation.initialHost`
- Produces: 页面函数 `window.CreateCircle.submit({name, type, mode})` → 生成 circle 对象（ownerId='u1'、hostId=initialHost、city='北京'、members=[u1]），经 Common.save() 持久化；演示流程：选类型（麻将/饭局/球局/户外/同学/同事，模板建圈=选类型即预填）→ 填圈子名（必填，空则 Toast"给圈子起个名字吧"）→ 生成"常聚邀请卡片"预览 → "分享到微信群"按钮 → 弹出模拟微信选择群聊浮层 → 模拟 3 位群友点卡入圈（头像依次点亮入圈动画）

- [ ] **Step 1: 写失败测试**：`create.test.cjs`
  - `submit_validates_name`：空名不生成 circle（状态不变）
  - `submit_creates_with_owner_as_host`：生成 circle 的 ownerId/hostId==='u1'、city==='北京'、joinOrder 从 1 起
  - `simulate_members_join`：模拟入圈后 members 数量=4、joinOrder 连续
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现 create.html**
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚建圈流程页（群卡片模拟）`

### Task 9: 圈子主页 circle.html

**Files:**
- Create: `D:\GitHub\DEMO\常聚\circle.html`、`D:\GitHub\DEMO\常聚\circle.test.cjs`

**Interfaces:**
- Consumes: Common、Rotation（checkRhythm/buildReminderText）、GlobalData；URL `?id=` 取圈
- Produces: 页面函数 `window.CircleView.render(circleId)` → HTML
- 内容：顶栏（圈名/类型/成员头像堆叠+"群卡片"再邀请按钮）；**当值张罗卡**（头像+“本期张罗”+距离节律剩余天数，超节律显示「该张罗啦」思念提醒卡含上次合影）；**记忆时间轴**（gathering 卡片按时间倒序：合影缩略/标题/时间/出席头像）；**组局 FAB**（暖橙圆钮"张罗个局"→propose.html?circle=）；成员列表入口；"想念大家了"按钮→全体圈友收到模拟服务通知（Common.showWechatNotice）+ notifications 落库

- [ ] **Step 1: 写失败测试**：`circle.test.cjs`
  - `timeline_renders_desc`：渲染 HTML 中聚会时间倒序（断言索引位置）
  - `host_card_due_state`：对超节律圈渲染含"该张罗啦"；对无 rhythm 圈不含
  - `reminder_has_photo`：超节律且存在上次合影→HTML 含对应照片文件名
  - `miss_button_creates_notification`：点击"想念大家了"→notifications 新增 type:'miss'
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现 circle.html**
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚圈子主页（时间轴/当值卡/思念提醒）`

### Task 10: 组局流程 propose.html + vote.html + event.html

**Files:**
- Create: `D:\GitHub\DEMO\常聚\propose.html`、`vote.html`、`event.html`、`zuju.test.cjs`

**Interfaces:**
- Consumes: Common、Recommend、GlobalData；URL `?circle=&proposal=` / `?id=`
- Produces:
  - propose.html：`window.ProposeView.build(circleId)` → 方向选择（复用 GlobalData.projects 的 category）→ 智能提案预览（项目 1 个默认可换/可设"待定"→投票、地点 3 候选、时间 3 候选可自加/删除）→「发出提案」生成 proposal（status:'open'，deadline=48h）→ 返回 circle.html 并 Toast
  - vote.html：时间矩阵（候选×圈友，"我可/我不行"，自己行可切换；"随大流"按钮）、项目/地点投票（当 proposal 含待定项目或多地点时展示）；`window.VoteView.submit(proposalId)` 落 votes；`computeBestTime` 展示"最齐时间"横幅（含 attendance 人数）
  - event.html：局详情——定案信息（时间/地点/项目）、出席名单、未表态者（点"提醒一下"→showWechatNotice）、"导航"（Toast 模拟）、聚会中入口（→game-liushang.html）、「散场」按钮（→end-event.html?id=）
- 状态机：proposal.status `open`→（截止/Demo.advanceTime 触发）→`decided`；decided 生成 gathering（时间=最佳候选、地点=得票最高、attendees=表态可出席者）

- [ ] **Step 1: 写失败测试**：`zuju.test.cjs`（vm 沙箱串联三页脚本）
  - `build_proposal_defaults`：build 后 proposal 有 3 时间候选/3 地点/项目非空/status open
  - `vote_matrix_and_best_time`：注入 votes 后 computeBestTime 返回正确 winnerIndex；页面 HTML 含"最齐时间"与人数
  - `deadline_auto_decide`：Demo.advanceTime(48h) 后 proposal.status==='decided' 且生成 gathering（attendees 与 votes 一致）
  - `remind_non_voters`：未表态者点击提醒→notifications 增 type:'respond'
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现三页**（propose.html 为表单+预览；vote.html 为矩阵；event.html 为详情）
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚组局流程（提案/矩阵表态/定案）`

### Task 11: 散场仪式与聚会记录 end-event.html + record.html

**Files:**
- Create: `D:\GitHub\DEMO\常聚\end-event.html`、`record.html`、`record.test.cjs`

**Interfaces:**
- Consumes: Common、Rotation.drawNextHost（抽签）、GlobalData；URL `?id=`（gatheringId）
- Produces:
  - end-event.html：**散场三步仪式**——①上传合影（从 images/moment-*.jpg 中选，可"拍照"占位）②抽签交接（签筒动画：成员头像轮转→停住；使用 drawNextHost({memberIds, rng: Math.random})，范围全体圈友；抽签结果落 hostId + 圈友可见"下一任张罗"）③生成记录卡（title 可填「一句话总结」默认"第 N 次聚会"；summary 选填）→ 完成后 gathering.photos/summary 落库、circle.lastGatheringId 更新、跳转 record.html
  - record.html：聚会记录卡详情——合影图集（可补传）、出席人、时间地点项目、买单方式徽标（aa/random/host + 中奖者/请客者名）、留言区（圈友 mock 留言 + 我可留言）、"去 AA 账本"入口（→ledger.html?gathering=）
- [ ] **Step 1: 写失败测试**：`record.test.cjs`
  - `three_steps_order`：渲染 HTML 三步按 ①②③顺序（索引断言）
  - `draw_updates_host_and_visible`：触发抽签后 hostId 变更且新值 ∈ members；HTML 含"下一任张罗"
  - `record_card_fields`：完成后 gathering.title/photos/summary 非空、lastGatheringId 已更新
  - `buymode_badge`：buyMode 'random' 且 payerId 存在→HTML 含"本局由 X 买单"
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现两页**
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚散场仪式与聚会记录卡`

### Task 12: AA 账本 ledger.html

**Files:**
- Create: `D:\GitHub\DEMO\常聚\ledger.html`、`ledger.test.cjs`

**Interfaces:**
- Consumes: Common、Settle、GlobalData；URL `?gathering=`
- Produces: `window.LedgerView.render(gatheringId)` → 账本页：账单条目列表（title/amount/payer/participants）；「记一笔」表单；分账方式三选一（均摊/随机买单=转盘动画用 drawPayer+Math.random/指定买单=选请客人）；结算清单（consolidate 结果："你应收/应付"列表，最少笔数）；结清标记（点"已转账"→settled 落库→billState 更新）；三态徽标；文案轻松不催债（未结清提示："还有 2 笔没结清，不着急，记得就行"）
- [ ] **Step 1: 写失败测试**：`ledger.test.cjs`
  - `add_entry_recomputes`：记一笔后 computeShares 结果含新条目
  - `consolidate_rendered_minimal`：HTML 结算清单笔数与 Settle.consolidate 输出一致
  - `random_buy_wheel`：随机买单后 buyMode==='random'、payerId ∈ members、HTML 含中奖者名
  - `state_badge_updates`：全部标记结清→billState==='settled' 且徽标文案"已结清"
  - `gentle_copy`：未结清时 HTML 含"不着急"字样、不含"催"字
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现 ledger.html**（转盘复用华熙逻辑自绘 SVG，文案温情）
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚AA账本页（随机买单转盘/结算清单）`

### Task 13: 现场小游戏 game-liushang.html + game-wheel.html

**Files:**
- Create: `D:\GitHub\DEMO\常聚\game-liushang.html`、`game-wheel.html`、`game.test.cjs`

**Interfaces:**
- Consumes: Liushang 引擎、GlobalData 当前圈成员；华熙转盘样式思路（自绘 SVG 六段+指针，见 `搭子计划/qiyu-huaxi.html` 参考实现）
- Produces:
  - game-liushang.html：单机传手机模式——全屏水墨山水背景（CSS 绘制）+ 水面流动动画（CSS keyframes）+ 酒杯漂动（按 Liushang.driftDuration 随机时长，随机 stopIndex 停杯）→ 停杯弹出「觞令卡」（drawCard，翻牌动画）→ 完成/再漂一轮；页脚"传给我右边的人"提示
  - game-wheel.html：大转盘（聚会场景内容：谁点菜/谁讲一个秘密/真心话/喝一杯/全场干杯/免死金牌），指针+旋转动画，Math.random 定停
- [ ] **Step 1: 写失败测试**：`game.test.cjs`
  - `liushang_stop_then_card`：vm 触发停杯→HTML 出现觞令卡 type 文案；再漂→卡消失
  - `liushang_card_type_valid`：展示的卡 type ∈ 四类
  - `wheel_segments_and_result`：转盘渲染 6 段文案；停后结果文案 ∈ 段集
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现两页**
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚曲水流觞与聚会大转盘`

### Task 14: 年度回顾 memory.html

**Files:**
- Create: `D:\GitHub\DEMO\常聚\memory.html`、`memory.test.cjs`

**Interfaces:**
- Consumes: GlobalData.gatherings；URL `?circle=`
- Produces: `window.MemoryView.render(circleId)` → 年度报告页：封面（SLOGAN「常聚常伴，圈子不散」）→ 翻页式数据卡——「这一年，我们聚了 N 次」「去了 M 个地方」「第一场：…」「最后一场：…」「垫付之王：X（Y 次）」「随机买单幸运儿：X」→ 尾页合影墙（photos 汇总）+「明年常聚」按钮（Toast）
- 空态：无聚会数据→单页占位"还没有聚会记录，去组一局吧"
- [ ] **Step 1: 写失败测试**：`memory.test.cjs`
  - `stats_correct`：构造 3 场聚会数据→N=3、M=去重地点数、首末场标题正确
  - `pay_king_and_lucky`：bills 统计垫付最多者、buyMode random 的 payer 统计正确
  - `empty_state`：无数据渲染占位文案不报错
  - `slogan_present`：HTML 含「常聚常伴，圈子不散」
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现 memory.html**（翻页动效 CSS transform，不引库）
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚年度回顾页`

### Task 15: 消息中心 message.html + 我的 me.html

**Files:**
- Create: `D:\GitHub\DEMO\常聚\message.html`、`me.html`、`misc.test.cjs`

**Interfaces:**
- Consumes: Common、GlobalData.notifications、Demo
- Produces:
  - message.html（tab=消息）：提醒列表分三类——「该张罗啦」（rhythm，附上次合影缩略）、「等你表态」（respond）、「想念大家了」（miss）；每条可标已读；空态占位
  - me.html（tab=我的）：个人卡片（头像/名字/「常聚常伴，圈子不散」签名）；我的圈子（跳 circle.html）；圈子设置（节律选择：无/每周/每两周/每月→落 rhythm；当值张罗顺延按钮→Rotation.passHost）；「演示控制」入口（Demo.toggle 面板：模拟圈友表态/推进 24h/重置演示）；版本与理念文案
- [ ] **Step 1: 写失败测试**：`misc.test.cjs`
  - `notifications_grouped_three_types`：三类提醒分组渲染、顺序=rhythm>respond>miss
  - `read_mark`：标已读后 read:true
  - `rhythm_setting_persists`：设"每月"→circle.rhythm==={unit:'month',n:1}
  - `pass_host_button`：点顺延→hostId 按 joinOrder 变化
  - `demo_panel_actions`：Demo.advanceTime(24) 后时钟变化、Demo.reset() 恢复初始
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现两页**
- [ ] **Step 4: 运行确认通过** → PASS
- [ ] **Step 5: Commit** `feat: 常聚消息中心与我的页`

### Task 16: 商户详情 merchant.html + 主线串联验收

**Files:**
- Create: `D:\GitHub\DEMO\常聚\merchant.html`、`flow.test.cjs`、`demo-script.md`、`README.md`

**Interfaces:**
- Consumes: GlobalData.venues；全链路页面
- Produces:
  - merchant.html：简化商户详情——封面图/名称/类型标签/评分/人均档位（不展示任何圈友消费信息）/地址/「订座权益」卡（isPartner 且 coupon 时展示，点领取→Toast+领后态）
  - flow.test.cjs：**主线全链路 vm 串联**——加载 data/common/recommend/rotation/settle + 各页内联脚本，顺序执行：建圈(c8)→build 提案→圈友表态（Demo.simulateVotes）→Demo.advanceTime(48)→定案生成 gathering→散场三步（合影/抽签/记录卡）→AA 记账→consolidate→billState settled→下一轮 checkRhythm/再提案；断言每步关键状态 + 最终渲染快照不含成员 position/spendTier 值（Review Focus #5）
  - demo-script.md：演示剧本（wechat.html 入口→主线闭环→四个高光逐个展示→次线一句话带过的操作序列与话术，含每步截图点位）
  - README.md：项目说明、双击 wechat.html 开始的演示指引、npm test 说明、目录结构
- [ ] **Step 1: 写失败测试**：`flow.test.cjs` 全链路断言（每条=一个用例，共 8 条）+ page-smoke 全量复跑
- [ ] **Step 2: 运行确认失败** → FAIL
- [ ] **Step 3: 实现 merchant.html + demo-script.md + README.md**
- [ ] **Step 4: 运行全量确认通过**：`npm test` 全绿（page-smoke 含全部 17 个 html）
- [ ] **Step 5: Commit** `feat: 常聚商户详情与演示主线串联`

---

## Self-Review 记录（已执行）

- **Spec 覆盖**：建圈入圈→Task 8/7；轮值→Task 3/9/11；组局流程→Task 2/10；地点项目与城市基座→Task 1/2/16；聚会记录→Task 11；AA→Task 4/12；小游戏→Task 5/13；年度回顾→Task 14；提醒/消息→Task 15；模拟微信→Task 7；演示控制→Task 6；四个武器与四个高光均有对应任务（散场抽签=11、曲水流觞=13、年度回顾=14、随机买单=12、轮值=3/9、思念提醒=9/15、记忆时间轴=9、散场仪式=11）。次线（模板建圈=8、顺延=15、项目待定投票=10、照片留言=11）均轻量实现。
- **类型一致性**：字段名（hostId/joinOrder/lastGatheringId/proposalId/spendTier/businessArea/buyMode/payerId/billState 三态文案）已在 Task 1 schema 与各引擎接口间核对一致；`computeBestTime`/`drawNextHost`/`consolidate` 等签名在各消费任务中同名引用。
- **Review Focus**：5 条均已挂靠任务（见上表）并落入对应 Step 1 用例。
