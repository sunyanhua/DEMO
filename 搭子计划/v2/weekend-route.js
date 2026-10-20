/**
 * 定制周末路线引擎（weekend-route.html 使用）
 * 依赖 window.GlobalData.weekendRoutes
 * 纯逻辑模块：类型标签、推荐优先排序、按片区匹配路线，DOM 渲染由页面负责
 */
(function () {
    const TYPE_LABELS = { recommend: '诚意推荐', classic: '经典必逛', smart: '智能定制' };
    const TYPE_ORDER = { recommend: 0, classic: 1, smart: 2 };

    function getRoutes() {
        const g = (typeof window !== 'undefined' && window.GlobalData) || {};
        return g.weekendRoutes || [];
    }

    function typeLabel(type) {
        return TYPE_LABELS[type] || type;
    }

    // 按推荐优先顺序排序：诚意推荐 > 经典必逛 > 智能定制（同类型保持原顺序）
    function sortByPriority(routes) {
        const order = (r) => (TYPE_ORDER[r.type] !== undefined ? TYPE_ORDER[r.type] : 99);
        return [...routes].sort((a, b) => order(a) - order(b));
    }

    // 推荐列表：按类型配额取固定条数——诚意推荐 1 → 经典必逛 3 → 智能定制 1，
    // 同类型内按匹配度降序（不同定制条件产生不同组合），配额不足时按剩余数据补齐
    function getRecommendationList(form, selections, limit) {
        limit = limit && limit > 0 ? limit : 5;
        const routes = getRoutes();
        const result = [];
        const pushGroup = (type, quota) => {
            const group = routes
                .filter(r => r.type === type && !result.includes(r))
                .sort((a, b) => matchPercent(b, form, selections) - matchPercent(a, form, selections));
            result.push(...group.slice(0, quota));
        };
        pushGroup('recommend', 1);
        pushGroup('classic', 3);
        pushGroup('smart', 1);
        if (result.length < limit) {
            const rest = routes.filter(r => !result.includes(r));
            result.push(...rest.slice(0, limit - result.length));
        }
        return result.slice(0, limit);
    }

    // 情况与人群标签的对应关系（用于"类型相符"推荐理由）
    const SITUATION_TAGS = {
        local: ['治愈型', '文艺型', '运动型'],
        newbie: ['美食型', '文艺型'],
        solo: ['治愈型', '文艺型'],
        party: ['社交型', '运动型', '美食型']
    };

    // 路线首站开始小时（'14:00' → 14；缺省按 12 点下午处理）
    function scheduleStartHour(route) {
        const first = route && route.schedule && route.schedule[0];
        if (!first || !first.time) return 12;
        const m = String(first.time).match(/(\d{1,2}):/);
        return m ? parseInt(m[1], 10) : 12;
    }

    // 生成路线推荐理由：片区匹配 / 时间合适 / 预算满足 / 类型相符
    function recommendReasons(route, form, selections) {
        const reasons = [];
        if (!route || !form || !selections) return reasons;
        // 片区匹配
        if (selections.area != null && form.areas[selections.area] && route.areaId === form.areas[selections.area].id) {
            reasons.push('片区匹配');
        }
        // 时间合适：路线首站时间落在所选时间段（周日全天恒成立）
        if (selections.time != null) {
            const timeFilter = form.filters.find(f => f.id === 'time');
            if (timeFilter && timeFilter.options[selections.time]) {
                const slot = timeFilter.options[selections.time];
                const hour = scheduleStartHour(route);
                const inSlot = slot === '周日全天'
                    ? true
                    : slot === '周六上午' ? hour < 12
                    : slot === '周六下午' ? hour >= 12 && hour < 18
                    : hour >= 18;
                if (inSlot) reasons.push('时间合适');
            }
        }
        // 预算满足：路线预算合计 ≤ 所选预算上限
        if (selections.budget != null) {
            const budgetFilter = form.filters.find(f => f.id === 'budget');
            if (budgetFilter && budgetFilter.options[selections.budget]) {
                const label = budgetFilter.options[selections.budget];
                const max = label === '300+' ? Infinity : parseInt(label.split('-')[1], 10);
                const total = (route.budget || []).reduce((sum, b) => sum + (b.amount || 0), 0);
                if (total <= max) reasons.push('预算满足');
            }
        }
        // 类型相符：所选情况对应的人群标签与路线标签有交集
        if (selections.situation != null && form.situations[selections.situation]) {
            const wanted = SITUATION_TAGS[form.situations[selections.situation].id] || [];
            if ((route.tags || []).some(tag => wanted.includes(tag))) reasons.push('类型相符');
        }
        return reasons;
    }

    // 匹配度：4 项指标（片区/时间/预算/类型）每命中一项计 25%
    function matchPercent(route, form, selections) {
        return recommendReasons(route, form, selections).length * 25;
    }

    // 同款搭子：匹配到该路线的搭子（路线详情"同款搭子"区块使用）
    function routeFellowsForRoute(routeId) {
        const g = (typeof window !== 'undefined' && window.GlobalData) || {};
        return (g.weekendFellows || []).filter(f => Array.isArray(f.routeIds) && f.routeIds.includes(routeId));
    }

    // ---------- 定制记录（localStorage 持久化，最多保留 20 条） ----------
    const RECORDS_KEY = 'weekend_route_records';

    function getRouteRecords() {
        try {
            const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(RECORDS_KEY) : null;
            const list = JSON.parse(raw || '[]');
            return Array.isArray(list) ? list : [];
        } catch (e) {
            return [];
        }
    }

    function saveRouteRecord(selections, routeIds) {
        const records = getRouteRecords();
        const record = {
            id: 'rec_' + Date.now(),
            time: new Date().toLocaleString('zh-CN', { hour12: false }),
            selections: { ...(selections || {}) },
            routeIds: [...(routeIds || [])]
        };
        records.unshift(record);
        const capped = records.slice(0, 20);
        try {
            localStorage.setItem(RECORDS_KEY, JSON.stringify(capped));
        } catch (e) {
            // 存储失败时忽略（演示环境）
        }
        return record;
    }

    function getRouteRecord(id) {
        return getRouteRecords().find(r => r.id === id) || null;
    }

    // 溜搭计划状态：sessionStorage 优先，其次数据默认，未加入返回 'none'
    function planStatus(routeId) {
        const saved = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('me_plan_' + routeId) : null;
        if (saved === 'done' || saved === 'pending') return saved;
        const g = (typeof window !== 'undefined' && window.GlobalData) || {};
        const item = (g.myPlanRoutes || []).find(p => p.routeId === routeId);
        return item ? item.status : 'none';
    }

    window.WeekendRoute = {
        TYPE_LABELS,
        TYPE_ORDER,
        getRoutes,
        typeLabel,
        sortByPriority,
        getRecommendationList,
        recommendReasons,
        matchPercent,
        routeFellowsForRoute,
        planStatus,
        getRouteRecords,
        saveRouteRecord,
        getRouteRecord
    };
})();
