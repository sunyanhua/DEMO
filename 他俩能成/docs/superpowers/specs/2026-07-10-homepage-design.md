# 他俩能成 - 首页设计文档

**日期**: 2026-07-10
**项目**: 他俩能成（相亲小程序演示版）
**版本**: v1.0-demo

## 概述

构建"他俩能成"相亲小程序的首屏首页。用户可浏览推荐单身用户、切换"我要牵线"模式查看嗑学成绩单和 CP 推荐。

## 技术选型

- **单文件 HTML**（演示版）：`index.html`
- **CDN 依赖**：Tailwind CSS（样式）+ Lucide（图标）
- **渲染模式**：`View` 对象 + template literals → `#app.innerHTML`
- **数据**：内联 mock 数据在 `window.GlobalData`
- **图标**：按钮区用 PNG 图标（已提供），其余用 Lucide

## 页面结构（自上而下）

### 0. 全局样式
- 背景色：`bg-white`
- 主点缀色：粉色 `#FF6B81`，用于高亮/按钮/Tab
- 辅点缀色：橙色 `#FF8C42`，用于渐变/强调
- 字体：`PingFang SC`, `Microsoft YaHei`, sans-serif
- Body 需 `pb-24` 为底部导航留空

### 1. Banner 轮播
- 图片来源：`images/banner1.jpg`、`images/banner2.jpg`
- 功能：自动轮播（3.5s 间隔），不可点击，不响应手势
- 实现：横向 overflow-x-auto snap + setInterval + 底部圆点指示器
- 比例：`aspect-ratio: 21/9`，圆角 `rounded-2xl`

### 2. 按钮区（4个功能入口）
- 布局：2×2 网格 (`grid grid-cols-4`)
- 每个按钮：上方图标（`w-10 h-10`），下方文字（`text-xs`）
- 按钮配置：
  - `icon-tougao.png` → 广播节目
  - `icon-chaoyang.png` → 朝阳相伴
  - `icon-qingai.png` → 青爱团
  - `icon-bangdan.png` → 榜单
- 样式：白色圆角卡片，带浅粉阴影，可点击（暂无跳转）

### 3. 用户区（Tab 切换）

两个 Tab 按钮：「我要脱单」|「我要牵线」，默认选中"我要脱单"。
选中态：粉色文字 + 底部指示条；未选：灰色。

#### 3a. Tab「我要脱单」
- 标题行：「推荐用户」+ 右侧搜索图标（Lucide `search`）
- 内容：10 个用户卡片，`grid grid-cols-2`，固定高度（`h-72` 左右）
- 卡片结构：
  - 头像照片：根据性别从 `images/photo/male/` 或 `images/photo/female/` 随机选取
  - 昵称、年龄、性别标识（♂蓝色/♀粉色）
  - 星座（随机分配 12 星座）
  - 部分用户（~30%）带「已实名」认证徽章（`verified-badge.png` 风格，用文字+图标模拟）
- 男女比例约 5:5，随机排序

#### 3b. Tab「我要牵线」
- **嗑学成绩单**：卡片式布局，含以下数据：
  - 总计操作 32 次，其中"能成"32 次，"不成"0 次，得分率 90.63%
  - 开启缘分：11 次 | 嗑CP：0 对
  - 成功助力：0 次 | 锦上添花：0 次
  - 棒打鸳鸯：0 次 | 乱点鸳鸯谱：2 次
- **CP 推荐区**：
  - 标题「CP推荐」+ 右侧「更多」
  - 两个卡片（男左女右），中间放置 `logo_bg_white.png`
  - 卡片内容与推荐用户一致（照片、昵称、年龄、性别、星座）

### 4. 底部导航

- 固定底部，白底半透明 + 顶部细线
- 5 个 tab：

| 序号 | 标签 | 图标 | 点击 |
|------|------|------|------|
| 1 | 首页 | Lucide `home` | 当前页（粉色高亮） |
| 2 | 活动 | Lucide `calendar` | `activity.html` |
| 3 | （无文字） | `logo_center.png` | 凸起圆形按钮，粉橙渐变底色 |
| 4 | 消息 | Lucide `message-circle` | `message.html` |
| 5 | 我的 | Lucide `user` | `me.html` |

- 中间按钮：圆形凸起 (`-mt-5`)，`w-12 h-12`，`bg-gradient-to-tr from-pink-400 to-orange-400`，白边 `border-4`

## Mock 数据结构

```javascript
window.GlobalData = {
  users: [
    {
      id: 'u1',
      name: '小明',
      age: 28,
      gender: 'male',      // 'male' | 'female'
      constellation: '双子座',
      photo: 'images/photo/male/crop.xxx.jpg',
      verified: true,       // 是否已实名
    },
    // ... 至少 20 条（10男10女），用于随机抽取
  ],
  matchStats: {
    total: 32,
    success: 32,
    fail: 0,
    scoreRate: 90.63,
    details: {
      openFate: 11,
      cpPairs: 0,
      helpSuccess: 0,
      bonusBoost: 0,
      breakCouple: 0,
      randomMatch: 2,
    }
  }
}
```

## 交互行为

| 元素 | 行为 |
|------|------|
| Banner | 自动轮播，不可点击 |
| 4 功能按钮 | 点击无跳转（演示版） |
| Tab「我要脱单」| 显示推荐用户列表 |
| Tab「我要牵线」| 显示成绩单 + CP 推荐 |
| 搜索图标 | 无跳转（演示版） |
| 用户卡片 | 无跳转（演示版） |
| CP推荐「更多」| 无跳转（演示版） |
| 底部导航 | 首页高亮，其余跳转到对应页面 |

## 边界情况

- 图片加载失败：占位背景色 `bg-pink-50`
- 用户数据不足 10 条：有多少显示多少
- 随机抽取：每次刷新页面随机不同的 10 个用户
