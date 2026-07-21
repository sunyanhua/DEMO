# 他俩能成 — 前端开发手册

> 本文档供下一阶段前端开发人员使用。请先通读全文，理解 DEMO 阶段的设计思路和规范标准后再动手。

---

## 一、项目是什么

"他俩能成"是一款相亲交友 H5 小程序。核心定位是**"自己做媒"**——用户既可以为自己找对象，也可以为别人牵线配对，通过"嗑CP"的方式参与社交。

**三种核心角色：**
- **脱单用户**：完善个人档案，浏览推荐、互相关注心动、收送礼物的被撮合方
- **嗑学家**：在牵线玩法中为任意男女投票"能成/不成"，赚取嗑学分的撮合方
- **亲友团**：加入特定用户的亲友团，每次牵线操作可获得 +20 匹配度加成

**与普通相亲产品的区别：** 不是你一个人在找对象，而是一群人在帮你找。牵线配对和缘分记录是所有互动的主线。

---

## 二、技术选型及原因

| 项 | 选型 | 为什么这样选 |
|----|------|-------------|
| 页面语言 | 纯 HTML/CSS/JS | DEMO 阶段不考虑框架迁移成本，方便直接交接给小程序开发团队 |
| 样式方案 | Tailwind CSS + style.css | Tailwind 提供原子化 class 快速开发；style.css 统一品牌色体系和高频复用模块 |
| 图标 | Lucide Icons | 开源免费，图标丰富，`createIcons()` 可批量渲染 |
| 数据 | `window.AppData` 全局 mock | 所有页面共用同一套假数据，方便将来替换为 API 调用 |
| 结构 | 全部页面平级，无路由 | 模拟小程序多页面跳转，每页独立渲染 |

---

## 三、品牌色体系

> 硬约束，不得自行增删改。

| Token | 色值 | 在哪定义 | 用途 |
|-------|------|---------|------|
| `brand.pink` | `#e04d2c` | `common.js` + `style.css` | **主色**：Tab 高亮、按钮渐变起点、标题强调 |
| `brand.pink-light` | `#FFF0EC` | 同上 | 浅粉底色块 |
| `brand.pink-dark` | `#C43E20` | 同上 | 渐变暗端 |
| `brand.orange` | `#F06840` | 同上 | **辅色**：按钮渐变终点、辅助强调 |
| `brand.orange-light` | `#FFF5F2` | 同上 | 辅助浅底色 |

**顶部暖橙渐变（`.top-section`）：**
```
两个交错径向光斑（左 30% 暖橙 + 右 70% 品牌粉）+ 浅桃色线性底 → 透明
```

**在 HTML 中用 Tailwind class：** `text-brand-pink`、`bg-brand-pink-light`、`from-brand-pink to-brand-orange`

---

## 四、页面是怎么组织的

### 4.1 两种页面布局

项目共 38 个 HTML 文件，分为两种布局模式：

**A 型 — 三段式（有顶部渐变区）**
```
┌──────────────────────┐
│   .top-section       │  ← 暖橙渐变背景，放标题或 Banner
│   (渐变 → 透明)      │
├──────────────────────┤
│   .rounded-top       │  ← 16px 白色桥接，圆角 + 上阴影
├──────────────────────┤
│   .content-section   │  ← 白色→底部透明，内容主体
│                      │
└──────────────────────┘
```
用于：首页、活动列表、全部用户、广播、专区、个人中心首页、神助攻等。

**B 型 — Sticky Header（子页面标准）**
```
┌──────────────────────┐
│  sticky header       │  ← 毛玻璃效果，始终吸顶
│  icon + 标题          │
├──────────────────────┤
│                      │
│   px-4 内容区         │
│                      │
└──────────────────────┘
```
用于：所有子页面（列表、表单、详情等）。**新建页面默认使用此布局。**

### 4.2 页面地图

