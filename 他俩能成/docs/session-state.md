# 会话状态存档（压缩前）

> 生成时间：2026-11-03。用户说"继续"后先读本文件恢复上下文。

## 项目概况

- 项目：**他俩能成**（相亲交友 H5 demo），目录 `D:/GitHub/DEMO/他俩能成/`
- 技术栈：纯 HTML/CSS/JS 无框架；本地 Tailwind + Lucide；`common.js` 公共函数（品牌色 #e04d2c 等）；mock 数据页面内 `var` 声明
- 测试：`npm test`（node baoxi-list.test.cjs，vm 沙箱）——**当前 20 用例全过**
- git：Auto-sync 定时提交（OldSun），本地改动会自动入库；无未跟踪文件

## 本次会话进行中的工作主线

1. **报喜功能全套**（第 1~24 批，均已完成）：
   - 报喜列表 `baoxi-list.html`（引导卡 baoxiGuideCard + 卡片报喜图片 SVG 占位 `images/placeholder-couple.svg` 硬编码 + 随份子弹窗 + 悬浮我要报喜/我的报喜）
   - 报喜详情 `baoxi-detail.html`（完整结缘海报 + 随礼清单）；报喜表单 `baoxi.html`（上传照片/结婚证 + 520 红包提示 + query 参数预选 TA：name/photo/gender，已做防注入清洗）
   - 共享模块：`lib/baoxi-data.js`（4 对 mock）、`lib/baoxi-gifts.js`（份子数据+弹窗状态机，选择操作**就地刷新**）、`lib/baoxi-report.js`（海报 DOM）、`lib/baoxi-poster.js`（海报 canvas 绘制+下载：上传大图压缩 ≤700px JPEG + 幸福时刻区域纯白检测兜底）、`lib/baoxi-imgdata.js`
   - 入口路由 `Common.goBaoxi(name,photo,gender)`：已报喜且记录完好→`baoxi-detail.html?id=mine`，否则→`baoxi.html`（可带预选参数）；`Common.isBaoxiSubmitted()` / `hasBaoxiReport()`（JSON 可解析且 names 长度 2）
   - 三处引导入口：首页匹配卡"🎉 报喜"按钮（已成卡且**未报喜**才显示，capsule==='你和TA已成'，用 MATCH_DONE_CAPSULE 常量）、my-1314.html 顶部引导卡（已报喜隐藏）、profile.html 缘分记录 1314 引导行
2. **靠谱值体系**（第 11~17 批，已完成）：
   - 榜单 `ranking.html`：首个 TAB **靠谱榜**，60-100 分一位小数，全部/男/女切换在右侧且默认全部，无周/总榜；单一用户池 KAOPU_USERS 派生三榜；甜心小鹿分数=KaopuData.total
   - `lib/kaopu-data.js`：10 条规则（注册+60；实名/学历/单位一次性 +10/+5/+5；签到+10/次；报名+1/次；未到场-10/次；被举报-15；周日20:00更新排行；长期未登录扣减 5%/10%/20%/50% 分档）+ 积累记录（活动含活动名）+ 总额 74.7 + updatedAt（最近周日20:00）
   - `my-kaopu.html`：总额+更新时间+规则说明弹窗（max-h-[80vh] 可滚）+记录列表
   - 入口：me.html 个人中心"我的脱单档案"上方靠谱值卡片；profile.html 人气指数标题上方显示靠谱值（与 KaopuData.total 同源）
3. **举报功能**（第 18 批，已完成）：me.html"我的认证"下方"我要举报"→弹窗（对方能成号+举报内容）→toast"您的举报内容已经提交，我们将与您联系核实情况。"
4. **近期小改**（第 20~24 批，已完成）：占位图硬编码修复 OSS undefined；下载海报上传图空白修复；首页匹配已成优先排序 sortChengFirst；已成卡报喜按钮保留门控（未报喜才显示）；报喜红包提示加红加粗放大；随份子弹窗就地刷新；首页快捷按钮合作专区→朝阳相伴+青爱团；首页能成报告悬浮入口移除

## 关键约定/决策（避免重蹈覆辙）

- 用户明确：报喜列表图**先用 SVG 占位**（不要改用 couplePhoto 合成照）
- "报名活动未到场"按 **-10/次** 实现（用户原文"一次性"矛盾处按/次）
- 举报 toast 用"核实情况"（用户原文"合适情况"）
- 已成卡报喜按钮**未报喜才显示**（用户确认门控是对的）
- 代码审查（/code-review skill）每次改完必跑；审查意见与用户显式需求冲突时以用户为准
- 测试沙箱：Math.random 固定 0.5、setInterval 桩、保留真实 Common（仅替换 renderBottomNav/initIcons/showToast）、裸 location 全局、跨 realm 数组断言用 Array.from

## 待办 / 部署提醒

- 无进行中的开发任务，等用户下一条指令
- 部署到 OSS 时注意传全部改动文件（baoxi.html/index.html/lib/*.js/my-kaopu.html 等）；新文件 images/placeholder-couple.svg、lib/kaopu-data.js、my-kaopu.html 已入库
- 真实浏览器效果（海报下载照片渲染、弹窗动画）线上验证

## 会话压缩约定

- 用户说"压缩"→ 写本文档；用户说"继续"→ 读本文档恢复上下文后等指令
