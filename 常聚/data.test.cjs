/**
 * 常聚 data.js 数据基座测试（node data.test.cjs）
 * vm 沙箱加载 data.js，校验 schema 完整性、引用一致性与 mock 配额
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function loadData() {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    return sandbox.window.GlobalData;
}

const G = loadData();

test('schema_venues_complete', () => {
    assert.ok(G.venues.length >= 1, 'venues 非空');
    for (const v of G.venues) {
        assert.equal(v.city, '北京', `${v.id} 城市必须为北京`);
        assert.ok(v.district, `${v.id} 缺 district`);
        assert.ok(v.businessArea, `${v.id} 缺 businessArea`);
        assert.ok(v.spendTier, `${v.id} 缺 spendTier`);
        assert.ok(v.category, `${v.id} 缺 category`);
    }
});

test('schema_circles_members_joinOrder', () => {
    assert.ok(G.circles.length >= 1, 'circles 非空');
    for (const c of G.circles) {
        assert.equal(c.ownerId, 'u1', `${c.id} ownerId 必须为 u1`);
        const orders = c.members.map(m => m.joinOrder).sort((a, b) => a - b);
        assert.deepEqual(orders, Array.from({ length: c.members.length }, (_, i) => i + 1),
            `${c.id} joinOrder 必须 1..n 连续`);
        assert.equal(new Set(c.members.map(m => m.id)).size, c.members.length, `${c.id} 成员 id 不得重复`);
        const ids = new Set(c.members.map(m => m.id));
        assert.ok(ids.has(c.hostId), `${c.id} hostId 必须属于圈内成员`);
    }
});

test('schema_refs_resolve', () => {
    const circles = new Set(G.circles.map(c => c.id));
    const projects = new Set(G.projects.map(p => p.id));
    const venues = new Set(G.venues.map(v => v.id));
    const bills = new Set(G.bills.map(b => b.id));
    for (const p of G.proposals) {
        assert.ok(circles.has(p.circleId), `proposal ${p.id} circleId 不存在`);
        assert.ok(projects.has(p.projectId), `proposal ${p.id} projectId 不存在`);
        for (const vid of p.venueIds) assert.ok(venues.has(vid), `proposal ${p.id} venueId ${vid} 不存在`);
    }
    for (const g of G.gatherings) {
        assert.ok(circles.has(g.circleId), `gathering ${g.id} circleId 不存在`);
        assert.ok(projects.has(g.projectId), `gathering ${g.id} projectId 不存在`);
        assert.ok(venues.has(g.venueId), `gathering ${g.id} venueId 不存在`);
        if (g.billId) assert.ok(bills.has(g.billId), `gathering ${g.id} billId 不存在`);
    }
    for (const b of G.bills) {
        assert.ok(G.gatherings.some(g => g.id === b.gatheringId), `bill ${b.id} gatheringId 不存在`);
    }
});

test('schema_mock_quota', () => {
    assert.ok(G.circles.length >= 3, '至少 3 个圈子');
    assert.ok(G.venues.length >= 12, '至少 12 个商户');
    assert.ok(G.venues.filter(v => v.isPartner).length >= 2, '至少 2 个合作商户');
    assert.ok(G.projects.length >= 12, '至少 12 个项目');
    assert.ok(G.gatherings.length >= 3, '至少 3 场聚会历史');
    assert.ok(G.proposals.some(p => p.status === 'open'), '至少 1 条进行中提案');
});