```
首页 (index)
├─ 底部 5 Tab ─┬─ 首页    → 快捷入口(广播/专区/榜单) + 用户推荐
│              ├─ 活动    → 活动列表 → 活动详情 → 报名
│              ├─ (logo)  → 缘分速配（卡片滑动交互）
│              ├─ 消息    → 通知分类 + 私信列表 → 聊天
│              └─ 我的    → 个人中心（登录/档案/列表/钱包…）
│
个人中心 (me) 子页面 ─┬─ register.html          注册
│                    ├─ edit-profile.html       编辑基本资料（只读）
│                    ├─ profile-wizard.html     填写脱单档案（4步向导）
│                    ├─ profile-edit.html       编辑脱单资料（完整表单）
│                    ├─ my-lists.html           心动/关注/无感
│                    ├─ my-1314.html            我的1314
│                    ├─ my-gifts.html           我的礼物
│                    ├─ my-prizes.html          我的奖品
│                    ├─ my-family.html          我的亲友团
│                    ├─ my-family-joined.html   我加入的亲友团
│                    ├─ my-assist.html          我的神助攻
│                    ├─ kexue.html              嗑学分
│                    ├─ history.html            牵线记录
│                    ├─ verification.html       认证中心
│                    ├─ wallet.html / wallet-cash.html  金币/钱包
│                    └─ help.html               帮助
│
其他独立页面 ─┬─ broadcast.html      广播节目
│            ├─ chaoyang.html       朝阳相伴专区
│            ├─ qingai.html         青爱团专区
│            ├─ ranking.html        排行榜
│            ├─ user-list.html      全部用户
│            ├─ profile.html        用户个人主页
│            ├─ interact.html       缘分速配
│            ├─ matchmaker.html     牵线玩法
│            ├─ fate-detail.html    缘分详情
│            ├─ assist.html         神助攻
│            └─ chat.html           私信对话
```

### 4.3 底部导航栏

5 个 Tab，通过 `window.Common.renderBottomNav(activeTabId)` 渲染。中间按钮是 66×66px 粉橙渐变圆形凸起。

**只在 4 个主页面调用此方法：** `index.html`、`activity.html`、`message.html`、`me.html`。

**子页面不设底部导航**——这是小程序 DEMO，小程序框架自带返回按钮，不需要页面内再加。

### 4.4 Body 底部 padding 规则

| class | 何时用 |
|-------|-------|
| `pb-28` | 有底部导航栏的页面（4个主页） |
| `pb-2` | 只有 sticky header 的子页面（绝大多数） |
| `pb-4` | 列表类子页面，留一点呼吸空间 |
| 无 class | 有自定义底部操作栏的页面（profile/chat/matchmaker 等） |

---

## 五、页面怎么建

### 5.1 新页面 checklist

每次新建页面，按以下步骤检查：

- [ ] `<head>` 引入 `tailwind.min.js`、`lucide.min.js`、`style.css`
- [ ] `<body>` 开头放入 `bg-decoration` + 5 个 `bg-blob`
- [ ] `<div id="app" class="relative z-[1]">` 作为渲染容器
- [ ] `<body class="bg-white text-gray-900 antialiased pb-2">`
- [ ] 选择布局：A型（三段式）或 B型（sticky header）
- [ ] 末尾引入 `<script src="common.js"></script>` 和自己的逻辑
- [ ] 使用 `window.AppData` 取 mock 数据，不要重复声明
- [ ] `render()` 末尾调用 `window.Common.initIcons()`
- [ ] 用 `DOMContentLoaded` 启动渲染
- [ ] 弹窗用 `Common.showPopup/hidePopup/closePopup`
- [ ] `onclick` 中的单引号用 `\x27` 转义
- [ ] 按钮用 `<span>` + `card-hover`，只有表单提交保留 `<button type="submit">`
- [ ] 不要在页面 `<style>` 中重复定义 `slide-up`、`scoreUp`、`floatUp`

### 5.2 页面标准模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<title>页面标题 - 他俩能成</title>
<script src="lib/tailwind.min.js"></script>
<script src="lib/lucide.min.js"></script>
<link rel="stylesheet" href="style.css">
</head>
<body class="bg-white text-gray-900 antialiased pb-2">

