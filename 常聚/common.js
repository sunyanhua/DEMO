/**
 * 常聚公共层：小程序外壳 / tabbar / Toast / 模拟微信通知 / 状态持久化 / 演示控制
 * 顶层只定义对象，不触 DOM；页面调 initIcons() 初始化图标
 */
window.Common = (function () {
    const win = window;
    const LS_KEY = 'cj.data';

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }

    // 顶栏：品牌词 + slogan 胶囊 + 页面标题（炉边温润质感，见 DESIGN.md）
    function renderShell(title) {
        return `<div class="cj-shell">
            <div class="cj-topbar">
                <span class="cj-wordmark">常聚</span>
                <span class="cj-slogan-chip">常聚常伴，圈子不散</span>
            </div>
            <div class="cj-navbar"><span class="cj-navbar-title">${esc(title)}</span></div>
        </div>`;
    }

    // 悬浮药丸 tabbar
    function renderTabbar(active) {
        const tabs = [
            { id: 'circles', label: '圈子', icon: 'users', href: 'index.html' },
            { id: 'messages', label: '消息', icon: 'bell', href: 'message.html' },
            { id: 'me', label: '我的', icon: 'user', href: 'me.html' }
        ];
        return `<div class="cj-tabbar">` + tabs.map(t =>
            `<a class="cj-tab${t.id === active ? ' cj-tab-active' : ''}" href="${t.href}">
                <i data-lucide="${t.icon}"></i><span>${t.label}</span></a>`).join('') + `</div>`;
    }

    function showToast(msg) {
        if (!win.document) return;
        const el = win.document.createElement('div');
        el.className = 'cj-toast';
        el.textContent = msg;
        win.document.body.appendChild(el);
        setTimeout(() => { try { el.remove(); } catch (e) { /* noop */ } }, 2200);
    }

    // 模拟微信服务通知浮层（右上滑入，3s 自动消失）
    function showWechatNotice({ title, body }) {
        if (!win.document) return;
        const el = win.document.createElement('div');
        el.className = 'cj-wxnotice';
        el.innerHTML = `<div class="cj-wxnotice-title">🔔 服务通知</div>
            <div class="cj-wxnotice-title" style="font-weight:600">${esc(title)}</div>
            <div class="cj-wxnotice-body">${esc(body)}</div>`;
        win.document.body.appendChild(el);
        setTimeout(() => { try { el.remove(); } catch (e) { /* noop */ } }, 3000);
    }

    // 运行时可变状态 ↔ localStorage（proposals/gatherings/bills/notifications + 圈子全量）
    const PERSIST_KEYS = ['proposals', 'gatherings', 'bills', 'notifications'];

    function save() {
        if (!win.GlobalData) return;
        try {
            const snapshot = {};
            PERSIST_KEYS.forEach(k => { snapshot[k] = win.GlobalData[k]; });
            snapshot.circles = win.GlobalData.circles || [];
            win.localStorage.setItem(LS_KEY, JSON.stringify(snapshot));
        } catch (e) { /* localStorage 不可用时静默 */ }
    }

    function load() {
        if (!win.GlobalData) return;
        try {
            const raw = win.localStorage.getItem(LS_KEY);
            if (!raw) return;
            const snap = JSON.parse(raw);
            PERSIST_KEYS.forEach(k => { if (snap[k]) win.GlobalData[k] = snap[k]; });
            (snap.circles || []).forEach(sc => {
                const c = (win.GlobalData.circles || []).find(x => x.id === sc.id);
                if (c) Object.assign(c, sc);
                else win.GlobalData.circles.push(sc);
            });
        } catch (e) { /* 损坏数据静默跳过 */ }
    }

    function initIcons() {
        if (win.lucide && win.lucide.createIcons) win.lucide.createIcons();
    }

    function fmtDate(d) {
        const p = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
    }

    return { renderShell, renderTabbar, showToast, showWechatNotice, save, load, initIcons, fmtDate, esc };
})();
// 每个页面加载时自动恢复运行时状态（页面均先加载 data.js 再加载本文件）
window.Common.load();

/**
 * 演示控制：虚拟时钟 / 模拟圈友表态 / 重置
 */
window.Demo = (function () {
    const win = window;
    const CLOCK_KEY = 'cj.clock';

    function readOffset() {
        try { return Number(win.localStorage.getItem(CLOCK_KEY)) || 0; } catch (e) { return 0; }
    }
    function writeOffset(v) {
        try { win.localStorage.setItem(CLOCK_KEY, String(v)); } catch (e) { /* noop */ }
    }

    // 虚拟时钟（真实时间 + 演示偏移）
    function getNow() {
        return new Date(Date.now() + readOffset() * 3600 * 1000);
    }
    function advanceTime(hours) {
        writeOffset(readOffset() + hours);
        if (win.Common) win.Common.showToast(`演示时间已推进 ${hours} 小时`);
    }

    // mock 圈友按预置规则表态（排除"我"；时间选一个可出席、地点投一票）
    function simulateVotes(proposalId) {
        const G = win.GlobalData;
        if (!G) return;
        const p = (G.proposals || []).find(x => x.id === proposalId);
        if (!p) return;
        const circle = (G.circles || []).find(c => c.id === p.circleId);
        if (!circle) return;
        (circle.members || []).forEach(m => {
            if (m.id === 'u1') return;
            const h = [...m.id].reduce((s, ch) => s + ch.charCodeAt(0), 0);
            p.votes.time = p.votes.time || {};
            p.votes.venue = p.votes.venue || {};
            if (p.timeCandidates.length) p.votes.time[m.id] = { [h % p.timeCandidates.length]: true };
            if (p.venueIds.length) p.votes.venue[m.id] = p.venueIds[h % p.venueIds.length];
        });
        if (win.Common) { win.Common.save(); win.Common.showToast('圈友们已表态'); }
    }

    function toggle() {
        if (!win.document) return;
        let panel = win.document.querySelector('.cj-demo-panel');
        if (panel) { panel.remove(); return; }
        panel = win.document.createElement('div');
        panel.className = 'cj-demo-panel';
        panel.innerHTML = `
            <div class="cj-sub" style="font-weight:700">演示控制</div>
            <button data-demo="votes">模拟圈友表态（当前提案）</button>
            <button data-demo="advance">推进时间 +24 小时</button>
            <button data-demo="reset">重置演示数据</button>`;
        panel.addEventListener('click', e => {
            const act = e.target && e.target.getAttribute('data-demo');
            if (act === 'votes') {
                const G = win.GlobalData;
                const open = G && (G.proposals || []).find(p => p.status === 'open');
                if (open) win.Demo.simulateVotes(open.id);
                else if (win.Common) win.Common.showToast('当前没有进行中的提案');
            } else if (act === 'advance') {
                win.Demo.advanceTime(24);
            } else if (act === 'reset') {
                win.Demo.reset();
            }
        });
        win.document.body.appendChild(panel);
    }

    function reset() {
        try {
            win.localStorage.removeItem(CLOCK_KEY);
            win.localStorage.removeItem('cj.data');
        } catch (e) { /* noop */ }
        if (win.location) win.location.reload();
    }

    // 页面挂载演示悬浮钮（各页 init 时调用）
    function mountFab() {
        if (!win.document) return;
        if (win.document.querySelector('.cj-demo-fab')) return;
        const btn = win.document.createElement('button');
        btn.className = 'cj-demo-fab';
        btn.textContent = '演示';
        btn.addEventListener('click', () => win.Demo.toggle());
        win.document.body.appendChild(btn);
    }

    return { getNow, advanceTime, simulateVotes, toggle, reset, mountFab };
})();
