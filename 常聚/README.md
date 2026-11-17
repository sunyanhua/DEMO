# 常聚 · Gatherly（演示版）

**常聚常伴，圈子不散。** 以熟人组局为切口的微信小程序形态演示——帮助圈子"张罗下一场、记住每一场"。

## 快速开始

- **演示入口**：双击 `wechat.html`（模拟微信里的一张常聚卡片），点击卡片进入小程序。
- **零依赖**：全部资源本地化，双击任意 HTML 即可离线预览，无网络、无构建。
- **演示控制**：右下角「演示」悬浮钮——模拟圈友表态 / 推进时间 +24h / 重置演示数据。
- **演示剧本**：见 [demo-script.md](demo-script.md)，全流程约 8-10 分钟。

## 产品主线

建圈（群卡片）→ 轮值张罗 → 智能提案 → 矩阵表态 → 自动定案 → 聚会 → 散场仪式（合影/抽签/记录）→ 记忆时间轴 → AA 账本 → 下一轮。

四个武器：轮值张罗、思念式提醒、记忆时间轴、散场仪式。
四个高光：散场抽签、曲水流觞、年度回顾、随机买单转盘。

## 页面清单

| 文件 | 说明 |
|------|------|
| `wechat.html` | 模拟微信外壳（演示入口） |
| `index.html` | 圈子列表（tab：圈子） |
| `circle.html` | 圈子主页（时间轴/当值卡/想念提醒） |
| `create.html` | 建圈（模板/空白 + 群卡片模拟） |
| `propose.html` | 发起组局（一键智能提案） |
| `vote.html` | 表态（时间矩阵/投票/随大流） |
| `event.html` | 局详情（定案/名单/提醒/散场入口） |
| `end-event.html` | 散场三步仪式（合影/抽签/记录卡） |
| `record.html` | 聚会记录卡（合影/留言/买单徽标） |
| `ledger.html` | AA 账本（记账/分账/债务合并/随机买单转盘） |
| `game-liushang.html` | 曲水流觞（单机传手机小游戏） |
| `game-wheel.html` | 聚会大转盘 |
| `memory.html` | 年度回顾 |
| `merchant.html` | 合作商户详情（订座权益） |
| `message.html` | 消息中心（tab：消息） |
| `me.html` | 我的（tab：我的；节律设置/顺延/演示控制） |

## 数据与状态

- `data.js`：`window.GlobalData` mock 数据（北京城市基座、3 圈子、13 商户、14 项目、聚会历史）。
- `common.js`：外壳/tabbar/Toast/模拟微信通知/演示控制（`window.Common` / `window.Demo`）。
- 运行时状态经 localStorage（`cj.data` / `cj.clock`）持久化。

## 测试

```bash
npm test   # node 原生测试：引擎单测 + vm 沙箱页面流程测试 + 静态冒烟
```

测试文件：`*.test.cjs`（引擎纯逻辑 + 页面 vm 沙箱渲染 + 全链路 flow + 零外链/资源完整冒烟）。

## 设计文档

- 设计：`docs/superpowers/specs/2026-11-17-changju-design.md`
- 计划：`docs/superpowers/plans/2026-11-17-changju-demo.md`

## 远期（不在本 demo）

缺人补位 → 搭子社区；商户 POI 数据管线（地图 API + AI 补全 + 认领纠错）；向量检索；联机小游戏。