<div class="bg-decoration">
  <div class="bg-blob"></div><div class="bg-blob"></div>
  <div class="bg-blob"></div><div class="bg-blob"></div>
  <div class="bg-blob"></div>
</div>
<div id="app" class="relative z-[1]"></div>

<script src="common.js"></script>
<script>
function render(){
  document.getElementById('app').innerHTML =
    '<div class="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-sm flex items-center">'+
      '<i data-lucide="icon-name" class="w-3.5 h-3.5 text-brand-pink mr-2"></i>'+
      '<h1 class="text-sm font-bold text-gray-900">页面标题</h1>'+
    '</div>'+
    '<div class="px-4 pt-3 pb-6">'+
      // 内容区
    '</div>';
  window.Common.initIcons();
}
document.addEventListener('DOMContentLoaded', function(){ render(); });
</script>
</body>
</html>
```

---

## 六、JavaScript 怎么用

### 6.1 common.js 提供的能力

`common.js` 是全局运行环境，必须先于页面脚本加载。它做了三件事：

1. **注册 Tailwind 品牌色**（`brand.pink/orange/...`）
2. **挂载 `window.Common` 方法集**
3. **提供 `window.AppData` mock 数据**

### 6.2 弹窗系统（核心机制）

所有弹窗遵循同一套规则：

```
弹窗 DOM 结构：  .fixed.inset-0 > .bg-black/40 (遮罩) > .bg-white (内容)
初始状态：       hidden（Tailwind hidden class）
显示：           Common.showPopup(id) → 移除 hidden，添加 flex
隐藏：           Common.hidePopup(id) → 添加 hidden，移除 flex
遮罩点击关闭：    onclick="Common.closePopup(event, 'id')"
内容阻止冒泡：    onclick="event.stopPropagation()"
```

**居中弹窗尺寸：** `w-80`(320px) × `p-5`(20px) × `rounded-2xl`
**底部弹窗尺寸：** `w-full` × `rounded-t-2xl` × `max-h-[85vh]` + `animate-slide-up`

### 6.3 API 速查

| 方法 | 用途 |
|------|------|
| `Common.el(id)` | 等同于 `document.getElementById` |
| `Common.gb(gender)` | 返回 ♂/♀ 性别标签 HTML，`'male'` 或 `'female'` |
| `Common.vfBadge()` | 返回"已实名"标签 HTML |
| `Common.showToast(msg)` | 居中黑色 Toast，自动消失 |
| `Common.floatToast(msg)` | 底部浮出 Toast（卡片交互反馈） |
| `Common.showScorePopup(text)` | 人气值飘出动画（送礼/投票反馈） |
| `Common.showPopup(id)` | 显示弹窗，自动初始化内部图标 |
| `Common.hidePopup(id)` | 隐藏弹窗 |
| `Common.closePopup(e, id)` | 遮罩点击关闭（判断 target） |
| `Common.initIcons()` | 渲染 Lucide 图标（含 200ms 重试） |
| `Common.renderBottomNav(tab)` | 渲染底部导航栏 |
| `Common.initStickyTab()` | Tab 栏吸顶联动 |

### 6.4 Mock 数据 (window.AppData)

| 字段 | 数量 | 示例 |
|------|------|------|
| `CONS` | 12 | 白羊座…双鱼座 |
| `ZODIACS` | 12 | 鼠…猪 |
| `DISTRICTS` | 17 | 东城区…延庆区, 其他 |
| `NATIONS` | 11 | 汉族…朝鲜族, 外国民族 |
| `PROVS` | 37 | 北京市…澳门, 外籍, 其他 |
| `EDU` | 5 | 高中及以下…博士 |
| `BLOOD` | 4 | A型…O型 |
| `MARITAL` | 3 | 未婚/离异/丧偶 |
| `NM` | 12 | 阳光骑士…蓝调人生 |
| `NF` | 12 | 甜心小鹿…初夏之梦 |
| `PHOTOS_M` | 10 | images/photo/male/crop.*.jpg |
| `PHOTOS_F` | 10 | images/photo/female/crop.*.jpg |
| `GIFTS` | 3 | 菜小宝/听小北-爱你/听小北-亲亲 |

**页面级随机工具：**
```javascript
function r(n) { return Math.floor(Math.random() * n); }
function shuffle(a) { for(var i=a.length-1;i>0;i--){ var j=r(i+1);[a[i],a[j]]=[a[j],a[i]]; } return a; }
```

---

## 七、嗑学分等级体系

嗑学分是平台核心激励数值。通过牵线投票赚取，不同分段对应不同头衔，用于神助攻等功能。

| 头衔 | 分数区间 | 性质 |
|------|---------|------|
| 嗑学传奇 | ≥ 50001 | 正向最高 |
| 嗑学宗师 | 20001 ~ 50000 | |
| 嗑学大神 | 10001 ~ 20000 | |
| 嗑学行家 | 5001 ~ 10000 | |
| 嗑学高手 | 2001 ~ 5000 | |
| 嗑学爱好者 | 1001 ~ 2000 | |
| 嗑学门生 | 101 ~ 1000 | |
| 嗑学菜鸟 | 0 ~ 100 | 新手起步 |
| 嗑学门外汉 | -100 ~ -1 | |
| 反嗑学分子 | -1000 ~ -101 | |
| 高级拆家 | -10000 ~ -1001 | |
| 当代法海 | ≤ -10001 | 负向最低 |

**匹配度数值范围：** -200 ~ 1314，1314 为最高值（寓意"一生一世"）。

**神助攻获取规则：** 每周嗑学分达 1314 → 1次；达 3344 → 3次（周六牵线榜揭晓时结算）。

---

## 八、数据模型速览

### 8.1 用户档案

| 字段组 | 包含字段 | 可修改？ |
|--------|---------|---------|
| 基本资料（注册时锁定） | 昵称、手机号、性别、出生日期 | ❌ 不可修改（仅在注册页填写一次） |
| 脱单资料 | 婚姻状态、身高、体重、属相、血型、学历、职业、所在区县、民族、户籍、家乡 | ✅ 可在 profile-edit 中编辑 |
| 隐私信息 | 姓名、工作单位 | ✅ 可编辑，标记为"不向其他用户展示" |
| 更多信息 | 兴趣爱好、才艺特长、个人介绍、择偶标准 | ✅ 可编辑 |
| 档案可见性 | 全平台公开 / 仅专区展示 / 完全隐藏 | ✅ 可随时切换 |

### 8.2 用户交互关系

```
用户 A ──关注──→ 用户 B
用户 A ──心动──→ 用户 B    （会自动关注）
用户 A ──送礼──→ 用户 B    （消耗金币）
用户 A ──无感──→ 用户 B    （不再推荐）

