# CLAUDE.md — 1039发现

## 项目概述

"1039发现"是北京交通广播 FM103.9 旗下活动/票务/商品一站式服务小程序（H5 DEMO 版）。用户可浏览活动并报名、购买票务、选购 1039 官方文创商品。

当前阶段为 **DEMO 演示版**，纯静态 HTML 页面，用于 UI/UE 效果确认。

## 技术栈

| 项 | 选型 |
|----|------|
| 页面语言 | 纯 HTML/CSS/JavaScript（无框架，无构建工具） |
| 样式方案 | Tailwind CSS（本地 `lib/tailwind.min.js`）+ 自定义 `style.css` |
| 图标库 | Lucide Icons（本地 `lib/lucide.min.js`） |
| 公共脚本 | `common.js`（品牌色配置、底部导航、Toast、图标初始化） |
| 数据模式 | 页面内 JavaScript 对象 mock 数据，模拟接口 |

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
| `--gold` / `brand.gold` | `#f2a600` | LOGO 主色调（首页/我的 Tab 高亮） |
| `--gold-light` / `brand.gold-light` | `#FFF8EB` | 金色浅底 |
| `--gold-dark` / `brand.gold-dark` | `#C27A00` | 金色深色 |
| `--purple` / `brand.purple` | `#836ec2` | 活动标识色（Tab 高亮、活动标签） |
| `--purple-light` / `brand.purple-light` | `#F3F0FA` | 紫色浅底 |
| `--purple-dark` / `brand.purple-dark` | `#6A56B0` | 紫色深色 |
| `--pink` / `brand.pink` | `#fdbeda` | 商品标识色（Tab 高亮、商品标签） |
| `--pink-light` / `brand.pink-light` | `#FFF5F9` | 粉色浅底 |
| `--pink-dark` / `brand.pink-dark` | `#E89AB8` | 粉色深色 |
| `--blue` / `brand.blue` | `#9adff3` | 票务标识色（Tab 高亮、票务标签） |
| `--blue-light` / `brand.blue-light` | `#F0F9FC` | 蓝色浅底 |
| `--blue-dark` / `brand.blue-dark` | `#6CC8E8` | 蓝色深色 |

**配色原则**：
- 整体配色多元体现热闹氛围，品牌五种颜色可灵活搭配
- **不要用渐变混合色调**，用不规则曲线区域叠加处理
- 底部导航五个 Tab 各有独立高亮色：首页/我的=金 `#f2a600`，活动=紫 `#836ec2`，门票=蓝 `#3DAFD8`，商品=粉 `#E880A5`
- 各 section 使用白色圆角卡片浮于深色背景之上

**使用方式**：HTML 中直接用 Tailwind class `text-brand-purple`、`bg-brand-purple-light`、`bg-brand-pink` 等。

## 页面结构标准

### 区段划分

页面的区段划分有两种：

**标准页**（首页/列表页/我的 — 有底部导航）：
```
.top-section        （透明，露出深色底 + 页面标题/LOGO）
.content-card       （白色圆角卡片，margin:0 12px，border-radius:20px）
底部留白 + 底部导航
```

**二级页**（订单详情/收货地址/设置/关于我们 — 无底部导航）：
```
.top-section        （透明，仅放 LOGO，与首页位置一致）
.content-card       （白色圆角卡片，margin:0 12px，border-radius:20px）
底部留白（无导航）
```

二级页标准模板：
```html
<div class="top-section">
    <div class="px-4 pt-3 pb-2">
        <img src="logo.png" alt="1039发现" style="height:28px;" />
    </div>
</div>
<div class="content-card">
    <!-- 卡片第一行：图标 + 页面标题 -->
    <div class="px-4 py-4 border-b border-gray-100 flex items-center gap-2">
        <i data-lucide="xxx" class="w-5 h-5 text-brand-purple"></i>
        <span class="text-base font-black text-gray-800">页面标题</span>
    </div>
    <!-- 内容 -->
</div>
<div class="pb-2"></div>
```

`rounded-top` 桥接层已废弃，不再使用。

### 背景装饰

所有页面添加 7 个大面积不规则曲线色块，以 LOGO 金色（`#f2a600`）为主占据画面主体，紫、粉、蓝为辅做四角穿插点缀。深色底 `#1a1818`，无渐变、无模糊。

```html
<div class="bg-decoration">
    <div class="bg-blob"></div>  <!-- ×14 -->
</div>
```

## 底部导航

