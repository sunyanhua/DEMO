/**
 * 常聚现场小游戏测试（node game.test.cjs）
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
    vm.runInContext(fs.readFileSync(path.join(dir, 'liushang.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf('game-liushang.html'), sandbox);
    vm.runInContext(inlineScriptOf('game-wheel.html'), sandbox);
    return sandbox;
}

test('liushang_stop_then_card', () => {
    const s = makeSandbox();
    s.window.LiushangView.render();
    s.window.LiushangView.stop(() => 0.5);
    assert.ok(s.document._html.includes('觞令卡'), '停杯弹出觞令卡');
    assert.ok(s.window.LiushangView._card && s.window.LiushangView._card.text, '卡片有文案');
    s.window.LiushangView.driftStart();
    assert.ok(!s.document._html.includes('觞令卡'), '再漂一轮卡片消失');
});

test('liushang_card_type_valid', () => {
    const s = makeSandbox();
    s.window.LiushangView.render();
    s.window.LiushangView.stop(() => 0.5);
    const card = s.window.LiushangView._card;
    assert.ok(['truth', 'dare', 'act', 'poem'].includes(card.type), '卡片类型合法');
    assert.ok(s.document._html.includes(card.text), '页面展示卡片文案');
});

test('wheel_segments_and_result', () => {
    const s = makeSandbox();
    s.window.WheelView.render();
    const html = s.document._html;
    for (const label of ['谁点菜', '谁讲一个秘密', '真心话', '喝一杯', '全场干杯', '免死金牌']) {
        assert.ok(html.includes(label), '转盘渲染段：' + label);
    }
    s.window.WheelView.spin(() => 0.99);
    assert.equal(s.window.WheelView._result, '免死金牌', 'rng 决定停格');
    assert.ok(s.document._html.includes('免死金牌'), '结果已展示');
});
