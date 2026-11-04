/**
 * 奇遇华熙专题页流程测试（node qiyu-huaxi.test.cjs）
 * 在浏览器语义沙箱中执行 data.js + dumpling-quiz-data.js + dumpling-data.js + qiyu-huaxi-data.js + dumpling-test.js + 页面内联脚本，
 * 覆盖：题库与饺子完全一致、转盘抽好运（完成测试门槛/仅一次/加权落定/持久化）、
 * 抽中运气解锁对应券（未解锁拦截/领取/持久化）、有奖分享主体为奇遇华熙、演示清空全量重置。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

// 内存版 sessionStorage：模拟"完成测试/抽奖后重进页面"的持久化
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

// 加载 data.js + 题库 + 饺子数据（测验引擎依赖 GlobalData.dumpling）+ 奇遇华熙数据 + 测验引擎
function runBase(sandbox) {
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-quiz-data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'qiyu-huaxi-data.js'), 'utf8'), sandbox);
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
    vm.runInContext(inlineScriptOf('qiyu-huaxi.html'), sandbox);
    return { View: sandbox.window.View, document, sessionStorage, toasts, window: sandbox.window };
}

// 模拟页面加载：恢复状态 + 渲染
function renderView(s) {
    s.View.restoreTestState();
    s.View.restoreSpinState();
    s.View.render();
    return s.document._html;
}

// 在沙箱中直接完成测试（答满 8 题）并模拟从详情页返回（恢复摘要态）
function completeQuiz(s) {
    s.View.startQuiz();
    s.View.quiz.answers = [0, 1, 2, 3, 0, 1, 2, 3];
    s.View.quiz.currentIndex = 7;
    s.View.nextQuestion(); // 完成测试（真实环境跳转详情页）
    s.View.restoreTestState();
    s.View.render();
}

test('数据：题库与饺子完全一致，六种好运各对应一组华熙商户券（每组多张）', () => {
    const s = makeViewSandbox();
    const G = s.window.GlobalData;
    assert.ok(G.qiyuHuaxi, '应有奇遇华熙数据');
    assert.strictEqual(G.qiyuHuaxi.questions.length, G.dumpling.questions.length, '题目数量应与饺子一致');
    assert.deepStrictEqual(JSON.parse(JSON.stringify(G.qiyuHuaxi.questions)), JSON.parse(JSON.stringify(G.dumpling.questions)), '题目内容应与饺子完全一致');
    assert.strictEqual(G.qiyuHuaxi.personalities.length, G.dumpling.personalities.length, '人格数量应与饺子一致');
    // 六种好运 → 各自对应一组券，每组至少两张
    assert.strictEqual(G.qiyuHuaxi.fortunes.length, 6, '应有六种好运');
    assert.strictEqual(new Set(G.qiyuHuaxi.fortunes.map(f => f.id)).size, 6, '好运 id 应唯一');
    assert.ok(G.qiyuHuaxi.coupons.length > 6, '每种好运应有多张优惠券');
    for (const f of G.qiyuHuaxi.fortunes) {
        const group = G.qiyuHuaxi.coupons.filter(x => x.luckId === f.id);
        assert.ok(group.length >= 2, '每种好运的券不应少于两张: ' + f.id);
        for (const c of group) {
            assert.ok(c.shop && c.title && c.value && c.short && c.deadline && c.mode && c.code, '券字段应完整');
            assert.strictEqual(c.mode, 'qr', '核销应统一为二维码形式: ' + c.id);
        }
    }
});

test('默认渲染：奇遇华熙头部 + 转盘入口，未抽奖不出优惠券', () => {
    const s = makeViewSandbox();
    const html = renderView(s);
    assert.ok(html.includes('奇遇华熙'), '头部应有奇遇华熙标题');
    assert.ok(!html.includes('天之"饺"子') && !html.includes('立冬偷吃饺子小赛'), '不应出现饺子专题标题');
    assert.ok(html.includes('马上开始测试'), '未测试应展示引导卡');
    assert.ok(html.includes('奇遇大转盘') && html.includes('转盘抽好运'), '应有转盘抽好运入口');
    assert.ok(html.includes('完成人格测试后可参与转盘抽好运领券'), '未测试应提示先完成测试');
    assert.ok(!html.includes('华熙国际影城') && !html.includes('专属好礼'), '未抽奖不应展示优惠券');
    assert.ok(html.includes('精选活动') && html.includes('有奖分享'), '应有双TAB');
});

test('转盘门槛：未完成测试不能抽奖也不能领券', () => {
    const s = makeViewSandbox();
    renderView(s);
    s.View.openWheel();
    assert.ok(s.toasts.some(t => t.includes('请先完成人格测试')), '未测试点转盘应提示');
    assert.ok(!s.document._html.includes('wheel-modal-card'), '未测试不应打开转盘弹窗');
    s.View.claimCoupon('qh1');
    assert.ok(s.toasts.some(t => t.includes('请先完成人格测试')), '未测试领券应提示');
    assert.strictEqual(s.sessionStorage.getItem('qiyu_coupon_claimed'), null, '未测试不应写入领取记录');
});

test('转盘抽好运：完成测试后可抽，仅一次机会，结果不出奖品只提示解锁', () => {
    const s = makeViewSandbox();
    renderView(s);
    completeQuiz(s);
    // 完成测试跳转详情页带回源标记（详情页返回时回奇遇华熙而非饺子专题）
    assert.strictEqual(s.window.location.href, 'dumpling-test.html?from=qiyu', '完成测试应带来源标记跳转详情页');
    // 完成测试后渲染：转盘入口无未测试提示
    let html = s.document._html;
    assert.ok(!html.includes('完成人格测试后可参与'), '已测试不应再提示先完成测试');
    // 打开弹窗并抽奖（沙箱无真实 DOM，直接落定结果）
    s.View.openWheel();
    html = s.document._html;
    assert.ok(html.includes('wheel-modal-card') && html.includes('点击中间按钮开始抽奖'), '应展示转盘弹窗');
    s.View.startSpin();
    assert.strictEqual(s.sessionStorage.getItem('qiyu_spin_used'), '1', '应记录已抽奖');
    const luckId = s.sessionStorage.getItem('qiyu_spin_luck');
    assert.ok(luckId && s.View.fortunes.some(f => f.id === luckId), '应落定到有效运气');
    html = s.document._html;
    assert.ok(html.includes('恭喜抽中') && html.includes('优惠券已解锁，请选择领取'), '中奖结果只提示运气与解锁，不出奖品');
    // 再抽拒绝：每人仅一次
    s.View.startSpin();
    assert.ok(s.toasts.some(t => t.includes('每人仅有一次抽奖机会')), '重复抽奖应被拒绝');
    // 关闭弹窗：券区展示已抽运气，且仅该运气的券组出现（组内多张均可领取）
    s.View.closeWheel();
    html = s.document._html;
    assert.ok(html.includes('恭喜抽中「') && html.includes('已抽好运'), '券区应展示已抽中的运气');
    assert.ok(html.includes('专属好礼'), '券组应有专属好礼提示');
    const f = s.View.fortuneById(luckId);
    const group = s.View.coupons.filter(c => c.luckId === f.id);
    assert.ok(group.length >= 2, '抽中运气的券组应有多张');
    for (const c of group) {
        assert.ok(html.includes(`openConfirm('${c.id}')`), '组内每张券应可领取: ' + c.id);
    }
    // 未抽中运气的券组不应展示
    const other = s.View.coupons.find(c => c.luckId !== f.id);
    assert.ok(!html.includes(other.title), '未抽中运气的券组不应展示');
});

test('领券门控：二次确认 + 同组仅可领一张，已领后其余锁定且明显提示', () => {
    const s = makeViewSandbox();
    renderView(s);
    completeQuiz(s);
    s.View.openWheel();
    s.View.startSpin();
    s.View.closeWheel();
    const luckId = s.sessionStorage.getItem('qiyu_spin_luck');
    const group = s.View.coupons.filter(c => c.luckId === luckId);
    const first = group[0];
    // 领取需二次确认
    s.View.openConfirm(first.id);
    let html = s.document._html;
    assert.ok(html.includes('确认领取') && html.includes('再想想'), '领取应弹二次确认');
    assert.ok(html.includes('同一运气仅可领取一张，领取后不能更换'), '确认弹窗应提示同组仅一张');
    // 取消：不领取
    s.View.closeConfirm();
    assert.strictEqual(s.sessionStorage.getItem('qiyu_coupon_claimed'), null, '取消确认后不应领取');
    // 确认领取第一张
    s.View.openConfirm(first.id);
    s.View.claimCoupon(first.id);
    assert.ok(s.toasts.some(t => t.includes(first.shop) && t.includes('已领取')), '领取成功应提示');
    const claimed = JSON.parse(s.sessionStorage.getItem('qiyu_coupon_claimed') || '[]');
    assert.ok(claimed.includes(first.id), '领取记录应持久化');
    html = s.document._html;
    assert.ok(html.includes('已领取，去使用'), '已领取券应展示去使用');
    assert.ok(!html.includes('已领取 1 张') && !html.includes('其余已锁定'), '领取后不应再显示组横幅提示');
    assert.ok(html.includes('该运气已领取一张，不能再领'), '同组其余券卡片应锁定提示');
    // 同组第二张：卡片锁定不可领取，直接调用也拒绝
    const second = group[1];
    assert.ok(!html.includes(`openConfirm('${second.id}')`), '同组其余券不应再可领取');
    s.View.claimCoupon(second.id);
    assert.ok(s.toasts.some(t => t.includes('只能领取一张')), '同组第二张应被拒绝并提示');
    assert.strictEqual(JSON.parse(s.sessionStorage.getItem('qiyu_coupon_claimed') || '[]').length, 1, '领取记录应仅一张');
});

test('重进恢复：已抽奖用户重进页面恢复运气与领取状态', () => {
    const s1 = makeViewSandbox();
    renderView(s1);
    completeQuiz(s1);
    s1.View.openWheel();
    s1.View.startSpin();
    s1.View.closeWheel();
    const luckId = s1.sessionStorage.getItem('qiyu_spin_luck');
    const group = s1.View.coupons.filter(c => c.luckId === luckId);
    s1.View.claimCoupon(group[0].id);
    // 同一份 sessionStorage 重进页面
    const s2 = makeViewSandbox(s1.sessionStorage);
    const html = renderView(s2);
    assert.ok(html.includes('恭喜抽中「') && html.includes('已抽好运'), '重进应恢复已抽运气');
    assert.strictEqual(s2.View.spinLuck, luckId, '恢复的运气应与持久化一致');
    assert.ok(!html.includes('转盘抽好运'), '已抽奖不再显示转盘按钮');
    assert.ok(!html.includes('已领取 1 张') && html.includes('已领取，去使用'), '重进应恢复领取状态且不显示组横幅提示');
});

test('有奖分享：主体为奇遇华熙，无饺子话题', () => {
    const s = makeViewSandbox();
    renderView(s);
    s.View.switchTab('share');
    const html = s.document._html;
    assert.ok(html.includes('奇遇华熙有奖分享'), '应有奇遇华熙有奖分享卡片');
    assert.ok(html.includes('#奇遇华熙#'), '动态应带奇遇华熙话题');
    assert.ok(!html.includes('#我的饺子人格#'), '不应出现饺子话题');
    assert.ok(html.includes('有奖发布'), '有奖分享 TAB 应显示悬浮发布按钮');
    // 规则弹窗（奖项在弹窗内）
    s.View.openRules();
    const rulesHtml = s.document._html;
    assert.ok(rulesHtml.includes('活动规则') && rulesHtml.includes('12月15日'), '应有奇遇华熙活动规则弹窗');
    assert.ok(rulesHtml.includes('华熙国际影城双人观影月卡'), '奖项应为奇遇华熙好礼');
});

test('测试详情页：从奇遇华熙进入时返回回奇遇华熙，否则回饺子专题', () => {
    // 加载 dumpling-test.html 内联脚本（带 ?from=qiyu）
    function makeTestSandbox(search) {
        const sessionStorage = makeStorage();
        const document = makeDocument();
        const toasts = [];
        const sandbox = {
            window: { location: { href: '', search: search || '' } },
            document,
            sessionStorage,
            navigator: {},
            URLSearchParams
        };
        sandbox.window.sessionStorage = sessionStorage;
        sandbox.window.document = document;
        sandbox.window.Common = { initIcons() {}, showToast: (m) => toasts.push(m), drawQr() {} };
        vm.createContext(sandbox);
        vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
        vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-quiz-data.js'), 'utf8'), sandbox);
        vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-data.js'), 'utf8'), sandbox);
        vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-test.js'), 'utf8'), sandbox);
        vm.runInContext(inlineScriptOf('dumpling-test.html'), sandbox);
        return { Test: sandbox.window.Test, document, sandbox };
    }
    // 从奇遇华熙进入：返回奇遇华熙专题
    const fromQiyu = makeTestSandbox('?from=qiyu');
    assert.strictEqual(fromQiyu.Test.backHref(), 'qiyu-huaxi.html', '从奇遇华熙进入应返回奇遇华熙专题');
    fromQiyu.Test.render();
    assert.ok(fromQiyu.document._html.includes("href='qiyu-huaxi.html'"), '头部返回按钮应指向奇遇华熙');
    // 完成测试看结果页底部按钮
    fromQiyu.Test.answers = [0, 1, 2, 3, 0, 1, 2, 3];
    fromQiyu.Test.currentIndex = 7;
    fromQiyu.Test.complete();
    assert.ok(fromQiyu.document._html.includes('回活动页抽好运领券'), '底部按钮文案应为奇遇华熙版');
    // 默认/饺子专题进入：返回饺子专题
    const fromDumpling = makeTestSandbox('');
    assert.strictEqual(fromDumpling.Test.backHref(), 'dumpling.html', '无来源标记应返回饺子专题');
    fromDumpling.Test.answers = [0, 1, 2, 3, 0, 1, 2, 3];
    fromDumpling.Test.currentIndex = 7;
    fromDumpling.Test.complete();
    assert.ok(fromDumpling.document._html.includes('回活动页领优惠券'), '默认底部按钮文案应为饺子版');
});

test('部署兜底：dumpling-quiz-data.js / dumpling-data.js 漏传（404）时由 qiyu-huaxi-data.js 内嵌题库兜底', () => {
    const sessionStorage = makeStorage();
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
    vm.createContext(sandbox);
    // 模拟部署漏传：只加载 data.js + qiyu-huaxi-data.js + dumpling-test.js（不加载题库文件与 dumpling-data.js）
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'qiyu-huaxi-data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-test.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf('qiyu-huaxi.html'), sandbox);
    // 内嵌题库可用，且测验引擎依赖的 GlobalData.dumpling 被兜底补全
    assert.strictEqual(sandbox.window.GlobalData.qiyuHuaxi.questions.length, 8, '内嵌题库应有 8 道题');
    assert.strictEqual(sandbox.window.GlobalData.qiyuHuaxi.personalities.length, 8, '内嵌题库应有 8 种人格');
    assert.ok(sandbox.window.GlobalData.dumplingQuiz && sandbox.window.GlobalData.dumplingQuiz.questions.length === 8, 'dumplingQuiz 应被兜底补全');
    assert.ok(sandbox.window.GlobalData.dumpling && sandbox.window.GlobalData.dumpling.questions.length === 8, '引擎依赖的 dumpling 应被兜底补全');
    // 页面可渲染、可答题、可完成测试
    sandbox.window.View.restoreTestState();
    sandbox.window.View.restoreSpinState();
    sandbox.window.View.render();
    assert.ok(sandbox.document._html.includes('马上开始测试'), '漏传文件时页面仍可渲染');
    sandbox.window.View.startQuiz();
    assert.ok(sandbox.document._html.includes('第 1/8 题'), '漏传文件时仍可答题');
    sandbox.window.View.quiz.answers = [0, 1, 2, 3, 0, 1, 2, 3];
    sandbox.window.View.quiz.currentIndex = 7;
    sandbox.window.View.nextQuestion();
    assert.strictEqual(sandbox.window.location.href, 'dumpling-test.html?from=qiyu', '漏传文件时仍可完成测试');
});

test('清空（仅演示）：测试/抽奖/领券状态全量重置', () => {
    const s = makeViewSandbox();
    renderView(s);
    completeQuiz(s);
    s.View.openWheel();
    s.View.startSpin();
    const luckId = s.sessionStorage.getItem('qiyu_spin_luck');
    const c = s.View.coupons.find(x => x.luckId === luckId);
    s.View.claimCoupon(c.id);
    // 清空演示
    s.View.clearTest();
    assert.strictEqual(s.sessionStorage.getItem('dumpling_test_done'), null, '应清除测试完成标记');
    assert.strictEqual(s.sessionStorage.getItem('qiyu_spin_used'), null, '应清除抽奖记录');
    assert.strictEqual(s.sessionStorage.getItem('qiyu_spin_luck'), null, '应清除运气结果');
    assert.strictEqual(s.sessionStorage.getItem('qiyu_coupon_claimed'), null, '应清除领取记录');
    assert.strictEqual(s.View.spinLuck, null, '内存中运气应重置');
    const html = s.document._html;
    assert.ok(html.includes('马上开始测试'), '清空后应回到引导态');
    assert.ok(html.includes('转盘抽好运'), '清空后转盘入口应恢复');
});
