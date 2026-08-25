# CLAUDE.md — 他俩能成

## 项目概述

"他俩能成"是一款相亲交友小程序（H5 演示版），用户可浏览推荐单身用户、参与广播节目互动、加入专区、查看榜单排名、牵线配对等。

## 技术栈

| 项 | 选型 |
|----|------|
| 页面语言 | 纯 HTML/CSS/JavaScript（无框架，无构建工具） |
| 样式方案 | Tailwind CSS（本地 `lib/tailwind.min.js`）+ 自定义 `style.css` |
| 图标库 | Lucide Icons（本地 `lib/lucide.min.js`） |
| 公共脚本 | `common.js`（品牌色配置、底部导航、Toast、图标初始化） |
| 数据模式 | 页面内 `var` 声明的 mock 数据，模拟接口 |

**每页标准模板**：
```html
<script src="lib/tailwind.min.js"></script>
<script src="lib/lucide.min.js"></script>
<link rel="stylesheet" href="style.css">
```

## 品牌色体系

`style.css` 中定义，并由 `common.js` Tailwind 扩展注册：

| 变量 / Token | 色值 | 用途 |
|-------------|------|------|
| `--pink` / `brand.pink` | `#e04d2c` | 主强调色（Tab 高亮、按钮、标题） |
| `--pink-light` / `brand.pink-light` | `#FFF0EC` | 浅底色 |
| `--pink-dark` / `brand.pink-dark` | `#C43E20` | 深色（渐变暗端） |
| `--orange` / `brand.orange` | `#F06840` | 辅助强调（渐变中端） |
| `--orange-light` / `brand.orange-light` | `#FFF5F2` | 辅助浅色 |

**顶部渐变**：两交错径向光斑（左暖橙+右品牌粉）+ 浅桃色线性底 `#FABFAA → transparent`

**使用方式**：HTML 中直接用 Tailwind class `text-brand-pink`、`bg-brand-pink-light`、`from-brand-pink to-brand-orange` 等。

## 页面结构标准

### 区段划分

当页面需要区分顶部区域和内容区域时，使用三个标准层：

```
.top-section        （暖橙渐变背景，含 banner/图片等顶部元素）
.rounded-top         （桥接层，16px 上方圆角 + 向上阴影，不设 overflow:hidden）
.content-section     （白色底色，16px 上方圆角）
```

`rounded-top` 桥接层不要设 `overflow:hidden`，否则会影响 sticky 定位。

### 背景装饰

所有页面应添加全局流线色块背景装饰：

```html
<div class="bg-decoration">
    <div class="bg-blob"></div>  <!-- x5 -->
</div>
```

## 底部导航

使用 `window.Common.renderBottomNav(activeTabId)`，五个 tab：

| ID | 标签 | 图标 | 链接 |
|----|------|------|------|
| home | 首页 | home | index.html |
| activity | 活动 | calendar | activity.html |
| center | （空） | logo_center.png | interact.html |
| message | 消息 | message-circle | message.html |
| me | 我的 | user | # |

中间按钮：粉橙渐变 66×66px 圆形凸起，`-mt-7`，带 `raised-btn` 阴影。

## UI 组件规范

### 弹窗

- 所有居中弹窗（确认、提示、规则说明）宽度固定 `mx-auto w-80`（320px），`rounded-2xl` 圆角
- 底部滑入弹窗（表单、礼物列表）使用 `items-end` + `animate-slide-up`
- 弹窗内按钮统一 `card-hover` 类

### 用户资料卡片

- **推荐用户**：2 列网格，`rounded-2xl`，照片 `aspect-ratio: 3/4`，信息行含昵称、性别、年龄、星座，部分用户右上角"已实名"标签
- **小尺寸卡片**（横向滑动）：宽 148px，照片 185px 高，信息行 2 列排列

### 性别标识

```html
♂ 男: bg-blue-50 text-blue-500
♀ 女: bg-pink-50 text-brand-pink
```

