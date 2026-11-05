/**
 * 报喜功能测试（node baoxi-list.test.cjs）
 * 覆盖：报喜数据、官方首礼、随份子规则、列表卡、报喜引导说明与报喜图片占位、报喜详情页（完整结缘海报）、报喜页结婚证照片。
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
        setInterval: () => 0,
        // 固定随机数，保证 me.html 等含随机分支的页面渲染结果可断言
        Math: Object.assign(Object.create(Math), { random: function () { return 0.5; } }),
        Date,
        FileReader: function () {}
    };
    sandbox.window.document = document;
    sandbox.location = sandbox.window.location;
    // 加载页面依赖的公共脚本
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/kaopu-data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-imgdata.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-poster.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-gifts.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'lib/baoxi-report.js'), 'utf8'), sandbox);
    // Common 桩：仅替换依赖真实 DOM 的方法，保留其余公共方法（如 goBaoxi）
    sandbox.window.Common.renderBottomNav = () => '<div class="__bottom_nav__"></div>';
    sandbox.window.Common.initIcons = function () {};
    sandbox.window.Common.showToast = (m) => toasts.push(m);
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

test('列表页：上方报喜引导说明 + 卡片报喜图片SVG占位', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('baoxi-list.html');
    vm.runInContext('render()', sandbox);
    const html = document._html;
    // 引导已成用户主动报喜的说明文字 + 去报喜入口（goBaoxi 位于审核说明行之前，即引导卡内；悬浮按钮在卡片之后）
    assert.ok(html.includes('快来报喜') && html.includes('在一起了吗'), '列表上方应有引导报喜的说明文字');
    assert.ok(html.includes('520元官方红包'), '引导说明应提到审核通过送官方红包');
    const guideGoBaoxi = html.indexOf('window.Common.goBaoxi()');
    assert.ok(guideGoBaoxi !== -1 && guideGoBaoxi < html.indexOf('以下喜讯均已通过平台审核'), '引导卡应可点击去报喜');
    // 每张卡片显示报喜图片（暂无上传时用双人合影SVG占位）
    const pairs = sandbox.window.BaoxiData.pairs;
    const noPhotoCount = pairs.filter(p => !p.reportPhoto).length;
    const placeholderSrcCount = (html.match(/src="images\/placeholder-couple\.svg"/g) || []).length;
    assert.strictEqual(placeholderSrcCount, noPhotoCount, '无报喜图片的卡片均应显示双人合影SVG占位图');
    const altCount = (html.match(/alt="报喜合影"/g) || []).length;
    assert.strictEqual(altCount, pairs.length, '每张卡片占位图均应有报喜合影说明（alt）');
    // 报喜图片加载失败应回退占位图
    const onerrorCount = (html.match(/this\.onerror=null;this\.src='images\/placeholder-couple\.svg'/g) || []).length;
    assert.strictEqual(onerrorCount, pairs.length, '每张卡片报喜图片均应有加载失败回退占位图');
});

test('报喜引导入口：首页已成卡 + 我的1314引导卡 + 资料页缘分引导 + goBaoxi 路由', () => {
    clearStore();
    // Common.goBaoxi：未报喜去报喜表单；已报喜且记录完好去我的报喜；标记在但记录缺失回退表单；可带TA预选参数
    const { sandbox } = makeSandbox('baoxi-list.html');
    assert.strictEqual(sandbox.window.Common.isBaoxiSubmitted(), false, '未报喜应识别为未报喜');
    sandbox.window.Common.goBaoxi();
    assert.strictEqual(sandbox.window.location.href, 'baoxi.html', '未报喜应去报喜表单');
    store['baoxi_submitted'] = '1';
    assert.strictEqual(sandbox.window.Common.isBaoxiSubmitted(), true, '已报喜应识别为已报喜');
    sandbox.window.Common.goBaoxi();
    assert.strictEqual(sandbox.window.location.href, 'baoxi.html', '标记在但记录缺失应回退报喜表单');
    store['baoxi_my_report'] = JSON.stringify({ id: 'mine' });
    sandbox.window.Common.goBaoxi();
    assert.strictEqual(sandbox.window.location.href, 'baoxi.html', '记录结构损坏应回退报喜表单');
    store['baoxi_my_report'] = JSON.stringify({ id: 'mine', names: ['甜心小鹿', '陈屿'] });
    sandbox.window.Common.goBaoxi();
    assert.strictEqual(sandbox.window.location.href, 'baoxi.html', '记录缺头像/历程应视为损坏回退报喜表单');
    store['baoxi_my_report'] = JSON.stringify({ id: 'mine', names: ['甜心小鹿', '陈屿'], avatars: ['a.jpg', 'b.jpg'], events: [{ time: '', html: 'x' }] });
    sandbox.window.Common.goBaoxi();
    assert.strictEqual(sandbox.window.location.href, 'baoxi-detail.html?id=mine', '已报喜且记录完好应去我的报喜');
    store['baoxi_my_report'] = null;
    sandbox.window.Common.goBaoxi('星河漫步', 'p.jpg', 'male');
    assert.strictEqual(sandbox.window.location.href, 'baoxi.html?name=' + encodeURIComponent('星河漫步') + '&photo=p.jpg&gender=male', '未报喜应带TA预选参数去报喜表单');
    // 引导卡组件：输出标题与 goBaoxi 点击
    const guideHtml = sandbox.window.Common.baoxiGuideCard('T', 'D');
    assert.ok(guideHtml.includes('T</p>') && guideHtml.includes('goBaoxi') && guideHtml.includes('text-brand-pink'), '引导卡组件应含标题、goBaoxi 点击与品牌色类');
    clearStore();

    // 首页"我的匹配"：已成卡带报喜按钮（含TA预选参数），其他状态卡不带
    const idxEnv = makeSandbox('index.html');
    let card = vm.runInContext("View.smallCard({name:'测试',age:25,gender:'female',constellation:'天秤座',photo:'p.jpg',verified:false,capsule:'你和TA已成'})", idxEnv.sandbox);
    assert.ok(card.includes('🎉 报喜') && card.includes('goBaoxi'), '已成卡应带报喜按钮');
    assert.ok(card.includes("goBaoxi('测试','p.jpg','female')"), '报喜按钮应带TA预选参数');
    assert.ok(card.includes('event.stopPropagation()'), '报喜按钮应阻止卡片跳转');
    assert.ok(card.includes('cursor-pointer') && card.includes('card-hover'), '报喜按钮应符合操作按钮规范');
    card = vm.runInContext("View.smallCard({name:'测试',age:25,gender:'male',constellation:'狮子座',photo:'p.jpg',verified:false,capsule:'只待最后助攻'})", idxEnv.sandbox);
    assert.ok(!card.includes('报喜'), '未成卡不应带报喜按钮');
    store['baoxi_submitted'] = '1';
    card = vm.runInContext("View.smallCard({name:'测试',age:25,gender:'female',constellation:'天秤座',photo:'p.jpg',verified:false,capsule:'你和TA已成'})", idxEnv.sandbox);
    assert.ok(card.includes('报喜'), '仅标记无记录（残态）应继续显示报喜按钮');
    store['baoxi_my_report'] = JSON.stringify({ id: 'mine', names: ['甜心小鹿', '陈屿'], avatars: ['a.jpg', 'b.jpg'], events: [{ time: '', html: 'x' }] });
    card = vm.runInContext("View.smallCard({name:'测试',age:25,gender:'female',constellation:'天秤座',photo:'p.jpg',verified:false,capsule:'你和TA已成'})", idxEnv.sandbox);
    assert.ok(!card.includes('报喜'), '已报喜且记录完好不应再显示报喜按钮');
    clearStore();

    // 报喜页：入口带入的TA自动补入候选并预选；名称清洗防注入；同名人忽略；已有候选用带入照片
    const envBaoxi = makeSandbox('baoxi.html', '?name=星河漫步&photo=p.jpg&gender=male');
    const preSel = vm.runInContext('selUser && selUser.name', envBaoxi.sandbox);
    assert.strictEqual(preSel, '星河漫步', '报喜页应预选入口带入的TA');
    const inMatched = vm.runInContext('MATCHED.some(function(u){return u.name===\'星河漫步\';})', envBaoxi.sandbox);
    assert.strictEqual(inMatched, true, '入口带入的TA应补入候选');
    const envBaoxiXss = makeSandbox('baoxi.html', '?name=' + encodeURIComponent('<img src=x>') + '&photo=p.jpg&gender=male');
    const cleanName = vm.runInContext('MATCHED[0] && MATCHED[0].name', envBaoxiXss.sandbox);
    assert.ok(!(cleanName || '').includes('<'), '带入名称应清洗防注入');
    const envBaoxiSelf = makeSandbox('baoxi.html', '?name=' + encodeURIComponent('甜心小鹿'));
    assert.strictEqual(vm.runInContext('selUser', envBaoxiSelf.sandbox), null, '与当前用户同名不应预选（避免自己和自己报喜）');
    const envBaoxiHit = makeSandbox('baoxi.html', '?name=' + encodeURIComponent('清风徐来') + '&photo=images/photo/male/crop.0.0.1078.1438.0.750.1000.jpg&gender=male');
    const hitPhoto = vm.runInContext("MATCHED.filter(function(u){return u.name==='清风徐来';})[0].photo", envBaoxiHit.sandbox);
    assert.strictEqual(hitPhoto, 'images/photo/male/crop.0.0.1078.1438.0.750.1000.jpg', '已有候选应使用带入的照片');

    // 我的1314：匹配用户列表上方报喜引导卡；已报喜隐藏
    const env1314 = makeSandbox('my-1314.html');
    vm.runInContext('render()', env1314.sandbox);
    assert.ok(env1314.document._html.includes('已经成了？快来报喜'), '我的1314列表上方应有报喜引导卡');
    assert.ok(env1314.document._html.includes('goBaoxi') && env1314.document._html.includes('520元官方红包'), '引导卡应可点击去报喜并提示官方红包');
    store['baoxi_submitted'] = '1';
    vm.runInContext('render()', env1314.sandbox);
    assert.ok(env1314.document._html.includes('已经成了？快来报喜'), '仅标记无记录（残态）应继续显示报喜引导卡');
    store['baoxi_my_report'] = JSON.stringify({ id: 'mine', names: ['甜心小鹿', '陈屿'], avatars: ['a.jpg', 'b.jpg'], events: [{ time: '', html: 'x' }] });
    vm.runInContext('render()', env1314.sandbox);
    assert.ok(!env1314.document._html.includes('已经成了？快来报喜'), '已报喜且记录完好不应再显示报喜引导卡');
    clearStore();

    // 资料页缘分记录：匹配度达1314有报喜引导；未达1314保持原"就差最后一步"分支
    const envProfile = makeSandbox('profile.html');
    vm.runInContext("profile.matchScore=1314;profile.fateCard='success';render()", envProfile.sandbox);
    assert.ok(envProfile.document._html.includes('匹配度已达1314') && envProfile.document._html.includes('去报喜'), '缘分记录达1314应有报喜引导');
    assert.ok(envProfile.document._html.includes('goBaoxi'), '引导按钮应可点击去报喜');
    assert.ok(envProfile.document._html.includes("goBaoxi('追风少年'"), '去报喜应带入缘分对象而非当前用户本人');
    assert.ok(envProfile.document._html.includes('chat.html?name=' + encodeURIComponent('追风少年')), '联系TA与去报喜应指向同一缘分对象');
    vm.runInContext("profile.matchScore=100;profile.fateCard='pending';render()", envProfile.sandbox);
    assert.ok(envProfile.document._html.includes('就差最后一步') && !envProfile.document._html.includes('去报喜'), '未达1314不应显示报喜引导');
    // 初始状态：固定随机数下匹配度<1314，不应随机出"你们成了"（与1314规则一致）
    const envProfile2 = makeSandbox('profile.html');
    assert.ok(vm.runInContext('profile.matchScore', envProfile2.sandbox) < 1314, '固定随机数下匹配度应<1314');
    assert.strictEqual(vm.runInContext('profile.fateCard', envProfile2.sandbox), 'pending', '未达1314不应显示你们成了');
});

test('排行榜：靠谱榜为首个TAB，按靠谱值排名，全部/男女切换在右侧且默认全部', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('ranking.html');
    const View = sandbox.window.View;
    // 默认展示靠谱榜（首个TAB），默认全部
    assert.strictEqual(View.m, 'kaopu', '默认应展示靠谱榜');
    assert.strictEqual(View.sg, 'all', '默认应展示全部');
    // 数据：全部/男/女 三榜，按靠谱值降序
    const all = vm.runInContext("DATA['kp-all']", sandbox);
    const male = vm.runInContext("DATA['kp-m']", sandbox);
    const female = vm.runInContext("DATA['kp-f']", sandbox);
    assert.ok(all.length > 0 && male.length > 0 && female.length > 0, '全部/男女榜均应有数据');
    [all, male, female].forEach(list => {
        for (let i = 1; i < list.length; i++) {
            assert.ok(list[i - 1].score >= list[i].score, '榜单应按靠谱值降序');
        }
    });
    assert.ok(all.some(u => u.gender === 'male') && all.some(u => u.gender === 'female'), '全部榜应含男女');
    // rankDesc 行为：降序排序 + 重排名次（合成数据直接验证，不受随机数影响）
    const sd = vm.runInContext('rankDesc([{score:3},{score:9},{score:1}])', sandbox);
    assert.deepStrictEqual(Array.from(sd, u => u.score), [9, 3, 1], 'rankDesc 应降序排序');
    assert.deepStrictEqual(Array.from(sd, u => u.rank), [1, 2, 3], 'rankDesc 应重排名次');
    // 同一用户池派生三榜：同一用户在各榜分数一致；当前用户与我的靠谱值同源
    const qfAll = all.filter(u => u.name === '清风徐来')[0];
    const qfMale = male.filter(u => u.name === '清风徐来')[0];
    assert.ok(qfAll && qfMale && qfAll.score === qfMale.score, '同一用户各榜靠谱值应一致');
    const txAll = all.filter(u => u.name === '甜心小鹿')[0];
    assert.ok(txAll && txAll.score === sandbox.window.KaopuData.total, '榜单中当前用户靠谱值应与我的靠谱值总额一致');
    // 渲染：靠谱榜TAB在最前，无周榜/总榜切换，全部/男女切换在右侧
    View.render();
    let html = document._html;
    const kaopuIdx = html.indexOf('靠谱榜'), renqiIdx = html.indexOf('人气榜');
    assert.ok(kaopuIdx !== -1 && renqiIdx !== -1 && kaopuIdx < renqiIdx, '靠谱榜TAB应在最前面');
    assert.ok(html.includes('靠谱值'), '应展示靠谱值');
    assert.ok(!html.includes('周排行') && !html.includes('总排行'), '靠谱榜不应有周榜/总榜切换');
    assert.ok(html.includes("View.genderClick('all')") && html.includes("View.genderClick('m')") && html.includes("View.genderClick('f')"), '应有全部/男女切换');
    // 靠谱榜更新时间与"我的靠谱值"同源（周日20:00），且全部榜名次不重复（派生榜单不互相改写名次）
    assert.ok(html.includes(sandbox.window.KaopuData.updatedAt), '靠谱榜更新时间应与我的靠谱值一致（周日20:00）');
    const allRanks = Array.from(all, u => u.rank);
    assert.strictEqual(new Set(allRanks).size, allRanks.length, '全部榜名次不应重复');
    const mlAutoIdx = html.indexOf('<div class="ml-auto">');
    assert.ok(mlAutoIdx !== -1 && mlAutoIdx < html.indexOf("View.genderClick('all')"), '全部/男女切换应放在右侧');
    // 默认全部：男女用户都展示
    assert.ok(html.includes('清风徐来') && html.includes('甜心小鹿'), '全部榜应展示男女用户');
    // 切男榜
    View.genderClick('m');
    html = document._html;
    assert.ok(html.includes('清风徐来') && !html.includes('甜心小鹿'), '男榜应只展示男用户');
    // 切女榜
    View.genderClick('f');
    html = document._html;
    assert.ok(html.includes('甜心小鹿') && !html.includes('清风徐来'), '女榜应只展示女用户');
    // 切回人气榜：周榜/总榜切换恢复
    View.mainClick('popular');
    html = document._html;
    assert.ok(html.includes('周排行') && html.includes('总排行'), '人气榜应保留周榜/总榜切换');
});

test('资料页：靠谱值显示在人气指数上方（60-100分，无说明文字，与靠谱榜同范围）', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('profile.html');
    vm.runInContext('render()', sandbox);
    const html = document._html;
    // 指数区标题
    assert.ok(html.includes('TA的人气指数') && !html.includes('TA的指数'), '指数区标题应为TA的人气指数');
    // 靠谱值：无说明文字，位于人气指数明细上方，范围 60-100
    assert.ok(html.includes('靠谱值'), '指数区应有靠谱值显示');
    assert.ok(!html.includes('综合评定'), '靠谱值下方不应有说明文字');
    const kv = vm.runInContext('profile.kaopu', sandbox);
    assert.ok(kv >= 60 && kv <= 100, '资料页靠谱值应在60-100分范围');
    assert.ok(html.includes('>' + kv + '<span'), '页面应展示该靠谱值');
    assert.ok(html.indexOf('靠谱值') < html.indexOf('TA的人气指数'), '靠谱值应显示在人气指数标题上方');
    // 靠谱榜靠谱值与资料页同范围（60-100）
    const { sandbox: rkSandbox } = makeSandbox('ranking.html');
    const all = vm.runInContext("DATA['kp-all']", rkSandbox);
    assert.ok(all.every(u => u.score >= 60 && u.score <= 100), '靠谱榜靠谱值应为60-100分');
});

test('我的靠谱值：总额+规则弹窗+积累记录（活动含活动名），个人中心卡入口', () => {
    clearStore();
    // 数据：总额为记录之和，60-100 范围内
    const { document, sandbox } = makeSandbox('my-kaopu.html');
    const K = sandbox.window.KaopuData;
    assert.strictEqual(K.total, K.records.reduce((s, r) => s + r.delta, 0), '总额应为记录之和');
    assert.ok(K.total >= 60 && K.total <= 100, '总额应在60-100分范围');
    // 规则完整：8 条，含一次性与待讨论标注
    assert.strictEqual(K.rules.length, 10, '应有10条规则');
    assert.ok(K.rules.some(r => r.label === '注册脱单资料' && r.value === '+60'), '注册规则应为+60');
    assert.ok(K.rules.some(r => r.label === '实名认证' && r.note === '一次性'), '实名认证应为一次性');
    assert.ok(K.rules.some(r => r.label.includes('被举报') && r.value === '-15' && r.note !== '待讨论'), '被举报规则应保留且不再标注待讨论');
    assert.ok(K.rules.some(r => r.label.includes('更新') && r.value === '每周日20:00'), '应有每周日20:00更新排行规则');
    const loginRule = K.rules.filter(r => r.label.includes('未登录'))[0];
    assert.ok(loginRule && loginRule.desc && loginRule.desc.includes('50%') && loginRule.desc.includes('5%'), '应有长期未登录扣减规则（含各档比例）');
    // 登录扣减记录：最近一次更新时间扣除，负值
    assert.ok(K.records.some(r => r.label.includes('长期未登录扣减') && r.delta < 0), '应有登录扣减记录');
    assert.ok(K.updatedAt && K.updatedAt.includes('20:00'), '更新时间应为周日20:00');
    // 活动相关每条单独记录且含活动名称；含扣分记录
    const actRecs = K.records.filter(r => /活动/.test(r.label));
    assert.ok(actRecs.length >= 4, '活动相关应有单独记录');
    assert.ok(actRecs.every(r => r.label.includes('·')), '活动记录应包含活动名称');
    assert.ok(K.records.some(r => r.delta < 0), '应有扣分记录');
    // 页面渲染：总额 + 规则说明按钮（弹窗查看）+ 记录
    vm.runInContext('render()', sandbox);
    const html = document._html;
    assert.ok(html.includes('靠谱值总额') && html.includes('>' + K.total + '<span'), '页面应展示靠谱值总额');
    assert.ok(html.includes('靠谱值规则说明'), '规则应为按钮入口');
    assert.ok(html.includes("showPopup('kaopu-rules-popup')"), '按钮点击应弹出规则弹窗');
    assert.ok(html.includes('我知道了') && html.includes('注册脱单资料'), '弹窗应含规则明细与关闭按钮');
    assert.ok(html.includes('max-h-[80vh]') && html.includes('overflow-y-auto'), '规则弹窗应可滚动（小屏适配）');
    assert.ok(!html.includes('待讨论'), '举报规则不应再标注待讨论');
    assert.ok(html.includes('积累记录'), '页面应展示积累记录');
    assert.ok(html.includes('秋日漫步·朝阳公园摄影联谊') && html.includes('报名活动未到场'), '记录应含活动名称');
    assert.ok(html.includes('+60') && html.includes('-10'), '记录应展示加减分值');
    assert.ok(html.includes('长期未登录扣减'), '记录应含登录扣减记录');
    assert.ok(html.includes('更新于') && html.includes(K.updatedAt) && html.includes('每周日20:00'), '页面应显示靠谱值更新时间');
    // 个人中心首页：靠谱值卡片位于"我的脱单档案"链接上方
    const envMe = makeSandbox('me.html');
    vm.runInContext('render()', envMe.sandbox);
    const meHtml = envMe.document._html;
    assert.ok(meHtml.includes('靠谱值') && meHtml.includes('my-kaopu.html'), '个人中心应有靠谱值卡片入口');
    assert.ok(meHtml.indexOf('靠谱值') < meHtml.indexOf('我的脱单档案'), '靠谱值卡片应位于我的脱单档案上方');
    assert.ok(meHtml.includes(envMe.sandbox.window.KaopuData.total + '分'), '卡片应显示当前靠谱值总额');
    // 脱单档案页不再内置靠谱值卡片
    const envEdit = makeSandbox('profile-edit.html');
    vm.runInContext('render()', envEdit.sandbox);
    assert.ok(!envEdit.document._html.includes('my-kaopu.html'), '脱单档案页不应再有靠谱值卡片');
    // 资料页靠谱值与我的靠谱值同源
    const envProfile = makeSandbox('profile.html');
    assert.strictEqual(vm.runInContext('profile.kaopu', envProfile.sandbox), envProfile.sandbox.window.KaopuData.total, '资料页靠谱值应与我的靠谱值总额一致');
});

test('首页快捷入口：青爱团与朝阳相伴恢复，合作专区与能成报告入口移除', () => {
    clearStore();
    const { sandbox } = makeSandbox('index.html');
    const btns = vm.runInContext('View.iconButtons()', sandbox);
    assert.ok(btns.includes('青爱团') && btns.includes('qingai.html'), '应有青爱团快捷入口');
    assert.ok(btns.includes('朝阳相伴') && btns.includes('chaoyang.html'), '应有朝阳相伴快捷入口');
    assert.ok(!btns.includes('合作专区') && !btns.includes('zones.html'), '不应再有合作专区入口');
    const src = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.ok(!src.includes('report.html'), '首页不应再有能成报告入口');
});

test('随份子弹窗：选择礼物/金额就地刷新，不重载整页', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('baoxi-list.html');
    vm.runInContext('render()', sandbox);
    vm.runInContext("window.__GIFT_UI__.open('bx1')", sandbox);
    assert.ok(document._html.includes('gift-modal-body'), '弹窗应有就地更新容器');
    vm.runInContext("window.__GIFT_UI__.selectGiftType('money')", sandbox);
    assert.ok(document._html.includes('自定义金额'), '切换现金红包后内容可用');
    vm.runInContext("window.__GIFT_UI__.selectMoney('5.20')", sandbox);
    assert.ok(document._html.includes('value="5.20"'), '选择预设金额后输入框应显示金额');
    vm.runInContext("window.__GIFT_UI__.selectGiftType('gift')", sandbox);
    vm.runInContext("window.__GIFT_UI__.selectGift('🌹','玫瑰')", sandbox);
    assert.ok(document._html.includes('border-brand-pink bg-brand-pink/10'), '选择礼物应有选中态');
    // 源码防回归：选择操作走就地刷新而非整页重渲染
    const src = fs.readFileSync(path.join(dir, 'lib/baoxi-gifts.js'), 'utf8');
    assert.ok(src.includes('gift-modal-body') && src.includes('this.refresh()'), '选择操作应就地刷新弹窗');
});

test('首页我的匹配：已成优先排在前面', () => {
    clearStore();
    const { sandbox } = makeSandbox('index.html');
    // 已成卡排最前，其余保持原顺序
    const sorted = vm.runInContext("sortChengFirst([{name:'a',capsule:'你们已经互相关注'},{name:'b',capsule:'你和TA已成'},{name:'c',capsule:'只待最后助攻'},{name:'d',capsule:'你和TA已成'}])", sandbox);
    assert.deepStrictEqual(Array.from(sorted, u => u.capsule), ['你和TA已成', '你和TA已成', '你们已经互相关注', '只待最后助攻'], '已成应优先排在前面');
    // 页面数据应用了排序：所有已成卡都在非已成卡之前
    const gd = vm.runInContext('window.GlobalData.matchUsers', sandbox);
    const firstDoneIdx = gd.findIndex(u => u.capsule === '你和TA已成');
    const firstOtherIdx = gd.findIndex(u => u.capsule !== '你和TA已成');
    if (firstDoneIdx !== -1 && firstOtherIdx !== -1) {
        assert.ok(firstDoneIdx < firstOtherIdx, '全局匹配数据应已成优先');
    }
});

test('海报下载：上传大图压缩入快照 + 幸福时刻区域纯白检测兜底', () => {
    clearStore();
    // 快照路径依赖真实浏览器渲染（vm 沙箱无 canvas/DOM 布局），以源码断言防回归
    const src = fs.readFileSync(path.join(dir, 'lib/baoxi-poster.js'), 'utf8');
    assert.ok(src.includes("src.indexOf('data:image/')===0") && src.includes('!isData||src.length>150000'), '快照应将相对路径图片与大体积上传图内嵌为 dataURL');
    assert.ok(src.includes("toDataURL('image/jpeg'"), '内嵌应输出 JPEG dataURL');
    assert.ok(src.includes('测不到照片区域'), '测不到照片区域时应转手绘兜底');
    assert.ok(src.includes('photoOk') && src.includes('fallbackPoster(drawData)'), '幸福时刻区域纯白应转手绘兜底');
    // 空白检测应按快照中照片的真实位置采样（photoRect），而非固定比例猜测的采样带
    assert.ok(src.includes('photoRect') && src.includes("querySelector('[data-happy-photo]')"), '空白检测应按照片真实位置采样');
    assert.ok(fs.readFileSync(path.join(dir, 'lib/baoxi-report.js'), 'utf8').includes('data-happy-photo'), '幸福时刻照片应带检测标记');
    // 报喜页与详情页共用该下载模块
    for (const f of ['baoxi.html', 'baoxi-detail.html']) {
        assert.ok(fs.readFileSync(path.join(dir, f), 'utf8').includes('lib/baoxi-poster.js'), f + ' 应加载海报下载模块');
    }
});

test('个人中心：我的认证下方有我要举报入口，弹窗提交举报并提示', () => {
    clearStore();
    const { document, sandbox, toasts } = makeSandbox('me.html');
    vm.runInContext('render()', sandbox);
    const html = document._html;
    // 入口位于我的认证下方，点击打开弹窗
    const certIdx = html.indexOf('我的认证');
    const reportIdx = html.indexOf('我要举报');
    assert.ok(certIdx !== -1 && reportIdx !== -1 && reportIdx > certIdx, '我要举报应在我的认证下方');
    assert.ok(html.includes('showReport()'), '点击应打开举报弹窗');
    // 弹窗（静态 HTML）：能成号 + 举报内容 + 附件（多图非必填）+ 提交按钮
    const src = fs.readFileSync(path.join(dir, 'me.html'), 'utf8');
    assert.ok(src.includes('report-overlay') && src.includes('对方能成号') && src.includes('举报内容'), '举报弹窗应含能成号与举报内容字段');
    assert.ok(src.includes('附件') && src.includes('非必填') && src.includes('report-attach'), '举报内容后应有附件区块（非必填）');
    assert.ok(src.includes('multiple') && src.includes('accept="image/*"'), '附件应为多图上传');
    assert.ok(src.includes('onReportAttach(this)') && src.includes('removeReportImage') && src.includes('reportImages'), '附件应有选择/删除逻辑');
    assert.ok(src.includes('最多上传 9 张图片'), '附件应有张数上限提示');
    assert.ok(src.includes('submitReport()'), '弹窗应有提交按钮');
    // 提交校验：缺少字段提示；完整提交提示已提交
    vm.runInContext("document.getElementById=function(id){return {value:'',classList:{add:function(){},remove:function(){}}};}", sandbox);
    vm.runInContext('submitReport()', sandbox);
    assert.ok(toasts.some(t => t.includes('请填写对方能成号')), '缺少能成号应提示');
    vm.runInContext("document.getElementById=function(id){return {value:id==='report-id'?'123':'骚扰信息',classList:{add:function(){},remove:function(){}}};}", sandbox);
    vm.runInContext('submitReport()', sandbox);
    assert.ok(toasts.some(t => t.includes('已经提交')), '提交后应提示已提交');
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
        certPhoto: 'data:image/jpeg;base64,xxx',
        events: [{ time: '', html: 'x' }]
    })`, sandbox);
    assert.strictEqual(sandbox.localStorage.getItem('baoxi_submitted'), '1', '应写入已报喜标记');
    const mine = JSON.parse(sandbox.localStorage.getItem('baoxi_my_report'));
    assert.strictEqual(mine.id, 'mine');
    assert.strictEqual(mine.names[0], '甜心小鹿');
    assert.strictEqual(mine.couplePhoto, '', '无合照时记录留空（详情页负责回退占位图）');
    assert.strictEqual(mine.certPhoto, 'data:image/jpeg;base64,xxx', '应保存结婚证照片');
    assert.ok(Array.isArray(mine.posterLines) && mine.posterLines.length >= 1, '应保存海报绘制用的历程文案');
    // 未传结婚证：记录留空（我的报喜页据此展示补传区块）
    vm.runInContext("saveMyReport({ time:'x', names:['a','b'], avatars:['a.jpg','b.jpg'], genders:['female','male'], couplePhoto:'', events:[{time:'',html:'x'}] })", sandbox);
    assert.strictEqual(JSON.parse(sandbox.localStorage.getItem('baoxi_my_report')).certPhoto, '', '未传结婚证时记录应留空');
});

test('列表页悬浮按钮：未报喜显示我要报喜，已报喜显示我的报喜', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('baoxi-list.html');
    vm.runInContext('render()', sandbox);
    assert.ok(document._html.includes('我要报喜') && document._html.includes("href='baoxi.html'"), '未报喜应显示我要报喜');
    assert.ok(!document._html.includes('我的报喜'), '未报喜不应显示我的报喜');
    store['baoxi_submitted'] = '1';
    store['baoxi_my_report'] = JSON.stringify({ id: 'mine', names: ['甜心小鹿', '陈屿'], avatars: ['a.jpg', 'b.jpg'], events: [{ time: '', html: 'x' }] });
    vm.runInContext('render()', sandbox);
    assert.ok(document._html.includes('我的报喜') && document._html.includes('baoxi-detail.html?id=mine'), '已报喜应显示我的报喜');
    assert.ok(!document._html.includes('我要报喜'), '已报喜不应再显示我要报喜');
    assert.ok(!document._html.includes('在一起了吗'), '已报喜不应再显示报喜引导卡');
    // 标记在但记录缺失/损坏：回退"我要报喜"并重新显示引导卡
    store['baoxi_my_report'] = null;
    vm.runInContext('render()', sandbox);
    assert.ok(document._html.includes('我要报喜') && !document._html.includes('我的报喜'), '记录缺失应回退我要报喜');
    assert.ok(document._html.includes('在一起了吗'), '记录缺失应重新显示报喜引导卡');
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
    assert.ok(html.includes('text-sm font-bold text-red-500'), '红包提示应加红加粗放大');
    const src = fs.readFileSync(path.join(dir, 'baoxi.html'), 'utf8');
    assert.ok(src.includes('lib/baoxi-report.js'), '报喜页应引用共享海报模块');
    assert.ok(src.includes('已收到您的喜讯，我们核实后将会有大礼相赠！'), '报喜提交后界面应有喜讯状态提示');
    assert.ok(!src.includes('返回首页'), '报喜提交后界面返回首页应改为返回');
    assert.ok(sandbox.window.BaoxiReport && typeof sandbox.window.BaoxiReport.posterHtml === 'function', '共享海报模块应加载');
    assert.ok(sandbox.window.BaoxiPoster && typeof sandbox.window.BaoxiPoster.download === 'function', '海报下载能力应在共享模块中');
});

test('报喜首页：未注册脱单资料随机分支——底部邀请报喜+神助攻组合弹窗', () => {
    clearStore();
    const { document, toasts, sandbox } = makeSandbox('baoxi-list.html');
    // 默认分支（随机数 0.5 不触发）：有脱单资料 → 我要报喜
    vm.runInContext('render()', sandbox);
    assert.ok(document._html.includes('我要报喜') && !document._html.includes('邀请报喜'), '默认分支应显示我要报喜');
    // 未注册分支：底部按钮变邀请报喜，点击弹出神助攻过的组合记录
    vm.runInContext('NO_PROFILE=true; render()', sandbox);
    const html = document._html;
    assert.ok(html.includes('邀请报喜') && !html.includes('我要报喜') && !html.includes('我的报喜'), '未注册分支底部按钮应为邀请报喜');
    assert.ok(html.includes('openInvite()'), '邀请报喜按钮应打开底部弹窗');
    assert.ok(html.includes('invite-popup') && html.includes('您助攻或助力过的组合'), '应有邀请报喜底部弹窗');
    const pairCount = vm.runInContext('ASSIST_PAIRS.length', sandbox);
    const assistCount = (html.match(/为他俩送上神助攻/g) || []).length;
    const helpCount = (html.match(/为他俩助力/g) || []).length;
    assert.strictEqual(assistCount + helpCount, pairCount, '弹窗应展示助攻/助力过的组合记录');
    assert.ok(assistCount > 0 && helpCount > 0, '记录应同时含神助攻与助力文案');
    assert.ok(html.includes('style="color:#E85D3A;">❤</span>'), '昵称之间的桃心应为红色');
    assert.strictEqual((html.match(/inviteOne\(/g) || []).length, pairCount, '每条组合记录应有邀请报喜按钮');
    // 点击邀请：提示已向对方发出邀请
    vm.runInContext("inviteOne('阳光骑士','栀子花开')", sandbox);
    assert.ok(toasts.includes('已向对方发出邀请！'), '点击邀请应提示已发出邀请');
    // 已报喜用户必然注册过资料：即使随机到未注册分支，仍显示"我的报喜"
    store['baoxi_submitted'] = '1';
    store['baoxi_my_report'] = JSON.stringify({ id: 'mine', names: ['甜心小鹿', '陈屿'], avatars: ['a.jpg', 'b.jpg'], events: [{ time: '', html: 'x' }] });
    vm.runInContext('render()', sandbox);
    assert.ok(document._html.includes('我的报喜') && !document._html.includes('邀请报喜'), '已报喜用户不应显示邀请报喜');
});

test('我的报喜：未传结婚证时海报上方有补传区块（红色加粗大字520红包提示）', () => {
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
    assert.ok(html.includes('补传结婚证') && html.includes('点击上传结婚证照片'), '未传结婚证应显示补传区块');
    assert.ok(html.includes('平台审核通过后，将为您送上520元官方红包祝贺'), '应有审核红包提示');
    assert.ok(html.includes('text-base font-bold text-red-500'), '红包提示应为红色加粗大字');
    const certIdx = html.indexOf('补传结婚证'), posterIdx = html.indexOf('喜 结 良 缘');
    assert.ok(certIdx !== -1 && certIdx < posterIdx, '补传区块应位于结缘海报上方');
    assert.ok(html.includes('onCertPick(this)') && html.includes('id="mine-cert"'), '补传区块应可单独上传结婚证');
    // 已传结婚证：隐藏补传区块
    const rec = JSON.parse(store['baoxi_my_report']);
    rec.certPhoto = 'data:image/jpeg;base64,xxx';
    store['baoxi_my_report'] = JSON.stringify(rec);
    vm.runInContext('render()', sandbox);
    assert.ok(!document._html.includes('补传结婚证'), '已传结婚证不应再显示补传区块');
    // 他人的报喜详情不受影响
    const env2 = makeSandbox('baoxi-detail.html', '?id=bx1');
    vm.runInContext('render()', env2.sandbox);
    assert.ok(!env2.document._html.includes('补传结婚证'), '他人的报喜详情不应显示补传区块');
});

test('我的报喜：底部可删除报喜（仅演示），删除后回到未报喜状态', () => {
    clearStore();
    store['baoxi_submitted'] = '1';
    store['baoxi_my_report'] = JSON.stringify({
        id: 'mine', time: '2026年10月20日',
        names: ['甜心小鹿', '陈屿'],
        avatars: ['images/photo/female/crop.0.67.1079.1438.0.750.1000.jpg', 'images/photo/male/crop.0.0.1078.1438.0.750.1000.jpg'],
        genders: ['female', 'male'],
        couplePhoto: '',
        story: '我们报喜啦！感谢平台见证我们的幸福！',
        events: [{ time: '', html: '<b>甜心小鹿</b>加入了他俩能成' }]
    });
    const { document, toasts, sandbox } = makeSandbox('baoxi-detail.html', '?id=mine');
    vm.runInContext('render()', sandbox);
    const html = document._html;
    assert.ok(html.includes('删除报喜（仅演示）') && html.includes('deleteMyReport()'), '我的报喜底部应有删除报喜按钮');
    // 删除后：标记与记录清除，回到未报喜引导
    vm.runInContext('deleteMyReport()', sandbox);
    assert.strictEqual(store['baoxi_submitted'], undefined, '删除后应清除已报喜标记');
    assert.strictEqual(store['baoxi_my_report'], undefined, '删除后应清除报喜记录');
    assert.ok(document._html.includes('你还未报喜') && document._html.includes('去报喜'), '删除后应回到未报喜引导');
    assert.ok(toasts.includes('报喜信息已删除'), '删除后应提示已删除');
    // 他人的报喜详情不应有删除按钮
    const env2 = makeSandbox('baoxi-detail.html', '?id=bx1');
    vm.runInContext('render()', env2.sandbox);
    assert.ok(!env2.document._html.includes('删除报喜'), '他人的报喜详情不应有删除按钮');
});

test('报喜页：第一步选择TA支持按能成ID或昵称搜索并可清空', () => {
    clearStore();
    const { document, sandbox } = makeSandbox('baoxi.html');
    vm.runInContext('renderForm()', sandbox);
    let html = document._html;
    assert.ok(html.includes('输入能成ID或昵称') && html.includes('pick-search') && html.includes('applySearch()'), '应有搜索框与搜索按钮');
    // 候选用户均应有唯一能成ID，卡片展示ID
    const ids = vm.runInContext('MATCHED.map(function(u){return u.id;})', sandbox);
    assert.ok(Array.from(ids).every(Boolean), '候选用户均应有能成ID');
    assert.strictEqual(new Set(Array.from(ids)).size, Array.from(ids).length, '能成ID应唯一');
    assert.ok(html.includes('ID:10000136'), '候选卡片应展示能成ID');
    // 候选性别一致：均为男性，卡片不显示性别标识
    assert.ok(vm.runInContext("MATCHED.every(function(u){return u.gender==='male';})", sandbox), '1314候选应均为男性');
    const railHtml = vm.runInContext('railHtml()', sandbox);
    assert.ok(!railHtml.includes('bg-blue-50') && !railHtml.includes('bg-pink-50') && !railHtml.includes('data-lucide="mars"') && !railHtml.includes('data-lucide="venus"'), '候选卡片不应显示性别标识');
    // 按昵称关键词过滤：只保留符合关键词的用户，并显示结果数与清空入口
    const secHtml = vm.runInContext("(function(){searchKw='风';return pickSectionHtml();})()", sandbox);
    assert.ok(secHtml.includes('清风徐来') && secHtml.includes('追风少年'), '昵称含关键词的用户应保留');
    assert.ok(!secHtml.includes('阳光骑士') && !secHtml.includes('奶茶妹妹'), '昵称不含关键词的用户应被过滤');
    assert.ok(secHtml.includes('找到 <b>2</b>') && secHtml.includes('清空搜索'), '应有结果数与清空搜索入口');
    // 按能成ID搜索：精确命中
    const byId = vm.runInContext("(function(){searchKw='10000137';return visibleUsers().map(function(u){return u.name;});})()", sandbox);
    assert.deepStrictEqual(Array.from(byId), ['清风徐来'], '按能成ID搜索应精确命中');
    // 无匹配：返回空并提示
    assert.strictEqual(vm.runInContext("(function(){searchKw='不存在';return visibleUsers().length;})()", sandbox), 0, '无匹配应返回空列表');
    const noneHtml = vm.runInContext("(function(){searchKw='不存在';return pickSectionHtml();})()", sandbox);
    assert.ok(noneHtml.includes('没有找到符合条件的用户'), '无匹配应有空结果提示');
    // 清空搜索条件：恢复全部候选
    vm.runInContext("searchKw='不存在'; clearSearch()", sandbox);
    assert.strictEqual(vm.runInContext('searchKw', sandbox), '', '清空后搜索词应为空');
    assert.strictEqual(vm.runInContext('visibleUsers().length', sandbox), vm.runInContext('MATCHED.length', sandbox), '清空后应显示全部候选');
    // 已选TA被搜索过滤掉时清除选中，避免提交时用了页面上看不到的人
    vm.runInContext("selUser=MATCHED[0]; searchKw='海'; refreshPick()", sandbox);
    assert.strictEqual(vm.runInContext('selUser', sandbox), null, '已选TA被搜索过滤后应清除选中');
    vm.runInContext("selUser=MATCHED[0]; searchKw=''; refreshPick()", sandbox);
    assert.ok(vm.runInContext('selUser && selUser.name', sandbox) === '阳光骑士', '未过滤时应保留选中');
    // 搜索词转义防注入
    const escHtml = vm.runInContext("(function(){searchKw='<b>';return pickSectionHtml();})()", sandbox);
    assert.ok(escHtml.includes('value="&lt;b&gt;"'), '搜索词应转义防注入');
});

test('v参数透传：入口带v后持久化，站内跳转自动附加', () => {
    clearStore();
    // 带 v 进入页面：持久化参数
    const env = makeSandbox('baoxi-list.html', '?v=20261104');
    assert.strictEqual(env.sandbox.window.Common.getVParam(), '20261104', '入口v参数应被持久化');
    // 赋值式跳转自动附加 v（无查询参数用?，有查询参数用&）
    env.sandbox.window.Common.href = 'baoxi.html';
    assert.strictEqual(env.sandbox.window.location.href, 'baoxi.html?v=20261104', '站内跳转应附加v参数');
    env.sandbox.window.Common.href = 'baoxi-detail.html?id=mine';
    assert.strictEqual(env.sandbox.window.location.href, 'baoxi-detail.html?id=mine&v=20261104', '带查询参数的跳转应以&连接v参数');
    // 外链/锚点/已带v 不附加
    env.sandbox.window.Common.href = 'https://example.com/x';
    assert.strictEqual(env.sandbox.window.location.href, 'https://example.com/x', '外链不应附加v参数');
    env.sandbox.window.Common.href = '#top';
    assert.strictEqual(env.sandbox.window.location.href, '#top', '锚点不应附加v参数');
    env.sandbox.window.Common.href = 'baoxi.html?v=999';
    assert.strictEqual(env.sandbox.window.location.href, 'baoxi.html?v=999', '已带v参数的地址不重复附加');
    // 锚点：v 拼在 fragment 之前；含 v= 子串的其他参数不误判
    env.sandbox.window.Common.href = 'profile.html#about';
    assert.strictEqual(env.sandbox.window.location.href, 'profile.html?v=20261104#about', '带锚点的地址v应拼在fragment之前');
    env.sandbox.window.Common.href = 'ranking.html?rev=2';
    assert.strictEqual(env.sandbox.window.location.href, 'ranking.html?rev=2&v=20261104', '含v=子串的其他参数不应阻止追加v');
    // goBaoxi 跳转同样带 v
    env.sandbox.window.Common.goBaoxi();
    assert.strictEqual(env.sandbox.window.location.href, 'baoxi.html?v=20261104', 'goBaoxi跳转应附加v参数');
    // 后续页面即使不带 v 进入，也继续透传（持久化读取）
    const env2 = makeSandbox('index.html');
    env2.sandbox.window.Common.href = 'ranking.html';
    assert.strictEqual(env2.sandbox.window.location.href, 'ranking.html?v=20261104', '后续页面应继续透传v参数');
    // 新的入口 v 参数覆盖旧值
    const env3 = makeSandbox('ranking.html', '?v=20261225');
    assert.strictEqual(env3.sandbox.window.Common.getVParam(), '20261225', '新的入口v参数应覆盖旧值');
});
