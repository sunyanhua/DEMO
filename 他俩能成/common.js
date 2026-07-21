// ============================================
//   他俩能成 — 公共函数库
// ============================================

// --- Tailwind 品牌色配置 ---
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    brand: {
                        pink: '#e04d2c',
                        'pink-light': '#FFF0EC',
                        'pink-dark': '#C43E20',
                        orange: '#F06840',
                        'orange-light': '#FFF5F2',
                    }
                }
            }
        }
    };
}

window.Common = {

    // --- 渲染底部导航栏 ---
    renderBottomNav(activeTabId) {
        const tabs = [
            { id: 'home',    label: '首页', icon: 'home',             href: 'index.html',    special: false },
            { id: 'activity',label: '活动', icon: 'calendar',         href: 'activity.html',  special: false },
            { id: 'center',  label: '',     icon: null,               href: 'interact.html',  special: true },
            { id: 'message', label: '消息', icon: 'message-circle',   href: 'message.html',   special: false },
            { id: 'me',      label: '我的', icon: 'user',             href: 'me.html',        special: false },
        ];

        const items = tabs.map(t => {
            if (t.special) {
                return `
                <a href="${t.href}" class="flex flex-col items-center justify-end w-16 -mt-9 no-underline">
                    <div class="rounded-full flex items-center justify-center raised-btn border-[3px] border-white/80 card-hover bg-gradient-to-tr from-brand-pink to-brand-orange shadow-lg shadow-brand-pink/25" style="width:66px;height:66px;">
                        <img src="images/logo_center.png" alt="logo" class="object-contain" style="width:42px;height:42px;" />
                    </div>
                </a>`;
            }
            const isActive = activeTabId === t.id;
            return `
            <a href="${t.href}" class="flex flex-col items-center justify-center w-16 space-y-0.5 cursor-pointer no-underline">
                <div class="p-1 rounded-lg transition-all duration-200 ${isActive ? 'bg-white/90 shadow-sm' : 'hover:bg-white/30'}">
                    <i data-lucide="${t.icon}" class="w-6 h-6 ${isActive ? 'text-brand-pink' : 'text-gray-500'}" stroke-width="${isActive ? 2.5 : 2}"></i>
                </div>
                <span class="text-[11px] font-medium ${isActive ? 'text-brand-pink' : 'text-gray-500'}">${t.label}</span>
            </a>`;
        }).join('');

        return `
        <div class="fixed bottom-0 left-0 right-0 z-50" style="background:linear-gradient(180deg, rgba(255,245,242,0.92) 0%, rgba(255,240,236,0.96) 100%);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 -1px 0 rgba(224,77,44,0.12),0 -4px 16px rgba(224,77,44,0.06);">
            <div class="flex justify-between items-end pb-3 h-[68px] px-4 pt-4">
                ${items}
            </div>
        </div>`;
    },

    // --- 图标初始化（含重试） ---
    initIcons() {
        if (typeof lucide !== 'undefined') {
            try { lucide.createIcons(); } catch(e) {}
            setTimeout(() => { try { lucide.createIcons(); } catch(e) {} }, 200);
        }
    },

    // --- Toast 提示 ---
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);color:#fff;padding:10px 18px;border-radius:10px;z-index:9999;font-size:14px;opacity:0;transition:opacity 0.25s ease;';
        toast.innerText = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 1800);
    },

    // --- 弹窗显隐（含图标初始化） ---
    showPopup(id) {
        var el = typeof id === 'string' ? document.getElementById(id) : id;
        if (!el) return;
        el.classList.remove('hidden');
        el.classList.add('flex');
        var self = this;
        setTimeout(function() { self._icons(el); }, 50);
    },
    hidePopup(id) {
        var el = typeof id === 'string' ? document.getElementById(id) : id;
        if (!el) return;
        el.classList.add('hidden');
        el.classList.remove('flex');
    },
    // 点击遮罩关闭弹窗（onclick="Common.closePopup(event, 'my-popup')"）
    closePopup(event, id) {
        if (event && event.target !== document.getElementById(id)) return;
        this.hidePopup(id);
    },
    // 内部图标初始化，优先局部渲染
    _icons(el) {
        if (typeof lucide === 'undefined') return;
        try { lucide.createIcons({ target: el }); } catch(e) {}
        try { lucide.createIcons(); } catch(e) {}
    },

    // --- Tab 吸顶 padding 切换 ---
    initStickyTab() {
        const tabBar = document.getElementById('tab-bar');
        const sentinel = document.querySelector('.rounded-top');
        if (!tabBar || !sentinel) return;
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                tabBar.classList.remove('pt-1.5');
            } else {
                tabBar.classList.add('pt-1.5');
            }
        }, { threshold: 0 });
        observer.observe(sentinel);
    }

};

