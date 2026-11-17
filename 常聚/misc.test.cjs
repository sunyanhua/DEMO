/**
 * 常聚消息中心与我的页测试（node misc.test.cjs）
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
        window: { location: { href: '', reload() {} } },
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
    vm.runInContext(inlineScriptOf('message.html'), sandbox);
    vm.runInContext(inlineScriptOf('me.html'), sandbox);
    return sandbox;
}

test('notifications_grouped_three_types', () => {
    const s = makeSandbox();
    const html = s.window.MessageView.render();
    const iRhythm = html.indexOf('该张罗啦');
    const iRespond = html.indexOf('等你表态');
    const iMiss = html.indexOf('想念大家了');
    assert.ok(iRhythm >= 0 && iRespond >= 0 && iMiss >= 0, '三类分组齐全');
    assert.ok(iRhythm < iRespond && iRespond < iMiss, '分组顺序 rhythm>respond>miss');
});

test('read_mark', () => {
    const s = makeSandbox();
    s.window.MessageView.markRead('n1');
    const n1 = s.window.GlobalData.notifications.find(n => n.id === 'n1');
    assert.equal(n1.read, true, '标记已读');
});

test('rhythm_setting_persists', () => {
    const s = makeSandbox();
    s.window.MeView.setRhythm('c1', { unit: 'month', n: 1 });
    const c1 = s.window.GlobalData.circles.find(c => c.id === 'c1');
    assert.deepEqual(c1.rhythm, { unit: 'month', n: 1 }, '节律已落库');
    s.window.MeView.setRhythm('c1', null);
    assert.equal(c1.rhythm, null, '节律可取消');
});

test('pass_host_button', () => {
    const s = makeSandbox();
    const c2 = s.window.GlobalData.circles.find(c => c.id === 'c2');
    const before = c2.hostId;
    s.window.MeView.passHost('c2');
    assert.notEqual(c2.hostId, before, '顺延后当值变化');
    assert.ok(c2.members.some(m => m.id === c2.hostId), '新当值属于圈友');
});

test('me_onclick_attributes_compile', () => {
    const s = makeSandbox();
    const html = s.window.MeView.render();
    const attrs = [...html.matchAll(/onclick="([^"]+)"/g)].map(m => m[1]);
    assert.ok(attrs.length >= 5, '存在足够的交互按钮');
    attrs.forEach(code => {
        assert.doesNotThrow(() => new Function('window', code), 'onclick 可编译：' + code.slice(0, 60));
    });
});

test('demo_panel_actions', () => {
    const s = makeSandbox();
    s.window.Demo.advanceTime(24);
    assert.equal(s.localStorage.getItem('cj.clock'), '24', '虚拟时钟推进 24h');
    s.window.Demo.reset();
    assert.equal(s.localStorage.getItem('cj.clock'), null, '重置清空时钟');
    assert.equal(s.localStorage.getItem('cj.data'), null, '重置清空数据');
});
