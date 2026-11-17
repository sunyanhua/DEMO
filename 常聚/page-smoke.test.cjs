/**
 * 常聚页面静态冒烟测试（node page-smoke.test.cjs）
 * 全站约束：零外链、本地资源齐全、公共外壳可加载
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

test('no_external_links', () => {
    assert.ok(htmlFiles.length >= 1, '至少存在一个 html 页面');
    for (const f of htmlFiles) {
        const text = fs.readFileSync(path.join(dir, f), 'utf8');
        assert.ok(!/https?:\/\//.test(text), `${f} 不得引用外链（零网络依赖）`);
    }
});

test('assets_resolved', () => {
    for (const f of htmlFiles) {
        const text = fs.readFileSync(path.join(dir, f), 'utf8');
        // 只扫描静态标记，剔除内联脚本（内含字符串拼接）
        const markup = text.replace(/<script[\s\S]*?<\/script>/g, '');
        for (const m of markup.matchAll(/(?:href|src)="([^"]+)"/g)) {
            const ref = m[1];
            if (ref.startsWith('#') || ref.startsWith('http') || ref.startsWith('?')) continue;
            const clean = ref.split('?')[0];
            assert.ok(fs.existsSync(path.join(dir, clean)), `${f} 引用的 ${clean} 不存在`);
        }
    }
});

test('shell_functions_render', () => {
    const sandbox = {
        window: {},
        document: {
            body: { innerHTML: '', appendChild() {} },
            getElementById() { return null; },
            createElement() { return { appendChild() {}, remove() {}, style: {}, classList: { add() {} } }; },
            addEventListener() {}
        },
        localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
        setTimeout, clearTimeout
    };
    sandbox.window.document = sandbox.document;
    sandbox.window.localStorage = sandbox.localStorage;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    const C = sandbox.window.Common, D = sandbox.window.Demo;
    for (const fn of ['renderShell', 'renderTabbar', 'showToast', 'showWechatNotice', 'save', 'load']) {
        assert.equal(typeof C[fn], 'function', `Common.${fn} 应为函数`);
    }
    for (const fn of ['toggle', 'advanceTime', 'simulateVotes', 'reset', 'getNow']) {
        assert.equal(typeof D[fn], 'function', `Demo.${fn} 应为函数`);
    }
});
