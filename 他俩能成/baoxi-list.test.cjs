/**
 * 报喜功能测试（node baoxi-list.test.cjs）
 * 覆盖：报喜数据、官方首礼、随份子规则、列表卡、报喜详情页（完整结缘海报）、报喜页结婚证照片。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;
const store = {};

function makeSandbox(pageFile, search) {
    const document = {
        _html: '',
        getElementById() { return document; },
        set innerHTML(v) { document._html = v; },
        get innerHTML() { return document._html; },
        querySelectorAll() { return []; },
        addEventListener() {},
        head: { appendChild() {} },
        body: { appendChild() {} },
        createElement() { return { _html: '', className: '', innerHTML: '', appendChild() {}, remove() {} }; }
    };
    const localStorage = {
        getItem: (k) => (k in store ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: (k) => { delete store[k]; }
    };
    const sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const toasts = [];
    const sandbox = {
        window: { location: { href: '', search: search || '', pathname: pageFile }, history: { back() {} }, scrollTo() {} },
        document,
        localStorage,
        sessionStorage,
        URLSearchParams,
        setTimeout: (fn) => fn(),
        Math,
        Date,
        FileReader: function () {}
    };
    sandbox.window.document = document;
    // 加载页面依赖的公共脚本
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-imgdata.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-poster.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-gifts.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-report.js'), 'utf8'), sandbox);
    // Common 桩：toast 捕获 + gb 占位
    sandbox.window.Common = {
        renderBottomNav: () => '<div class="__bottom_nav__"></div>',
        initIcons() {},
        showToast: (m) => toasts.push(m),
        gb: (g) => '<div class="__gb__">' + g + '</div>'
    };
    const html = fs.readFileSync(path.join(dir, pageFile), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
    vm.runInContext(inline, sandbox);
    return { document, toasts, sandbox };
}

function clearStore() { for (const k of Object.keys(store)) delete store[k]; }

test('报喜数据完整：至少 3 对审核通过报喜', () => {
    clearStore();
    const { sandbox } = makeSandbox('baoxi-list.html');
    const pairs = sandbox.window.BaoxiData.pairs;
    assert.ok(Array.isArray(pairs) && pairs.length >= 3, '应至少 3 对报喜');
    for (const p of pairs) {
        assert.ok(p.id && p.time, '报喜缺 id/time');
        assert.ok(p.names && p.names.length === 2, '报喜应为两人');
        assert.ok(p.avatars && p.avatars.length === 2 && p.avatars.every(a => a.includes('images/photo/')), '头像应为本地照片');
        assert.ok(p.couplePhoto && p.couplePhoto.includes('images/photo/couple/'), '应有双人合照');
        assert.ok(p.story && p.story.length > 5, '报喜缺故事');
        // 故事应为报喜人第一人称的喜讯留言（表达幸福心情，可含对平台的感谢）
        assert.ok(/我|我们/.test(p.story), `报喜留言应为第一人称: ${p.story}`);
        assert.ok(/感谢|谢谢/.test(p.story), `报喜留言应表达对平台的感谢: ${p.story}`);
        assert.ok(Array.isArray(p.events) && p.events.length >= 3, '报喜缺结缘历程');
    }
});

test('官方首礼：每对报喜第一份份子为他俩能成官方红包 520 元', () => {
    clearStore();
    const { sandbox } = makeSandbox('baoxi-list.html');
    const G = sandbox.window.BaoxiGifts;
    const gifts = G.getGifts('bx1');
    assert.strictEqual(gifts.length, 1, '首访应自动写入官方红包');
    assert.strictEqual(gifts[0].from, '他俩能成');
    assert.strictEqual(gifts[0].amount, 520);
    assert.strictEqual(gifts[0].official, true);
    assert.strictEqual(G.getGifts('bx1').length, 1, '重复读取不重复写入');
});

test('随份子规则：每人每报喜只能随一次', () => {
    clearStore();
    const { sandbox, toasts } = makeSandbox('baoxi-list.html');
    const G = sandbox.window.BaoxiGifts;
    assert.strictEqual(G.submitGift('bx1', { type: 'gift', name: '玫瑰', icon: '🌹' }), true, '首次随礼应成功');
    const gifts = G.getGifts('bx1');
    assert.strictEqual(gifts.length, 2, '份子列表应含官方 + 我的礼物');
    assert.strictEqual(gifts[1].from, '甜心小鹿', '送礼人应为当前用户');
    assert.strictEqual(gifts[1].gift, '🌹 玫瑰');
    assert.strictEqual(G.myGiftDone('bx1'), true, '随过一次后应标记');
    assert.strictEqual(G.submitGift('bx1', { type: 'gift', name: '烟花', icon: '🎆' }), false, '第二次随礼应被拒绝');
    assert.ok(toasts.some(t => t.includes('只能随一次')), '重复随礼应提示');
});

test('随份子金额校验：预设与自定义金额', () => {
    clearStore();
    const { sandbox } = makeSandbox('baoxi-list.html');
    const G = sandbox.window.BaoxiGifts;
    assert.strictEqual(G.validateAmount('5.20'), 5.2, '预设金额应合法');
    assert.strictEqual(G.validateAmount('6.66'), 6.66, '自定义金额应合法');
    assert.strictEqual(G.validateAmount('0.005'), null, '低于 0.01 应拒绝');
    assert.strictEqual(G.validateAmount('999'), null, '超过 520 应拒绝');
    assert.strictEqual(G.validateAmount('abc'), null, '非法输入应拒绝');
    assert.strictEqual(G.submitGift('bx2', { type: 'money', amount: 6.66 }), true);
    const entry = G.getGifts('bx2').find(g => g.from === '甜心小鹿');
    assert.strictEqual(entry.gift, '红包 ¥6.66', '红包份子内容应含金额');
    assert.strictEqual(entry.amount, 6.66);
});

test('列表页：简洁卡片 + 详情页链接 + 悬浮报喜按钮', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('baoxi-list.html');
    vm.runInContext('render()', sandbox);
    let html = document._html;
    assert.ok(html.includes('我要随份子'), '卡片应有随份子按钮');
    assert.ok(html.includes('我要报喜') && html.includes('baoxi.html'), '应有悬浮我要报喜按钮');
    assert.ok(html.includes('林小满') && html.includes('陈屿'), '卡片应含结缘双方');
    assert.ok(html.includes("baoxi-detail.html?id=bx1"), '查看结缘海报应进入报喜详情页');
    assert.ok(!html.includes('喜 结 良 缘'), '列表卡不应渲染完整海报');
    assert.ok(!html.includes('poster-canvas'), '列表页不应有海报画布');
    // 随份子弹窗可用
    vm.runInContext('window.__GIFT_UI__.open(\'bx1\')', sandbox);
    html = document._html;
    assert.ok(html.includes('虚拟礼物') && html.includes('现金红包') && html.includes('喜糖'), '随份子弹窗应可用');
});

test('报喜详情页：完整结缘海报 + 海报内随礼列表与我要随份子 + 返回按钮', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('baoxi-detail.html', '?id=bx1');
    vm.runInContext('render()', sandbox);
    const html = document._html;
    // 完整海报内容（与报喜页 renderReport 同源模块）
    assert.ok(html.includes('《他俩能成》 · 缘分认证'), '应含认证标签');
    assert.ok(html.includes('喜 结 良 缘'), '应含主标题');
    assert.ok(html.includes('林小满 ❤ 陈屿'), '应含双人姓名');
    assert.ok(html.includes('结缘历程'), '应含结缘历程');
    assert.ok(html.includes('幸福时刻'), '应含幸福时刻');
    assert.ok(html.includes('能成祝福'), '应含能成祝福');
    assert.ok(html.includes('>喜</span>'), '应含喜字印章');
    assert.ok(html.includes('能成世界，因你们而更精彩'), '应含底部寄语');
    assert.ok(html.includes('images/photo/couple/bx1.jpg'), '幸福时刻应展示双人合照');
    assert.ok(html.includes('images/cheng.png'), '应含吉祥物');
    // 海报最下方：随礼列表 + 我要随份子
    assert.ok(html.includes('已收到的份子'), '海报最下方应展示随礼列表');
    assert.ok(html.includes('他俩能成') && html.includes('官方红包 ¥520') && html.includes('官方'), '应含官方 520 红包');
    assert.ok(html.includes('我要随份子'), '海报内应有我要随份子按钮');
    // 底部返回按钮
    assert.ok(html.includes('返回') && html.includes('window.history.back()'), '底部应有返回按钮');
    // 详情页随份子弹窗
    vm.runInContext('window.__GIFT_UI__.open(\'bx1\')', sandbox);
    assert.ok(document._html.includes('虚拟礼物'), '详情页随份子弹窗应可用');
    // 未找到报喜的兜底
    const { document: doc2, sandbox: sb2 } = makeSandbox('baoxi-detail.html', '?id=nobody');
    vm.runInContext('render()', sb2);
    assert.ok(doc2._html.includes('未找到该报喜喜讯'), '无效 id 应有兜底');
});

test('完成报喜：保存我的报喜记录与已报喜标记', () => {
    clearStore();
    const { sandbox } = makeSandbox('baoxi.html');
    vm.runInContext(`saveMyReport({
        time: '2026年10月20日',
        names: ['甜心小鹿', '陈屿'],
        avatars: ['a.jpg', 'b.jpg'],
        genders: ['female', 'male'],
        couplePhoto: '',
        events: [{ time: '', html: 'x' }]
    })`, sandbox);
    assert.strictEqual(sandbox.localStorage.getItem('baoxi_submitted'), '1', '应写入已报喜标记');
    const mine = JSON.parse(sandbox.localStorage.getItem('baoxi_my_report'));
    assert.strictEqual(mine.id, 'mine');
    assert.strictEqual(mine.names[0], '甜心小鹿');
    assert.strictEqual(mine.couplePhoto, '', '无合照时记录留空（详情页负责回退占位图）');
    assert.ok(Array.isArray(mine.posterLines) && mine.posterLines.length >= 1, '应保存海报绘制用的历程文案');
});

test('列表页悬浮按钮：未报喜显示我要报喜，已报喜显示我的报喜', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('baoxi-list.html');
    vm.runInContext('render()', sandbox);
    assert.ok(document._html.includes('我要报喜') && document._html.includes("href='baoxi.html'"), '未报喜应显示我要报喜');
    assert.ok(!document._html.includes('我的报喜'), '未报喜不应显示我的报喜');
    store['baoxi_submitted'] = '1';
    vm.runInContext('render()', sandbox);
    assert.ok(document._html.includes('我的报喜') && document._html.includes('baoxi-detail.html?id=mine'), '已报喜应显示我的报喜');
    assert.ok(!document._html.includes('我要报喜'), '已报喜不应再显示我要报喜');
});

test('我的报喜详情：展示自己的结缘海报；未报喜给引导', () => {
    clearStore();
    store['baoxi_my_report'] = JSON.stringify({
        id: 'mine', time: '2026年10月20日',
        names: ['甜心小鹿', '陈屿'],
        avatars: ['images/photo/female/crop.0.67.1079.1438.0.750.1000.jpg', 'images/photo/male/crop.0.0.1078.1438.0.750.1000.jpg'],
        genders: ['female', 'male'],
        couplePhoto: '',
        story: '我们报喜啦！感谢平台见证我们的幸福！',
        events: [{ time: '', html: '<b>甜心小鹿</b>加入了他俩能成' }]
    });
    const { document, sandbox } = makeSandbox('baoxi-detail.html', '?id=mine');
    vm.runInContext('render()', sandbox);
    const html = document._html;
    assert.ok(html.includes('喜 结 良 缘'), '应展示结缘海报');
    assert.ok(html.includes('甜心小鹿 ❤ 陈屿'), '应展示自己的双人姓名');
    assert.ok(html.includes('images/logo_center.png'), '无合照时详情页应回退占位图');
    // 与报喜提交后界面一致：状态提示 + 下载海报 + 返回链接，无随份子
    assert.ok(html.includes('已收到您的喜讯，我们核实后将会有大礼相赠！'), '应有喜讯状态提示');
    assert.ok(html.includes('下载结缘海报'), '应有下载结缘海报按钮');
    assert.ok(fs.readFileSync(path.join(dir, 'baoxi-detail.html'), 'utf8').includes('lib/baoxi-poster.js'), '详情页应加载海报模块（否则下载报错）');
    assert.ok(html.includes('返回') && html.includes('window.history.back()'), '应有返回链接');
    assert.ok(!html.includes('已收到的份子'), '我的报喜不应有随礼列表');
    assert.ok(!html.includes('我要随份子'), '我的报喜不应有随份子操作');
    // 未报喜引导
    clearStore();
    const { document: doc2, sandbox: sb2 } = makeSandbox('baoxi-detail.html', '?id=mine');
    vm.runInContext('render()', sb2);
    assert.ok(doc2._html.includes('你还未报喜'), '未报喜应有引导');
    assert.ok(doc2._html.includes('去报喜') && doc2._html.includes("href='baoxi.html'"), '引导应含去报喜入口');
});

test('报喜页：结婚证照片（非必填）+ 审核红包提示 + 共享海报模块', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('baoxi.html');
    vm.runInContext('renderForm()', sandbox);
    const html = document._html;
    assert.ok(html.includes('结婚证照片'), '报喜页应有结婚证照片上传');
    assert.ok(html.includes('非必填'), '结婚证照片应标注非必填');
    assert.ok(html.includes('520元官方红包'), '应有审核通过送 520 官方红包提示');
    const src = fs.readFileSync(path.join(dir, 'baoxi.html'), 'utf8');
    assert.ok(src.includes('lib/baoxi-report.js'), '报喜页应引用共享海报模块');
    assert.ok(src.includes('已收到您的喜讯，我们核实后将会有大礼相赠！'), '报喜提交后界面应有喜讯状态提示');
    assert.ok(!src.includes('返回首页'), '报喜提交后界面返回首页应改为返回');
    assert.ok(sandbox.window.BaoxiReport && typeof sandbox.window.BaoxiReport.posterHtml === 'function', '共享海报模块应加载');
    assert.ok(sandbox.window.BaoxiPoster && typeof sandbox.window.BaoxiPoster.download === 'function', '海报下载能力应在共享模块中');
});