### 按钮

- **主操作**：`bg-gradient-to-tr from-brand-pink to-brand-orange text-white rounded-full`（粉橙渐变圆角按钮）
- **描边**：`bg-white border-2 border-brand-pink text-brand-pink`
- **禁用态**：`bg-gray-300 text-white`
- **危险/不成**：`bg-gray-100 text-gray-600`
- **能成/肯定**：`bg-red-50 text-red-500`

### 浮动操作按钮（页面底部独立悬浮）

统一使用：`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-full bg-gradient-to-tr from-brand-pink to-brand-orange text-white font-bold text-sm shadow-xl shadow-brand-pink/30 card-hover cursor-pointer flex items-center gap-2`

### 分隔线

- 信息块间：`border-t border-gray-200`
- 缘分记录间：`border-t border-dashed border-pink-200`
- 第一条上方：`border-t border-pink-200`（实线）

### Toast 提示

通过 `window.Common.showToast(message)` 调用，固定居中黑色半透明背景。

特殊场景（interact 页面）使用 `.float-toast` 从底部操作栏上方飘出，动画时长 1.5s，渐隐停留后原地消失。

### 页面底部操作栏

固定底部的操作按钮栏：`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3`

## 交互模式

| 模式 | 说明 |
|------|------|
| 报名表单 | 底部滑入弹窗，含类型选择、文本输入、图片上传、安全提醒勾选 |
| 支付弹窗 | 居中弹窗，仅微信支付 |
| 心动→送礼 | 先确认 → 再送礼邀请 → 去个人主页或切换卡片 |
| 牵线投票 | 弹窗显示嗑学分变化 + 话术 → 查看详情或继续牵线 |
| 卡片切换 | 左翻（无感）/ 右翻（关注/心动），动画同时进行 |

## 图标使用

- Lucide 图标的 `stroke-width` 默认 2，激活态可用 2.5
- 每次渲染后调用 `window.Common.initIcons()`（含 200ms 重试，自动 fallback）
- 动态注入的 HTML 需延迟 50-300ms 再初始化图标
- 所有操作按钮统一用 `<span>` + `cursor-pointer` + `card-hover`（仅表单提交保留 `<button type="submit">`），避免浏览器默认 button 样式冲突

## 文件列表

| 文件 | 功能 |
|------|------|
| `index.html` | 首页（Banner+快捷入口+用户Tab+底部导航） |
| `broadcast.html` | 广播节目（投稿+抽奖） |
| `chaoyang.html` | 朝阳相伴专区（介绍+活动+申请加入） |
| `qingai.html` | 青爱团专区（介绍+活动+申请加入） |
| `shoufa.html` | 首发有约专区（banner+首发活动+用户榜+申请加入） |
| `shoufa-interact.html` | 首发有约在线互动（留言板+我要留言） |
| `activity.html` | 活动列表（筛选：全部/朝阳相伴/青爱团） |
| `activity-detail.html` | 活动详情+报名 |
| `ranking.html` | 排行榜（人气榜/礼物榜/牵线榜） |
| `profile.html` | 用户个人主页 |
| `interact.html` | 缘分速配（主玩法） |
| `matchmaker.html` | 牵线玩法（CP推荐+投票） |
| `fate-detail.html` | 缘分详情页 |
| `message.html` | 消息（通知+私信） |
| `chat.html` | 私信对话 |
| `style.css` | 全局自定义样式 |
| `common.js` | 公共函数库 |
| `lib/tailwind.min.js` | Tailwind CSS 本地副本 |
| `lib/lucide.min.js` | Lucide Icons 本地副本 |

## 开发约定

- 回复简洁，不重复解释代码，只告知修改位置
- 所有授权和修改直接进行，无需确认
- 图片资源统一放在 `images/` 目录下
- 用户照片按性别分 `images/photo/male/` 和 `images/photo/female/`
