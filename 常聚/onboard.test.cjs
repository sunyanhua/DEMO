/**
 * 常聚手机号授权 + 注册页测试（node onboard.test.cjs）
 * 两条路线共用：授权弹层（auth.html）→ 注册资料（register.html）→ 跳回目标页
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

function makeSandbox(page, storageSeed) {
    const document = makeDocument();
    const sandbox = {
        window: { location: { href: '' } },
        document,
        localStorage: makeStorage(),
        sessionStorage: makeStorage(storageSeed),
        navigator: {},
        URLSearchParams,
        setTimeout, clearTimeout
    };
    sandbox.window.document = document;
    sandbox.window.localStorage = sandbox.localStorage;
    sandbox.window.sessionStorage = sandbox.sessionStorage;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf(page), sandbox);
    return sandbox;
}

test('auth_renders_phone_sheet', () => {
    const s = makeSandbox('auth.html');
    assert.ok(s.document._html.includes('申请获取你的手机号'), '授权弹层标题');
    assert.ok(s.document._html.includes('允许'), '有允许按钮');
    assert.ok(s.document._html.includes('不同意'), '有拒绝入口');
    assert.ok(s.document._html.includes('138 **** 8000'), '手机号脱敏展示');
});

test('auth_allow_sets_authed_and_redirects_to_register', () => {
    const s = makeSandbox('auth.html');
    s.window.AuthView._next = 'vote.html?proposal=p1';
    s.window.AuthView.allow();
    assert.equal(s.sessionStorage.getItem('cj_authed'), '1', '授权状态已记录');
    assert.equal(s.window.location.href, 'register.html?next=vote.html%3Fproposal%3Dp1', '跳注册页并带目标');
});

test('auth_deny_no_authed', () => {
    const s = makeSandbox('auth.html');
    s.window.AuthView.deny();
    assert.equal(s.sessionStorage.getItem('cj_authed'), null, '拒绝不记录授权');
});

test('auth_preauthed_skips', () => {
    const s = makeSandbox('auth.html', { cj_authed: '1' });
    s.window.AuthView._next = 'index.html?new=1';
    s.window.AuthView.skipIfAuthed();
    assert.equal(s.window.location.href, 'index.html?new=1', '已授权直接跳目标页');
});

test('register_submit_persists_user_and_redirects', () => {
    const s = makeSandbox('register.html');
    s.window.RegisterView._next = 'index.html?new=1';
    s.window.RegisterView.submit({ name: '新朋友', avatar: 'images/avatar-5.png' });
    const saved = JSON.parse(s.localStorage.getItem('cj.user'));
    assert.equal(saved.name, '新朋友');
    assert.equal(saved.avatar, 'images/avatar-5.png');
    assert.equal(s.window.location.href, 'index.html?new=1', '注册完成跳目标页');
});

test('register_renders_avatar_pool_and_phone', () => {
    const s = makeSandbox('register.html');
    assert.ok(s.document._html.includes('完善资料'), '资料页标题');
    assert.ok((s.document._html.match(/avatar-\d+\.png/g) || []).length >= 12, '头像池至少 12 个');
    assert.ok(s.document._html.includes('138 **** 8000'), '手机号回显');
});
