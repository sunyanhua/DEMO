# 拾光聚会 — DEMO

> 北京交通广播 FM103.9 旗下车友活动社区平台 DEMO 版。

## 项目概述

"拾光聚会"面向北京交通广播车友听众，提供车友活动、商户展示、广播收听、社区交流等一站式服务。集汽车生活节、车展活动、购车优惠、广播节目收听、车友社区互动于一体，为车主打造专属的线上社区。

本仓库为 **DEMO 演示版**——纯静态 HTML 页面，数据通过 `window.GlobalData` mock 提供，用于 UI/UE 效果确认和交互流程验证。

## 技术栈

| 项 | 选型 |
|----|------|
| 页面语言 | 纯 HTML/CSS/JavaScript（无框架，无构建工具） |
| 样式方案 | Tailwind CSS（CDN `cdn.tailwindcss.com`）+ 自定义 `style.css` |
| 图标库 | Lucide Icons（CDN `jsdelivr` UMD 版本） |
| 公共脚本 | `common.js`（品牌色配置、底部导航、Toast、图标初始化等） |
| 数据模式 | `window.GlobalData` mock 数据（`data.js`） |

## 品牌色体系

| Token | 色值 | 用途 |
|-------|------|------|
| `brand.orange` | `#e8a87c` | 主色调 |
| `brand.yellow` | `#f5d89a` | 辅助色 |
| `brand.blue` | `#42A5F5` | 辅助色 |
| `brand.teal` | `#00A99D` | 辅助色 |
| `brand.purple` | `#7B1FA2` | 辅助色 |
| `brand.pink` | `#FF4081` | 辅助色 |
| `brand.green` | `#00C853` | 辅助色 |
| `brand.red` | `#FF3D00` | 警示色 |
| `brand.bg` | `#F8F9FA` | 背景色 |

另配有 `vibrant` 色系，值与 brand 对应，用于更醒目的强调场景。

## 项目结构

```
拾光聚会/
├── index.html             # 首页（活动推荐 + 商户入口 + Banner）
├── radio.html             # 广播收听页
├── discover.html          # 发现/探索页
├── community.html         # 社区交流页
├── merchant.html          # 商户列表页
├── merchant-detail.html   # 商户详情页
├── activity-detail.html   # 活动详情页
├── registration-form.html # 报名表单页
├── me.html                # 个人中心
├── style.css              # 全局自定义样式
├── common.js              # 公共函数库（品牌色、底部导航、弹窗等）
├── data.js                # 全局 mock 数据
└── poster.jpg             # 海报图片
```

## 页面清单（共 9 页）

| 页面 | 文件 | 说明 |
|------|------|------|
| 首页 | `index.html` | Banner + 分类入口 + 活动推荐 + 商户推荐 |
| 广播 | `radio.html` | 北京交通广播 FM103.9 节目收听 |
| 发现 | `discover.html` | 探索发现页 |
| 社区 | `community.html` | 车友社区动态、交流 |
| 商户列表 | `merchant.html` | 合作商户展示列表 |
| 商户详情 | `merchant-detail.html` | 商户详情 + 优惠活动 |
| 活动详情 | `activity-detail.html` | 活动详情 + 报名入口 |
| 报名表单 | `registration-form.html` | 用户报名信息填写 |
| 我的 | `me.html` | 个人中心 |

## 底部导航

| Tab | 图标 | 跳转 |
|-----|------|------|
| 首页 | home | `index.html` |
| 广播 | radio | `radio.html` |
| 发现 | compass | `discover.html` |
| 社区 | message-square | `community.html` |
| 我的 | user | `me.html` |

## DEMO 数据

`data.js` 中的 `window.GlobalData` 提供以下 mock 数据：

| 数据 | 说明 |
|------|------|
| `user` | 当前登录用户信息（头像、昵称、积分、钱包等） |
| `bannerImages` | 首页轮播图（4 张） |
| `categories` | 活动分类（车展、生活节、购车优惠、广播收听等 10 类） |
| `partners` | 合作商户（奥迪、宝马、特斯拉、奔驰等经销商） |
| `activities` | 活动列表数据 |
| `communityPosts` | 社区动态帖子 |

## 开发约定

- 品牌主色为暖橙 `#e8a87c`，整体风格温暖活泼
- 使用 Tailwind 原子化 class 为主，`style.css` 补充高频复用样式
- 每页独立可预览，不需构建
- 图片资源统一使用 CDN 外链
