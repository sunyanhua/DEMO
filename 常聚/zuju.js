/**
 * 常聚组局流程状态机（提案 → 表态 → 定案），三页共享
 */
window.Zuju = (function () {
    function G() { return window.GlobalData; }
    function circleOf(id) { return G().circles.find(c => c.id === id); }
    function proposalOf(id) { return G().proposals.find(p => p.id === id); }
    function nowStr() { return window.Common.fmtDate(window.Demo.getNow()); }

    // 一键生成智能提案并发出（status open；写 circle.proposalId）
    function buildProposal(circleId) {
        const circle = circleOf(circleId);
        if (!circle) return null;
        const members = circle.members || [];
        const memberTags = [...new Set(members.flatMap(m => m.tags || []))];
        const circleGatherings = G().gatherings.filter(g => g.circleId === circleId);
        const lastProjectIds = circleGatherings.map(g => g.projectId);
        const lastVenueId = circleGatherings.length ? circleGatherings[circleGatherings.length - 1].venueId : null;
        const projectId = window.Recommend.recommendProjects({
            projects: G().projects, memberTags, lastProjectIds, season: 'autumn'
        })[0];
        const project = G().projects.find(p => p.id === projectId);
        const venueIds = window.Recommend.recommendVenues({
            venues: G().venues, members, project, lastVenueId
        });
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
        p.status = 'decided';
        const circle = circleOf(p.circleId);
        const sum = voteSummary(proposalId);
        const timeIdx = sum.bestTime.winnerIndex !== null ? sum.bestTime.winnerIndex : 0;
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

    return { buildProposal, markProjectPending, submitVotes, voteSummary, tryDecide, remindNonVoters };
})();
