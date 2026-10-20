/**
 * 个人中心页测试（node me.test.cjs）
 * 覆盖：黑卡/积分区移除、周末人格展示、活动/收藏/溜达 TAB、更多下拉。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

// 共享 sessionStorage 存储：模拟同一会话内页面刷新后状态保留
const store = {};

function makePageSandbox() {
    const document = {
        _html: '',
        getElementById() { return document; },
        set innerHTML(v) { document._html = v; },
        get innerHTML() { return document._html; },
        querySelectorAll() { return []; },
        addEventListener() {}
    };
    const sessionStorage = {
        getItem: (k) => (k in store ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: (k) => { delete store[k]; }
    };
    const toasts = [];
    const sandbox = {
        window: { scrollY: 0, scrollTo() {}, location: { href: '', search: '', pathname: 'me.html' } },
        document,
        sessionStorage,
        URLSearchParams,
        setTimeout: (fn) => fn(),
        Math,
        Date
    };
    sandbox.window.sessionStorage = sessionStorage;
    sandbox.window.document = document;
    sandbox.window.Common = {
        renderBottomNav: () => '<div class="__bottom_nav__"></div>',
        initIcons() {},
        showToast: (msg) => toasts.push(msg)
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    const html = fs.readFileSync(path.join(dir, 'me.html'), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
    vm.runInContext(inline, sandbox);
    // vm 环境不触发 DOMContentLoaded，主动渲染页面
    vm.runInContext('window.MePage.render()', sandbox);
    return { document, toasts, MePage: sandbox.window.MePage };
}

test('数据完整：报名活动/收藏/溜达计划引用有效且人格有效', () => {
    // 通过沙箱重载 data.js 读取 GlobalData
    const store = {};
    const sandbox = { window: {}, sessionStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } } };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    const G = sandbox.window.GlobalData;
    const activityIds = new Set(G.activities.map(a => a.id));
    const momentIds = new Set(G.moments.map(m => m.id));
    const routeIds = new Set(G.weekendRoutes.map(r => r.id));
    const pids = new Set(G.weekendPersonalities.map(p => p.id));
    assert.ok(G.user.weekendPersonality && pids.has(G.user.weekendPersonality), '用户应有人格且人格有效');
    for (const id of G.myActivities) assert.ok(activityIds.has(id), `报名活动 ${id} 不存在`);
    for (const id of G.myFavoriteMoments) assert.ok(momentIds.has(id), `收藏动态 ${id} 不存在`);
    for (const id of G.myFavoriteRoutes) assert.ok(routeIds.has(id), `收藏路线 ${id} 不存在`);
    for (const p of G.myPlanRoutes) {
        assert.ok(routeIds.has(p.routeId), `溜达路线 ${p.routeId} 不存在`);
        assert.ok(p.status === 'pending' || p.status === 'done', `溜达状态非法: ${p.status}`);
    }
    assert.ok(G.myPlanRoutes.some(p => p.status === 'pending') && G.myPlanRoutes.some(p => p.status === 'done'),
        '溜达计划应同时有未出行与已出行示例');
});

test('页面渲染：无黑卡会员/等级说明，有周末人格与钱包，TAB 区齐全', () => {
    const { document } = makePageSandbox();
    const html = document._html;
    assert.ok(!html.includes('搭子黑卡会员'), '黑卡会员区域应移除');
    assert.ok(!html.includes('查看等级特权说明'), '等级特权说明应移除');
    assert.ok(html.includes('我的周末人格'), '应展示周末人格区');
    assert.ok(html.includes('胡同街溜子'), '应展示人格标题');
    assert.ok(html.includes('钱包余额') && html.includes('¥386.50'), '应保留钱包余额卡');
    for (const tab of ['活动', '收藏', '溜达', '更多']) {
        assert.ok(html.includes(tab), `TAB 区缺失: ${tab}`);
    }
});

test('活动 TAB（默认）：展示我报名的活动', () => {
    const { document } = makePageSandbox();
    const html = document._html;
    assert.ok(html.includes('我报名的活动'), '应有报名活动区标题');
    assert.ok(html.includes('朝阳公园飞盘新手局'), '应含报名活动 a1');
    assert.ok(html.includes('奥森公园5km慢跑+拉伸'), '应含报名活动 a3');
    assert.ok(html.includes('羽毛球双打局'), '应含报名活动 a21');
    assert.ok(html.includes('已报名'), '应有报名状态徽章');
});

test('收藏 TAB：展示收藏的动态与路线', () => {
    const { document, MePage } = makePageSandbox();
    MePage.setTab('favorites');
    const html = document._html;
    assert.ok(html.includes('我收藏的动态'), '应有动态收藏区');
    assert.ok(html.includes('亮马河') , '应含收藏动态内容（mo1）');
    assert.ok(html.includes('我收藏的路线'), '应有路线收藏区');
    assert.ok(html.includes('三里屯brunch与亮马河散步'), '应含收藏路线 r1');
    assert.ok(html.includes('什刹海晨光散步与鼓楼早午餐'), '应含收藏路线 r9');
});

test('溜达 TAB：未出行/已出行分组，未出行可标记已出行', () => {
    const { document, MePage } = makePageSandbox();
    MePage.setTab('stroll');
    let html = document._html;
    assert.ok(html.includes('未出行') && html.includes('已出行'), '应有未出行/已出行分组');
    // r1 未出行在前，r2 已出行在后
    assert.ok(html.indexOf('三里屯brunch与亮马河散步') < html.indexOf('鼓楼南锣鼓巷夜景与什刹海小吃'), 'r1 应在未出行组（已出行组之前）');
    assert.ok(html.includes('标记已出行'), '未出行路线应有标记按钮');
    // 标记 r1 已出行：r1 卡片应移到"已出行"标题之后（未出行组只剩 r9 的标记按钮）
    MePage.markPlanDone('r1');
    html = document._html;
    assert.ok(html.indexOf('三里屯brunch与亮马河散步') > html.indexOf('标记已出行'), '标记后 r1 应移入已出行组');
    // 新沙箱（模拟刷新）后状态保留（共享 sessionStorage）
    const { MePage: Me2, document: doc2 } = makePageSandbox();
    Me2.setTab('stroll');
    assert.ok(doc2._html.indexOf('三里屯brunch与亮马河散步') > doc2._html.indexOf('标记已出行'),
        '刷新后标记状态应保留');
    // 清理共享状态，避免影响重复运行
    delete store['me_plan_r1'];
});

test('更多按钮：点击下拉展示个人中心链接，再点收起', () => {
    const { document, MePage } = makePageSandbox();
    assert.ok(!document._html.includes('我的认证'), '初始不应显示更多菜单');
    MePage.toggleMore();
    let html = document._html;
    for (const item of ['我的资料', '我的认证', '我的搭子', '浏览历史', '我的订单', '帮助与反馈', '退出登录']) {
        assert.ok(html.includes(item), `更多菜单缺失: ${item}`);
    }
    MePage.toggleMore();
    assert.ok(!document._html.includes('我的认证'), '再次点击应收起');
});
