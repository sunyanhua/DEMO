/**
 * 常聚 AA 账本引擎测试（node settle.test.cjs）
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadSettle() {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(__dirname, 'settle.js'), 'utf8'), sandbox);
    return sandbox.window.Settle;
}
const S = loadSettle();

test('shares_split_and_select', () => {
    const entries = [
        { id: 'e1', title: '火锅', amount: 300, payerId: 'A', participants: ['A', 'B', 'C'] },
        { id: 'e2', title: '酒水', amount: 200, payerId: 'B', participants: ['B', 'C'] }
    ];
    const shares = S.computeShares({ entries, memberIds: ['A', 'B', 'C'] });
    assert.deepEqual(shares.A, { pay: 300, receive: 100 }, 'A 垫付 300、摊 100');
    assert.deepEqual(shares.B, { pay: 200, receive: 200 }, 'B 垫付 200、摊 100+100');
    assert.deepEqual(shares.C, { pay: 0, receive: 200 }, '按人勾选：C 只摊参与的笔');
});

test('addEntry_appends_immutably', () => {
    const bill = { id: 'b1', gatheringId: 'g1', entries: [], settled: {} };
    const next = S.addEntry(bill, { title: '加餐', amount: 100, payerId: 'A', participants: ['A', 'B'] });
    assert.equal(bill.entries.length, 0, '原对象不被修改');
    assert.equal(next.entries.length, 1, '新对象追加一笔');
    assert.equal(next.entries[0].amount, 100);
    assert.notEqual(next, bill);
});

test('consolidate_chain', () => {
    const r = S.consolidate({
        A: { pay: 100, receive: 0 },
        B: { pay: 100, receive: 100 },
        C: { pay: 0, receive: 100 }
    });
    assert.deepEqual(r, [{ from: 'C', to: 'A', amount: 100 }], '链式债务合并为一笔');
});

test('consolidate_cycle', () => {
    const r = S.consolidate({
        A: { pay: 100, receive: 100 },
        B: { pay: 100, receive: 100 },
        C: { pay: 100, receive: 100 }
    });
    assert.deepEqual(r, [], '环式债务净额全 0');
});

test('consolidate_minimal_count', () => {
    const r = S.consolidate({
        u1: { pay: 500, receive: 100 },  // 净 +400 应收
        u2: { pay: 100, receive: 300 },  // 净 -200 应付
        u3: { pay: 0, receive: 150 },    // 净 -150 应付
        u4: { pay: 0, receive: 50 },     // 净 -50 应付
        u5: { pay: 0, receive: 0 }
    });
    assert.ok(r.length <= 4, '笔数不超过人数-1');
    const fromSum = r.reduce((s, t) => s + t.amount, 0);
    assert.equal(fromSum, 400, '应付总额账平');
    const toSum = r.reduce((s, t) => s + t.amount, 0);
    assert.equal(toSum, 400);
    assert.ok(r.every(t => t.to === 'u1'), '唯一应收方为 u1');
});

test('drawPayer_respects_rng', () => {
    const ids = ['A', 'B', 'C'];
    assert.equal(S.drawPayer({ memberIds: ids, rng: () => 0 }), 'A');
    assert.equal(S.drawPayer({ memberIds: ids, rng: () => 0.99 }), 'C');
});

test('billState_three_states', () => {
    const bill = {
        id: 'b1', gatheringId: 'g1',
        entries: [{ id: 'e1', title: '餐费', amount: 400, payerId: 'A', participants: ['A', 'B'] }],
        settled: {}
    };
    assert.equal(S.billState({ bill, settled: {} }), 'pending', '无结清标记→pending');
    assert.equal(S.billState({ bill, settled: { A: true } }), 'partial', '部分结清→partial');
    assert.equal(S.billState({ bill, settled: { A: true, B: true } }), 'settled', '全员结清→settled');
});