用户 C ──加入亲友团──→ 用户 D  （每次牵线 +20 匹配度）
用户 C ──认为能成/不成──→ CP(E,F) （+/- 嗑学分）
用户 C ──神助攻──→ CP(E,F) （匹配度直达 1314）
```

---

## 九、UI 组件速查

> 以下模板可直接复制使用，class 即为标准。

### 弹窗

**居中弹窗（w-80 / p-5 / rounded-2xl）：**
```html
<div id="popup-id" class="fixed inset-0 bg-black/40 z-[200] hidden items-center justify-center"
     onclick="window.Common.closePopup(event,'popup-id')">
  <div class="bg-white rounded-2xl p-5 mx-auto w-80 shadow-xl text-center" onclick="event.stopPropagation()">
    <!-- 内容 --><div class="mt-4 w-full py-2.5 rounded-xl bg-brand-pink text-white font-bold text-sm card-hover text-center cursor-pointer" onclick="window.Common.hidePopup('popup-id')">确定</div>
  </div>
</div>
```

**底部滑入弹窗（表单专用）：**
```html
<div id="slide-popup" class="fixed inset-0 bg-black/40 z-[200] hidden items-end justify-center"
     onclick="window.Common.closePopup(event,'slide-popup')">
  <div class="bg-white w-full rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up" onclick="event.stopPropagation()">
    <div class="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-4 border-b border-gray-100 rounded-t-2xl">
      <span class="text-lg font-black text-gray-800">标题</span>
      <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer" onclick="window.Common.hidePopup('slide-popup')"><i data-lucide="x" class="w-5 h-5 text-gray-500"></i></span>
    </div>
    <div class="p-4 space-y-4"><!-- 表单 --></div>
  </div>
