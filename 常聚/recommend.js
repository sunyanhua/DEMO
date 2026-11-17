/**
 * 常聚智能提案推荐引擎（纯函数，不碰 DOM/localStorage）
 * 时间格式统一为 'YYYY-MM-DD HH:mm'
 */
window.Recommend = (function () {
    function pad(n) { return String(n).padStart(2, '0'); }
    function fmt(d, h, m) {
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(h)}:${pad(m)}`;
    }

    // 从 base 的次日开始，找第一个 weekday 的日期
    function nextWeekday(base, weekday) {
        const d = new Date(base);
        d.setDate(d.getDate() + 1);
        while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
        return d;
    }

    // 推荐 3 个具体项目：命中成员共同 tag 多者优先；排除上次；同分取输入序
    function recommendProjects({ projects, memberTags, lastProjectIds }) {
        const excluded = new Set(lastProjectIds || []);
        const pool = projects.filter(p => !excluded.has(p.id));
        const tags = new Set(memberTags || []);
        const ranked = pool.map(p => ({ p, score: p.tags.filter(t => tags.has(t)).length }));
        ranked.sort((a, b) => b.score - a.score || projects.indexOf(a.p) - projects.indexOf(b.p));
        return ranked.map(x => x.p.id).slice(0, 3);
    }

    // 推荐 3 个地点：同区成员数（中间地带）> 消费档位众数一致 > 评分；排除上次
    function recommendVenues({ venues, members, project, lastVenueId }) {
        const tierCount = {};
        (members || []).forEach(m => { tierCount[m.spendTier] = (tierCount[m.spendTier] || 0) + 1; });
        let modeTier = null, best = -1;
        for (const t in tierCount) { if (tierCount[t] > best) { best = tierCount[t]; modeTier = t; } }
        const distCount = {};
        (members || []).forEach(m => {
            const d = m.position && m.position.district;
            if (d) distCount[d] = (distCount[d] || 0) + 1;
        });
        const pool = (venues || []).filter(v => v.category === (project && project.category) && v.id !== lastVenueId);
        const ranked = pool.map(v => ({
            v,
            cover: distCount[v.district] || 0,
            tierHit: v.spendTier === modeTier ? 1 : 0
        }));
        ranked.sort((a, b) => b.cover - a.cover || b.tierHit - a.tierHit || b.v.rating - a.v.rating);
        return ranked.map(x => x.v.id).slice(0, 3);
    }

    // 生成 3 个时间候选：白班多数→工作日 19:00 起；晚班多数→周末 14:00 起
    // now 可选（默认演示日 2026-11-17），保证输出确定可测
    function suggestTimes({ members, count = 3, now }) {
        const base = now ? new Date(now.replace(' ', 'T')) : new Date('2026-11-17T12:00');
        const white = (members || []).filter(m => m.work && m.work.type === '白班').length;
        const night = (members || []).filter(m => m.work && m.work.type === '晚班').length;
        const times = [];
        if (night > white) {
            // 晚班多：周六 14:00、周日 14:00、未来工作日 20:30
            times.push(fmt(nextWeekday(base, 6), 14, 0));
            times.push(fmt(nextWeekday(base, 0), 14, 0));
            let wd = nextWeekday(base, 1);
            while (wd.getDay() === 0 || wd.getDay() === 6) wd = nextWeekday(wd, 1);
            times.push(fmt(wd, 20, 30));
        } else {
            // 白班多/持平：未来两个工作日 19:00、周六 14:00
            let wd1 = nextWeekday(base, 1);
            while (wd1.getDay() === 0 || wd1.getDay() === 6) wd1 = nextWeekday(wd1, 1);
            times.push(fmt(wd1, 19, 0));
            let wd2 = nextWeekday(wd1, 1);
            while (wd2.getDay() === 0 || wd2.getDay() === 6) wd2 = nextWeekday(wd2, 1);
            times.push(fmt(wd2, 19, 0));
            times.push(fmt(nextWeekday(base, 6), 14, 0));
        }
        return times.slice(0, count);
    }

    // 组装提案对象（时间格式与 deadline 同全局约定）
    function buildProposal({ circle, projectId, venues, times, proposerId }) {
        const d = new Date(Date.now() + 48 * 3600 * 1000);
        return {
            id: 'pr-' + Date.now().toString(36),
            circleId: circle.id,
            proposerId,
            projectId,
            venueIds: venues.slice(),
            timeCandidates: times.slice(),
            votes: { time: {}, venue: {} },
            status: 'open',
            deadline: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
        };
    }

    // 时间矩阵最大公约：平票取最早候选；全部未表态→winnerIndex:null
    function computeBestTime({ timeVotes, timeCandidates }) {
        const votes = timeVotes || {};
        const attendance = (timeCandidates || []).map((_, i) =>
            Object.values(votes).filter(v => v && v[i]).length);
        if (attendance.every(n => n === 0)) return { winnerIndex: null, tied: [], attendance };
        const max = Math.max(...attendance);
        const tied = attendance.map((n, i) => (n === max ? i : -1)).filter(i => i >= 0);
        return { winnerIndex: tied[0], tied, attendance };
    }

    return { recommendProjects, recommendVenues, suggestTimes, buildProposal, computeBestTime };
})();
