/**
 * 常聚 AA 账本页测试（node ledger.test.cjs）
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function makeStorage() {
    const m = {};
    return {
        getItem: k => (k in m ? m[k] : null),
        setItem: (k, v) => { m[k] = String(v); },
        removeItem: k => { delete m[k]; }
    };
}

function makeDocument() {
    const document = {
        _html: '',
        getElementById() { return document; },
        set innerHTML(v) { document._html = v; },
        get innerHTML() { return document._html; },
        querySelectorAll() { return []; },
        querySelector() { return null; },
        addEventListener() {},
        createElement() { return { appendChild() {}, remove() {}, style: {}, classList: { add() {} }, addEventListener() {} }; },
        body: { appendChild() {} }
    };
    return document;
}

function inlineScriptOf(file) {
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    return [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
}

function makeSandbox() {
    const document = makeDocument();
    const sandbox = {
        window: { location: { href: '' } },
        document,
        localStorage: makeStorage(),
        navigator: {},
        URLSearchParams,
        setTimeout, clearTimeout
    };
    sandbox.window.document = document;
    sandbox.window.localStorage = sandbox.localStorage;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'rotation.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'settle.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf('ledger.html'), sandbox);
    return sandbox;
}

test('add_entry_recomputes', () => {
    const s = makeSandbox();
    const bill = s.window.LedgerView.getBill('g2');
    const before = s.window.Settle.computeShares({ entries: bill.entries, memberIds: ['u1', 'm5', 'm6', 'm7'] });
    s.window.LedgerView.addEntry('g2', { title: '打车', amount: 60, payerId: 'u1', participants: ['u1', 'm5'] });
    const after = s.window.Settle.computeShares({ entries: bill.entries, memberIds: ['u1', 'm5', 'm6', 'm7'] });
    assert.equal(after.u1.pay, before.u1.pay + 60, '新条目计入垫付');
    assert.equal(after.m5.receive, before.m5.receive + 30, '新条目计入分摊');
});

test('consolidate_rendered_minimal', () => {
    const s = makeSandbox();
    const bill = s.window.LedgerView.getBill('g2');
    const expected = s.window.Settle.consolidate(
        s.window.Settle.computeShares({ entries: bill.entries, memberIds: ['u1', 'm5', 'm6', 'm7'] })
    );
    assert.ok(expected.length >= 1, '存在转账');
    const html = s.window.LedgerView.render('g2');
    const count = (html.match(/cj-transfer/g) || []).length;
    assert.equal(count, expected.length, 'HTML 结算清单笔数与合并结果一致');
});

test('random_buy_wheel', () => {
    const s = makeSandbox();
    s.window.LedgerView.setBuyMode('g2', 'random', { rng: () => 0.99 });
    const g2 = s.window.GlobalData.gatherings.find(g => g.id === 'g2');
    assert.equal(g2.buyMode, 'random');
    assert.equal(g2.payerId, 'm7', 'rng 决定中奖者');
    const html = s.window.LedgerView.render('g2');
    assert.ok(html.includes('二狗'), 'HTML 含中奖者名');
});

test('state_badge_updates', () => {
    const s = makeSandbox();
    ['u1', 'm5', 'm6', 'm7'].forEach(id => s.window.LedgerView.markSettled('g2', id));
    const bill = s.window.LedgerView.getBill('g2');
    assert.equal(s.window.Settle.billState({ bill, settled: bill.settled }), 'settled');
    const html = s.window.LedgerView.render('g2');
    assert.ok(html.includes('已结清'), '三态徽标已结清');
});

test('gentle_copy', () => {
    const s = makeSandbox();
    const html = s.window.LedgerView.render('g2');
    assert.ok(html.includes('不着急'), '未结清文案轻松');
    assert.ok(!html.includes('催'), '不出现催债字眼');
});
