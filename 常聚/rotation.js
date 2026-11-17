/**
 * 常聚轮值张罗引擎（纯函数，不碰 DOM/localStorage）
 * 时间格式统一为 'YYYY-MM-DD HH:mm'
 */
window.Rotation = (function () {
    function rhythmDays(rhythm) {
        if (!rhythm) return null;
        if (rhythm.unit === 'week') return rhythm.n * 7;
        if (rhythm.unit === 'month') return rhythm.n * 30;
        if (rhythm.unit === 'day') return rhythm.n;
        return null;
    }

    // 按自然日差计算"已 X 天没聚"（只比日期部分）
    function daysBetween(lastTime, now) {
        if (!lastTime) return null;
        const a = new Date(lastTime.slice(0, 10) + 'T00:00:00');
        const b = new Date(now.slice(0, 10) + 'T00:00:00');
        return Math.round((b - a) / 86400000);
    }

    // 建圈人首任当值张罗
    function initialHost(circle) {
        return circle.ownerId;
    }

    // 散场抽签：范围=全体圈友（含未出席者）；rng 注入 ()=>[0,1)
    function drawNextHost({ memberIds, rng }) {
        const ids = memberIds || [];
        if (ids.length === 0) return null;
        const idx = Math.min(ids.length - 1, Math.floor((rng() || 0) * ids.length));
        return ids[idx];
    }

    // 顺延：joinOrder 下一位，末尾回卷到 joinOrder 最小
    function passHost({ members, currentHostId }) {
        const sorted = (members || []).slice().sort((a, b) => a.joinOrder - b.joinOrder);
        if (sorted.length === 0) return null;
        const idx = sorted.findIndex(m => m.id === currentHostId);
        if (idx < 0) return sorted[0].id;
        return sorted[(idx + 1) % sorted.length].id;
    }

    // 节律提醒判断：无节律/无上次→due:false；daysSince >= 节律天数→due:true（边界触发）
    function checkRhythm({ circle, lastGatheringTime, now }) {
        const days = rhythmDays(circle.rhythm);
        const daysSince = daysBetween(lastGatheringTime, now);
        if (days === null || daysSince === null) return { due: false, daysSince };
        return { due: daysSince >= days, daysSince };
    }

    // 思念式提醒文案（now 可选，默认演示日 2026-11-17 12:00）
    function buildReminderText({ circle, gathering, now }) {
        const base = now || '2026-11-17 12:00';
        const daysSince = daysBetween(gathering ? gathering.time : null, base);
        if (!gathering || daysSince === null) {
            return `「${circle.name}」好久没聚啦，想念大家了`;
        }
        const photo = (gathering.photos && gathering.photos[0]) || '';
        const photoPart = photo ? `还记得这张合影吗：${photo}` : '';
        return `「${circle.name}」已经 ${daysSince} 天没聚啦，该张罗啦！${photoPart}`;
    }

    return { initialHost, drawNextHost, passHost, checkRhythm, buildReminderText };
})();
