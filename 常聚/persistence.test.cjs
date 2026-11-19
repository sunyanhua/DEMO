/**
 * 常聚跨页持久化测试（node persistence.test.cjs）
 * 评审 C1：Common.load() 必须在页面加载时自动恢复状态，新建圈子/提案跨"页面导航"存活
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function makeStorage(seed) {
    const m = {};
    if (seed) Object.keys(seed).forEach(k => { m[k] = seed[k]; });
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

// 沙箱 A/B 共用一份 localStorage（模拟同一浏览器的两次页面加载）
function makeSandbox(storage) {
    const document = makeDocument();
    const sandbox = {
        window: { location: { href: '', reload() {} } },
        document,
        localStorage: storage,
        navigator: {},
        URLSearchParams,
        setTimeout, clearTimeout
    };
    sandbox.window.document = document;
    sandbox.window.localStorage = storage;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'rotation.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'recommend.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'zuju.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf('create.html'), sandbox);
    return sandbox;
}

test('save_then_fresh_load_restores_state', () => {
    const storage = makeStorage();
    // 第一次"页面"：建圈 + 发提案 + 保存
    const sA = makeSandbox(storage);
    const c = sA.window.CreateCircle.submit({ name: '持久化圈', type: 'dinner', mode: 'blank' });
    sA.window.CreateCircle.simulateJoin(c.id);
    const p = sA.window.Zuju.buildProposalManual({ circleId: c.id, projectId: 'p3', venueIds: ['v6', 'v4'], times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'] });
    sA.window.Common.save();

    // 第二次"页面"：全新沙箱（重新执行 data.js），只共享 localStorage
    const sB = makeSandbox(storage);
    assert.ok(sB.window.GlobalData.circles.some(x => x.id === c.id), '新建圈子跨页存活');
    const rc = sB.window.GlobalData.circles.find(x => x.id === c.id);
    assert.equal(rc.members.length, 4, '圈子成员完整恢复');
    assert.equal(rc.hostId, c.hostId, '当值状态恢复');
    assert.ok(sB.window.GlobalData.proposals.some(x => x.id === p.id), '提案跨页存活');
    assert.equal(sB.window.GlobalData.circles.find(x => x.id === 'c1').proposalId, 'p1', '基础数据不受影响');
});

test('load_without_snapshot_is_noop', () => {
    const s = makeSandbox(makeStorage());
    const baseCircles = s.window.GlobalData.circles.length;
    assert.equal(baseCircles, 3, '无存储时保留初始数据');
});

test('load_merges_seed_and_snapshot', () => {
    // 快照只含 g1（旧数据）；种子新增 g5——恢复后两者都在（按 id 合并，快照覆盖同 id）
    const storage = makeStorage({ 'cj.data': JSON.stringify({ gatherings: [{ id: 'g1', title: '快照版标题', photos: [], done: true }], circles: [], proposals: [], bills: [], notifications: [] }) });
    const s = makeSandbox(storage);
    const G = s.window.GlobalData;
    const g1 = G.gatherings.find(g => g.id === 'g1');
    const g5 = G.gatherings.find(g => g.id === 'g5');
    assert.ok(g1 && g1.title === '快照版标题', '同 id 快照覆盖种子');
    assert.ok(g5, '种子新增聚会保留（快照不整表覆盖）');
});
