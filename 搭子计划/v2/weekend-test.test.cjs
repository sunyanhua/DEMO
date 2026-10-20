/**
 * 周末人格测试引擎测试（node weekend-test.test.cjs）
 * 在浏览器语义沙箱中执行 data.js + weekend-test.js，测试与线上运行完全相同的代码。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;
// 浏览器 API 垫片：data.js 顶层会读取 sessionStorage 恢复认证状态
const sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const sandbox = { window: {}, sessionStorage };
sandbox.window.sessionStorage = sessionStorage;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(dir, 'weekend-test.js'), 'utf8'), sandbox);

const { GlobalData, WeekendTest } = sandbox.window;
const { score, pickWinner, calculate } = WeekendTest;

const PIDS = ['hutong', 'beer', 'solo', 'host', 'tourist', 'lazy', 'budget', 'outdoor'];

// 选项下标：0=A 1=B 2=C 3=D
const ALL_A = [0, 0, 0, 0, 0, 0, 0, 0];
const ALL_B = [1, 1, 1, 1, 1, 1, 1, 1];
const ALL_C = [2, 2, 2, 2, 2, 2, 2, 2];
const ALL_D = [3, 3, 3, 3, 3, 3, 3, 3];

test('人格数据完整：8 种人格且字段齐全', () => {
    assert.strictEqual(GlobalData.weekendPersonalities.length, 8);
    const ids = new Set();
    for (const p of GlobalData.weekendPersonalities) {
        assert.ok(p.id && !ids.has(p.id), `人格 id 唯一且非空: ${p.id}`);
        ids.add(p.id);
        assert.ok(p.title, `${p.id} 缺少 title`);
        assert.ok(p.quote, `${p.id} 缺少 quote`);
        assert.ok(p.description, `${p.id} 缺少 description`);
        assert.ok(Array.isArray(p.tags) && p.tags.length >= 2, `${p.id} tags 应为至少 2 项的数组`);
        assert.ok(p.emoji && p.color, `${p.id} 缺少 emoji/color`);
    }
    assert.deepStrictEqual([...ids].sort(), [...PIDS].sort(), '人格 id 集合');
});

test('题目数据完整：8 题 × 4 选项，分值指向有效人格', () => {
    const { weekendTestQuestions: qs, weekendPersonalities: ps } = GlobalData;
    assert.strictEqual(qs.length, 8);
    const pidSet = new Set(ps.map(p => p.id));
    qs.forEach((q, qi) => {
        assert.ok(q.text, `第 ${qi + 1} 题缺少 text`);
        assert.strictEqual(q.options.length, 4, `第 ${qi + 1} 题应有 4 个选项`);
        q.options.forEach((opt, oi) => {
            assert.ok(opt.text, `第 ${qi + 1} 题选项 ${oi} 缺少 text`);
            const entries = Object.entries(opt.scores);
            assert.ok(entries.length > 0, `第 ${qi + 1} 题选项 ${oi} 无分值`);
            for (const [pid, pts] of entries) {
                assert.ok(pidSet.has(pid), `第 ${qi + 1} 题选项 ${oi} 分值指向未知人格: ${pid}`);
                assert.ok(Number.isInteger(pts) && pts > 0, `第 ${qi + 1} 题选项 ${oi} 分值应为正整数`);
            }
        });
    });
});

test('全选 A → 一人食孤勇者（唯一胜出）', () => {
    const { id, scores } = calculate(ALL_A);
    assert.strictEqual(id, 'solo');
    assert.strictEqual(scores.solo, 10);
});

test('全选 B → 胡同街溜子（唯一胜出）', () => {
    const { id } = calculate(ALL_B);
    assert.strictEqual(id, 'hutong');
});

test('全选 C → 胡同街溜子/搭子局攒局王 同分，随机出结果', () => {
    const { scores } = calculate(ALL_C);
    assert.strictEqual(scores.hutong, 6);
    assert.strictEqual(scores.host, 6);
    // random 可控：0 → 第一个候选（胡同街溜子），接近 1 → 第二个候选（搭子局攒局王）
    assert.strictEqual(pickWinner(scores, () => 0), 'hutong');
    assert.strictEqual(pickWinner(scores, () => 0.9999), 'host');
    // 多次随机只在两个同分候选间取值
    for (let i = 0; i < 50; i++) {
        const winner = pickWinner(scores);
        assert.ok(['hutong', 'host'].includes(winner), `同分随机应只出并列者, got ${winner}`);
    }
});

test('全选 D → 户外放电永动机/搭子局攒局王 同分，随机出结果', () => {
    const { scores } = calculate(ALL_D);
    assert.strictEqual(scores.outdoor, 6);
    assert.strictEqual(scores.host, 6);
    assert.strictEqual(pickWinner(scores, () => 0), 'outdoor');
    assert.strictEqual(pickWinner(scores, () => 0.9999), 'host');
});

test('定向答案 → 精酿社交悍匪（唯一胜出）', () => {
    // Q1B Q2B Q3D Q4C Q5B Q6C Q7D Q8D：beer 13 分 > host 10 分
    const { id, scores } = calculate([1, 1, 3, 2, 1, 2, 3, 3]);
    assert.strictEqual(id, 'beer');
    assert.strictEqual(scores.beer, 13);
});

test('每种人格都存在至少一种答案组合可唯一胜出', () => {
    const qs = GlobalData.weekendTestQuestions;
    const winCount = Object.fromEntries(PIDS.map(p => [p, 0]));
    for (let n = 0; n < 65536; n++) {
        let x = n;
        const answers = [];
        for (let i = 0; i < 8; i++) { answers.push(x % 4); x = (x - answers[i]) / 4; }
        const s = score(answers);
        const max = Math.max(...Object.values(s));
        const top = Object.keys(s).filter(k => s[k] === max);
        if (top.length === 1) winCount[top[0]]++;
    }
    for (const pid of PIDS) {
        assert.ok(winCount[pid] > 0, `${pid} 无任何答案组合可唯一胜出`);
    }
});

test('答案数量与题目数量不符时抛错', () => {
    assert.throws(() => score([0, 1]), /答案数量/);
    assert.throws(() => score([]), /答案数量/);
});

test('选项下标非法时抛错', () => {
    assert.throws(() => score([9, 0, 0, 0, 0, 0, 0, 0]), /非法/);
});

test('空得分表抛错', () => {
    assert.throws(() => pickWinner({}, () => 0), /得分表为空/);
});

// ---------- 页面状态机测试：在沙箱中执行 weekend-test.html 的内联脚本 ----------

function makePageSandbox(options = {}) {
    const document = {
        _html: '',
        getElementById() { return document; },
        set innerHTML(v) { document._html = v; },
        get innerHTML() { return document._html; },
        querySelectorAll() { return []; }, // 选中高亮逻辑在测试中为 noop
        addEventListener() {}
    };
    const sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const sandbox = { window: {}, document, sessionStorage, setTimeout: (fn) => fn() }; // 同步触发延时回调
    sandbox.window.sessionStorage = sessionStorage;
    sandbox.window.document = document;
    // Common 桩：若页面调用 renderBottomNav，会渲染出 __bottom_nav__ 标记
    sandbox.window.Common = { renderBottomNav: () => '<div class="__bottom_nav__"></div>', initIcons() {} };
    vm.createContext(sandbox);
    if (options.emptyData) {
        sandbox.window.GlobalData = { weekendPersonalities: [], weekendTestQuestions: [] };
    } else {
        vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    }
    vm.runInContext(fs.readFileSync(path.join(dir, 'weekend-test.js'), 'utf8'), sandbox);
    const html = fs.readFileSync(path.join(dir, 'weekend-test.html'), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
    vm.runInContext(inline, sandbox);
    return {
        Test: sandbox.window.Test,
        WeekendTest: sandbox.window.WeekendTest,
        document,
        GlobalData: sandbox.window.GlobalData
    };
}

test('页面初始渲染为介绍视图（含规格文案）', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    assert.ok(document._html.includes('测测你是哪种北京周末生物？'), '标题应为规格文案');
    assert.ok(document._html.includes('8道题，看看你周末是哪种野生人类。'), '副标题应为规格文案');
    assert.ok(document._html.includes('不赶景点，不硬社交。'), '引导语第 1 句缺失');
    assert.ok(document._html.includes('选你真实会选的，我们给你一条北京周末路线。'), '引导语第 2 句缺失');
    assert.ok(document._html.includes('一个人能玩，熟人能分享，想找搭子也能一键组局。'), '引导语第 3 句缺失');
    assert.ok(document._html.includes('开始鉴定'), '按钮文案应为「开始鉴定 →」');
    assert.ok(!document._html.includes('重新测试')); // 尚未出现结果视图
});

test('点击开始测试后进入第 1 题答题视图', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    assert.ok(document._html.includes('开始鉴定'));
    Test.start(); // 模拟点击"开始鉴定"按钮
    assert.ok(document._html.includes('第 1/8 题'), 'start 后应展示第 1 题进度');
    assert.ok(document._html.includes('周六早上醒来，你第一反应是？'), 'start 后应展示第 1 题题干');
    assert.ok(!document._html.includes('开始鉴定'), 'start 后不应再停留在介绍视图');
    assert.strictEqual(Test.answers.length, 0, '尚未作答，答案应为空');
});

test('逐题作答：第 2 题展示进度，答满 8 题出结果（全选 B → 胡同街溜子）', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    Test.start();
    Test.answer(1); // 第 1 题
    assert.ok(document._html.includes('第 2/8 题'), '答完第 1 题应进入第 2 题');
    for (let i = 0; i < 7; i++) Test.answer(1); // 答完剩余 7 题
    assert.ok(document._html.includes('你的周末人格'), '答满 8 题应出结果视图');
    assert.ok(document._html.includes('胡同街溜子'), '全选 B 结果应为胡同街溜子');
    assert.ok(document._html.includes('我不赶路，我巡视胡同。'), '结果应包含人设台词');
    assert.ok(document._html.includes('慢聊搭子'), '结果应包含适合搭子标签');
    assert.ok(document._html.includes('定制我的周末路线'), '结果应包含路线定制入口');
});

test('全选 A 出结果：一人食孤勇者', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    Test.start();
    for (let i = 0; i < 8; i++) Test.answer(0);
    assert.ok(document._html.includes('一人食孤勇者'));
});

test('重新测试回到介绍视图', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    Test.start();
    for (let i = 0; i < 8; i++) Test.answer(0);
    assert.ok(document._html.includes('你的周末人格'));
    Test.restart();
    assert.ok(document._html.includes('测测你是哪种北京周末生物？'));
    assert.ok(!document._html.includes('重新测试'), '重新测试后应回到介绍页');
    assert.strictEqual(Test.answers.length, 0);
    assert.strictEqual(Test.started, false);
});

test('数据缺失时展示错误视图', () => {
    const { Test, document } = makePageSandbox({ emptyData: true });
    Test.render();
    assert.ok(document._html.includes('测试题目加载失败'));
    assert.ok(!document._html.includes('开始测试'));
});

test('结果页配套数据：人格路线映射与同款搭子完整', () => {
    const { GlobalData } = makePageSandbox();
    const map = GlobalData.weekendPersonalityRoutes;
    const pids = GlobalData.weekendPersonalities.map(p => p.id);
    const routeIds = new Set(GlobalData.weekendRoutes.map(r => r.id));
    assert.ok(map, '应有 weekendPersonalityRoutes 映射');
    for (const pid of pids) {
        assert.ok(Array.isArray(map[pid]) && map[pid].length >= 2, `人格 ${pid} 应映射至少 2 条路线`);
        for (const rid of map[pid]) assert.ok(routeIds.has(rid), `人格 ${pid} 映射了未知路线 ${rid}`);
    }
    const fellows = GlobalData.weekendFellows;
    assert.ok(Array.isArray(fellows) && fellows.length >= 8, '同款搭子 mock 数据应至少 8 人');
    for (const pid of pids) {
        assert.ok(fellows.some(f => f.personalityId === pid), `人格 ${pid} 应至少 1 个同款搭子`);
    }
    for (const f of fellows) {
        assert.ok(f.id && f.name && f.avatarUrl && f.personalityId && f.distance && Array.isArray(f.tags) && f.intro,
            `搭子 ${f.name} 字段不全`);
    }
});

test('引擎查询：人格路线 / 最新活动 / 同款搭子', () => {
    const { WeekendTest } = makePageSandbox();
    const routes = [...WeekendTest.routesForPersonality('hutong')];
    assert.deepStrictEqual(routes.map(r => r.id), ['r2', 'r9', 'r4'], '胡同街溜子应映射鼓楼/什刹海/白塔寺路线');
    const acts = [...WeekendTest.latestActivities(3)];
    assert.strictEqual(acts.length, 3);
    assert.strictEqual(acts[0].id, 'a25', '最新活动应按 id 降序（a25 密室逃脱挑战）');
    assert.strictEqual(acts[1].id, 'a24');
    assert.strictEqual(acts[2].id, 'a23');
    const fellows = [...WeekendTest.fellowsForPersonality('hutong')];
    assert.strictEqual(fellows.length, 2, '胡同街溜子应有 2 位同款搭子');
    assert.ok(fellows.every(f => f.personalityId === 'hutong'));
    assert.strictEqual(WeekendTest.fellowsForPersonality('nobody').length, 0, '未知人格应返回空');
});

test('测试结果页新增区块：分享人格按钮 + 推荐路线 + 热门活动 + 同款搭子', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    Test.start();
    for (let i = 0; i < 8; i++) Test.answer(1); // 全选 B → 胡同街溜子
    const html = document._html;
    assert.ok(html.includes('分享人格'), '结果页应有分享人格按钮');
    assert.ok(html.includes('推荐周末路线'), '应有推荐周末路线区');
    assert.ok(html.includes('鼓楼南锣鼓巷夜景与什刹海小吃'), '推荐路线应含人格映射路线');
    assert.ok(html.includes('weekend-route.html?view=detail&route=r2'), '推荐路线应可深链进路线详情');
    assert.ok(html.includes('平台热门活动'), '应有平台热门活动区');
    assert.ok(html.includes('密室逃脱挑战') && html.includes('日式居酒屋小酌') && html.includes('火锅聚餐局'), '应显示 3 条最新活动');
    assert.ok(html.includes('同款搭子'), '应有同款搭子区');
    assert.ok(html.includes('胡同观察员') && html.includes('慢速遛弯儿'), '应显示同人格的搭子');
});

test('分享人格海报：含头像昵称/结果/台词/描述/二维码/扫码引导', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    Test.start();
    for (let i = 0; i < 8; i++) Test.answer(1);
    assert.ok(!document._html.includes('qr-canvas'), '未打开海报时不应有二维码');
    Test.openPoster();
    const html = document._html;
    assert.ok(html.includes('ActiveExplorer'), '海报应含当前用户昵称');
    assert.ok(html.includes('胡同街溜子'), '海报应含测试结果');
    assert.ok(html.includes('我不赶路，我巡视胡同。'), '海报应含人设台词');
    assert.ok(html.includes('你不爱排队打卡'), '海报应含人格描述');
    assert.ok(html.includes('来测测你和我') && html.includes('周末生物'), '海报应含扫码引导语');
    assert.ok(html.includes('qr-canvas'), '海报应含二维码画布');
    Test.closePoster();
    assert.ok(!document._html.includes('qr-canvas'), '关闭海报后二维码应消失');
});

test('页面不渲染底部主导航（介绍/答题/结果视图均无）', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    assert.ok(!document._html.includes('__bottom_nav__'), '介绍视图不应有底部导航');
    Test.start();
    assert.ok(!document._html.includes('__bottom_nav__'), '答题视图不应有底部导航');
    for (let i = 0; i < 8; i++) Test.answer(0);
    assert.ok(!document._html.includes('__bottom_nav__'), '结果视图不应有底部导航');
});