</div>
```

### 按钮

| 场景 | class 模板 |
|------|-----------|
| 全宽主按钮 | `block text-center w-full py-3.5 bg-gradient-to-tr from-brand-pink to-brand-orange text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-pink/20 card-hover cursor-pointer` |
| 描边按钮 | `rounded-xl bg-white border border-brand-pink/30 text-brand-pink font-bold card-hover cursor-pointer` |
| 灰色取消 | `rounded-xl bg-gray-100 text-gray-500 font-bold card-hover cursor-pointer` |
| 悬浮胶囊 | `fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-full bg-gradient-to-tr from-brand-pink to-brand-orange text-white font-bold text-sm shadow-xl shadow-brand-pink/30 card-hover cursor-pointer flex items-center gap-2` |

### 子标签切换

```html
<div class="flex gap-2 pt-2 pb-1">
  <span onclick="switchTab('a')" class="px-3 py-1.5 text-xs rounded-full font-medium cursor-pointer bg-brand-pink text-white">选中</span>
  <span onclick="switchTab('b')" class="px-3 py-1.5 text-xs rounded-full font-medium cursor-pointer bg-gray-100 text-gray-500">未选</span>
</div>
```

### Sticky Tab 栏

```html
<div id="tab-bar" class="sticky top-0 z-30 bg-white px-4 pt-3 pb-0 shadow-sm">
  <div class="flex w-full border-b border-gray-100">
    <span class="flex-1 text-center text-sm pb-2.5 font-bold text-brand-pink border-b-[3px] border-brand-pink cursor-pointer">选中</span>
    <span class="flex-1 text-center text-sm pb-2.5 font-bold text-gray-400 border-b-[3px] border-transparent cursor-pointer">未选</span>
  </div>
</div>
```

### 列表容器

```html
<div class="bg-white rounded-2xl shadow-sm border border-gray-100">
  <div class="px-3"><!-- 每项: px-4 py-4 border-b border-gray-50 --></div>
</div>
```

### 标准用户行

```html
<div class="flex items-center gap-3 px-4 py-4 border-b border-gray-50 cursor-pointer card-hover"
     onclick="window.location.href='profile.html'">
  <div class="relative flex-shrink-0">
    <img src="..." class="w-12 h-12 rounded-full object-cover border border-gray-100"/>
  </div>
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-1.5">
      <span class="text-sm font-bold text-gray-800 truncate max-w-[80px]">昵称</span>
      <!-- Common.gb() -->
    </div>
    <div class="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">年龄 · 星座</div>
  </div>
  <!-- 右侧按钮 -->
</div>
```

### 表单元素

| 类型 | class |
|------|-------|
| 输入框 | `w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-pink` |
| 禁用态 | `w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed` |
| 下拉框 | 同上 + 去掉 `text-center`（居左对齐） |
| 多行文本 | 同上 + `resize-none` |
| 必填标记 | `<span class="text-brand-pink">*</span>` |

### 分隔线

| 场景 | |
|------|---|
| 卡片内信息块间 | `border-t border-gray-200` |
| 列表项间 | `border-b border-gray-50` 或 `border-gray-200`（需清晰时） |
| 缘分记录间 | `border-t border-dashed border-pink-200` |

### 二次确认弹窗

```html
<div id="confirm-overlay" class="fixed inset-0 bg-black/40 z-[200] hidden items-center justify-center"
     onclick="window.Common.closePopup(event,'confirm-overlay')">
  <div class="bg-white rounded-2xl p-5 mx-auto w-80 shadow-xl text-center" onclick="event.stopPropagation()">
    <div class="text-4xl mb-3">💔</div>
    <p id="confirm-msg" class="text-sm text-gray-700 mb-4"></p>
    <div class="space-y-2">
      <span class="block w-full py-2.5 rounded-xl bg-brand-pink text-white font-bold text-sm card-hover text-center cursor-pointer">确定</span>
      <span onclick="window.Common.hidePopup('confirm-overlay')" class="block w-full py-2.5 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm card-hover text-center cursor-pointer">我再想想</span>
    </div>
  </div>