使用 `Common.renderBottomNav(activeTabId)`，五个 tab。导航栏为白色半透明毛玻璃底，高度 64px。每 Tab 激活态独立色系：

| ID | 标签 | 图标 | 链接 | 激活色 |
|----|------|------|------|--------|
| home | 首页 | home | index.html | `#f2a600` 金 |
| event | 活动 | calendar | events.html | `#836ec2` 紫 |
| ticket | 门票 | ticket | tickets.html | `#3DAFD8` 蓝 |
| product | 商品 | shopping-bag | products.html | `#E880A5` 粉 |
| me | 我的 | user | me.html | `#f2a600` 金 |

颜色定义在 `window.NAV_COLORS` 中，common.js 自动根据 activeTabId 应用对应色。

## UI 组件规范

### 按钮

- **主操作**：`bg-brand-purple text-white rounded-full font-bold`（紫色圆角按钮）
- **描边**：`bg-white border border-brand-purple/30 text-brand-purple`
- **浅底描边**：`bg-brand-purple/10 border border-brand-purple/20 text-brand-purple`
- **禁用态**：`bg-gray-300 text-white`

### 标签

| 业务类型 | 样式 |
|---------|------|
| 活动 | `bg-brand-purple-light text-brand-purple` |
| 门票 | `bg-brand-blue-light text-brand-blue-dark` |
| 商品 | `bg-brand-pink-light text-brand-pink-dark` |

### 卡片

- **推荐列表卡片**：`bg-white rounded-xl shadow-sm border border-gray-100` + `card-hover` 类
- **入口卡片**：`bg-white rounded-xl border border-gray-100 entry-card` 带顶部色条
- **详情卡片**：`bg-white rounded-2xl shadow-sm border border-gray-100`

### 弹窗

- 所有居中弹窗宽度 `mx-auto w-80`（320px），`rounded-2xl` 圆角
- 底部滑入弹窗使用 `items-end` + `animate-slide-up`

### 分隔线

- 信息块间：`border-t border-gray-200`
- 区块间留白为主，少用分割线

### Toast 提示

通过 `Common.showToast(message)` 调用，固定居中黑色半透明背景。

## 图标使用

- Lucide 图标的 `stroke-width` 默认 2，激活态可用 2.5
- 每次渲染后调用 `Common.initIcons()`（含 200ms 重试，自动 fallback）
- 动态注入的 HTML 需延迟 50-300ms 再初始化图标

## 页面清单（19 页）

### 主要业务页面

| 文件 | 功能 | 业务类型 |
|------|------|---------|
| `index.html` | 首页（Banner+入口+推荐列表） | 全部 |
| `events.html` | 活动列表 | 活动 |
| `event-detail.html` | 活动详情+报名（模板 A） | 活动 |
| `event-detail2.html` | 活动详情+报名（模板 B） | 活动 |
| `tickets.html` | 票务列表 | 票务 |
| `ticket-detail.html` | 票务详情+购买（模板 A） | 票务 |
| `ticket-detail2.html` | 票务详情+购买（模板 B） | 票务 |
| `products.html` | 商品列表 | 商品 |
| `product-detail.html` | 商品详情+购买 | 商品 |
| `order-detail.html` | 订单详情 | 通用 |

### 个人中心子页面

| 文件 | 功能 |
|------|------|
| `me.html` | 个人中心首页 |
| `my-orders.html` | 我的订单 |
| `my-tickets.html` | 我的票夹 |
| `my-coupons.html` | 我的优惠券 |
| `my-points.html` | 我的积分 |
| `my-invoices.html` | 我的发票 |
| `edit-profile.html` | 编辑资料 |
| `address.html` | 收货地址 |
| `help.html` | 帮助与反馈 |

## 三种业务类型差异

| 特征 | 活动 | 票务 | 商品 |
|------|------|------|------|
| 操作按钮 | 立即报名 | 立即购买 | 立即购买 |
| 信息模板 | 报名信息（姓名+手机号+身份证号+性别） | 购票信息（可配置） | 购买信息（可配置） |
| 退款 | 阶梯退 | 随时退 | 不退款 |
| 退款文案 | "提前30天退100%..." | "票未核销前可随时退款" | 不显示 |
| 活动时间 | 显示 | 不显示 | 不显示 |
| 库存 | 显示 | 不限(99999) | 显示实际库存 |

## 开发约定

- 回复简洁，不重复解释代码，只告知修改位置
- 所有授权和修改直接进行，无需确认
- 图片资源统一放在 `images/` 目录下
- 开发顺序：先完成首页确认整体样式 → 再展开其他页面
