/**
 * 常聚曲水流觞游戏引擎测试（node liushang.test.cjs）
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadLiushang() {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(__dirname, 'liushang.js'), 'utf8'), sandbox);
    return sandbox.window.Liushang;
}
const L = loadLiushang();

test('duration_within_range_for_edge_rng', () => {
    assert.equal(L.driftDuration({ rng: () => 0 }), 8000, 'rng=0 得 min');
    assert.equal(L.driftDuration({ rng: () => 0.5 }), 14000, '中点均匀');
    const nearMax = L.driftDuration({ rng: () => 0.999 });
    assert.ok(nearMax >= 19900 && nearMax <= 20000, 'rng→1 逼近 max');
});

test('stopIndex_bounds_and_rng', () => {
    assert.equal(L.stopIndex({ memberCount: 5, rng: () => 0 }), 0);
    assert.equal(L.stopIndex({ memberCount: 5, rng: () => 0.5 }), 2);
    assert.equal(L.stopIndex({ memberCount: 5, rng: () => 0.99 }), 4, '上限不越界');
});

test('drawCard_four_types_exist', () => {
    const types = new Set();
    for (let i = 0; i < 200; i++) {
        const c = L.drawCard({ rng: Math.random });
        assert.ok(['truth', 'dare', 'act', 'poem'].includes(c.type), 'type 恒合法');
        assert.ok(typeof c.text === 'string' && c.text.length > 0, '文案非空');
        types.add(c.type);
    }
    assert.equal(types.size, 4, '四类觞令卡均可抽到');
});
