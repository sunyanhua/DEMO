/**
 * 首页测试（node index.test.cjs）
 * 覆盖：分类区仅 4 项 + 更多入口；推荐搭子区改为搭子需求卡片。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function makePageSandbox() {
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
        window: { scrollY: 0, scrollTo() {}, location: { href: '', search: '', pathname: 'index.html' } },
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
    const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
    vm.runInContext(inline, sandbox);
    vm.runInContext('window.View.render()', sandbox);
    return { document, GlobalData: sandbox.window.GlobalData };
}

test('首页分类区：仅 4 个分类 + 更多（跳发现活动标签页）', () => {
    const { document } = makePageSandbox();
    const html = document._html;
    assert.strictEqual((html.match(/category\.html\?view=activity&cat=/g) || []).length, 4, '分类磁贴应只有 4 个');
    assert.ok(html.includes('更多'), '最后一项应为更多');
    assert.ok(html.includes("window.location.href='category.html?view=activity'"), '更多应跳发现活动标签页');
    assert.ok(!html.includes('全部</span>'), '原全部磁贴应移除');
});

test('首页头像图源与分类行布局修复', () => {
    const { document, GlobalData } = makePageSandbox();
    const html = document._html;
    assert.ok(!html.includes('picsum.photos'), '头像不应再使用 picsum 图源');
    assert.ok(html.includes('images/avatar-'), '头像应使用本地生成的头像文件');
    assert.ok(!html.includes('w=100&h=100'), '头像不应再依赖外网人像图');
    assert.strictEqual(GlobalData.categories[0].icon, 'dumbbell', '运动分类图标应为 dumbbell（dribbble 已从 lucide 移除）');
    assert.ok(html.includes('grid grid-cols-5 justify-items-center'), '分类行应五等分均匀分布');
});

test('首页搭子需求卡片：需求胶囊 + 认识TA + 定制同款路线', () => {
    const { document, GlobalData } = makePageSandbox();
    const html = document._html;
    assert.ok(html.includes('搭子需求'), '应有搭子需求区标题');
    assert.ok(!html.includes('推荐搭子'), '原推荐搭子区应移除');
    for (const u of GlobalData.demandUsers) {
        assert.ok(html.includes(u.name), `应展示需求用户 ${u.name}`);
        assert.ok(html.includes('profile.html?id=' + u.id), `认识TA 应进个人主页（${u.id}）`);
    }
    // 需求胶囊：情况/片区/时间等选择内容
    assert.ok(html.includes('本地周末'), '胶囊应含所选情况');
    assert.ok(html.includes('周六下午'), '胶囊应含所选时间');
    // 预算胶囊：带"人均预算"标签与"元"单位
    assert.ok(html.includes('人均预算 50-150元'), '预算胶囊应带人均预算标签与元单位');
    // 是否找搭子/是否接受陌生人组局两个选项不显示
    assert.ok(!html.includes('是否找搭子'), '需求卡不应显示是否找搭子');
    assert.ok(!html.includes('是否接受陌生人组局'), '需求卡不应显示是否接受陌生人组局');
    // 定制同款路线：带定制参数深链
    const d1 = GlobalData.demandUsers[0];
    const s = d1.selections;
    const params = `s=${s.situation}&a=${s.area}&t=${s.time}&p=${s.people}&b=${s.budget}&pa=${s.partner}&st=${s.stranger}`;
    assert.ok(html.includes('weekend-route.html?' + params), '定制同款路线应带定制参数深链');
    assert.ok(html.includes('认识TA') && html.includes('定制同款路线'), '两个按钮应存在');
    // 右侧入口：更多 → 发现搭子页
    assert.ok(html.includes('更多'), '右侧入口应为更多');
    assert.ok(html.includes("window.location.href='category.html?view=partner'"), '更多应进入发现搭子页');
    assert.ok(!html.includes('我也要定制'), '原我也要定制入口应移除');
});