</div>
```

---

## 十、JS 编码硬规则

### 10.1 引号转义

JS 字符串中嵌入 `onclick` 属性时，用 `\x27` 替代单引号：

```javascript
// ✅ 对
'<span onclick="window.location.href=\x27page.html\x27">文字</span>'

// ❌ 错 — 页面报 SyntaxError
'<span onclick="window.location.href=\'page.html\'">文字</span>'
```

### 10.2 图标初始化

- 每次 `render()` 末尾必须调用 `window.Common.initIcons()`
- 弹窗内图标由 `Common.showPopup()` 自动处理，无需手动调用
- 动态注入 HTML 后若图标未渲染，延迟 50~300ms 再调一次

### 10.3 标准渲染模式

```javascript
function render() {
  document.getElementById('app').innerHTML = '...';
  window.Common.initIcons();
}
document.addEventListener('DOMContentLoaded', function(){ render(); });
```

---

## 十一、交互流程全景

```
┌──────────────────────────────────────────────────────────┐
│                    登录 / 注册                            │
│  me → phone-auth 弹窗 → register → (回me)                │
│  (注册时的基本资料不可修改)                                │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│                 填写脱单档案 (4步向导)                     │
│  ①基本资料(只读)+姓名单位+隐私协议                         │
│  → ②上传照片 → ③脱单资料(婚姻/身高/学历…)                 │
│  → ④更多信息(爱好/才艺/介绍/择偶，可跳过)                  │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│                    首页 → 缘分速配                         │
│  卡片滑动浏览 → 无感(左滑) / 关注(右滑)                    │
│  → 心动(确认弹窗) → 送礼邀请 → profile 或下一张            │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│                profile → 牵线配对 → 缘分详情               │
│  "帮TA牵线" → matchmaker (CP投票能成/不成)                 │
│  → 弹窗结果(嗑学分变化) → fate-detail(缘分记录)            │
│  → 神助攻(匹配度直达1314) → assist页面                    │
│  "找助力" → 分享/求助攻弹窗                               │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│              个人中心 → 各类子页面                         │
│  我的心动/关注/无感/1314/礼物/奖品/亲友团/神助攻           │
│  嗑学分 → 等级说明弹窗 + 成绩单 → 牵线记录                │
│  认证中心 → 实名认证 + 单位认证(社保证明)                  │
└──────────────────────────────────────────────────────────┘
```

---

## 十二、注意事项（必须遵守）

1. **所有 mock 数据优先用 `window.AppData`**，不要再在各页面声明 `CONS`/`NM`/`NF` 等数组
2. **`slide-up` 动画在 `style.css` 统一定义**，`scoreUp`/`floatUp` 由 `common.js` 注入——页面 `<style>` 中不重复定义
3. **品牌橙色统一为 `#F06840`，渐变方向统一 `to-tr`**（右下斜向）
4. **弹窗内边距固定 `p-5`**，宽度 `w-80`
5. **所有页面必须有 `bg-decoration` 背景装饰**
6. **按钮用 `<span>` + `card-hover`**，仅表单提交保留 `<button type="submit">`
7. **图片存 `images/`**，用户照片按性别分 `images/photo/male/` 和 `images/photo/female/`
8. **B型布局为默认**——新建子页面使用 sticky header
9. **子页面 body class：** `bg-white text-gray-900 antialiased pb-2`
10. **表单输入居左**，不设 `text-center`；提交按钮文字居中
