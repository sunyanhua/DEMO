# CLAUDE.md — 搭子计划

## 项目概述

"搭子计划"（Da-Party）是一个面向都市年轻人的交友社区平台 DEMO。用户可浏览和发布线下活动、发布动态、浏览个人主页、私信搭讪留言，帮助年轻人在城市中找到志同道合的伙伴。

当前阶段为 **DEMO 演示版**，主要使用纯 HTML/CSS/JavaScript（原 React/TypeScript 项目已迁移至 vanilla JS）。

## 技术栈

| 项 | 选型 |
|----|------|
| 页面语言 | 纯 HTML/CSS/JavaScript（无构建工具，CDN 加载依赖） |
| 样式方案 | Tailwind CSS（CDN `cdn.tailwindcss.com`）+ 自定义 `style.css` |
| 图标库 | Lucide Icons（CDN `jsdelivr` UMD 版本） |
| 公共脚本 | `common.js`（品牌色配置、底部导航、Toast、图标初始化等） |
| 数据模式 | `window.GlobalData` mock 数据（`data.js`），页面内 `var` 声明的局部数据 |
| 遗留代码 | React 19 + TypeScript + Vite 组件（`components/`、`App.tsx`、`index.tsx` 等，已废弃） |

**注意**：项目的 `components/` 目录中保留有原始 React 组件（`Banner.tsx`、`CategoryGrid.tsx`、`ActivityFeed.tsx` 等），但当前 `App.tsx` 和 `index.tsx` 已标记为 deprecated。所有活跃代码均为 `index.html` + `data.js` + `common.js` 的 vanilla JS 架构。

**每页标准模板**：
```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js"></script>
<link rel="stylesheet" href="style.css">
```

## 品牌色体系

`style.css` 中定义，并由 `common.js` Tailwind 扩展注册：

| Token | 色值 | 用途 |
|-------|------|------|
| `brand.orange` | `#FF6B00` | 主色调（Tab 高亮、按钮、标题） |
| `brand.yellow` | `#FFD000` | 辅助色 |
| `brand.blue` | `#42A5F5` | 辅助色 |
| `brand.teal` | `#00A99D` | 辅助色 |
| `brand.purple` | `#7B1FA2` | 辅助色 |
| `brand.pink` | `#FF4081` | 辅助色 |
| `brand.green` | `#00C853` | 辅助色 |
| `brand.red` | `#FF3D00` | 警示色 |
| `brand.bg` | `#F8F9FA` | 背景色 |

**配色原则**：主色调为活力橙 `#FF6B00`，辅以 vibrant 色系用于各类标签和点缀。整体配色鲜亮活泼，符合年轻人社交调性。

**使用方式**：HTML 中直接用 Tailwind class `text-brand-orange`、`bg-brand-orange`、`bg-brand-pink` 等。

## 字体

| 字体 | 用途 |
|------|------|
| PingFang SC | 主字体（iOS/ macOS） |
| Microsoft YaHei | 回退字体（Windows） |
| sans-serif | 通用回退 |

## 页面结构标准

### Body 样式

```html
<body class="bg-gray-50 text-gray-900 antialiased selection:bg-brand-orange selection:text-white pb-20">
```

### 浮动装饰

所有页面包含 4 个浮动装饰形状：
```html
<div class="floating-shapes">
    <div class="floating-shape"></div>  <!-- ×4 -->
</div>
```

### 应用挂载点

```html
<div id="app" class="min-h-screen"></div>
```

## 底部导航

使用 `window.Common.renderBottomNav(activeTabId)`，五个 tab：

| ID | 标签 | 图标 | 链接 | 说明 |
|----|------|------|------|------|
| home | 首页 | home | index.html | 活动流 + 推荐 |
| discover | 发现 | compass | category.html | 分类浏览 |
| publish | 发布 | plus | publish.html | 特殊样式（橙色圆形凸起） |
| message | 消息 | message-square-more | message.html | 私信列表 |
| me | 我的 | user | me.html | 个人中心 |

