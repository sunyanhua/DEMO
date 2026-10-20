/**
 * 随份子模块（报喜列表页与报喜详情页共用）
 * BaoxiGifts：份子数据与规则（localStorage 持久化，官方首礼 520）
 * BaoxiGifts.createUi(page) -> 随份子弹窗状态机（modalHtml 输出弹窗 HTML）
 */
var CURRENT_USER = { name: '甜心小鹿', avatar: 'images/photo/female/crop.0.67.1079.1438.0.750.1000.jpg' };
var GIFTS_KEY = 'baoxi_gifts_v1';
var MY_KEY = 'baoxi_my_gift_';

var VIRTUAL_GIFTS = [
    { icon: '🍬', name: '喜糖' },
    { icon: '🌹', name: '玫瑰' },
    { icon: '🔒', name: '同心锁' },
    { icon: '🎆', name: '烟花' },
    { icon: '🐟', name: '锦鲤' },
    { icon: '🕯️', name: '烛光' }
];
var MONEY_PRESETS = ['0.10', '0.99', '1.11', '2', '3', '5.20'];

function readGiftMap() {
    try { return JSON.parse(localStorage.getItem(GIFTS_KEY) || '{}'); } catch (e) { return {}; }
}
function writeGiftMap(map) {
    try { localStorage.setItem(GIFTS_KEY, JSON.stringify(map)); } catch (e) {}
}
function getGifts(pairId) {
    var map = readGiftMap();
    if (!map[pairId]) {
        map[pairId] = [{
            from: '他俩能成', avatar: 'images/logo_center.png', gift: '官方红包 ¥520', amount: 520,
            official: true, time: '成亲首礼'
        }];
        writeGiftMap(map);
    }
    return map[pairId];
}
function myGiftDone(pairId) {
    return localStorage.getItem(MY_KEY + pairId) === '1';
}
function validateAmount(v) {
    var n = parseFloat(v);
    if (isNaN(n) || !/^\d+(\.\d{1,2})?$/.test(String(v).trim())) return null;
    if (n < 0.01 || n > 520) return null;
    return Math.round(n * 100) / 100;
}
function submitGift(pairId, opt) {
    if (myGiftDone(pairId)) {
        window.Common.showToast('每个报喜只能随一次份子哦');
        return false;
    }
    var map = readGiftMap();
    if (!map[pairId]) { getGifts(pairId); map = readGiftMap(); }
    var entry;
    if (opt.type === 'money') {
        var amt = validateAmount(opt.amount);
        if (amt === null) { window.Common.showToast('请输入 0.01-520 之间的金额'); return false; }
        entry = { from: CURRENT_USER.name, avatar: CURRENT_USER.avatar, gift: '红包 ¥' + amt, amount: amt, official: false, time: nowTime() };
    } else {
        entry = { from: CURRENT_USER.name, avatar: CURRENT_USER.avatar, gift: opt.icon + ' ' + opt.name, amount: 0, official: false, time: nowTime() };
    }
    map[pairId].push(entry);
    writeGiftMap(map);
    localStorage.setItem(MY_KEY + pairId, '1');
    return true;
}
function nowTime() {
    var d = new Date();
    return d.getMonth() + 1 + '月' + d.getDate() + '日 ' + (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
}

// 份子清单 HTML（海报最下方区域）
function giftListHtml(pair) {
    var gifts = getGifts(pair.id);
    var rows = gifts.map(function (g) {
        return `
        <div class="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-none">
            <img src="${g.avatar}" class="w-7 h-7 rounded-full object-cover border border-gray-100 flex-shrink-0"/>
            <span class="text-[10px] font-bold text-gray-700 flex-shrink-0">${g.from}${g.official ? '<span class="px-1 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink text-[8px] font-bold ml-1">官方</span>' : ''}</span>
            <span class="text-[10px] text-gray-400 truncate flex-1 text-right">${g.gift}</span>
        </div>
        `;
    }).join('');
    return `
    <div class="rounded-xl p-3 mt-4 text-left" style="background:rgba(255,255,255,0.75);border:1px solid rgba(224,77,44,0.15);">
        <p class="text-xs font-black mb-1.5" style="color:#E85D3A;">已收到的份子（${gifts.length}）</p>
        ${rows}
    </div>
    `;
}

// 随份子弹窗状态机（每页一个实例）
function createGiftUi(page) {
    var state = { pairId: null, show: false, giftType: 'gift', selectedGift: null, customAmount: '' };
    var ui = {
        open: function (pairId) {
            state.pairId = pairId;
            state.show = true;
            state.giftType = 'gift';
            state.selectedGift = null;
            state.customAmount = '';
            page.render();
        },
        close: function () { state.show = false; page.render(); },
        selectGiftType: function (t) { state.giftType = t; page.render(); },
        selectGift: function (icon, name) { state.giftType = 'gift'; state.selectedGift = { icon: icon, name: name }; page.render(); },
        selectMoney: function (m) { state.giftType = 'money'; state.customAmount = m; page.render(); },
        onAmount: function (v) { state.customAmount = v; },
        submit: function () {
            var ok;
            if (state.giftType === 'gift') {
                if (!state.selectedGift) { window.Common.showToast('请选择一份虚拟礼物'); return; }
                ok = submitGift(state.pairId, { type: 'gift', icon: state.selectedGift.icon, name: state.selectedGift.name });
            } else {
                ok = submitGift(state.pairId, { type: 'money', amount: state.customAmount });
            }
            if (ok) {
                window.Common.showToast('随份子成功，心意已送达 💝');
                state.show = false;
                page.render();
            }
        },
        modalHtml: function () {
            if (!state.show || !state.pairId) return '';
            var pair = window.BaoxiData.getPair(state.pairId);
            if (!pair) return '';
            var giftChips = VIRTUAL_GIFTS.map(function (g) {
                var active = state.selectedGift && state.selectedGift.name === g.name;
                return `
                <span onclick="__GIFT_UI__.selectGift('${g.icon}','${g.name}')" class="flex flex-col items-center gap-1 py-3 rounded-xl border cursor-pointer card-hover ${active ? 'border-brand-pink bg-brand-pink/10' : 'border-gray-100 bg-white'}">
                    <span class="text-2xl">${g.icon}</span>
                    <span class="text-[10px] font-bold ${active ? 'text-brand-pink' : 'text-gray-600'}">${g.name}</span>
                </span>
                `;
            }).join('');
            var presetChips = MONEY_PRESETS.map(function (m) {
                var active = state.giftType === 'money' && state.customAmount === m;
                return `
                <span onclick="__GIFT_UI__.selectMoney('${m}')" class="px-3.5 py-2 rounded-full border cursor-pointer card-hover text-sm font-bold ${active ? 'border-brand-pink bg-brand-pink/10 text-brand-pink' : 'border-gray-200 bg-white text-gray-600'}">¥${m}</span>
                `;
            }).join('');
            return `
            <div class="fixed inset-0 bg-black/40 z-[200] flex items-end" onclick="__GIFT_UI__.close()">
                <div class="bg-white rounded-t-2xl w-full px-4 py-4 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto no-scrollbar" onclick="event.stopPropagation()">
                    <p class="font-black text-gray-800 text-base text-center">随份子 · ${pair.names[0]} × ${pair.names[1]}</p>
                    <p class="text-[10px] text-gray-400 text-center mt-1">每个报喜只能随一次，心意与红包任选其一</p>
                    <div class="flex gap-2 mt-4">
                        <span onclick="__GIFT_UI__.selectGiftType('gift')" class="flex-1 py-2 text-center rounded-full text-sm font-bold cursor-pointer card-hover ${state.giftType === 'gift' ? 'bg-gradient-to-tr from-brand-pink to-brand-orange text-white' : 'bg-gray-100 text-gray-500'}">虚拟礼物</span>
                        <span onclick="__GIFT_UI__.selectGiftType('money')" class="flex-1 py-2 text-center rounded-full text-sm font-bold cursor-pointer card-hover ${state.giftType === 'money' ? 'bg-gradient-to-tr from-brand-pink to-brand-orange text-white' : 'bg-gray-100 text-gray-500'}">现金红包</span>
                    </div>
                    ${state.giftType === 'gift' ? `
                    <div class="grid grid-cols-3 gap-2 mt-4">${giftChips}</div>
                    <p class="text-[10px] text-gray-400 mt-2 text-center">虚拟礼物免费送出，心意无价</p>
                    ` : `
                    <div class="flex flex-wrap gap-2 mt-4">${presetChips}</div>
                    <input id="gift-amount" type="number" placeholder="自定义金额（0.01-520）" value="${state.customAmount}" oninput="__GIFT_UI__.onAmount(this.value)" class="block w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:border-brand-pink mt-3"/>
                    `}
                    <span onclick="__GIFT_UI__.submit()" class="block text-center cursor-pointer w-full py-3.5 rounded-full bg-gradient-to-tr from-brand-pink to-brand-orange text-white font-bold text-base shadow-lg shadow-brand-pink/30 card-hover mt-4">送出份子</span>
                </div>
            </div>
            `;
        }
    };
    window.__GIFT_UI__ = ui;
    return ui;
}

window.BaoxiGifts = {
    getGifts: getGifts,
    myGiftDone: myGiftDone,
    validateAmount: validateAmount,
    submitGift: submitGift,
    giftListHtml: giftListHtml,
    createUi: createGiftUi,
    VIRTUAL_GIFTS: VIRTUAL_GIFTS,
    MONEY_PRESETS: MONEY_PRESETS
};
