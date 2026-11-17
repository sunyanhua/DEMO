/**
 * 常聚散场仪式与聚会记录测试（node record.test.cjs）
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
    vm.runInContext(inlineScriptOf('end-event.html'), sandbox);
    vm.runInContext(inlineScriptOf('record.html'), sandbox);
    return sandbox;
}

test('three_steps_order', () => {
    const s = makeSandbox();
    const html = s.window.EndView.render('g2');
    const i1 = html.indexOf('①'), i2 = html.indexOf('②'), i3 = html.indexOf('③');
    assert.ok(i1 >= 0 && i2 >= 0 && i3 >= 0, '三步齐全');
    assert.ok(i1 < i2 && i2 < i3, '三步按顺序呈现');
});

test('draw_updates_host_and_visible', () => {
    const s = makeSandbox();
    const c2 = s.window.GlobalData.circles.find(c => c.id === 'c2');
    const before = c2.hostId;
    s.window.EndView.render('g2');
    s.window.EndView.draw('g2', () => 0.99);
    assert.notEqual(c2.hostId, before, '当值已交接');
    assert.ok(c2.members.some(m => m.id === c2.hostId), '新当值属于圈友');
    assert.ok(s.document._html.includes('下一任张罗'), '抽签结果展示下一任张罗');
});

test('record_card_fields', () => {
    const s = makeSandbox();
    s.window.EndView.finish('g2', {
        title: '十年之约，下次还聚',
        summary: '一个都没少',
        photos: ['images/moment-3.jpg', 'images/moment-4.jpg']
    });
    const G = s.window.GlobalData;
    const g2 = G.gatherings.find(g => g.id === 'g2');
    assert.equal(g2.title, '十年之约，下次还聚');
    assert.equal(g2.summary, '一个都没少');
    assert.equal(g2.photos.length, 2, '合影已落库');
    const c2 = G.circles.find(c => c.id === 'c2');
    assert.equal(c2.lastGatheringId, 'g2', '圈子记录已更新');
});

test('buymode_badge', () => {
    const s = makeSandbox();
    const html = s.window.RecordView.render('g4');
    assert.ok(html.includes('随机买单'), '随机买单徽标');
    assert.ok(html.includes('阿婷'), '本局由中奖者买单');
});
