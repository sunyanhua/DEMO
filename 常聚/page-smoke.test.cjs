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
        // data URI 是本地内嵌资源（如 SVG 噪点的 xmlns 声明），先剥离再查外链
        const withoutDataUris = text.replace(/url\(["']?data:[^)]*\)/gi, '').replace(/data:[a-z-]+\/[a-z0-9.+-]+[^"'\s)]*/gi, '');
        assert.ok(!/https?:\/\//.test(withoutDataUris), `${f} 不得引用外链（零网络依赖）`);
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
    for (const fn of ['toggle', 'advanceTime', 'simulateVotes', 'simulateConfirms', 'reset', 'getNow']) {
        assert.equal(typeof D[fn], 'function', `Demo.${fn} 应为函数`);
    }
});

test('theme_has_universal_reset', () => {
    // 授权/注册向导页不加载 tailwind preflight，需靠 theme.css 全局 reset 消除浏览器默认边距（否则提示条图标与文字错位）
    const css = fs.readFileSync(path.join(dir, 'theme.css'), 'utf8');
    assert.ok(/^\*, \*::before, \*::after \{ box-sizing: border-box; margin: 0; padding: 0; \}/m.test(css), '全局 reset（border-box + margin/padding 归零）');
});

test('theme_defines_warm_tokens', () => {
    const css = fs.readFileSync(path.join(dir, 'theme.css'), 'utf8');
    for (const token of ['--cream', '--cream-deep', '--warm', '--warm-deep', '--warm-soft', '--seal', '--line', '--ink', '--caption']) {
        assert.ok(css.includes(token + ':'), `theme.css 定义 ${token}`);
    }
    for (const cls of ['.cj-pola', '.cj-ticket', '.cj-note', '.cj-host-card', '.cj-pill', '.cj-seal', '.cj-topbar', '.cj-anim-drop', '.cj-anim-fadeup', '.cj-float']) {
        assert.ok(css.includes(cls), `theme.css 定义 ${cls}`);
    }
    for (const kf of ['@keyframes cj-drop', '@keyframes cj-fadeup', '@keyframes cj-float']) {
        assert.ok(css.includes(kf), `theme.css 定义 ${kf}`);
    }
    // 动效节奏（慢速温情）
    assert.ok(css.includes('animation: cj-drop 1.1s'), '拍立得飘落 1.1s');
    assert.ok(css.includes('animation: cj-fadeup 0.85s'), '逐行浮现 0.85s');
    assert.ok(css.includes('animation: cj-float 6s'), '静置浮动 6s');
    // 步骤条大字 + 胶囊选中态保持圆角
    assert.ok(css.includes('.cj-step-label { font-size: 12px'), '步骤标签 12px 大字');
    assert.ok(/\.cj-step\s*\{[^}]*align-items: flex-start/.test(css), '步骤圆点顶部对齐（与连接线同轴，不受多行标签撑高影响）');
    assert.ok(/\.cj-step-line\s*\{[^}]*margin-top: 11px/.test(css), '连接线 11px 顶距对齐 24px 圆点中心');
    assert.ok(/\.cj-step-label\s*\{[^}]*(?<!min-)height: 24px/.test(css), '标签容器固定 24px 高（文字中心恒与圆点中心同轴）');
    assert.ok(/\.cj-step-label\s*\{[^}]*align-items: center/.test(css), '两行标签上下居中对齐');
    assert.ok(/\.cj-chip,\s*[^{}]*\.cj-chip-warm\s*\{[^}]*border-radius: 999px/.test(css), 'cj-chip-warm 与 cj-chip 共享圆角形状');
    assert.ok(!css.includes('cj-statusbar') && !css.includes('cj-capsule'), '无小程序外壳残留');
});

test('outline_buttons_span_content_width', () => {
    // 独立描边按钮（建圈子/去AA账本）与内容区（圈卡列表）同宽，不用自适应小按钮
    const index = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.ok(/cj-btn-outline"\s+style="width:100%/.test(index), 'index.html 建圈子按钮与内容区同宽');
    const record = fs.readFileSync(path.join(dir, 'record.html'), 'utf8');
    assert.ok(/cj-btn-outline"\s+style="width:100%/.test(record), 'record.html 去AA账本按钮与内容区同宽');
});

test('cjpx_containers_keep_horizontal_padding', () => {
    // .cj-px 容器内联样式不得用 padding 简写（会把左右 20px 归零，导致按钮比卡片宽）
    for (const f of htmlFiles) {
        const text = fs.readFileSync(path.join(dir, f), 'utf8');
        for (const m of text.matchAll(/cj-px"\s+style="([^"]*)"/g)) {
            assert.ok(!/padding\s*:/.test(m[1]), `${f} cj-px 内联样式禁用 padding 简写：${m[1]}`);
        }
    }
});

test('tabbar_has_zuju_tab', () => {
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
    const html = sandbox.window.Common.renderTabbar('zuju');
    assert.ok(html.includes('组局'), 'tabbar 含组局页签');
    assert.ok(html.includes('index.html?tab=zuju'), '组局页签链接首页组局视图');
    assert.ok(html.includes('cj-tab-active'), '激活态渲染');
});

test('shell_has_no_miniprogram_chrome', () => {
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
    const html = sandbox.window.Common.renderShell('圈子');
    assert.ok(!html.includes('cj-statusbar'), '外壳不得含模拟状态栏');
    assert.ok(!html.includes('cj-capsule'), '外壳不得含胶囊按钮');
    assert.ok(!html.includes('9:41'), '外壳不得含模拟时间');
    assert.ok(!html.includes('cj-navbar'), '外壳不渲染页面标题行');
    assert.ok(html.includes('常聚常伴，圈子不散'), '品牌行保留');
});
