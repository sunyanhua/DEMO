/**
 * 常聚年度回顾页测试（node memory.test.cjs）
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
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf('memory.html'), sandbox);
    return sandbox;
}

function seedCircle(s) {
    const G = s.window.GlobalData;
    G.circles.push({
        id: 'c9', name: '测试圈子', type: 'dinner', city: '北京', createdAt: '2026-01-01',
        ownerId: 'u1',
        members: [
            { id: 'u1', name: '阿Sun', avatarUrl: 'images/avatar-1.png', joinOrder: 1 },
            { id: 'm5', name: '老赵', avatarUrl: 'images/avatar-6.png', joinOrder: 2 },
            { id: 'm6', name: '陈陈', avatarUrl: 'images/avatar-7.png', joinOrder: 3 },
            { id: 'm7', name: '二狗', avatarUrl: 'images/avatar-8.png', joinOrder: 4 }
        ],
        hostId: 'u1', rhythm: null, lastGatheringId: null, proposalId: null
    });
    G.gatherings.push(
        { id: 't1', circleId: 'c9', title: '第一场', summary: '', projectId: 'p1', venueId: 'v1', time: '2026-01-10 18:00', attendees: ['u1', 'm5'], photos: [], buyMode: 'aa', payerId: null, billId: 'bt1' },
        { id: 't2', circleId: 'c9', title: '第二场', summary: '', projectId: 'p2', venueId: 'v2', time: '2026-03-15 18:00', attendees: ['u1', 'm5', 'm6'], photos: [], buyMode: 'aa', payerId: null, billId: null },
        { id: 't3', circleId: 'c9', title: '最后一场', summary: '', projectId: 'p3', venueId: 'v1', time: '2026-09-20 18:00', attendees: ['u1', 'm5', 'm6', 'm7'], photos: ['images/moment-1.jpg'], buyMode: 'random', payerId: 'm7', billId: 'bt2' }
    );
    G.bills.push(
        { id: 'bt1', gatheringId: 't1', entries: [
            { id: 'e1', title: '餐费', amount: 300, payerId: 'm5', participants: ['u1', 'm5'] },
            { id: 'e2', title: '酒水', amount: 100, payerId: 'm5', participants: ['u1', 'm5'] },
            { id: 'e3', title: '打车', amount: 60, payerId: 'm6', participants: ['u1', 'm5'] }
        ], settled: {} },
        { id: 'bt2', gatheringId: 't3', entries: [
            { id: 'e4', title: '餐费', amount: 400, payerId: 'm7', participants: ['u1', 'm5', 'm6', 'm7'] }
        ], settled: {} }
    );
    return s;
}

test('stats_correct', () => {
    const s = seedCircle(makeSandbox());
    const st = s.window.MemoryView.stats('c9');
    assert.equal(st.count, 3, '聚了 3 次');
    assert.equal(st.venueCount, 2, '去重地点 2 个');
    assert.equal(st.first.title, '第一场');
    assert.equal(st.last.title, '最后一场');
    const html = s.window.MemoryView.render('c9');
    assert.ok(html.includes('第一场') && html.includes('最后一场'), '首末场已展示');
});

test('pay_king_and_lucky', () => {
    const s = seedCircle(makeSandbox());
    const st = s.window.MemoryView.stats('c9');
    assert.equal(st.payKing.name, '老赵', '垫付之王按次数统计');
    assert.equal(st.payKing.count, 2);
    assert.equal(st.lucky, '二狗', '随机买单幸运儿');
    const html = s.window.MemoryView.render('c9');
    assert.ok(html.includes('老赵') && html.includes('二狗'), '回顾页展示两项彩蛋');
});

test('empty_state', () => {
    const s = makeSandbox();
    const G = s.window.GlobalData;
    G.circles.push({
        id: 'c0', name: '空圈子', type: 'dinner', city: '北京', createdAt: '2026-01-01',
        ownerId: 'u1', members: [{ id: 'u1', name: '阿Sun', avatarUrl: 'images/avatar-1.png', joinOrder: 1 }],
        hostId: 'u1', rhythm: null, lastGatheringId: null, proposalId: null
    });
    const html = s.window.MemoryView.render('c0');
    assert.ok(html.includes('还没有聚会记录'), '空态占位');
});

test('slogan_present', () => {
    const s = seedCircle(makeSandbox());
    const html = s.window.MemoryView.render('c9');
    assert.ok(html.includes('常聚常伴，圈子不散'), '封面含 SLOGAN');
});
