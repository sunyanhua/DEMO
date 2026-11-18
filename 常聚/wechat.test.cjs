/**
 * 常聚模拟微信外壳入口页测试（node wechat.test.cjs）
 * 两条演示路线：①全新用户点开小程序 ②群内组局邀请卡片
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
        sessionStorage: makeStorage(),
        navigator: {},
        setTimeout, clearTimeout
    };
    sandbox.window.document = document;
    sandbox.window.localStorage = sandbox.localStorage;
    sandbox.window.sessionStorage = sandbox.sessionStorage;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf('wechat.html'), sandbox);
    return sandbox;
}

test('new_user_card_renders', () => {
    const s = makeSandbox();
    assert.ok(s.document._html.includes('常聚'), '含小程序卡片');
    assert.ok(s.document._html.includes('常聚常伴，圈子不散'), '卡片含 SLOGAN');
    assert.ok(s.document._html.includes('试试'), '新用户场景话术存在');
});

test('invite_card_renders_with_proposal_info', () => {
    const s = makeSandbox();
    const p = s.window.GlobalData.proposals.find(x => x.id === 'p1');
    const circle = s.window.GlobalData.circles.find(c => c.id === p.circleId);
    assert.ok(s.document._html.includes(circle.name), '组局邀请卡含圈名');
    assert.ok(s.document._html.includes(p.timeCandidates[0].slice(5)), '邀请卡含局时间');
    assert.ok(s.document._html.includes('组局邀请'), '邀请卡标识');
});

test('enter_new_goes_auth_with_next', () => {
    const s = makeSandbox();
    s.window.WechatView.enterNew();
    assert.equal(s.window.location.href, 'auth.html?next=index.html%3Ftab%3Dzuju', '新用户先授权再进首页组局引导');
});

test('enter_invite_goes_auth_with_next', () => {
    const s = makeSandbox();
    s.window.WechatView.enterInvite();
    assert.equal(s.window.location.href, 'auth.html?next=vote.html%3Fproposal%3Dp1', '被邀请先授权再进表态页');
});
