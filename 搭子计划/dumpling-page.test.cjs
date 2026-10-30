/**
 * 天之"饺"子专题页 + 测试详情页 页面流程测试（node dumpling-page.test.cjs）
 * 在浏览器语义沙箱中执行 data.js + dumpling-quiz-data.js + dumpling-data.js + dumpling-test.js + 页面内联脚本，
 * 覆盖：上一题/下一题手动跳转、完成前拦截、完成后禁止重新测试（保留演示清空）、
 * 活动卡片仅详情按钮、精选活动/有奖分享双TAB。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

// 内存版 sessionStorage：模拟"完成测试后重进页面"的持久化
function makeStorage() {
    const m = {};
    return {
        getItem: (k) => (k in m ? m[k] : null),
        setItem: (k, v) => { m[k] = String(v); },
        removeItem: (k) => { delete m[k]; }
    };
}

function makeDocument() {
    const document = {
        _html: '',
        getElementById() { return document; },
        set innerHTML(v) { document._html = v; },
        get innerHTML() { return document._html; },
        querySelectorAll() { return []; },
        addEventListener() {}
    };
    return document;
}

// 加载 data.js + dumpling-quiz-data.js + dumpling-data.js + dumpling-test.js
function runBase(sandbox) {
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-quiz-data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-test.js'), 'utf8'), sandbox);
}

// 提取页面内联脚本（跳过 <script src> 与 module 类型）
function inlineScriptOf(file) {
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    return [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
}

// ============ 专题页 dumpling.html ============
function makeViewSandbox(storage) {
    const sessionStorage = storage || makeStorage();
    const document = makeDocument();
    const toasts = [];
    const sandbox = {
        window: { location: { href: '' } },
        document,
        sessionStorage,
        navigator: {}
    };
    sandbox.window.sessionStorage = sessionStorage;
    sandbox.window.document = document;
    sandbox.window.Common = { initIcons() {}, showToast: (m) => toasts.push(m), drawQr() {} };
    runBase(sandbox);
    vm.runInContext(inlineScriptOf('dumpling.html'), sandbox);
    return { View: sandbox.window.View, document, sessionStorage, toasts, window: sandbox.window };
}

// 模拟页面加载：恢复状态 + 渲染
function renderView(s) {
    s.View.restoreTestState();
    s.View.render();
    return s.document._html;
}

test('默认渲染精选活动 TAB：活动与首页共享数据，卡片仅详情按钮', () => {
    const s = makeViewSandbox();
    const html = renderView(s);
    assert.ok(html.includes('马上开始测试'), '未测试应展示引导卡');
    assert.ok(html.includes('精选活动'), '应有精选活动 TAB');
    assert.ok(html.includes('有奖分享'), '应有有奖分享 TAB');
    assert.ok(html.includes('data-lucide="sparkles"'), '精选活动 TAB 应有图标');
    assert.ok(html.includes('data-lucide="gift"'), '有奖分享 TAB 应有图标');
    assert.ok(html.includes('立冬饺子偷吃小赛·线下落地'), '应含 a26 饺子线下活动');
    for (const t of ['密室逃脱挑战', '火锅聚餐局', '羽毛球双打局', 'IMAX影院《流浪地球3》观影', '桌游之夜：狼人杀局']) {
        assert.ok(html.includes(t), '应含首页精选活动: ' + t);
    }
    assert.ok(!html.includes('立即报名'), '活动卡片不应有立即报名按钮');
    assert.ok(html.includes('查看详情'), '活动卡片应有详情按钮');
    assert.ok(!html.includes('有奖发布'), '精选活动 TAB 不应显示有奖发布悬浮按钮');
});

test('活动卡片底部：左侧发起人头像昵称可点进主页，右侧查看详情', () => {
    const s = makeViewSandbox();
    const html = renderView(s);
    assert.ok(html.includes('搭子计划官方'), 'a26 卡片应显示发起人昵称');
    assert.ok(html.includes('images/avatar-1.png'), 'a26 卡片应显示发起人头像');
    assert.ok(html.includes('profile.html?id=official-dumpling'), '发起人应可点进个人主页');
    assert.ok(html.includes('profile.html?id=p4'), '普通活动发起人应可点进个人主页');
});

test('切换到有奖分享 TAB：分享卡片 + 动态瀑布流 + 悬浮发布按钮', () => {
    const s = makeViewSandbox();
    renderView(s);
    s.View.switchTab('share');
    const html = s.document._html;
    assert.ok(html.includes('人格测试有奖分享'), '应展示有奖分享卡片');
    assert.ok(html.includes('#我的饺子人格#'), '应展示饺子人格动态瀑布流');
    assert.ok(html.includes('有奖发布'), '有奖分享 TAB 应显示悬浮发布按钮');
    assert.ok(!html.includes('密室逃脱挑战'), '有奖分享 TAB 不应展示活动列表');
});

test('答题选择不自动跳题，上一题/下一题手动跳转且保留已答状态', () => {
    const s = makeViewSandbox();
    renderView(s);
    s.View.startQuiz();
    let html = s.document._html;
    assert.ok(html.includes('第 1/8 题'), '应从第 1 题开始');
    assert.ok(html.includes('已答 0/8'), '初始已答应为 0');
    assert.ok(!html.includes('上一题'), '第 1 题不应有上一题');
    assert.ok(html.includes('下一题'), '应有下一题');

    s.View.answer(1);
    html = s.document._html;
    assert.ok(html.includes('第 1/8 题'), '选择选项后不应自动跳题');
    assert.ok(html.includes('已答 1/8'), '选择后已答应为 1');
    assert.ok(html.includes('ring-1 ring-brand-orange'), '已选选项应有高亮');

    s.View.nextQuestion();
    html = s.document._html;
    assert.ok(html.includes('第 2/8 题'), '下一题应跳到第 2 题');
    assert.ok(html.includes('上一题'), '第 2 题应有上一题');

    s.View.prevQuestion();
    html = s.document._html;
    assert.ok(html.includes('第 1/8 题'), '上一题应回到第 1 题');
    assert.ok(html.includes('已答 1/8'), '回看时已答状态应保留');
    assert.ok(html.includes('ring-1 ring-brand-orange'), '回看时原选择应保留高亮');
});

test('未答完点完成测试：提示并跳到第一道未答题', () => {
    const s = makeViewSandbox();
    renderView(s);
    s.View.startQuiz();
    s.View.answer(1); // 只答第 1 题
    s.View.quiz.currentIndex = 7;
    s.View.render();
    assert.ok(s.document._html.includes('完成测试'), '最后一题应显示完成测试按钮');
    s.View.nextQuestion();
    assert.ok(s.toasts.some(t => t.includes('还有 7 题未作答')), '未答完应提示, got: ' + s.toasts.join('|'));
    assert.ok(s.document._html.includes('第 2/8 题'), '应跳到第一道未答题');
});

test('答完提交：保存完成状态并跳转详情页；重进显示结果摘要且无重新测试', () => {
    const s = makeViewSandbox();
    renderView(s);
    s.View.startQuiz();
    s.View.quiz.answers = [0, 1, 2, 3, 0, 1, 2, 3];
    s.View.quiz.currentIndex = 7;
    s.View.nextQuestion(); // 完成测试
    assert.strictEqual(s.window.location.href, 'dumpling-test.html', '完成后应跳转详情页');
    assert.strictEqual(s.sessionStorage.getItem('dumpling_test_done'), '1', '应保存完成标记');
    const resultId = s.sessionStorage.getItem('dumpling_test_result');
    assert.ok(resultId && s.View.personalities.some(p => p.id === resultId), '应保存有效人格结果');

    // 重进页面：恢复结果摘要
    const s2 = makeViewSandbox(s.sessionStorage);
    const html2 = renderView(s2);
    assert.ok(html2.includes('你的饺子人格'), '重进应恢复结果摘要');
    assert.ok(html2.includes('清空（仅演示）'), '应保留演示清空入口');
    assert.ok(html2.includes('查看详情'), '摘要应有查看详情按钮');
    assert.ok(!html2.includes('重新测试'), '不应有重新测试按钮');
    assert.ok(!html2.includes('马上开始测试'), '已测试不应再显示开始测试');
});

test('清空（仅演示）：回到引导态并清除完成标记', () => {
    const s = makeViewSandbox();
    renderView(s);
    s.View.startQuiz();
    s.View.quiz.answers = [0, 1, 2, 3, 0, 1, 2, 3];
    s.View.quiz.currentIndex = 7;
    s.View.nextQuestion();
    s.View.clearTest();
    assert.ok(s.document._html.includes('马上开始测试'), '清空后应回到引导态');
    assert.strictEqual(s.sessionStorage.getItem('dumpling_test_done'), null, '清空应移除完成标记');
});

// ============ 测试详情页 dumpling-test.html ============
function makeTestSandbox(storage) {
    const sessionStorage = storage || makeStorage();
    const document = makeDocument();
    const toasts = [];
    const sandbox = {
        window: { location: { href: '' } },
        document,
        sessionStorage,
        navigator: {}
    };
    sandbox.window.sessionStorage = sessionStorage;
    sandbox.window.document = document;
    sandbox.window.Common = { initIcons() {}, showToast: (m) => toasts.push(m), drawQr() {} };
    runBase(sandbox);
    vm.runInContext(inlineScriptOf('dumpling-test.html'), sandbox);
    return { Test: sandbox.window.Test, document, sessionStorage, toasts, window: sandbox.window };
}

test('详情页：介绍页开始测试，上/下一题手动跳转', () => {
    const s = makeTestSandbox();
    s.Test.render();
    assert.ok(s.document._html.includes('开始测试'), '未测试应展示介绍页');
    s.Test.start();
    let html = s.document._html;
    assert.ok(html.includes('第 1/8 题'), '应从第 1 题开始');
    assert.ok(!html.includes('上一题'), '第 1 题不应有上一题');
    assert.ok(html.includes('下一题'), '应有下一题');
    s.Test.answer(0);
    html = s.document._html;
    assert.ok(html.includes('第 1/8 题'), '选择选项后不应自动跳题');
    assert.ok(html.includes('已答 1/8'), '选择后已答应为 1');
    s.Test.nextQuestion();
    assert.ok(s.document._html.includes('第 2/8 题'), '下一题应跳到第 2 题');
    assert.ok(s.document._html.includes('上一题'), '第 2 题应有上一题');
    s.Test.prevQuestion();
    assert.ok(s.document._html.includes('第 1/8 题'), '上一题应回到第 1 题');
});

test('详情页：未答完拦截；答完出结果页且无重新测试按钮', () => {
    const s = makeTestSandbox();
    s.Test.render();
    s.Test.answers = [1];
    s.Test.currentIndex = 7;
    s.Test.complete();
    assert.ok(s.toasts.some(t => t.includes('还有 7 题未作答')), '未答完应提示, got: ' + s.toasts.join('|'));
    assert.ok(s.document._html.includes('第 2/8 题'), '应跳到第一道未答题');
    assert.ok(!s.document._html.includes('你的饺子人格'), '未完成不应出结果');

    s.Test.answers = [0, 1, 2, 3, 0, 1, 2, 3];
    s.Test.currentIndex = 7;
    s.Test.complete();
    const html = s.document._html;
    assert.ok(html.includes('你的饺子人格'), '完成后应展示结果页');
    assert.ok(html.includes('分享我的饺子人格'), '结果页应有分享按钮');
    assert.ok(!html.includes('重新测试'), '结果页不应有重新测试按钮');
    assert.strictEqual(s.sessionStorage.getItem('dumpling_test_done'), '1', '应保存完成标记');
});

test('详情页：已测试重进直接展示结果，不再出现介绍页', () => {
    const s = makeTestSandbox();
    s.Test.render();
    s.Test.answers = [0, 1, 2, 3, 0, 1, 2, 3];
    s.Test.currentIndex = 7;
    s.Test.complete();

    const s2 = makeTestSandbox(s.sessionStorage);
    s2.Test.render();
    assert.ok(s2.document._html.includes('你的饺子人格'), '已测试重进应直接展示结果');
    assert.ok(!s2.document._html.includes('开始测试'), '已测试不应再出现介绍页开始按钮');
    assert.ok(!s2.document._html.includes('重新测试'), '已测试不应有重新测试按钮');
});
