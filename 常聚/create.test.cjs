/**
 * 常聚建圈流程测试（node create.test.cjs）
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
        addEventListener() {},
        createElement() { return { appendChild() {}, remove() {}, style: {}, classList: { add() {} } }; },
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
        setTimeout, clearTimeout
    };
    sandbox.window.document = document;
    sandbox.window.localStorage = sandbox.localStorage;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'rotation.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'zuju.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf('create.html'), sandbox);
    return sandbox;
}

test('submit_validates_name', () => {
    const s = makeSandbox();
    const before = s.window.GlobalData.circles.length;
    const r = s.window.CreateCircle.submit({ name: '   ', type: 'mahjong', mode: 'template' });
    assert.equal(r, null, '空名返回 null');
    assert.equal(s.window.GlobalData.circles.length, before, '空名不生成圈子');
});

test('submit_creates_with_owner_as_host', () => {
    const s = makeSandbox();
    const r = s.window.CreateCircle.submit({ name: '新麻将局', type: 'mahjong', mode: 'blank' });
    assert.ok(r && r.id, '返回生成的圈子');
    assert.equal(r.ownerId, 'u1');
    assert.equal(r.hostId, 'u1', '建圈人首任当值张罗');
    assert.equal(r.city, '北京');
    assert.equal(r.members.length, 1);
    assert.equal(r.members[0].joinOrder, 1, 'joinOrder 从 1 起');
    assert.equal(s.window.GlobalData.circles.includes(r), true, '已挂入 GlobalData');
});

test('simulate_members_join', () => {
    const s = makeSandbox();
    const c = s.window.CreateCircle.submit({ name: '饭局新圈', type: 'dinner', mode: 'template' });
    s.window.CreateCircle.simulateJoin(c.id);
    assert.equal(c.members.length, 4, '3 位群友点卡入圈');
    const orders = c.members.map(m => m.joinOrder).sort((a, b) => a - b);
    assert.deepEqual(orders, [1, 2, 3, 4], 'joinOrder 连续');
});
