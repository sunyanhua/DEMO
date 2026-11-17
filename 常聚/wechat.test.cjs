/**
 * 常聚模拟微信外壳入口页测试（node wechat.test.cjs）
 * vm 沙箱加载 data.js + common.js + 页面内联脚本
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
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf('wechat.html'), sandbox);
    return sandbox;
}

test('card_renders_with_brand', () => {
    const s = makeSandbox();
    assert.ok(s.document._html.includes('常聚常伴，圈子不散'), '卡片含 SLOGAN');
    assert.ok(s.document._html.includes('常聚'), '卡片含产品名');
});

test('slogan_and_member_count', () => {
    const s = makeSandbox();
    const c1 = s.window.GlobalData.circles.find(c => c.id === 'c1');
    assert.ok(s.document._html.includes('群友 ' + c1.members.length + ' 人已加入'), '卡片人数取自 c1 成员数');
});

test('card_click_goes_circle', () => {
    const s = makeSandbox();
    assert.equal(typeof s.window.WechatView.enter, 'function', '暴露 enter 跳转函数');
    s.window.WechatView.enter();
    assert.equal(s.window.location.href, 'index.html', '点卡片进入常聚圈子列表');
});
