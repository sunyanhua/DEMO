# 1039发现 — 小程序 DEMO

> 北京交通广播 FM103.9 旗下活动/票务/商品一站式服务平台 DEMO 版。

## 项目概述

1039发现面向北京交通广播听众，提供活动报名、票务购买、文创商品购买三大核心功能。用户可通过小程序浏览汽车生活节等活动、购买什刹海摇橹船票等票务、选购1039官方文创商品。

本仓库为 **DEMO 演示版**——纯静态 HTML 页面，数据写死在页面中，用于 UI/UE 效果确认和交互流程验证。

## 技术栈

| 项 | 选型 |
|----|------|
| 页面语言 | 纯 HTML/CSS/JavaScript（无框架，无构建工具） |
| 样式方案 | Tailwind CSS（本地 `lib/tailwind.min.js`）+ 自定义 `style.css` |
| 图标库 | Lucide Icons（本地 `lib/lucide.min.js`） |
| 公共脚本 | `common.js`（品牌色配置、底部导航、Toast、图标初始化） |
| 数据模式 | 页面内 JavaScript 对象 mock 数据 |

## 品牌色体系

| 变量 | 色值 | 用途 |
|------|------|------|
| `--gold` / `brand.gold` | `#f2a600` | LOGO 主色调（首页/我的 Tab 高亮） |
| `--purple` / `brand.purple` | `#836ec2` | 活动标识色（Tab 高亮、活动标签） |
| `--blue` / `brand.blue` | `#9adff3` | 票务标识色（Tab 高亮、票务标签） |
| `--pink` / `brand.pink` | `#fdbeda` | 商品标识色（Tab 高亮、商品标签） |

**导航色系**：底部五个 Tab 各有独立高亮色——首页/我的用金色 `#f2a600`，活动用紫色 `#836ec2`，门票用蓝色 `#3DAFD8`，商品用粉色 `#E880A5`。此划分作为整个小程序的基调。

全局背景使用 14 个不规则曲线色块（金、紫、粉、蓝）叠加在深色底 `#18152C` 上，无渐变、无模糊，营造热闹氛围。内容区使用白色圆角卡片浮于深色背景之上。

## 项目结构

```
1039发现/
├── index.html            # 首页（Banner + 入口卡片 + 推荐列表）
├── events.html           # 活动列表页
├── event-detail.html     # 活动详情页
├── tickets.html          # 票务列表页
├── ticket-detail.html    # 票务详情页
├── products.html         # 商品列表页
├── product-detail.html   # 商品详情页
├── event-detail2.html    # 活动详情页（模板 B）
├── ticket-detail2.html   # 票务详情页（模板 B）
├── order-detail.html     # 订单详情页
├── me.html               # 我的（个人中心）
├── my-orders.html        # 我的订单
├── my-tickets.html       # 我的票夹
├── my-coupons.html       # 我的优惠券
├── my-points.html        # 我的积分
├── my-invoices.html      # 我的发票
├── edit-profile.html     # 编辑资料
├── address.html          # 收货地址
├── help.html             # 帮助与反馈
├── style.css             # 全局自定义样式
├── common.js             # 公共函数库
├── logo.png              # 项目 LOGO（234×32px）
├── lib/
│   ├── tailwind.min.js   # Tailwind CSS 本地副本
│   └── lucide.min.js     # Lucide Icons 本地副本
├── images/               # 图片资源目录
├── CLAUDE.md             # AI 助手指南
└── README.md             # 本文件
```

## 页面清单（共 19 页）

### 主要业务页面

| 页面 | 文件 | 说明 |
|------|------|------|
| 首页 | `index.html` | Banner 轮播 + 三类入口 + 推荐列表 |
| 活动列表 | `events.html` | 活动筛选与列表 |
| 活动详情 | `event-detail.html` | 活动介绍 + 票种选择 + 报名（模板 A） |
| 活动详情 | `event-detail2.html` | 活动详情（模板 B） |
| 票务列表 | `tickets.html` | 票务筛选与列表 |
| 票务详情 | `ticket-detail.html` | 票务介绍 + 类型选择 + 购买（模板 A） |
| 票务详情 | `ticket-detail2.html` | 票务详情（模板 B） |
| 商品列表 | `products.html` | 商品筛选与列表 |
| 商品详情 | `product-detail.html` | 商品介绍 + 款式选择 + 购买 |
| 订单详情 | `order-detail.html` | 订单详情 + 票务信息展示 |

### 个人中心子页面

| 页面 | 文件 | 说明 |
|------|------|------|
| 我的 | `me.html` | 个人中心首页 + 功能入口 |
| 我的订单 | `my-orders.html` | 订单列表 |
| 我的票夹 | `my-tickets.html` | 已购票务管理 |
| 我的优惠券 | `my-coupons.html` | 优惠券列表 |
| 我的积分 | `my-points.html` | 积分查看 |
| 我的发票 | `my-invoices.html` | 发票管理 |
| 编辑资料 | `edit-profile.html` | 个人资料编辑 |
| 收货地址 | `address.html` | 地址管理 |
| 帮助与反馈 | `help.html` | 帮助中心 |

## 底部导航

| Tab | 图标 | 跳转 | 高亮范围 |
|-----|------|------|---------|
| 首页 | 🏠 home | `index.html` | 首页 |
| 活动 | 🎉 calendar | `events.html` | 活动列表/详情/订单确认 |
| 门票 | 🎫 ticket | `tickets.html` | 票务列表/详情/订单确认 |
| 商品 | 📦 shopping-bag | `products.html` | 商品列表/详情/订单确认 |
| 我的 | 👤 user | `me.html` | 我的/订单详情/订单成功 |

## DEMO 数据

| 类型 | 产品名称 | 规格 | 价格区间 |
|------|---------|------|---------|
| 活动 | 2026冰丝带汽车生活节 | 单人票/双人票/家庭票 | ¥99 - ¥259 |
| 票务 | 什刹海摇橹船票 | 普通船票/1039专属船票 | ¥120 - ¥168 |
| 商品 | 北京交通广播专属冰箱贴 | 经典圆形/方型复古/限量金色 | ¥29.9 - ¥69.9 |

## 开发约定

- UI 参考"他俩能成"项目设计标准
- 品牌色不使用渐变混合，用不规则曲线区域叠加处理
- 各 section 使用白色或浅灰色底，品牌色用于点缀
- 页面间跳转使用相对路径 `<a href>` 链接
- 每页独立可预览，不需构建
