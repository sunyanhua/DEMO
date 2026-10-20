/**
 * 私聊页测试（node chat.test.cjs）
 * 覆盖：带同款路线进入私聊（路线卡片+畅聊状态）、带路线发送私信、无路线时的留言限制回归。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function makePageSandbox(search) {
    // 元素桩：chat-container 记录追加的消息，message-input 提供输入值
    const elements = {};
    function el(id) {
        if (!elements[id]) {
            elements[id] = {
                _html: '',
                _children: [],
                value: '',
                className: '',
                scrollTop: 0,
                scrollHeight: 0,
                set innerHTML(v) { this._html = v; },
                get innerHTML() { return this._html; },
                appendChild(child) { this._children.push(child); },
                addEventListener() {},
                setAttribute() {},
                getAttribute() { return null; }
            };
        }
        return elements[id];
    }
    const document = {
        getElementById(id) { return el(id); },
        querySelectorAll() { return []; },
        createElement() { return { _html: '', className: '', innerHTML: '', appendChild() {} }; },
        addEventListener() {},
        body: { appendChild() {}, removeChild() {} },
        execCommand() { return true; },
        get _html() { return el('app').innerHTML; },
        set _html(v) { el('app').innerHTML = v; }
    };
    const sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const toasts = [];
    const iconInitCalls = [];
    const sandbox = {
        window: { scrollY: 0, scrollTo() {}, location: { href: '', search: search || '', pathname: 'chat.html' } },
        document,
        sessionStorage,
        URLSearchParams,
        setTimeout: (fn) => fn(),
        Math,
        Date
    };
    sandbox.window.sessionStorage = sessionStorage;
    sandbox.window.document = document;
    sandbox.window.Common = {
        renderBottomNav: () => '<div class="__bottom_nav__"></div>',
        initIcons() { iconInitCalls.push(1); },
        showToast: (msg) => toasts.push(msg)
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    const html = fs.readFileSync(path.join(dir, 'chat.html'), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
    vm.runInContext(inline, sandbox);
    // vm 环境不触发 DOMContentLoaded，主动渲染页面
    vm.runInContext('window.render()', sandbox);
    return { document, elements, toasts, iconInitCalls, sendMessage: sandbox.window.sendMessage, closeRouteHint: sandbox.window.closeRouteHint };
}

test('带同款路线进入私聊：路线卡片 + 畅聊状态 + 搭子信息', () => {
    const { document } = makePageSandbox('?uid=f1&name=胡同观察员&route=r2');
    const html = document._html;
    assert.ok(html.includes('你们因这条路线相识'), '应展示同款路线相识提示');
    assert.ok(html.includes('鼓楼南锣鼓巷夜景与什刹海小吃'), '路线卡应含路线名');
    assert.ok(html.includes('约 200 元/人'), '路线卡应含预算');
    assert.ok(html.includes('胡同观察员'), '应展示搭子昵称');
    assert.ok(html.includes('你们已经互相关注，可以进行畅聊了'), '匹配搭子应可畅聊');
    assert.ok(!html.includes('只能互相留言一次'), '路线场景不应是留言一次限制');
    assert.ok(html.includes('同款路线'), '输入框上方应有同款路线卡片提示');
    assert.ok(!html.includes('paperclip') && !html.includes('attach-toggle'), '不应是胶囊开关形式');
    assert.ok(html.includes('closeRouteHint') && html.includes('data-lucide="x"'), '路线卡片右侧应有×关闭图标');
    assert.ok(html.includes('pb-2.5'), '路线卡片与输入框之间应有间距');
});

test('不带路线进入私聊：保持留言一次限制（回归）', () => {
    const { document } = makePageSandbox('?uid=f1&name=胡同观察员');
    const html = document._html;
    assert.ok(html.includes('只能互相留言一次'), '无路线时应保持留言限制');
    assert.ok(!html.includes('你们因这条路线相识'), '无路线时不应有路线卡');
});

test('发送私信：消息气泡上方有路线胶囊链接可跳转', () => {
    const { document, iconInitCalls, sendMessage } = makePageSandbox('?uid=f1&name=胡同观察员&route=r2');
    document.getElementById('message-input').value = '周末一起走这条？';
    const initBefore = iconInitCalls.length;
    sendMessage();
    const container = document.getElementById('chat-container');
    assert.ok(container._children.length >= 1, '应追加发送的消息');
    const bubble = container._children[0].innerHTML;
    assert.ok(bubble.includes('周末一起走这条？'), '消息应含输入文本');
    assert.ok(bubble.includes('href="weekend-route.html?view=detail&route=r2"'), '气泡上方应有路线胶囊链接');
    assert.ok(bubble.includes('data-lucide="link"'), '胶囊链接前应有链接图标');
    assert.ok(bubble.includes('鼓楼南锣鼓巷夜景与什刹海小吃'), '胶囊链接应含路线名');
    assert.ok(bubble.includes('约 200 元/人'), '胶囊链接应含预算');
    assert.ok(iconInitCalls.length > initBefore, '发送后应重新初始化图标（气泡内 lucide 图标才能渲染）');
});

test('关闭同款路线卡片后发送：不再带路线胶囊', () => {
    const { document, sendMessage, closeRouteHint } = makePageSandbox('?uid=f1&name=胡同观察员&route=r2');
    closeRouteHint();
    assert.ok(!document._html.includes('同款路线'), '关闭后路线卡片提示应消失');
    document.getElementById('message-input').value = '普通聊天';
    sendMessage();
    const bubble = document.getElementById('chat-container')._children[0].innerHTML;
    assert.ok(bubble.includes('普通聊天'));
    assert.ok(!bubble.includes('weekend-route.html'), '关闭路线卡片后发送不应带路线胶囊');
});

test('空消息不发送', () => {
    const { document, sendMessage } = makePageSandbox('?uid=f1&name=胡同观察员&route=r2');
    document.getElementById('message-input').value = '   ';
    sendMessage();
    assert.strictEqual(document.getElementById('chat-container')._children.length, 0, '空消息不应追加');
});
