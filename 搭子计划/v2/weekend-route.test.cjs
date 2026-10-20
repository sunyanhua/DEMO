/**
 * 定制周末路线测试（node weekend-route.test.cjs）
 * 在浏览器语义沙箱中执行 data.js + weekend-route.js + weekend-route.html 内联脚本，测试与线上运行完全相同的代码。
 * 流程：表单（就地选择，不整页重渲染）→ 提交 → 路线推荐列表（含定制条件）→ 点击进入路线详情。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

// 共享 sessionStorage 存储：模拟同一会话内状态保留
const store = {};
// 共享 localStorage 存储：定制记录持久化
const localStore = {};

function clearPlanStore() {
    for (const k of Object.keys(store)) delete store[k];
    for (const k of Object.keys(localStore)) delete localStore[k];
}

function makePageSandbox(options = {}) {
    // 元素桩：app 为整页容器；route-submit-bar 等局部容器就地记录 innerHTML，用于验证"就地更新"
    const elements = {};
    function el(id) {
        if (!elements[id]) {
            elements[id] = {
                _html: '',
                attrs: {},
                set innerHTML(v) { this._html = v; },
                get innerHTML() { return this._html; },
                setAttribute(k, v) { this.attrs[k] = String(v); },
                getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
            };
        }
        return elements[id];
    }
    const document = {
        getElementById(id) { return el(id); },
        querySelectorAll() { return []; }, // 就地选中态 DOM 切换在 vm 中不模拟
        addEventListener() {},
        get _html() { return el('app').innerHTML; },
        set _html(v) { el('app').innerHTML = v; }
    };
    const sessionStorage = {
        getItem: (k) => (k in store ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: (k) => { delete store[k]; }
    };
    const toasts = [];
    // 浏览器语义的 history/location 模拟：pushState 追加记录并更新 location.search，back() 回退并触发 popstate
    const location = { href: '', search: options.initialSearch || '', pathname: 'weekend-route.html' };
    const history = {
        entries: [location.search],
        index: 0,
        listeners: [],
        pushState(d, t, url) { this.entries.splice(this.index + 1); this.entries.push(url || ''); this.index++; location.search = url || ''; },
        replaceState(d, t, url) { this.entries[this.index] = url || ''; location.search = url || ''; },
        back() {
            if (this.index > 0) {
                this.index--;
                location.search = this.entries[this.index];
                for (const l of [...this.listeners]) l();
            }
        }
    };
    const sandbox = {
        window: {
            scrollY: 0, scrollTo() {}, location, history,
            addEventListener(type, fn) { if (type === 'popstate') history.listeners.push(fn); }
        },
        document,
        sessionStorage,
        URLSearchParams,
        setTimeout: (fn) => fn()
    };
    const localStorage = {
        getItem: (k) => (k in localStore ? localStore[k] : null),
        setItem: (k, v) => { localStore[k] = String(v); },
        removeItem: (k) => { delete localStore[k]; }
    };
    sandbox.window.sessionStorage = sessionStorage;
    sandbox.localStorage = localStorage;
    sandbox.window.document = document;
    // Common 桩：renderBottomNav 渲染 __bottom_nav__ 标记，showToast 记录调用
    sandbox.window.Common = {
        renderBottomNav: () => '<div class="__bottom_nav__"></div>',
        initIcons() {},
        showToast: (msg) => toasts.push(msg)
    };
    vm.createContext(sandbox);
    if (options.emptyData) {
        sandbox.window.GlobalData = {};
    } else {
        vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    }
    vm.runInContext(fs.readFileSync(path.join(dir, 'weekend-route.js'), 'utf8'), sandbox);
    const html = fs.readFileSync(path.join(dir, 'weekend-route.html'), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
    vm.runInContext(inline, sandbox);
    return {
        RouteForm: sandbox.window.RouteForm,
        WeekendRoute: sandbox.window.WeekendRoute,
        document,
        GlobalData: sandbox.window.GlobalData,
        toasts,
        history,
        location
    };
}

// 选齐全部 7 项：situation=0 area=0 time=0 people=0 budget=0 partner=0 stranger=0
function selectAll(RouteForm) {
    RouteForm.select('situation', 0);
    RouteForm.select('area', 0);
    RouteForm.select('time', 0);
    RouteForm.select('people', 0);
    RouteForm.select('budget', 0);
    RouteForm.select('partner', 0);
    RouteForm.select('stranger', 0);
}

test('表单配置完整：4 种情况、4 个片区、5 组筛选', () => {
    const { GlobalData } = makePageSandbox();
    const form = GlobalData.weekendRouteForm;
    assert.strictEqual(form.situations.length, 4);
    for (const s of form.situations) {
        assert.ok(s.title && s.subtitle && s.icon, `情况 ${s.id} 字段不全`);
    }
    assert.strictEqual(form.areas.length, 4);
    for (const a of form.areas) {
        assert.ok(a.label && a.icon, `片区 ${a.id} 字段不全`);
    }
    assert.strictEqual(form.filters.length, 5);
    for (const f of form.filters) {
        assert.ok(f.label, `筛选 ${f.id} 缺少 label`);
        assert.ok(Array.isArray(f.options) && f.options.length >= 3, `筛选 ${f.id} 选项应至少 3 个`);
    }
});

test('初始渲染展示三个区块，提交按钮为未选齐禁用态', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    const html = document._html;
    assert.ok(html.includes('这次属于哪种情况？'));
    assert.ok(html.includes('想在哪片儿玩？'));
    assert.ok(html.includes('再补充筛选'));
    assert.ok(html.includes('本地周末'));
    assert.ok(html.includes('白塔寺 / 华熙 / 宫门口'));
    assert.ok(html.includes('什么时候有空'));
    assert.ok(html.includes('还差 7 项'), '未选时按钮应显示还差 7 项');
    assert.ok(!html.includes('onclick="RouteForm.submit()"'), '未选齐时提交按钮应禁用');
});

test('选择选项时就地更新选中态，不整页重渲染（防闪烁）', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    const before = document._html;
    RouteForm.select('situation', 1);
    assert.strictEqual(document._html, before, '选择后整页 HTML 不应被替换');
    RouteForm.select('area', 2);
    assert.strictEqual(document._html, before, '多次选择也不应整页重渲染');
    const bar = document.getElementById('route-submit-bar');
    assert.ok(bar.innerHTML.includes('还差 5 项'), '提交栏应就地更新为还差 5 项');
    assert.strictEqual(RouteForm.selections.situation, 1);
    assert.strictEqual(RouteForm.selections.area, 2);
});

test('路线数据完整：覆盖表单 4 片区，字段齐全', () => {
    const { GlobalData } = makePageSandbox();
    const routes = GlobalData.weekendRoutes;
    assert.ok(routes.length >= 8, '应至少 8 条路线（支持组合展示）');
    const areaIds = GlobalData.weekendRouteForm.areas.map(a => a.id);
    const covered = new Set(routes.map(r => r.areaId));
    for (const areaId of areaIds) {
        assert.ok(covered.has(areaId), `片区 ${areaId} 应有对应路线`);
    }
    const activityIds = new Set(GlobalData.activities.map(a => a.id));
    const validTypes = ['recommend', 'classic', 'smart'];
    for (const r of routes) {
        assert.ok(validTypes.includes(r.type), `${r.id} type 非法: ${r.type}`);
        assert.ok(Array.isArray(r.tags) && r.tags.length > 0, `${r.id} 缺少标签`);
        assert.ok(r.name, `${r.id} 缺少路线名称`);
        assert.ok(Array.isArray(r.schedule) && r.schedule.length >= 3, `${r.id} 行程应至少 3 项`);
        for (const s of r.schedule) assert.ok(s.time && s.item, `${r.id} 行程项字段不全`);
        assert.ok(r.nearbyActivities.length >= 2 && r.nearbyActivities.length <= 3, `${r.id} 附近活动应为 2-3 条`);
        for (const aid of r.nearbyActivities) {
            assert.ok(activityIds.has(aid), `${r.id} 附近活动引用未知活动: ${aid}`);
        }
        assert.ok(Array.isArray(r.merchants) && r.merchants.length >= 2, `${r.id} 沿途推荐应至少 2 家`);
        assert.ok(r.merchants[0].primary === true, `${r.id} 第一家应为「主推荐」`);
        assert.ok(r.merchants.slice(1).every(m => m.primary === false), `${r.id} 其余应为「顺路推荐」`);
        for (const m of r.merchants) {
            assert.ok(m.name && m.budget && m.district && m.blurb && m.tip, `${r.id} 商户 ${m.name} 字段不全`);
            if (m.partner) {
                assert.ok(m.image, `${r.id} 合作商家 ${m.name} 应有图片`);
                assert.ok(m.partnerId, `${r.id} 合作商家 ${m.name} 应有 partnerId`);
                assert.ok(GlobalData.partnerMerchants && GlobalData.partnerMerchants[m.partnerId],
                    `${r.id} 合作商家 ${m.name} 的 partnerId 应在商户注册表中存在`);
            }
        }
        const partnerCount = r.merchants.filter(m => m.partner === true).length;
        assert.ok(partnerCount >= 1 && partnerCount <= 2, `${r.id} 合作商家应为 1-2 家（实际 ${partnerCount}）`);
        assert.ok(Array.isArray(r.prep) && r.prep.length >= 3, `${r.id} 路线准备应至少 3 条`);
        assert.ok(Array.isArray(r.budget) && r.budget.length >= 3, `${r.id} 预算明细应至少 3 项`);
        for (const b of r.budget) assert.ok(b.item && typeof b.amount === 'number', `${r.id} 预算项字段不全`);
        assert.ok(r.budgetTotal, `${r.id} 缺少合计`);
        assert.ok(r.reason, `${r.id} 缺少推荐理由`);
        const g = r.guide;
        assert.ok(g && g.transport && Array.isArray(g.suitable) && Array.isArray(g.unsuitable) && Array.isArray(g.alternatives),
            `${r.id} 路线攻略四分类不全`);
    }
});

test('质量评价选项为 5 项', () => {
    const { GlobalData } = makePageSandbox();
    // 宿主域展开，避免 vm 沙箱数组原型不一致导致 deepStrictEqual 误报
    assert.deepStrictEqual([...GlobalData.routeRatingOptions], ['路线好用', '店铺不准', '价格不准', '太远了', '排队太久']);
});

test('路线按类型优先级排序：诚意推荐 > 经典必逛 > 智能定制', () => {
    const { WeekendRoute } = makePageSandbox();
    const mixed = [
        { id: 'x', type: 'smart' },
        { id: 'y', type: 'recommend' },
        { id: 'z', type: 'classic' }
    ];
    assert.deepStrictEqual([...WeekendRoute.sortByPriority(mixed)].map(r => r.type), ['recommend', 'classic', 'smart']);
    assert.strictEqual(WeekendRoute.typeLabel('recommend'), '诚意推荐');
    assert.strictEqual(WeekendRoute.typeLabel('classic'), '经典必逛');
    assert.strictEqual(WeekendRoute.typeLabel('smart'), '智能定制');
});

test('getRecommendationList 按类型配额与匹配度组合推荐 5 条', () => {
    const { WeekendRoute, GlobalData } = makePageSandbox();
    const form = GlobalData.weekendRouteForm;
    const sel = { situation: 0, area: 0, time: 0, people: 0, budget: 0, partner: 0, stranger: 0 };
    const list = [...WeekendRoute.getRecommendationList(form, sel, 5)];
    assert.strictEqual(list.length, 5, '每次定制应固定推荐 5 条');
    assert.deepStrictEqual(list.map(r => r.type), ['recommend', 'classic', 'classic', 'classic', 'smart'],
        '顺序应为 诚意推荐 → 经典必逛×3 → 智能定制');
    // 诚意推荐配额 1：r1/r9 两条推荐路线中匹配度更高（50% vs 25%）的 r9 入选
    assert.strictEqual(list[0].id, 'r9', '诚意推荐应按匹配度取 1 条');
    // 经典必逛配额 3：组内按匹配度降序（r4 50% 在前）
    assert.strictEqual(list[1].id, 'r4', '经典必逛组内应按匹配度降序');
    assert.strictEqual(list[4].type, 'smart', '智能定制应排最后');
    const classics = list.filter(r => r.type === 'classic');
    const percents = classics.map(r => WeekendRoute.matchPercent(r, form, sel));
    assert.deepStrictEqual(percents, [...percents].sort((a, b) => b - a), '经典必逛组内匹配度应降序');
    // 不同条件下组合不同：三里屯片区 + 周六下午 + 300+ 时 classic 前三应为 r6/r2/r4 组合的一部分
    const sel2 = { ...sel, area: 2, time: 1, budget: 3 };
    const list2 = [...WeekendRoute.getRecommendationList(form, sel2, 5)];
    assert.notDeepStrictEqual(list2.map(r => r.id), list.map(r => r.id), '不同定制条件应产生不同组合');
});

test('matchPercent 按 4 项指标每项 25% 计算匹配度', () => {
    const { WeekendRoute, GlobalData } = makePageSandbox();
    const routes = [...GlobalData.weekendRoutes];
    const form = GlobalData.weekendRouteForm;
    const r1 = routes.find(r => r.id === 'r1');
    const sel = (o) => ({ situation: 0, area: 0, time: 0, people: 0, budget: 0, partner: 0, stranger: 0, ...o });
    // 4 项全中 → 100%
    assert.strictEqual(WeekendRoute.matchPercent(r1, form, sel({ area: 2, time: 1, budget: 3 })), 100);
    // 只中 1 项（类型相符）→ 25%
    assert.strictEqual(WeekendRoute.matchPercent(r1, form, sel({ area: 0, time: 0, budget: 0 })), 25);
    // 无选择数据 → 0
    assert.strictEqual(WeekendRoute.matchPercent(r1, form, {}), 0);
});

test('recommendReasons 按用户选择生成推荐理由（片区/时间/预算/类型）', () => {
    const { WeekendRoute, GlobalData } = makePageSandbox();
    const routes = [...GlobalData.weekendRoutes];
    const form = GlobalData.weekendRouteForm;
    const r1 = routes.find(r => r.id === 'r1');
    const r4 = routes.find(r => r.id === 'r4');
    const sel = (o) => ({ situation: 0, area: 0, time: 0, people: 0, budget: 0, partner: 0, stranger: 0, ...o });
    // 三里屯片区 + 周六下午 + 300+：r1（14:00 起、330 元、含文艺型）四条理由全中
    const all = WeekendRoute.recommendReasons(r1, form, sel({ area: 2, time: 1, budget: 3 }));
    assert.deepStrictEqual([...all], ['片区匹配', '时间合适', '预算满足', '类型相符']);
    // 白塔寺片区 + 周六上午 + 0-50：r1 只剩 类型相符
    const partial = WeekendRoute.recommendReasons(r1, form, sel({ area: 0, time: 0, budget: 0 }));
    assert.deepStrictEqual([...partial], ['类型相符']);
    // 周日全天：时间合适恒成立；r4（白塔寺片区、160 元、文艺型）全中
    const sunday = WeekendRoute.recommendReasons(r4, form, sel({ time: 3, budget: 3 }));
    assert.deepStrictEqual([...sunday], ['片区匹配', '时间合适', '预算满足', '类型相符']);
    // 无选择数据时返回空数组，不抛错
    assert.deepStrictEqual([...WeekendRoute.recommendReasons(r1, form, {})], []);
    assert.deepStrictEqual([...WeekendRoute.recommendReasons(null, form, sel({}))], []);
});

test('选齐后提交按钮就地启用，提交后出路线推荐列表（含定制条件）', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    selectAll(RouteForm);
    const bar = document.getElementById('route-submit-bar');
    assert.ok(bar.innerHTML.includes('onclick="RouteForm.submit()"'), '选齐后提交按钮应可用');
    assert.ok(!bar.innerHTML.includes('还差'), '选齐后不应再有缺项提示');
    RouteForm.submit();
    const html = document._html;
    // 列表页：定制条件 + 多条路线
    assert.ok(html.includes('你的定制条件'), '列表页应显示定制条件');
    assert.ok(html.includes('本地周末'), '定制条件应包含所选情况');
    assert.ok(html.includes('白塔寺 / 华熙 / 宫门口'), '定制条件应包含所选片区');
    assert.ok(html.includes('周六上午'), '定制条件应包含所选筛选值');
    assert.ok(html.includes('路线推荐'), '应展示路线推荐区');
    assert.ok(html.includes('白塔寺胡同漫游与宫门口咖啡'), '列表应含白塔寺路线');
    assert.ok(!html.includes('三里屯brunch与亮马河散步'), '该条件下三里屯路线匹配度低，不应入选（组合展示）');
    assert.ok(!html.includes('匹配你的片区'), '匹配片区角标应已被匹配度替换');
    // 排序：诚意推荐 r9 → 经典必逛 r4/r2/r5（组内匹配度降序）→ 智能定制 r3
    const order = ['什刹海晨光散步与鼓楼早午餐', '白塔寺胡同漫游与宫门口咖啡', '鼓楼南锣鼓巷夜景与什刹海小吃', '798艺术区咖啡与公园散步', '奥森绿道骑行与林间野餐'];
    const positions = order.map(name => html.indexOf(name));
    assert.ok(positions.every(p => p !== -1), '5 条路线应全部展示');
    for (let i = 1; i < positions.length; i++) {
        assert.ok(positions[i - 1] < positions[i], `第 ${i + 1} 位应为 ${order[i]}`);
    }
    // 匹配度徽章：诚意推荐与经典必逛共 4 张卡显示，智能定制不显示
    assert.strictEqual((html.match(/匹配度/g) || []).length, 4, '仅 4 张非智能卡应显示匹配度');
    assert.strictEqual((html.match(/匹配度 50%/g) || []).length, 2, 'r9 与 r4 应为 50%');
    assert.strictEqual((html.match(/匹配度 25%/g) || []).length, 2, 'r2 与 r5 应为 25%');
    // 智能定制卡：不显示推荐理由，改为 AI 定制胶囊
    assert.ok(html.includes('根据您的需求AI定制，路线仅供参考'), '智能定制卡应显示 AI 定制胶囊');
    assert.ok(html.includes('查看详情'), '路线卡片应有查看详情入口');
    // 推荐理由徽章：片区匹配（r4）、时间合适（r3 早上 9 点）、类型相符；0-50 预算下无预算满足
    assert.ok(html.includes('片区匹配'), '列表应有片区匹配理由');
    assert.ok(html.includes('时间合适'), '列表应有时间合适理由');
    assert.ok(html.includes('类型相符'), '列表应有类型相符理由');
    assert.ok(!html.includes('预算满足'), '0-50 预算下不应有预算满足理由');
    // 预算突出显示
    assert.ok(html.includes('人均预算'), '卡片应有人均预算标签');
    assert.ok(html.includes('约 160 元/人'), '应突出展示路线预算');
    assert.ok(!html.includes('路线安排'), '列表页不应直接是详情');
});

test('点击路线卡片进入详情：全字段展示、无定制条件、无重新定制、头部顺序正确', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    selectAll(RouteForm);
    RouteForm.submit();
    RouteForm.openRoute('r1'); // 三里屯路线
    const html = document._html;
    // 顶部顺序：类型标签 → 路线标题 → 标签胶囊
    const iType = html.indexOf('诚意推荐');
    const iName = html.indexOf('三里屯brunch与亮马河散步');
    const iTag = html.indexOf('社交型');
    assert.ok(iType !== -1 && iType < iName && iName < iTag, `头部顺序应为 类型标签→标题→标签, got ${iType}/${iName}/${iTag}`);
    // 详情不含定制条件与重新定制
    assert.ok(!html.includes('你的定制条件'), '详情页不应显示定制条件');
    assert.ok(!html.includes('重新填写'), '详情页不应有重新定制操作');
    assert.ok(!html.includes('匹配你的片区'), '详情页不应有列表徽章');
    // 全字段区块
    assert.ok(html.includes('路线安排') && html.includes('14:00') && html.includes('三里屯brunch'), '应展示路线安排');
    assert.ok(html.includes('附近活动') && html.includes('三里屯Bistro早午餐'), '应展示附近活动');
    assert.ok(html.includes('沿途推荐') && html.includes('主推荐') && html.includes('顺路推荐') && html.includes('Element Fresh（三里屯店）'), '应展示沿途推荐');
    // 合作商家：图片 + 平台合作标识 + 跳转商户详情页的两个按钮
    assert.ok(html.includes('平台合作'), '合作商家应有平台合作标识');
    assert.ok(html.includes('茶百道（三里屯店）'), '应展示合作商家店名');
    assert.strictEqual((html.match(/>领取优惠<\/button>/g) || []).length, 1, 'r1 详情应有且仅有一处领取优惠按钮');
    assert.strictEqual((html.match(/>查看详情<\/button>/g) || []).length, 1, 'r1 详情应有且仅有一处查看详情按钮');
    assert.ok(html.includes("merchant-detail.html?id=m-teabadao-slt"), '查看详情应跳转商户详情页');
    assert.ok(html.includes('merchant-detail.html?id=m-teabadao-slt&tab=coupons'), '领取优惠应跳转商户详情页优惠区');
    assert.ok(html.includes('路线准备'), '应展示路线准备');
    assert.ok(html.includes('预算明细') && html.includes('约 330 元/人'), '应展示预算明细');
    assert.ok(html.includes('推荐理由'), '应展示推荐理由');
    assert.ok(html.includes('路线攻略') && html.includes('出行建议') && html.includes('适合谁') && html.includes('不太适合谁') && html.includes('备选方案'), '攻略应含四分类');
    // 质量评价
    assert.ok(html.includes('这条路线怎么样？'), '应展示质量评价区');
    assert.ok(html.includes('点一下就行，后续会用来优化路线和店铺'), '评价区提示文案应与规格一致');
    for (const opt of ['路线好用', '店铺不准', '价格不准', '太远了', '排队太久']) {
        assert.ok(html.includes(opt), `评价选项缺失: ${opt}`);
    }
    // 底部固定悬浮操作栏：收藏/分享 + 溜搭状态按钮（找同款搭子已移除）
    assert.ok(html.includes('fixed bottom-0'), '操作栏应固定在页面底部');
    for (const action of ['收藏', '分享']) {
        assert.ok(html.includes(action), `操作按钮缺失: ${action}`);
    }
    assert.ok(html.includes('标记为已出行'), 'r1 为未出行状态，按钮应显示「标记为已出行」');
    assert.ok(!html.includes('找同款搭子'), '找同款搭子按钮应已移除（改为同款搭子区块）');
    // 同款搭子区块（路线攻略下方）
    assert.ok(html.includes('同款搭子'), '应有同款搭子区块');
    assert.ok(html.includes('TA们也匹配到了这条路线'), '应有同款搭子说明文案');
    assert.ok(html.indexOf('路线攻略') < html.indexOf('同款搭子'), '同款搭子应位于路线攻略下方');
    assert.ok(html.includes('局王本王') && html.includes('首刷特种兵'), '应展示匹配该路线的搭子（r1）');
    assert.ok(html.includes('chat.html?uid=f6'), '同款搭子应可直接搭讪进聊天');
});

test('逐步后退：路线详情 → 推荐列表 → 定制表单（保留选择）', () => {
    const { RouteForm, document, history } = makePageSandbox();
    RouteForm.render();
    selectAll(RouteForm);
    RouteForm.submit();
    RouteForm.openRoute('r5');
    assert.ok(document._html.includes('798艺术区咖啡与公园散步'), '详情应展示所选路线');
    assert.strictEqual(history.entries.length, 3, '表单/列表/详情应各占一条历史记录');
    history.back();
    assert.ok(document._html.includes('你的定制条件'), '后退一步应回到列表');
    history.back();
    const html = document._html;
    assert.ok(html.includes('这次属于哪种情况？'), '再后退应回到表单');
    assert.ok(html.includes('onclick="RouteForm.submit()"'), '返回表单后已选条件应保留（提交可用）');
    assert.strictEqual(RouteForm.selections.situation, 0);
});

test('深链恢复：带视图状态的 URL 直接渲染对应视图（商户页后退场景）', () => {
    // 模拟从商户详情页 history.back() 回到路线详情 URL
    const { RouteForm, document } = makePageSandbox({ initialSearch: '?view=detail&route=r1&s=0&a=0&t=0&p=0&b=0&pa=0&st=0' });
    RouteForm.restoreFromUrl();
    RouteForm.render();
    assert.ok(document._html.includes('三里屯brunch与亮马河散步'), '应恢复路线详情视图');
    assert.strictEqual(RouteForm.selections.situation, 0, '选择状态应从 URL 恢复');
    assert.ok(!document._html.includes('这次属于哪种情况？'), '不应是表单视图');
    // 列表 URL 恢复
    const { RouteForm: RF2, document: doc2 } = makePageSandbox({ initialSearch: '?view=list&s=0&a=0&t=0&p=0&b=0&pa=0&st=0' });
    RF2.restoreFromUrl();
    RF2.render();
    assert.ok(doc2._html.includes('你的定制条件'), '应恢复推荐列表视图');
});

test('质量评价点击触发感谢提示', () => {
    const { RouteForm, toasts } = makePageSandbox();
    RouteForm.render();
    selectAll(RouteForm);
    RouteForm.submit();
    RouteForm.openRoute('r1');
    RouteForm.rate(0);
    assert.ok(toasts.some(t => t.includes('感谢反馈')), `评价点击应弹感谢提示, got: ${toasts.join('|')}`);
    assert.strictEqual(RouteForm.ratingSelected, 0);
});

test('收藏提示 + 操作栏按钮随溜搭状态变化', () => {
    const { RouteForm, document, toasts } = makePageSandbox();
    RouteForm.render();
    selectAll(RouteForm);
    RouteForm.submit();
    // r3 未加入溜搭计划 → 显示「加入溜搭计划」
    RouteForm.openRoute('r3');
    let html = document._html;
    assert.ok(html.includes('加入溜搭计划'), '未加入路线的按钮应为「加入溜搭计划」');
    RouteForm.joinPlan();
    assert.ok(toasts.some(t => t.includes('已加入你的溜搭计划') && t.includes('个人中心')), `加入应弹提示, got: ${toasts.join('|')}`);
    assert.strictEqual(store['me_plan_r3'], 'pending', '加入后应记录未出行状态');
    html = document._html;
    assert.ok(html.includes('标记为已出行'), '加入后按钮应变为「标记为已出行」');
    // 标记已出行
    RouteForm.markPlanDone();
    assert.ok(toasts.some(t => t.includes('已标记为已出行')), '标记应弹提示');
    assert.strictEqual(store['me_plan_r3'], 'done', '标记后应记录已出行');
    html = document._html;
    assert.ok(html.includes('已出行') && !html.includes('标记为已出行'), '标记后按钮应变为「已出行」');
    // r1 数据默认为未出行 → 按钮「标记为已出行」
    RouteForm.openRoute('r1');
    assert.ok(document._html.includes('标记为已出行'), 'r1 应显示「标记为已出行」');
    // r2 数据默认为已出行 → 按钮「已出行」且不可点击
    RouteForm.openRoute('r2');
    assert.ok(document._html.includes('已出行') && !document._html.includes('markPlanDone'), 'r2 应显示已出行且无标记入口');
    // 收藏提示
    RouteForm.favorite();
    assert.ok(toasts.some(t => t.includes('收藏成功') && t.includes('我的收藏')), `收藏应弹提示, got: ${toasts.join('|')}`);
    // 清理
    delete store['me_plan_r3'];
});

test('分享卡片：弹窗含当前路线信息与二维码，可关闭', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    selectAll(RouteForm);
    RouteForm.submit();
    RouteForm.openRoute('r1');
    assert.ok(!document._html.includes('qr-canvas'), '未点分享时不应有二维码');
    RouteForm.openShare();
    const html = document._html;
    assert.ok(html.includes('三里屯brunch与亮马河散步'), '分享卡片应含路线名称');
    assert.ok(html.includes('约 330 元/人'), '分享卡片应含路线预算');
    assert.ok(html.includes('qr-canvas'), '分享卡片应含二维码');
    RouteForm.closeShare();
    assert.ok(!document._html.includes('qr-canvas'), '关闭分享后二维码应消失');
});

test('同款搭子数据：每条路线至少 2 位匹配搭子', () => {
    const { GlobalData, WeekendRoute } = makePageSandbox();
    const fellows = GlobalData.weekendFellows;
    const routeIds = GlobalData.weekendRoutes.map(r => r.id);
    for (const r of routeIds) {
        const matched = WeekendRoute.routeFellowsForRoute(r);
        assert.ok(matched.length >= 2, `路线 ${r} 应至少 2 位同款搭子（实际 ${matched.length}）`);
    }
    for (const f of fellows) {
        assert.ok(Array.isArray(f.routeIds) && f.routeIds.every(rid => routeIds.includes(rid)), `搭子 ${f.name} routeIds 非法`);
    }
    assert.strictEqual(WeekendRoute.routeFellowsForRoute('nobody').length, 0, '未知路线应返回空');
});

test('未选齐时提交不生效', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    RouteForm.select('situation', 1);
    const bar = document.getElementById('route-submit-bar');
    assert.ok(bar.innerHTML.includes('还差 6 项'), '只选 1 项时应显示还差 6 项');
    RouteForm.submit();
    assert.ok(!document._html.includes('路线安排'), '未选齐提交不应出路线');
    assert.ok(!document._html.includes('你的定制条件'), '未选齐提交不应出列表');
});

test('数据缺失时展示错误视图', () => {
    const { RouteForm, document } = makePageSandbox({ emptyData: true });
    RouteForm.render();
    assert.ok(document._html.includes('表单配置加载失败'));
    assert.ok(!document._html.includes('这次属于哪种情况？'));
});

test('表单选项选中态完全由 data-selected 驱动（切换后旧选项可取消）', () => {
    // 预置选择后渲染（模拟从列表后退回表单），选项静态类不得包含选中样式
    const { RouteForm, document } = makePageSandbox({ initialSearch: '?s=0&a=0&t=0&p=0&b=0&pa=0&st=0' });
    RouteForm.restoreFromUrl();
    RouteForm.render();
    const html = document._html;
    const pick = (group, idx) => {
        const marker = 'onclick="RouteForm.select(\'' + group + '\', ' + idx + ')"';
        const start = html.indexOf(marker);
        const end = html.indexOf('</button>', start);
        return html.slice(start, end);
    };
    // 已选中的情况卡：只有 data-selected="true"，不写死橙色静态类
    const selSituation = pick('situation', 0);
    assert.ok(selSituation.includes('data-selected="true"'), '选中项应有 data-selected=true');
    assert.ok(!selSituation.includes('border-brand-orange'), '选中项静态类不得包含橙色边框（否则切换后取消不掉）');
    assert.ok(!selSituation.includes('text-brand-orange'), '选中项静态类不得包含橙色文字');
    // 未选中的情况卡
    assert.ok(!pick('situation', 1).includes('border-brand-orange'));
    // 片区卡与筛选胶囊同样校验
    assert.ok(!pick('area', 0).includes('border-brand-orange'));
    assert.ok(!pick('time', 0).includes('bg-brand-orange'));
});

test('提交定制自动保存记录；我的定制记录可查看历史并回看当次推荐路线', () => {
    clearPlanStore();
    const { RouteForm, document, WeekendRoute } = makePageSandbox();
    RouteForm.render();
    // 表单右上角有"我的定制记录"入口
    assert.ok(document._html.includes('我的定制记录'), '表单右上角应有我的定制记录入口');
    selectAll(RouteForm);
    RouteForm.submit();
    const records = [...WeekendRoute.getRouteRecords()];
    assert.strictEqual(records.length, 1, '提交后应保存 1 条记录');
    const rec = records[0];
    assert.strictEqual(rec.selections.situation, 0, '记录应含定制选择');
    assert.deepStrictEqual([...rec.routeIds], ['r9', 'r4', 'r2', 'r5', 'r3'], '记录应为当次推荐结果（5 条）');
    // 记录列表
    RouteForm.openRecords();
    let html = document._html;
    assert.ok(html.includes('定制记录'), '记录页应有标题');
    assert.ok(html.includes('本地周末'), '记录列表应含选择摘要');
    assert.ok(html.includes('5 条路线'), '记录列表应含推荐数量');
    // 每个选项带标题
    for (const label of ['情况', '片区', '什么时候有空', '几个人', '人均预算', '是否找搭子', '是否接受陌生人组局']) {
        assert.ok(html.includes(label), `记录列表应显示选项标题: ${label}`);
    }
    assert.ok(html.includes('0-50元'), '记录列表预算应带元单位');
    // 记录详情：当次推荐路线 + 本次定制条件（非当前选择）
    RouteForm.openRecord(rec.id);
    html = document._html;
    assert.ok(html.includes('本次定制条件'), '记录详情应展示该次定制条件');
    assert.ok(html.includes('什刹海晨光散步与鼓楼早午餐'), '记录详情应含当次推荐路线');
    assert.ok(html.includes('奥森绿道骑行与林间野餐'), '记录详情应含当次推荐路线');
    assert.ok(!html.includes('你的定制条件'), '记录详情不应是实时列表');
    // 深链恢复记录视图
    const { RouteForm: RF2, document: doc2 } = makePageSandbox({ initialSearch: '?view=records' });
    RF2.restoreFromUrl();
    RF2.render();
    assert.ok(doc2._html.includes('定制记录'), '深链应恢复记录视图');
    // 记录持久（同 storage 新沙箱）
    const { WeekendRoute: WR2 } = makePageSandbox();
    assert.strictEqual([...WR2.getRouteRecords()].length, 1, '记录应持久保存');
    clearPlanStore();
});

test('页面不渲染底部主导航（表单/列表/详情均无）', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    assert.ok(!document._html.includes('__bottom_nav__'), '表单视图不应有底部导航');
    selectAll(RouteForm);
    RouteForm.submit();
    assert.ok(!document._html.includes('__bottom_nav__'), '列表视图不应有底部导航');
    RouteForm.openRoute('r1');
    assert.ok(!document._html.includes('__bottom_nav__'), '详情视图不应有底部导航');
});
