/**
 * 靠谱值规则与积累记录（mock，当前用户）
 * 注册/认证为一次性加分；活动类按次计分，活动相关每条单独记录并含活动名称；
 * 长期未登录按最近登录时间扣减；靠谱值每周日20:00更新并进行排行。
 */
var KAOPU_RULES = [
    { label: '注册脱单资料', value: '+60', note: '' },
    { label: '实名认证', value: '+10', note: '一次性' },
    { label: '学历认证', value: '+5', note: '一次性' },
    { label: '单位认证', value: '+5', note: '一次性' },
    { label: '参加线下活动（现场签到）', value: '+10/次', note: '' },
    { label: '报名线下活动', value: '+1/次', note: '' },
    { label: '报名活动未到场', value: '-10/次', note: '' },
    { label: '被举报骚扰/虚假信息', value: '-15', note: '' },
    { label: '靠谱值更新与排行', value: '每周日20:00', note: '', desc: '靠谱值每周日20:00更新并进行排行' },
    { label: '长期未登录扣减', value: '-5%~-50%', note: '', desc: '按最近登录时间：超过1星期未登录扣减5%；超过1个月未登录扣减10%；超过3个月未登录扣减20%；超过1年未登录扣减50%' },
];

// 上次更新时间：最近一个周日 20:00
function kaopuLastUpdate() {
    var d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(20, 0, 0, 0);
    if (d.getTime() > Date.now()) d.setDate(d.getDate() - 7);
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 20:00';
}
var KAOPU_LAST_UPDATE = kaopuLastUpdate();

var KAOPU_RECORDS = [
    { time: '2026年8月12日', label: '注册脱单资料', delta: 60 },
    { time: '2026年8月13日', label: '实名认证', delta: 10 },
    { time: '2026年8月15日', label: '学历认证', delta: 5 },
    { time: '2026年8月16日', label: '单位认证', delta: 5 },
    { time: '2026年9月6日', label: '报名线下活动 · 秋日漫步·朝阳公园摄影联谊', delta: 1 },
    { time: '2026年9月6日', label: '参加线下活动（现场签到）· 秋日漫步·朝阳公园摄影联谊', delta: 10 },
    { time: '2026年9月13日', label: '报名线下活动 · 书香交友·CBD读书分享会', delta: 1 },
    { time: '2026年9月20日', label: '报名活动未到场 · 书香交友·CBD读书分享会', delta: -10 },
    { time: '2026年10月11日', label: '报名线下活动 · 周末单身俱乐部·剧本杀专场', delta: 1 },
];

// 长期未登录扣减：以上累计值的5%（最近一次活动距今已超1星期，符合扣减档位），在最近一次周日20:00更新时扣除
var KAOPU_DEDUCT_BASE = KAOPU_RECORDS.reduce(function (s, r) { return s + r.delta; }, 0);
KAOPU_RECORDS.push({
    time: KAOPU_LAST_UPDATE,
    label: '长期未登录扣减（超过1星期未登录 · 扣减5%）',
    delta: -Math.round(KAOPU_DEDUCT_BASE * 0.05 * 10) / 10
});

window.KaopuData = {
    rules: KAOPU_RULES,
    records: KAOPU_RECORDS,
    total: KAOPU_RECORDS.reduce(function (s, r) { return s + r.delta; }, 0),
    updatedAt: KAOPU_LAST_UPDATE
};
