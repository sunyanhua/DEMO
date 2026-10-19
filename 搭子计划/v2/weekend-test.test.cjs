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
    return { Test: sandbox.window.Test, document };
}

test('页面初始渲染为介绍视图', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    assert.ok(document._html.includes('测出你的周末人格'));
    assert.ok(document._html.includes('开始测试'));
    assert.ok(!document._html.includes('重新测试')); // 尚未出现结果视图
});

test('点击开始测试后进入第 1 题答题视图', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    assert.ok(document._html.includes('开始测试'));
    Test.start(); // 模拟点击"开始测试"按钮
    assert.ok(document._html.includes('第 1/8 题'), 'start 后应展示第 1 题进度');
    assert.ok(document._html.includes('周六早上醒来，你第一反应是？'), 'start 后应展示第 1 题题干');
    assert.ok(!document._html.includes('开始测试'), 'start 后不应再停留在介绍视图');
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
    assert.ok(document._html.includes('测出你的周末人格'));
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

test('页面不渲染底部主导航（介绍/答题/结果视图均无）', () => {
    const { Test, document } = makePageSandbox();
    Test.render();
    assert.ok(!document._html.includes('__bottom_nav__'), '介绍视图不应有底部导航');
    Test.start();
    assert.ok(!document._html.includes('__bottom_nav__'), '答题视图不应有底部导航');
    for (let i = 0; i < 8; i++) Test.answer(0);
    assert.ok(!document._html.includes('__bottom_nav__'), '结果视图不应有底部导航');
});
