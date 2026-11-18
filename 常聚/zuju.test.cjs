/**
 * 常聚组局流程测试（node zuju.test.cjs）
 * vm 沙箱串联 zuju.js + propose/vote/event 三页内联脚本
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function makeStorage() {
    const m = {};
    return {
        getItem: k => (k in m ? m[k] : null),
        setItem: (k, v) => { m[k] = String(v); },
        removeItem: k => { delete m[k]; }
    };
}

function makeDocument() {
    const document = {
        _html: '',
        getElementById() { return document; },
        set innerHTML(v) { document._html = v; },
        get innerHTML() { return document._html; },
        querySelectorAll() { return []; },
        querySelector() { return null; },
        addEventListener() {},
        createElement() { return { appendChild() {}, remove() {}, style: {}, classList: { add() {} }, addEventListener() {} }; },
        body: { appendChild() {} }
    };
    return document;
}

function inlineScriptOf(file) {
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    return [...html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(m => !/type=["'](importmap|module)["']/.test(m[1]))
        .map(m => m[2])
        .join('\n');
}

function makeSandbox() {
    const document = makeDocument();
    const sandbox = {
        window: { location: { href: '' } },
        document,
        localStorage: makeStorage(),
        navigator: {},
        URLSearchParams,
        setTimeout, clearTimeout
    };
    sandbox.window.document = document;
    sandbox.window.localStorage = sandbox.localStorage;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'rotation.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'recommend.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'zuju.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf('propose.html'), sandbox);
    vm.runInContext(inlineScriptOf('vote.html'), sandbox);
    vm.runInContext(inlineScriptOf('event.html'), sandbox);
    return sandbox;
}

function manualProposal(s, circleId) {
    return s.window.Zuju.buildProposalManual({
        circleId,
        projectId: 'p5',
        venueIds: ['v9', 'v10', 'v11'],
        times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00']
    });
}

test('build_proposal_manual', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    assert.ok(p, '生成提案');
    assert.equal(p.timeCandidates.length, 3, '时间候选来自发起人选择');
    assert.equal(p.venueIds.length, 3, '地点候选来自发起人选择');
    assert.equal(p.projectId, 'p5', '项目来自发起人选择');
    assert.equal(p.status, 'open');
    const c3 = s.window.GlobalData.circles.find(c => c.id === 'c3');
    assert.equal(c3.proposalId, p.id, '圈子记录进行中提案');
    const bad = s.window.Zuju.buildProposalManual({ circleId: 'c3', projectId: null, venueIds: ['v9'], times: ['2026-11-21 14:00'] });
    assert.equal(bad, null, '缺项目不生成');
});

test('vote_matrix_and_best_time', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    s.window.Zuju.submitVotes(p.id, {
        time: { u1: { 0: true }, m1: { 0: true }, m2: { 1: true } },
        venue: { u1: 'v1', m1: 'v1', m2: 'v2' }
    });
    const sum = s.window.Zuju.voteSummary(p.id);
    assert.equal(sum.bestTime.winnerIndex, 0, '最大公约时间');
    assert.equal(sum.bestTime.attendance[0], 2, '出席人数正确');
    const html = s.window.VoteView.render(p.id);
    assert.ok(html.includes('最齐时间'), '页面含最齐时间横幅');
    assert.ok(html.includes('2'), '横幅含人数');
});

test('deadline_auto_decide', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    s.window.Zuju.submitVotes(p.id, {
        time: { u1: { 0: true }, m1: { 0: true }, m2: { 1: true } },
        venue: { u1: 'v1', m1: 'v1' }
    });
    s.window.Demo.advanceTime(48);
    const now = s.window.Common.fmtDate(s.window.Demo.getNow());
    s.window.Zuju.tryDecide(p.id, now);
    assert.equal(p.status, 'decided', '超截止自动定案');
    const g = s.window.GlobalData.gatherings.find(x => x.proposalId === p.id);
    assert.ok(g, '定案生成聚会记录');
    assert.ok(g.attendees.includes('u1') && g.attendees.includes('m1'), '出席者与时间表态一致');
    assert.ok(!g.attendees.includes('m2'), '未选最佳时间的成员不在名单');
    const c3 = s.window.GlobalData.circles.find(c => c.id === 'c3');
    assert.equal(c3.proposalId, null, '圈子清空进行中提案');
});

test('create_circle_engine', () => {
    const s = makeSandbox();
    const c = s.window.Zuju.createCircle({ name: '组局新圈', type: 'mahjong' });
    assert.ok(c && c.id, '生成圈子');
    assert.equal(c.ownerId, 'u1');
    assert.equal(c.hostId, 'u1', '建圈人首任张罗');
    assert.equal(c.city, '北京');
    assert.equal(c.members.length, 1);
    assert.equal(c.members[0].joinOrder, 1);
    const bad = s.window.Zuju.createCircle({ name: '  ', type: 'dinner' });
    assert.equal(bad, null, '空名不创建');
});

test('propose_new_user_circle_form', () => {
    const s = makeSandbox();
    s.window.ProposeView._newUser = true;
    const html = s.window.ProposeView.renderNew();
    assert.ok(html.includes('新建圈子'), '新用户第一步是新建圈子');
    assert.ok(html.includes('圈子叫什么'), '含圈名输入');
    assert.ok(!html.includes('或选择已有圈子'), '新用户不显示已有圈子选择');
    assert.ok(!html.includes('cj-chip-warm'), '进入时不默认选中任何类型');
    assert.ok(html.includes('运动') && html.includes('棋牌') && html.includes('家人'), '类型更通用（运动/棋牌/家人等）');
    assert.ok(!html.includes('>麻将<'), '不再单列麻将类型');
    s.window.ProposeView._newUser = false;
    const picker = s.window.ProposeView.renderNew();
    assert.ok(picker.includes('或选择已有圈子'), '注册用户可选已有圈子');
});

test('propose_requires_circle_type', () => {
    const s = makeSandbox();
    s.window.ProposeView._newUser = true;
    s.window.ProposeView._circleType = null;
    const r = s.window.ProposeView.createAndContinue({ name: '无类型圈', type: null });
    assert.equal(r, null, '未选类型不创建圈子');
});

test('propose_create_circle_continues_to_zuju', () => {
    const s = makeSandbox();
    s.window.ProposeView._newUser = true;
    s.window.ProposeView.createAndContinue({ name: '周末新局', type: 'ball' });
    const c = s.window.GlobalData.circles.find(x => x.name === '周末新局');
    assert.ok(c, '圈子已创建');
    const html = s.window.ProposeView.renderStep(2);
    assert.ok(html.includes('玩什么'), '创建后进入第 2 步选活动项目');
    assert.equal((html.match(/data-time/g) || []).length, 0, '第 2 步不显示时间');
});

test('propose_five_step_flow', () => {
    const s = makeSandbox();
    s.window.ProposeView._newUser = true;
    s.window.ProposeView.createAndContinue({ name: '周末新局', type: 'mahjong' });
    // 第 2 步：选活动项目
    let html = s.window.ProposeView.renderStep(2);
    assert.ok(html.includes('饭局') && html.includes('麻将'), '项目类别齐全');
    s.window.ProposeView.pickProjectCategory('mahjong');
    s.window.ProposeView.pickProject('p8');
    // 第 3 步：选时间
    html = s.window.ProposeView.renderStep(3);
    assert.ok(html.includes('什么时候聚'), '第 3 步时间标题');
    assert.equal((html.match(/data-time/g) || []).length, 3, '默认 3 个时间候选');
    // 第 4 步：选地点
    html = s.window.ProposeView.renderStep(4);
    assert.ok(html.includes('去哪聚'), '第 4 步地点标题');
    assert.ok(html.includes('雀神会所'), '地点列表按项目类别过滤（麻将馆）');
    s.window.ProposeView.toggleVenue('v1');
    assert.ok(s.window.ProposeView._venueIds.includes('v1'), '地点已选');
    // 第 5 步：生成邀请卡片
    html = s.window.ProposeView.renderStep(5);
    assert.ok(html.includes('组局邀请卡片'), '第 5 步邀请卡预览');
    assert.ok(html.includes('血战到底麻将'), '卡片含项目名');
    // 发出提案
    s.window.ProposeView.send();
    const c = s.window.GlobalData.circles.find(x => x.name === '周末新局');
    assert.ok(c.proposalId, '提案已发出');
    const p = s.window.GlobalData.proposals.find(x => x.id === c.proposalId);
    assert.equal(p.status, 'open');
    assert.equal(p.projectId, 'p8');
    assert.equal(p.venueIds.length, 1);
});

test('propose_share_invite_overlay', () => {
    const s = makeSandbox();
    s.window.ProposeView.shareInvite();
    assert.ok(s.document._html.includes('把组局邀请分享到群'), '分享浮层标题');
    assert.ok(s.document._html.includes('周五麻将局群'), '含可分享的群');
    s.window.ProposeView.pickShareGroup('周五麻将局群');
    assert.ok(!s.document._html.includes('把组局邀请分享到群'), '选群后浮层关闭');
});

test('event_has_share_button', () => {
    const s = makeSandbox();
    const html = s.window.EventView.render('p1');
    assert.ok(html.includes('分享邀请到群'), '局详情页有分享入口');
});

test('deadline_all_abstain_stays_open', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    s.window.Demo.advanceTime(48);
    const now = s.window.Common.fmtDate(s.window.Demo.getNow());
    s.window.Zuju.tryDecide(p.id, now);
    assert.equal(p.status, 'open', '全部未表态不自动定案');
    assert.equal(s.window.GlobalData.gatherings.some(g => g.proposalId === p.id), false, '不生成空聚会');
});

test('remind_non_voters', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    const before = s.window.GlobalData.notifications.length;
    s.window.Zuju.remindNonVoters(p.id);
    const G = s.window.GlobalData;
    assert.equal(G.notifications.length, before + 1, '新增提醒');
    assert.equal(G.notifications[G.notifications.length - 1].type, 'respond');
});