// ============================================
//   公共数据（mock data 统一入口）
// ============================================
window.AppData = {
    CONS: ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'],
    ZODIACS: ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'],
    DISTRICTS: ['东城区','西城区','朝阳区','海淀区','丰台区','石景山区','通州区','大兴区','房山区','门头沟区','昌平区','顺义区','平谷区','怀柔区','密云区','延庆区','其他'],
    NATIONS: ['汉族','蒙古族','回族','藏族','维吾尔族','苗族','彝族','壮族','满族','朝鲜族','外国民族'],
    PROVS: ['北京市','天津市','上海市','重庆市','河北省','山西省','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','海南省','四川省','贵州省','云南省','陕西省','甘肃省','青海省','台湾省','内蒙古自治区','广西壮族自治区','西藏自治区','宁夏回族自治区','新疆维吾尔自治区','香港特别行政区','澳门特别行政区','外籍','其他'],
    EDU: ['高中及以下','大专','大学本科','硕士','博士'],
    BLOOD: ['A型','B型','AB型','O型'],
    MARITAL: ['未婚','离异','丧偶'],
    NM: ['阳光骑士','清风徐来','北辰','追风少年','海的彼岸','咖啡不加糖','大熊','星河漫步','枫叶飘零','时光旅人','城北徐公','蓝调人生'],
    NF: ['甜心小鹿','浅笑安然','栀子花开','棉花糖','薄荷微光','雪落无声','小兔软糖','咕咚姑娘','奶茶妹妹','月亮不睡','星光点点','初夏之梦'],
    PHOTOS_M: ['images/photo/male/crop.17.0.1224.1632.0.750.1000.jpg','images/photo/male/crop.0.0.1078.1438.0.750.1000.jpg','images/photo/male/crop.194.56.917.1222.0.750.1000.jpg','images/photo/male/crop.0.237.1080.1440.0.750.1000.jpg','images/photo/male/crop.0.501.960.1280.0.750.1000.jpg','images/photo/male/crop.0.54.942.1256.0.750.1000.jpg','images/photo/male/crop.1.0.3877.5170.0.750.1000.jpg','images/photo/male/crop.0.0.1773.2364.0.750.1000.jpg','images/photo/male/crop.0.875.2143.2857.0.750.1000.jpg','images/photo/male/crop.1033.0.3000.4000.0.750.1000.jpg'],
    PHOTOS_F: ['images/photo/female/crop.0.67.1079.1438.0.750.1000.jpg','images/photo/female/crop.0.61.723.964.0.750.1000.jpg','images/photo/female/crop.384.0.2304.3072.0.750.1000.jpg','images/photo/female/crop.0.0.2267.3023.0.750.1000.jpg','images/photo/female/crop.0.0.4896.6528.0.750.1000.jpg','images/photo/female/crop.70.444.1537.2050.0.750.1000.jpg','images/photo/female/crop.0.479.2160.2880.0.750.1000.jpg','images/photo/female/crop.0.181.1064.1418.0.750.1000.jpg','images/photo/female/crop.882.0.2266.3022.0.750.1000.jpg','images/photo/female/crop.0.0.3456.4608.0.750.1000.jpg'],
    GIFTS: [
        {icon:'images/gift1.png',name:'菜小宝',score:100,price:100},
        {icon:'images/gift2.gif',name:'听小北-爱你',score:150,price:200},
        {icon:'images/gift3.gif',name:'听小北-亲亲',score:200,price:300}
    ],
};

// ============================================
//   公共渲染辅助函数
// ============================================
window.Common.el = function(id) { return document.getElementById(id); };
window.Common.gb = function(gender) {
    return gender === 'male'
        ? '<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500 font-medium inline-flex items-center gap-0.5"><i data-lucide="mars" class="w-2.5 h-2.5"></i>男</span>'
        : '<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-50 text-brand-pink font-medium inline-flex items-center gap-0.5"><i data-lucide="venus" class="w-2.5 h-2.5"></i>女</span>';
};
window.Common.vfBadge = function() {
    return '<span class="text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange text-white font-medium">已实名</span>';
};
window.Common.showScorePopup = function(text) {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:20%;left:50%;transform:translateX(-50%);z-index:260;pointer-events:none;animation:scoreUp 1.4s ease-out forwards;';
    el.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;font-size:28px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.2);padding:14px 28px;border-radius:42px;background:rgba(224,77,44,0.92);box-shadow:0 8px 28px rgba(224,77,44,0.35);"><span style="font-size:24px;line-height:1;">❤️</span><span>'+text+'</span></div>';
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, 1500);
};
window.Common.floatToast = function(message) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);z-index:300;pointer-events:none;animation:floatUp 1.5s ease-out forwards;display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:30px;background:rgba(0,0,0,0.82);color:#fff;font-size:14px;font-weight:600;white-space:nowrap;box-shadow:0 6px 20px rgba(0,0,0,0.3);';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 1600);
};

// --- 注入公共 keyframes ---
(function() {
    var style = document.createElement('style');
    style.textContent = '@keyframes floatUp{0%{opacity:0;transform:translateX(-50%) translateY(16px)}12%{opacity:1;transform:translateX(-50%) translateY(0)}65%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(0)}}@keyframes scoreUp{0%{opacity:0;transform:translateX(-50%) scale(0.3)}20%{opacity:1;transform:translateX(-50%) translateY(-10%) scale(1.15)}40%{transform:translateX(-50%) translateY(-30%) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-80%) scale(0.5)}}';
    document.head.appendChild(style);
})();

