/**
 * 常聚组局流程状态机（提案 → 表态 → 定案），三页共享
 */
window.Zuju = (function () {
    function G() { return window.GlobalData; }
    function circleOf(id) { return G().circles.find(c => c.id === id); }
    function proposalOf(id) { return G().proposals.find(p => p.id === id); }
    function nowStr() { return window.Common.fmtDate(window.Demo.getNow()); }

    // 圈子类型 → 项目类别（默认推荐方向）
    const CATEGORY_BY_TYPE = { mahjong: 'mahjong', dinner: 'dinner', ball: 'ball', outdoor: 'outdoor', exhibit: 'exhibit', ktv: 'ktv', classmate: 'dinner', colleague: 'dinner' };

    // 圈子类型（建圈页与组局流程共用）
    const CIRCLE_TYPES = [
        { key: 'mahjong', label: '麻将', suggest: '周末麻将局' },
        { key: 'dinner', label: '饭局', suggest: '约饭小分队' },
        { key: 'ball', label: '球局', suggest: '周末球局' },
        { key: 'outdoor', label: '户外', suggest: '山野同行' },
        { key: 'classmate', label: '同学', suggest: '老同学' },
        { key: 'colleague', label: '同事', suggest: '同事食堂搭子' }
    ];

    // 建圈（组局流程内嵌与建圈页共用）：owner/当值=建圈人；城市=北京
    function createCircle({ name, type }) {
        if (!name || !String(name).trim()) {
            window.Common.showToast('给圈子起个名字吧');
            return null;
        }
        const u = window.GlobalData.user;
        const circle = {
            id: 'c-' + Date.now().toString(36),
            name: String(name).trim(),
            type: type || 'dinner',
            city: '北京',
            createdAt: window.Common.fmtDate(window.Demo.getNow()).slice(0, 10),
            ownerId: 'u1',
            members: [{ id: u.id, name: u.name, avatarUrl: u.avatarUrl, joinOrder: 1, tags: u.tags || [], position: u.position || {}, work: u.work || {}, spendTier: u.spendTier || 'mid' }],
            hostId: 'u1',
            rhythm: null,
            lastGatheringId: null,
            proposalId: null
        };
        window.GlobalData.circles.push(circle);
        window.Common.save();
        return circle;
    }

    // 一键生成智能提案并发出（status open；写 circle.proposalId）；opts.category 显式指定方向
    function buildProposal(circleId, opts) {
        const circle = circleOf(circleId);
        if (!circle) return null;
        const members = circle.members || [];
        const memberTags = [...new Set(members.flatMap(m => m.tags || []))];
        const circleGatherings = G().gatherings.filter(g => g.circleId === circleId);
        const lastProjectIds = circleGatherings.map(g => g.projectId);
        const lastVenueId = circleGatherings.length ? circleGatherings[circleGatherings.length - 1].venueId : null;
        const category = (opts && opts.category) || CATEGORY_BY_TYPE[circle.type] || null;
        let ids = window.Recommend.recommendProjects({
            projects: G().projects, memberTags, lastProjectIds, season: 'autumn', category
        });
        if (!ids.length) {
            ids = window.Recommend.recommendProjects({ projects: G().projects, memberTags, lastProjectIds, season: 'autumn' });
        }
        const projectId = ids[0];
        const project = G().projects.find(p => p.id === projectId);
        let venueIds = window.Recommend.recommendVenues({
            venues: G().venues, members, project, lastVenueId, category
        });
        // 类别内商户不足：放宽到全类别兜底（保持 3 候选承诺）
        if (!venueIds.length) {
            venueIds = window.Recommend.recommendVenues({
                venues: G().venues, members, project: null, lastVenueId
            });
        }
        const times = window.Recommend.suggestTimes({ members, count: 3, now: nowStr() });
        const proposal = window.Recommend.buildProposal({
            circle, projectId, venues: venueIds, times, proposerId: G().user.id
        });
        G().proposals.push(proposal);
        circle.proposalId = proposal.id;
        window.Common.save();
        return proposal;
    }

    // 项目设为"待定"（让圈友投票决定）
    function markProjectPending(proposalId) {
        const p = proposalOf(proposalId);
        if (!p) return;
        p.projectId = 'pending';
        p.votes.project = p.votes.project || {};
        window.Common.save();
    }

    // 落票（合并进 proposal.votes）
    function submitVotes(proposalId, votes) {
        const p = proposalOf(proposalId);
        if (!p) return null;
        if (votes.time) Object.entries(votes.time).forEach(([uid, v]) => { p.votes.time[uid] = v; });
        if (votes.venue) Object.entries(votes.venue).forEach(([uid, v]) => { p.votes.venue[uid] = v; });
        if (votes.project) {
            p.votes.project = p.votes.project || {};
            Object.entries(votes.project).forEach(([uid, v]) => { p.votes.project[uid] = v; });
        }
        window.Common.save();
        return p;
    }

    // 表决汇总：最齐时间 + 地点/项目票数
    function voteSummary(proposalId) {
        const p = proposalOf(proposalId);
        if (!p) return null;
        const bestTime = window.Recommend.computeBestTime({ timeVotes: p.votes.time, timeCandidates: p.timeCandidates });
        const venueTally = {};
        Object.values(p.votes.venue || {}).forEach(v => { venueTally[v] = (venueTally[v] || 0) + 1; });
        const projectTally = {};
        Object.values(p.votes.project || {}).forEach(v => { projectTally[v] = (projectTally[v] || 0) + 1; });
        return { bestTime, venueTally, projectTally };
    }

    // 截止定案：open + 超过 deadline → decided + 生成聚会记录
    function tryDecide(proposalId, now) {
        const p = proposalOf(proposalId);
        if (!p || p.status !== 'open') return p;
        const nowTime = new Date(now.replace(' ', 'T'));
        const deadline = new Date(p.deadline.replace(' ', 'T'));
        if (nowTime < deadline) return p;
        const sum = voteSummary(proposalId);
        // 全部未表态：保持待定，不生成空聚会
        if (sum.bestTime.winnerIndex === null) return p;
        p.status = 'decided';
        const circle = circleOf(p.circleId);
        const timeIdx = sum.bestTime.winnerIndex;
        const venuePick = Object.entries(sum.venueTally).sort((a, b) => b[1] - a[1])[0];
        const venueId = venuePick ? venuePick[0] : p.venueIds[0];
        let projectId = p.projectId;
        if (projectId === 'pending') {
            const pp = Object.entries(sum.projectTally).sort((a, b) => b[1] - a[1])[0];
            if (pp) projectId = pp[0];
        }
        const attendees = (circle.members || [])
            .filter(m => p.votes.time[m.id] && p.votes.time[m.id][timeIdx])
            .map(m => m.id);
        const count = G().gatherings.filter(g => g.circleId === p.circleId).length + 1;
        const gathering = {
            id: 'g-' + Date.now().toString(36),
            proposalId: p.id,
            circleId: p.circleId,
            title: '第 ' + count + ' 次聚会',
            summary: '',
            projectId: projectId,
            venueId,
            time: p.timeCandidates[timeIdx],
            attendees,
            photos: [],
            buyMode: 'aa',
            payerId: null,
            billId: null
        };
        G().gatherings.push(gathering);
        circle.proposalId = null;
        window.Common.save();
        return p;
    }

    // 分享组局邀请到微信群（模拟浮层，写入指定容器）
    function shareInvite({ proposalId, circleId, containerId }) {
        const p = proposalOf(proposalId);
        const c = circleOf(circleId || (p && p.circleId));
        const el = document.getElementById(containerId);
        if (!el || el.innerHTML === undefined) return;
        el.innerHTML =
            '<div style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;display:flex;align-items:flex-end">' +
                '<div style="background:var(--cream);width:100%;border-radius:24px 24px 0 0;padding:20px;box-shadow:0 -8px 32px rgba(59,46,34,0.2)">' +
                    '<div class="cj-title" style="font-size:16px;margin-bottom:14px">把组局邀请分享到群</div>' +
                    (p && c ? '<div class="cj-card" style="text-align:center">' +
                        '<div class="cj-sub" style="letter-spacing:2px">组局邀请</div>' +
                        '<div class="cj-title" style="font-size:18px;margin:8px 0 4px">' + c.name + '</div>' +
                        '<div class="cj-sub">' + (p.timeCandidates[0] || '') + ' · 点击卡片参与表态</div>' +
                    '</div>' : '') +
                    '<div style="display:flex;flex-direction:column;gap:12px;margin-top:14px">' +
                        '<div class="cj-card" style="margin:0;cursor:pointer" onclick="window.Zuju.pickShareGroup(\'周五麻将局群\',\'' + containerId + '\')"><div class="cj-row" style="justify-content:space-between"><span class="cj-title" style="font-size:14px">周五麻将局群</span><span class="cj-sub">6 人</span></div></div>' +
                        '<div class="cj-card" style="margin:0;cursor:pointer" onclick="window.Zuju.pickShareGroup(\'老同学群\',\'' + containerId + '\')"><div class="cj-row" style="justify-content:space-between"><span class="cj-title" style="font-size:14px">老同学群</span><span class="cj-sub">8 人</span></div></div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    function pickShareGroup(groupName, containerId) {
        const el = document.getElementById(containerId);
        if (el && el.innerHTML !== undefined) el.innerHTML = '';
        window.Common.showToast('邀请已发到「' + groupName + '」，等大家点卡片进来');
    }

    // 提醒未表态者（服务通知 + 落库）
    function remindNonVoters(proposalId) {
        const p = proposalOf(proposalId);
        if (!p) return;
        const circle = circleOf(p.circleId);
        const nonVoters = (circle.members || []).filter(m => !p.votes.time[m.id]);
        if (nonVoters.length === 0) {
            window.Common.showToast('大家都表态啦');
            return;
        }
        G().notifications.push({
            id: 'n-' + Date.now().toString(36),
            circleId: p.circleId,
            type: 'respond',
            text: '「' + circle.name + '」的组局等你表态',
            read: false
        });
        window.Common.showWechatNotice({ title: '常聚 · 服务通知', body: nonVoters.map(m => m.name).join('、') + '，等你们表态啦' });
        window.Common.save();
    }

    return { CIRCLE_TYPES, createCircle, buildProposal, markProjectPending, submitVotes, voteSummary, tryDecide, remindNonVoters, shareInvite, pickShareGroup };
})();
