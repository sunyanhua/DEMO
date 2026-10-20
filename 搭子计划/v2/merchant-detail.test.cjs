/**
 * 合作商家详情页测试（node merchant-detail.test.cjs）
 * 在浏览器语义沙箱中执行 data.js + merchant-detail.html 内联脚本。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function makePageSandbox(search) {
    const document = {
        _html: '',
        getElementById() { return document; },
        set innerHTML(v) { document._html = v; },
        get innerHTML() { return document._html; },
        querySelectorAll() { return []; },
        addEventListener() {}
    };
    const sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const toasts = [];
    const sandbox = {
        window: { scrollY: 0, scrollTo() {}, location: { href: '', search: search || '' } },
        document,
        sessionStorage,
        URLSearchParams,
        setTimeout: (fn) => fn()
    };
    sandbox.window.sessionStorage = sessionStorage;
    sandbox.window.document = document;
    sandbox.window.Common = {
        renderBottomNav: () => '<div class="__bottom_nav__"></div>',
        initIcons() {},
        showToast: (msg) => toasts.push(msg)
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    const html = fs.readFileSync(path.join(dir, 'merchant-detail.html'), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
    vm.runInContext(inline, sandbox);
    return { MerchantDetail: sandbox.window.MerchantDetail, document, GlobalData: sandbox.window.GlobalData, toasts };
}

test('合作商家注册表：id 唯一且详情字段齐全', () => {
    const { GlobalData } = makePageSandbox();
    const registry = GlobalData.partnerMerchants;
    assert.ok(registry, '应存在 partnerMerchants 注册表');
    const entries = Object.values(registry);
    assert.ok(entries.length >= 5, '应至少 5 家合作商家');
    const ids = entries.map(m => m.id);
    assert.strictEqual(new Set(ids).size, ids.length, '商户 id 应全局唯一');
    for (const m of entries) {
        assert.ok(m.name && m.budget && m.district, `${m.id} 缺少基础字段`);
        assert.ok(m.businessHours && m.businessHours.length > 5, `${m.id} 应有营业时间`);
        assert.ok(m.description && m.description.length > 20, `${m.id} 店面介绍过短`);
        assert.ok(typeof m.notes === 'string' && m.notes.length > 10, `${m.id} 注意事项应为一句话`);
        assert.ok(Array.isArray(m.images) && m.images.length >= 3, `${m.id} 店面图应至少 3 张`);
        for (const img of m.images) assert.ok(img.startsWith('https://images.unsplash.com'), `${m.id} 图片应使用 unsplash`);
        assert.ok(m.address, `${m.id} 缺少地址`);
        assert.ok(m.location && typeof m.location.lng === 'number' && typeof m.location.lat === 'number', `${m.id} 应有经纬度`);
        assert.ok(Array.isArray(m.coupons) && m.coupons.length >= 2, `${m.id} 优惠应至少 2 项`);
        for (const c of m.coupons) {
            assert.ok(c.id && c.title && c.description && c.value, `${m.id} 优惠字段不全`);
            assert.ok(c.code && c.code.length >= 6, `${m.id} 优惠 ${c.id} 应有券码/核销码`);
        }
        assert.ok(m.couponMode === 'code' || m.couponMode === 'qr', `${m.id} 应有 couponMode（code/qr）`);
    }
    // 茶百道用券码、北平机器/华熙用核销二维码
    for (const m of entries) {
        if (m.name.includes('茶百道')) assert.strictEqual(m.couponMode, 'code', `${m.id} 应为券码模式`);
        else assert.strictEqual(m.couponMode, 'qr', `${m.id} 应为核销二维码模式`);
    }
    // 华熙LIVE商圈优惠需带店名与相关优惠内容
    const huaxi = registry['m-huaxi'];
    assert.ok(huaxi.coupons.some(c => c.title.includes('（华熙店）')), '华熙优惠应包含店名');
    assert.ok(huaxi.coupons.some(c => c.title.includes('满100减15') || c.title.includes('9折')), '华熙优惠应包含具体优惠内容');
});

test('商户详情页渲染全部内容区块（茶百道三里屯店）', () => {
    const { MerchantDetail, document } = makePageSandbox('?id=m-teabadao-slt');
    MerchantDetail.render();
    const html = document._html;
    assert.ok(html.includes('茶百道（三里屯店）'), '应展示店名');
    assert.ok(html.includes('¥15-25/人'), '应展示预算');
    assert.ok(html.includes('三里屯'), '应展示片区');
    assert.ok(html.includes('平台合作'), '应展示平台合作标识');
    assert.ok(html.includes('营业时间'), '应展示营业时间');
    assert.ok(html.includes('10:00-22:00'), '应展示具体营业时间段');
    assert.ok(!html.includes('店面介绍'), '店面介绍标题应已移除');
    assert.ok(!html.includes('注意事项'), '注意事项标题应已移除');
    assert.ok(html.includes('三里屯核心商圈的连锁鲜果茶店'), '介绍内容应直接展示');
    assert.ok(html.includes('周末下午出杯较慢，建议小程序提前下单，高峰时段建议外带。'), '注意事项应以一句话展示');
    assert.ok(html.includes('bg-amber-50'), '注意事项应为黄色背景提示样式');
    assert.ok((html.match(/<img /g) || []).length >= 3, '店面图片应至少 3 张');
    assert.ok(html.includes('北京市朝阳区三里屯太古里南区 B1'), '应展示详细地址');
    assert.ok(html.includes('到这儿去'), '应有到这儿去按钮');
    assert.ok(html.includes('uri.amap.com/marker'), '到这儿去应使用地图导航链接');
    assert.ok(html.includes('店内优惠'), '应展示店内优惠区');
    assert.ok((html.match(/>领取<\/button>/g) || []).length >= 2, '每项优惠应有领取按钮');
    assert.ok(!html.includes('__bottom_nav__'), '不应渲染底部导航');
});

test('领取优惠点击弹提示，按钮变为「已领取，去使用」', () => {
    const { MerchantDetail, document, toasts } = makePageSandbox('?id=m-teabadao-slt');
    MerchantDetail.render();
    const couponId = MerchantDetail.merchant.coupons[0].id;
    MerchantDetail.claim(couponId);
    assert.ok(toasts.some(t => t.includes('领取成功')), `领取应弹成功提示, got: ${toasts.join('|')}`);
    assert.strictEqual(MerchantDetail.claimed[couponId], true, '领取后应标记已领取');
    assert.ok(document._html.includes('已领取，去使用'), '领取后按钮应显示「已领取，去使用」');
    assert.ok(document._html.includes('openUsage'), '已领取按钮应可点击进入使用面板');
});

test('茶百道优惠：使用面板展示券码与一键复制', () => {
    const { MerchantDetail, document, toasts } = makePageSandbox('?id=m-teabadao-slt');
    MerchantDetail.render();
    const couponId = MerchantDetail.merchant.coupons[0].id;
    MerchantDetail.claim(couponId);
    MerchantDetail.openUsage(couponId);
    const html = document._html;
    assert.ok(html.includes('请复制券码后前往茶百道小程序下单时使用'), '应展示小程序使用提示');
    assert.ok(html.includes(MerchantDetail.merchant.coupons[0].code), '应展示券码');
    assert.ok(html.includes('一键复制'), '应有一键复制按钮');
    MerchantDetail.copyCode(couponId);
    assert.ok(toasts.some(t => t.includes('已复制')), `复制应弹提示, got: ${toasts.join('|')}`);
    MerchantDetail.closeUsage();
    assert.ok(!document._html.includes('一键复制'), '关闭后使用面板应消失');
});

test('北平机器/华熙优惠：使用面板展示核销二维码与核销提示', () => {
    const { MerchantDetail, document } = makePageSandbox('?id=m-beiping-798');
    MerchantDetail.render();
    const couponId = MerchantDetail.merchant.coupons[0].id;
    MerchantDetail.claim(couponId);
    MerchantDetail.openUsage(couponId);
    const html = document._html;
    assert.ok(html.includes('请在点单时将核销码出示给店员核销使用'), '应展示核销提示');
    assert.ok(html.includes('qr-canvas'), '应有核销二维码画布');
    assert.ok(!html.includes('核销码：'), '二维码模式不应显示核销码字符');
    assert.ok(!html.includes('一键复制'), '核销模式不应有一键复制');
});

test('未知商家 id 展示错误视图', () => {
    const { MerchantDetail, document } = makePageSandbox('?id=unknown-id');
    MerchantDetail.render();
    assert.ok(document._html.includes('商户信息加载失败'));
    assert.ok(!document._html.includes('店内优惠'));
});

test('tab=coupons 参数下正常渲染优惠区', () => {
    const { MerchantDetail, document } = makePageSandbox('?id=m-teabadao-slt&tab=coupons');
    MerchantDetail.render();
    assert.ok(document._html.includes('店内优惠'), 'tab=coupons 下应正常渲染优惠区');
});