## UI 组件规范

### 按钮

- **主操作**：`bg-brand-orange text-white rounded-xl font-bold`（橙色圆角按钮）
- **描边**：`bg-white border border-brand-orange text-brand-orange rounded-xl font-bold`
- **禁用态**：`bg-gray-200 text-gray-400`

### 卡片

- **活动卡片**：`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`
- **用户卡片**：`bg-white rounded-xl shadow-sm border border-gray-100`

### 标签

| 类型 | 样式 |
|------|------|
| 活动分类 | `bg-{color}-100 text-{color}-600` 小圆角标签 |
| 认证标识 | 橙色（实名）/ 蓝色（合作）边框 + 文字 |

### 弹窗

- 居中弹窗：`fixed inset-0 bg-black/40 z-[200]` + 内容 `bg-white rounded-2xl p-5 mx-auto w-80`
- 底部滑入：`items-end` + `animate-slide-up`

### Toast 提示

通过 `window.Common.showToast(message)` 调用。

## 文件清单

| 文件 | 功能 | 类型 |
|------|------|------|
| `index.html` | 首页（Banner + 分类 + 推荐用户 + 活动流） | 主页 |
| `category.html` | 发现/分类浏览 | 主页 |
| `publish.html` | 发布动态/活动 | 功能页 |
| `detail.html` | 活动详情 + 报名 | 详情页 |
| `profile.html` | 用户个人主页 | 详情页 |
| `edit-profile.html` | 编辑个人资料 | 表单页 |
| `chat.html` | 私信对话 | 功能页 |
| `message.html` | 消息列表 | 主页 |
| `search.html` | 搜索 | 功能页 |
| `user-list.html` | 用户列表 | 列表页 |
| `recommend-users.html` | 推荐搭子 | 列表页 |
| `me.html` | 个人中心 | 主页 |
| `moment.html` | 动态广场 | 列表页 |
| `history.html` | 浏览记录 | 列表页 |
| `favorites.html` | 我的收藏 | 列表页 |
| `orders.html` | 我的订单 | 列表页 |
| `points.html` | 积分中心 | 功能页 |
| `levels.html` | 等级说明 | 说明页 |
| `wallet.html` | 我的钱包 | 功能页 |
| `verification.html` | 认证中心 | 功能页 |
| `tree-growth.html` | 关系树 | 功能页 |
| `activity-manage.html` | 活动管理（发布者） | 管理页 |
| `activity-participants.html` | 活动参与者列表 | 列表页 |
| `autumn2026.html` | 🍂 秋季专题"秋天的第一个搭子" | 专题页 |
| `music-festival.html` | 🎵 大运河音乐节专题（上大屏 / 我的AI合照 / 找搭子） | 专题页 |
| `style.css` | 全局自定义样式 | 资源 |
| `common.js` | 公共函数库 | 资源 |
| `data.js` | 全局 mock 数据 | 资源 |

## 用户角色体系

| 角色 | 描述 | 关键权限 |
|------|------|----------|
| 普通用户 | 未认证的注册用户 | 浏览活动/动态、报名免费活动、发布动态、关注/私信 |
| 实名认证用户 | 完成实名认证 | + 个人主页显示实名认证标识 |
| 合作认证用户 | 商户/主理人 | + 发布收费活动、活动管理、收入结算 |
| 平台管理员 | 运营管理人员 | 用户管理、活动审核、内容管理 |

## 私信限制策略

| 关系状态 | 权限 |
|---------|------|
| 未互相关注 | 只能互相留言一次 |
| 单方面关注 | 被关注方可发送多条消息 |
| 互相关注 | 畅聊无限制 |

## 开发约定

- 回复简洁，不重复解释代码，只告知修改位置
- 所有授权和修改直接进行，无需确认
- 图片资源统一放在 `images/` 目录下
- 使用 `window.GlobalData` 取 mock 数据，不在各页面重复声明
- 每页独立可预览，不需构建
- 遗留 React 组件不再维护，全部新功能在 vanilla JS 中实现
