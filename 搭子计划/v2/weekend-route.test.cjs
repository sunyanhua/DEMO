/**
 * 定制周末路线表单测试（node weekend-route.test.cjs）
 * 在浏览器语义沙箱中执行 data.js + weekend-route.html 内联脚本，测试与线上运行完全相同的代码。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function makePageSandbox(options = {}) {
    const document = {
        _html: '',
        getElementById() { return document; },
        set innerHTML(v) { document._html = v; },
        get innerHTML() { return document._html; },
        querySelectorAll() { return []; },
        addEventListener() {}
    };
    const sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const sandbox = {
        window: { scrollY: 0, scrollTo() {} },
        document,
        sessionStorage,
        setTimeout: (fn) => fn()
    };
    sandbox.window.sessionStorage = sessionStorage;
    sandbox.window.document = document;
    // Common 桩：若页面调用 renderBottomNav，会渲染出 __bottom_nav__ 标记
    sandbox.window.Common = { renderBottomNav: () => '<div class="__bottom_nav__"></div>', initIcons() {} };
    vm.createContext(sandbox);
    if (options.emptyData) {
        sandbox.window.GlobalData = {};
    } else {
        vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    }
    const html = fs.readFileSync(path.join(dir, 'weekend-route.html'), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
    vm.runInContext(inline, sandbox);
    return { RouteForm: sandbox.window.RouteForm, document, GlobalData: sandbox.window.GlobalData };
}

// 选齐全部 7 项：situation=0 area=0 time=0 people=0 budget=0 partner=0 stranger=0
function selectAll(RouteForm) {
    RouteForm.select('situation', 0);
    RouteForm.select('area', 0);
    RouteForm.select('time', 0);
    RouteForm.select('people', 0);
    RouteForm.select('budget', 0);
    RouteForm.select('partner', 0);
    RouteForm.select('stranger', 0);
}

test('表单配置完整：4 种情况、4 个片区、5 组筛选', () => {
    const { GlobalData } = makePageSandbox();
    const form = GlobalData.weekendRouteForm;
    assert.strictEqual(form.situations.length, 4);
    for (const s of form.situations) {
        assert.ok(s.title && s.subtitle && s.icon, `情况 ${s.id} 字段不全`);
    }
    assert.strictEqual(form.areas.length, 4);
    for (const a of form.areas) {
        assert.ok(a.label && a.icon, `片区 ${a.id} 字段不全`);
    }
    assert.strictEqual(form.filters.length, 5);
    for (const f of form.filters) {
        assert.ok(f.label, `筛选 ${f.id} 缺少 label`);
        assert.ok(Array.isArray(f.options) && f.options.length >= 3, `筛选 ${f.id} 选项应至少 3 个`);
    }
});

test('初始渲染展示三个区块，提交按钮为未选齐禁用态', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    const html = document._html;
    assert.ok(html.includes('这次属于哪种情况？'));
    assert.ok(html.includes('想在哪片儿玩？'));
    assert.ok(html.includes('再补充筛选'));
    assert.ok(html.includes('本地周末'));
    assert.ok(html.includes('白塔寺 / 华熙 / 宫门口'));
    assert.ok(html.includes('什么时候有空'));
    assert.ok(html.includes('还差 7 项'), '未选时按钮应显示还差 7 项');
    assert.ok(!html.includes('onclick="RouteForm.submit()"'), '未选齐时提交按钮应禁用');
});

test('选齐全部 7 项后提交按钮可用，提交后展示所选摘要', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    selectAll(RouteForm);
    let html = document._html;
    assert.ok(html.includes('onclick="RouteForm.submit()"'), '选齐后提交按钮应可用');
    assert.ok(!html.includes('还差'), '选齐后不应再有缺项提示');
    RouteForm.submit();
    html = document._html;
    assert.ok(html.includes('敬请期待'), '提交后应展示路线生成占位');
    assert.ok(html.includes('本地周末'), '摘要应包含所选情况');
    assert.ok(html.includes('白塔寺 / 华熙 / 宫门口'), '摘要应包含所选片区');
    assert.ok(html.includes('周六上午'), '摘要应包含所选筛选值');
    assert.ok(html.includes('重新填写'), '结果视图应提供重新填写入口');
});

test('未选齐时提交不生效', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    RouteForm.select('situation', 1);
    RouteForm.submit();
    assert.ok(document._html.includes('还差 6 项'), '只选 1 项时应显示还差 6 项');
    assert.ok(!document._html.includes('敬请期待'), '未选齐提交不应出结果');
});

test('重新填写清空状态并回到表单', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    selectAll(RouteForm);
    RouteForm.submit();
    assert.ok(document._html.includes('敬请期待'));
    RouteForm.reset();
    const html = document._html;
    assert.ok(html.includes('这次属于哪种情况？'), '重置后应回到表单');
    assert.ok(html.includes('还差 7 项'), '重置后状态应清空');
    assert.strictEqual(RouteForm.selections.situation, null);
});

test('数据缺失时展示错误视图', () => {
    const { RouteForm, document } = makePageSandbox({ emptyData: true });
    RouteForm.render();
    assert.ok(document._html.includes('表单配置加载失败'));
    assert.ok(!document._html.includes('这次属于哪种情况？'));
});

test('页面不渲染底部主导航（表单/结果视图均无）', () => {
    const { RouteForm, document } = makePageSandbox();
    RouteForm.render();
    assert.ok(!document._html.includes('__bottom_nav__'), '表单视图不应有底部导航');
    selectAll(RouteForm);
    RouteForm.submit();
    assert.ok(!document._html.includes('__bottom_nav__'), '结果视图不应有底部导航');
});
