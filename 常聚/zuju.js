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

    // 圈子类型（建圈页与组局流程共用，通用常见分类）
    const CIRCLE_TYPES = [
        { key: 'dinner', label: '饭局', suggest: '约饭小分队' },
        { key: 'sport', label: '运动', suggest: '周末运动局' },
        { key: 'boardgame', label: '棋牌', suggest: '棋牌桌游局' },
        { key: 'outdoor', label: '户外', suggest: '山野同行' },
        { key: 'classmate', label: '同学', suggest: '老同学' },
        { key: 'colleague', label: '同事', suggest: '同事搭子' },
        { key: 'family', label: '家人', suggest: '一家人' },
        { key: 'hobby', label: '兴趣', suggest: '兴趣小组' }
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

    // 手动四步组局：圈子/单项目(+备注)/时间+地点均由发起人逐项选定（不做智能推荐），
    // 生成提案（status open；写 circle.proposalId）
    function buildProposalManual({ circleId, projectId, venueIds, times, customVenue, note }) {
        const circle = circleOf(circleId);
        if (!circle) return null;
        if (!projectId || !times || !times.length) {
            window.Common.showToast('请完成项目、时间的选择');
            return null;
        }
        if ((!venueIds || !venueIds.length) && !customVenue) {
            window.Common.showToast('请完成地点的选择');
            return null;
        }
        const proposal = window.Recommend.buildProposal({
            circle, projectId, venues: venueIds || [], times, proposerId: G().user.id
        });
        proposal.customVenue = customVenue || null;
        proposal.note = note || null;
        G().proposals.push(proposal);
        circle.proposalId = proposal.id;
        window.Common.save();
        return proposal;
    }

    // 项目设为"待定"（让圈友投票决定）
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
        const customVenue = p.customVenue || null;
        const venueId = customVenue ? null : (venuePick ? venuePick[0] : p.venueIds[0]);
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
            projectId: p.projectId,
            note: p.note || '',
            venueId,
            customVenue,
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

    return { CIRCLE_TYPES, createCircle, buildProposalManual, submitVotes, voteSummary, tryDecide, remindNonVoters, shareInvite, pickShareGroup };
})();
