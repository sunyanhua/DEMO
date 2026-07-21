// ============================================
//   1039发现 — 公共函数库
// ============================================

// --- Tailwind 品牌色配置 ---
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    brand: {
                        purple:      '#836ec2',
                        'purple-light': '#F3F0FA',
                        'purple-dark':  '#6A56B0',
                        pink:        '#fdbeda',
                        'pink-light':   '#FFF5F9',
                        'pink-dark':    '#E89AB8',
                        blue:        '#9adff3',
                        'blue-light':   '#F0F9FC',
                        'blue-dark':    '#6CC8E8',
                        gold:        '#f2a600',
                        'gold-light':   '#FFF8EB',
                        'gold-dark':    '#C27A00',
                    }
                }
            }
        }
    };
}

// 导航 Tab 色系映射（全局基调）
window.NAV_COLORS = {
    home:    { name: '首页',   icon: 'home',         color: '#f2a600', bg: 'rgba(242,166,0,0.10)' },
    event:   { name: '活动',   icon: 'calendar',     color: '#836ec2', bg: 'rgba(131,110,194,0.10)' },
    ticket:  { name: '门票',   icon: 'ticket',       color: '#3DAFD8', bg: 'rgba(61,175,216,0.10)' },
    product: { name: '商品',   icon: 'shopping-bag',  color: '#E880A5', bg: 'rgba(232,128,165,0.10)' },
    me:      { name: '我的',   icon: 'user',          color: '#f2a600', bg: 'rgba(242,166,0,0.10)' },
};

window.Common = {

    // --- 渲染底部导航栏 (5 Tab，每 Tab 独立色系) ---
    renderBottomNav: function(activeTabId) {
        var tabs = [
            { id: 'home',    href: 'index.html'  },
            { id: 'event',   href: 'events.html'  },
            { id: 'ticket',  href: 'tickets.html' },
            { id: 'product', href: 'products.html' },
            { id: 'me',      href: 'me.html'       },
        ];

        var self = this;
        var items = tabs.map(function(t) {
            var cfg = window.NAV_COLORS[t.id];
            var isActive = activeTabId === t.id;
            var color = isActive ? cfg.color : '#9CA3AF';
            var bg    = isActive ? cfg.bg : 'transparent';
            return '\n            <a href="' + t.href + '" class="flex flex-col items-center justify-center w-16 space-y-0.5 cursor-pointer no-underline" style="color:' + color + ';">\n                <div class="p-1 rounded-lg transition-all duration-200" style="background:' + bg + ';">\n                    <i data-lucide="' + cfg.icon + '" class="w-5 h-5" stroke-width="' + (isActive ? 2.5 : 1.8) + '"></i>\n                </div>\n                <span class="text-[10px] font-medium">' + cfg.name + '</span>\n            </a>';
        }).join('');

        return '\n        <div class="fixed bottom-0 left-0 right-0 z-50 bottom-nav-glass">\n            <div class="flex justify-between items-end pb-3 h-[64px] px-4 pt-4">\n                ' + items + '\n            </div>\n        </div>';
    },

    // --- 图标初始化（含重试） ---
    initIcons: function() {
        if (typeof lucide !== 'undefined') {
            try { lucide.createIcons(); } catch(e) {}
            setTimeout(function() { try { lucide.createIcons(); } catch(e) {} }, 200);
        }
    },

    // --- Toast 提示 ---
    showToast: function(message) {
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);color:#fff;padding:10px 18px;border-radius:10px;z-index:9999;font-size:14px;opacity:0;transition:opacity 0.25s ease;';
        toast.innerText = message;
        document.body.appendChild(toast);
        requestAnimationFrame(function() { toast.style.opacity = '1'; });
        setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 300);
        }, 1800);
    },

    // --- 弹窗显隐 ---
    showPopup: function(id) {
        var el = typeof id === 'string' ? document.getElementById(id) : id;
        if (!el) return;
        el.classList.remove('hidden');
        el.classList.add('flex');
        var self = this;
        setTimeout(function() { self._icons(el); }, 50);
    },
    hidePopup: function(id) {
        var el = typeof id === 'string' ? document.getElementById(id) : id;
        if (!el) return;
        el.classList.add('hidden');
        el.classList.remove('flex');
    },
    closePopup: function(event, id) {
        if (event && event.target !== document.getElementById(id)) return;
        this.hidePopup(id);
    },
    _icons: function(el) {
        if (typeof lucide === 'undefined') return;
        try { lucide.createIcons({ target: el }); } catch(e) {}
        try { lucide.createIcons(); } catch(e) {}
    },

    // --- 元素快捷获取 ---
    el: function(id) { return document.getElementById(id); }
};

// ============================================
//   注入公共 keyframes
// ============================================
(function() {
    var style = document.createElement('style');
    style.textContent = '@keyframes floatUp{0%{opacity:0;transform:translateX(-50%) translateY(16px)}12%{opacity:1;transform:translateX(-50%) translateY(0)}65%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(0)}}@keyframes scoreUp{0%{opacity:0;transform:translateX(-50%) scale(0.3)}20%{opacity:1;transform:translateX(-50%) translateY(-10%) scale(1.15)}40%{transform:translateX(-50%) translateY(-30%) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-80%) scale(0.5)}}';
    document.head.appendChild(style);
})();
