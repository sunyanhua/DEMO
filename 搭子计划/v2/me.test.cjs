/**
 * 个人中心页测试（node me.test.cjs）
 * 覆盖：黑卡/积分区移除、周末人格展示、活动/收藏/溜搭 TAB、更多下拉。
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
        removeItem: (k) => { delete store[k]; },
        get length() { return Object.keys(store).length; },
        key(i) { return Object.keys(store)[i] ?? null; }
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

test('数据完整：报名活动/收藏/溜搭计划引用有效且人格有效', () => {
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
        assert.ok(routeIds.has(p.routeId), `溜搭路线 ${p.routeId} 不存在`);
        assert.ok(p.status === 'pending' || p.status === 'done', `溜搭状态非法: ${p.status}`);
    }
    assert.ok(G.myPlanRoutes.some(p => p.status === 'pending') && G.myPlanRoutes.some(p => p.status === 'done'),
        '溜搭计划应同时有未出行与已出行示例');
});

test('页面渲染：无黑卡会员/等级说明，有周末人格与钱包，TAB 区齐全', () => {
    const { document } = makePageSandbox();
    const html = document._html;
    assert.ok(!html.includes('搭子黑卡会员'), '黑卡会员区域应移除');
    assert.ok(!html.includes('查看等级特权说明'), '等级特权说明应移除');
    assert.ok(html.includes('我的周末人格'), '应展示周末人格区');
    assert.ok(html.includes('胡同街溜子'), '应展示人格标题');
    assert.ok(html.includes('weekend-test.html?view=result'), '人格区应进入上次测试结果页');
    assert.ok(html.includes('钱包余额') && html.includes('¥386.50'), '应保留钱包余额卡');
    for (const tab of ['活动', '收藏', '溜搭', '更多']) {
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

test('收藏 TAB：动态/路线二级 TAB 切换', () => {
    const { document, MePage } = makePageSandbox();
    MePage.setTab('favorites');
    let html = document._html;
    // 默认"动态"二级 TAB（mo1 内容含"发呆"）
    assert.ok(html.includes('发呆'), '默认应展示收藏动态（mo1）');
    assert.ok(!html.includes('三里屯brunch与亮马河散步'), '动态 TAB 下不应展示路线卡');
    // 切到"路线"二级 TAB
    MePage.setFavoriteSub('routes');
    html = document._html;
    assert.ok(html.includes('三里屯brunch与亮马河散步'), '路线 TAB 应含收藏路线 r1');
    assert.ok(html.includes('什刹海晨光散步与鼓楼早午餐'), '路线 TAB 应含收藏路线 r9');
    assert.ok(!html.includes('发呆'), '路线 TAB 下不应展示动态卡');
    // 切回动态
    MePage.setFavoriteSub('moments');
    assert.ok(document._html.includes('发呆'));
});

test('溜搭 TAB：未出行/已出行二级 TAB，未出行可标记已出行', () => {
    const { document, MePage } = makePageSandbox();
    MePage.setTab('stroll');
    let html = document._html;
    // 默认"未出行"二级 TAB：r1/r9 展示，r2 不展示
    assert.ok(html.includes('标记已出行'), '未出行 TAB 应有标记按钮');
    assert.ok(html.includes('三里屯brunch与亮马河散步'), '未出行 TAB 应含 r1');
    assert.ok(!html.includes('鼓楼南锣鼓巷夜景与什刹海小吃'), '未出行 TAB 不应含已出行路线');
    // 卡片可点击进入路线详情，标记按钮不冒泡
    assert.ok(html.includes('weekend-route.html?view=detail&route=r1'), '溜搭路线卡应可点击进路线详情');
    assert.ok(html.includes('event.stopPropagation()'), '标记按钮应阻止冒泡');
    // 切到"已出行"二级 TAB
    MePage.setStrollSub('done');
    html = document._html;
    assert.ok(html.includes('鼓楼南锣鼓巷夜景与什刹海小吃'), '已出行 TAB 应含 r2');
    assert.ok(!html.includes('三里屯brunch与亮马河散步'), '已出行 TAB 不应含未出行路线');
    // 回未出行 TAB 标记 r1
    MePage.setStrollSub('pending');
    MePage.markPlanDone('r1');
    html = document._html;
    assert.ok(!html.includes('三里屯brunch与亮马河散步'), '标记后 r1 应从未出行 TAB 消失');
    MePage.setStrollSub('done');
    assert.ok(document._html.includes('三里屯brunch与亮马河散步'), '已出行 TAB 应出现 r1');
    // 新沙箱（模拟刷新）后状态保留（共享 sessionStorage）
    const { MePage: Me2, document: doc2 } = makePageSandbox();
    Me2.setTab('stroll');
    Me2.setStrollSub('done');
    assert.ok(doc2._html.includes('三里屯brunch与亮马河散步'), '刷新后标记状态应保留');
    // 动态加入的路线（不在静态 myPlanRoutes 列表）也应出现在溜搭列表
    store['me_plan_r8'] = 'pending';
    const { MePage: Me3, document: doc3 } = makePageSandbox();
    Me3.setTab('stroll');
    assert.ok(doc3._html.includes('温榆河露营风下午茶'), '动态加入的路线应出现在溜搭未出行列表');
    // 清理共享状态，避免影响重复运行
    delete store['me_plan_r1'];
    delete store['me_plan_r8'];
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
