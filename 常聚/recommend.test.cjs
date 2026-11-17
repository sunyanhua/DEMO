/**
 * 常聚推荐引擎测试（node recommend.test.cjs）
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadRecommend() {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(__dirname, 'recommend.js'), 'utf8'), sandbox);
    return sandbox.window.Recommend;
}
const R = loadRecommend();

const sampleProjects = [
    { id: 'p1', name: '火锅局', category: 'dinner', season: ['winter'], tags: ['火锅', '热闹'] },
    { id: 'p2', name: '羽毛球', category: 'ball', season: [], tags: ['运动', '羽毛球'] },
    { id: 'p3', name: '烧烤局', category: 'dinner', season: ['summer'], tags: ['烧烤', '热闹'] },
    { id: 'p4', name: '麻将', category: 'mahjong', season: [], tags: ['麻将', '热闹'] },
    { id: 'p5', name: '爬山', category: 'outdoor', season: ['autumn'], tags: ['爬山'] }
];

const sampleMembers = [
    { id: 'u1', position: { district: '朝阳' }, work: { type: '白班' }, spendTier: 'mid', tags: ['火锅'] },
    { id: 'm1', position: { district: '朝阳' }, work: { type: '白班' }, spendTier: 'mid', tags: ['火锅'] },
    { id: 'm2', position: { district: '海淀' }, work: { type: '白班' }, spendTier: 'premium', tags: ['火锅'] }
];

const sampleVenues = [
    { id: 'v1', district: '朝阳', businessArea: '三里屯', category: 'dinner', spendTier: 'mid', rating: 4.5 },
    { id: 'v2', district: '海淀', businessArea: '中关村', category: 'dinner', spendTier: 'mid', rating: 4.9 },
    { id: 'v3', district: '朝阳', businessArea: '国贸', category: 'dinner', spendTier: 'premium', rating: 4.6 },
    { id: 'v4', district: '朝阳', businessArea: '望京', category: 'dinner', spendTier: 'mid', rating: 4.8 },
    { id: 'v5', district: '朝阳', businessArea: '国贸', category: 'ball', spendTier: 'mid', rating: 5.0 }
];

test('projects_avoid_last_and_match_tags', () => {
    const result = R.recommendProjects({
        projects: sampleProjects,
        memberTags: ['火锅', '运动', '麻将'],
        lastProjectIds: ['p1', 'p3'],
        season: 'winter'
    });
    assert.equal(result.length, 3, '结果必须 3 个');
    assert.ok(!result.includes('p1') && !result.includes('p3'), '排除上次项目');
    // tag 命中：p2 命中"运动"=1、p4 命中"麻将"=1（同分取输入序）→ p2 在前，p5 命中 0 兜底
    assert.equal(result[0], 'p2');
    assert.ok(result.includes('p5'), '不足时按顺序补足');
});

test('projects_filter_by_category', () => {
    const result = R.recommendProjects({
        projects: sampleProjects,
        memberTags: ['火锅', '麻将'],
        lastProjectIds: [],
        category: 'mahjong'
    });
    assert.ok(result.length >= 1, '类别内有结果');
    result.forEach(id => {
        const p = sampleProjects.find(x => x.id === id);
        assert.equal(p.category, 'mahjong', '只推荐指定类别');
    });
});

test('venues_midpoint_tier_and_avoid_last', () => {
    const project = { id: 'p1', category: 'dinner' };
    const r = R.recommendVenues({ venues: sampleVenues, members: sampleMembers, project, lastVenueId: 'v1' });
    assert.equal(r.length, 3);
    assert.ok(!r.includes('v1'), '排除上次地点');
    assert.ok(!r.includes('v5'), '排除 category 不匹配');
    // 成员 朝阳×2/海淀×1，档位众数 mid：v4(朝阳2,mid,4.8) > v3(朝阳2,premium,4.6) > v2(海淀1,mid,4.9)
    assert.deepEqual(r, ['v4', 'v3', 'v2']);
});

test('times_rules_and_count', () => {
    const dayMembers = [
        { work: { type: '白班' } }, { work: { type: '白班' } },
        { work: { type: '白班' } }, { work: { type: '自由' } }
    ];
    const t1 = R.suggestTimes({ members: dayMembers, count: 3, now: '2026-11-17 12:00' });
    assert.equal(t1.length, 3, 'count=3 固定');
    const first = new Date(t1[0].replace(' ', 'T'));
    assert.ok(first.getDay() >= 1 && first.getDay() <= 5, '白班多数首个候选应为工作日');
    assert.equal(first.getHours(), 19, '白班多数应从 19:00 起');

    const nightMembers = [
        { work: { type: '晚班' } }, { work: { type: '晚班' } }, { work: { type: '白班' } }
    ];
    const t2 = R.suggestTimes({ members: nightMembers, count: 3, now: '2026-11-17 12:00' });
    const first2 = new Date(t2[0].replace(' ', 'T'));
    assert.ok(first2.getDay() === 0 || first2.getDay() === 6, '晚班多数首个候选应为周末');
});

test('bestTime_tie_picks_earliest', () => {
    const r = R.computeBestTime({
        timeVotes: { u1: { 0: true }, m1: { 1: true } },
        timeCandidates: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00']
    });
    assert.deepEqual(r.attendance, [1, 1, 0]);
    assert.equal(r.winnerIndex, 0, '平票取最早候选');
    assert.equal(r.tied.length, 2, '并列项完整记录');
});

test('bestTime_all_absent', () => {
    const r = R.computeBestTime({ timeVotes: {}, timeCandidates: ['a', 'b'] });
    assert.equal(r.winnerIndex, null, '全部未表态无最佳');
});

test('output_no_member_privacy', () => {
    const vs = JSON.stringify(R.recommendVenues({
        venues: sampleVenues, members: sampleMembers,
        project: { category: 'dinner' }, lastVenueId: null
    }));
    assert.ok(!vs.includes('朝阳') && !vs.includes('海淀'), '地点推荐输出不得含成员位置');
    assert.ok(!vs.includes('premium') && !vs.includes('mid'), '地点推荐输出不得含成员消费档位');

    const circle = { id: 'c1', members: sampleMembers };
    const pr = JSON.stringify(R.buildProposal({
        circle, projectId: 'p1', venues: ['v1', 'v4'],
        times: ['2026-11-21 14:00'], proposerId: 'u1'
    }));
    assert.ok(!pr.includes('朝阳') && !pr.includes('premium'), '提案输出不得含成员隐私字段');
    assert.ok(!pr.includes('m1'), '提案输出不得含成员信息');
    assert.equal(pr.includes('"status":"open"'), true, '提案初始状态 open');
});
