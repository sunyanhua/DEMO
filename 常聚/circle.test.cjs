/**
 * 常聚圈子主页测试（node circle.test.cjs）
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
    vm.runInContext(inlineScriptOf('circle.html'), sandbox);
    return sandbox;
}

test('timeline_renders_desc', () => {
    const s = makeSandbox();
    const html = s.window.CircleView.render('c1');
    const g1 = html.indexOf('2026-11-08');
    const g4 = html.indexOf('2026-10-11');
    assert.ok(g1 >= 0 && g4 >= 0, '两次聚会均在时间轴');
    assert.ok(g1 < g4, '时间倒序：较近的聚会在前');
});

test('host_card_due_state', () => {
    const s = makeSandbox();
    const due = s.window.CircleView.render('c3');
    assert.ok(due.includes('该张罗啦'), '超节律圈显示该张罗啦');
    const c1 = s.window.GlobalData.circles.find(c => c.id === 'c1');
    c1.rhythm = null;
    const noRhythm = s.window.CircleView.render('c1');
    assert.ok(!noRhythm.includes('该张罗啦'), '无节律圈不显示该张罗啦');
});

test('reminder_has_photo', () => {
    const s = makeSandbox();
    const html = s.window.CircleView.render('c3');
    assert.ok(html.includes('moment-5.jpg'), '思念提醒含上次聚会合影');
});

test('miss_button_creates_notification', () => {
    const s = makeSandbox();
    const before = s.window.GlobalData.notifications.length;
    s.window.CircleView.miss('c2');
    const G = s.window.GlobalData;
    assert.equal(G.notifications.length, before + 1, '新增一条通知');
    const last = G.notifications[G.notifications.length - 1];
    assert.equal(last.type, 'miss');
    assert.equal(last.circleId, 'c2');
});
