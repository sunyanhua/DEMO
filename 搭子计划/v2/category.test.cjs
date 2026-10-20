/**
 * 发现页测试（node category.test.cjs）
 * 覆盖：搭子页改为与首页一致的搭子需求卡片页（去筛选）；活动页回归。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function makePageSandbox(search) {
    const document = {
        _html: '',
        getElementById() { return document; },
        set innerHTML(v) { document._html = v; },
        get innerHTML() { return document._html; },
        querySelectorAll() { return []; },
        addEventListener() {}
    };
    const sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const sandbox = {
        window: { scrollY: 0, scrollTo() {}, location: { href: '', search: search || '', pathname: 'category.html' }, history: { replaceState() {} } },
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
        showToast() {}
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    const html = fs.readFileSync(path.join(dir, 'category.html'), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
    vm.runInContext(inline, sandbox);
    vm.runInContext('render()', sandbox);
    return { document, GlobalData: sandbox.window.GlobalData };
}

test('搭子页：与首页一致的搭子需求卡片，去掉全部/附近等筛选', () => {
    const { document, GlobalData } = makePageSandbox('?view=partner');
    const html = document._html;
    assert.ok(html.includes('搭子需求'), '搭子页应有搭子需求标题');
    for (const u of GlobalData.demandUsers) {
        assert.ok(html.includes(u.name), `应展示需求用户 ${u.name}`);
    }
    assert.ok(html.includes('人均预算'), '需求胶囊应含人均预算');
    assert.ok(html.includes('认识TA') && html.includes('定制同款路线'), '应有认识TA与定制同款路线按钮');
    assert.ok(html.includes('weekend-route.html?s=0'), '定制同款路线应带参数深链');
    assert.ok(html.includes('profile.html?id=d1'), '认识TA应进个人主页');
    // 筛选已去掉
    assert.ok(!html.includes('applyPartnerFilter'), '搭子页不应有筛选按钮');
    assert.ok(!html.includes('附近'), '附近筛选应移除');
    // 每行一个排版（非双列网格）
    assert.ok(!html.includes('grid grid-cols-2'), '搭子页不应是双列网格');
    assert.ok(html.includes('space-y-3'), '应为每行一个的纵向列表');
    // 内容比首页稍丰富：定制时间 + 一句话需求描述
    assert.ok(html.includes('10分钟前'), '卡片应含定制时间');
    assert.ok(html.includes('周末想找个人一起探索三里屯'), '卡片应含一句话需求描述');
});

test('活动页回归：左侧分类导航保留', () => {
    const { document } = makePageSandbox('?view=activity');
    const html = document._html;
    assert.ok(html.includes('全部活动'), '活动页应保留全部活动标题');
    assert.ok(html.includes('category.html?view=activity&cat=c1'), '活动页分类导航应保留');
});
