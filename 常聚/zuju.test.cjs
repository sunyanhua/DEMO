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
        times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'],
        note: '打完球附近一起吃个饭'
    });
}

test('build_proposal_manual', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    assert.ok(p, '生成提案');
    assert.equal(p.timeCandidates.length, 3, '时间候选来自发起人选择');
    assert.equal(p.venueIds.length, 3, '地点候选来自发起人选择');
    assert.equal(p.projectId, 'p5', '单项目来自发起人选择');
    assert.equal(p.note, '打完球附近一起吃个饭', '备注写入提案');
    assert.equal(p.status, 'organizing');
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
    assert.equal(p.status, 'progress', '超截止自动定案');
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
    assert.ok(!html.includes('已有圈子'), '新用户不显示已有圈子选择');
    assert.ok(!html.includes('cj-chip-warm'), '进入时不默认选中任何类型');
    assert.ok(html.includes('运动') && html.includes('棋牌') && html.includes('家人'), '类型更通用（运动/棋牌/家人等）');
    assert.ok(!html.includes('>麻将<'), '不再单列麻将类型');
    s.window.ProposeView._newUser = false;
    const picker = s.window.ProposeView.renderNew();
    assert.ok(picker.includes('已有圈子'), '已有圈子区块存在');
    assert.ok(picker.indexOf('已有圈子') < picker.indexOf('新建圈子'), '已有圈子在上、新建圈子在下');
    assert.ok(picker.includes('周五麻将局'), '圈子卡片显示圈名');
    assert.ok(picker.includes('上次聚会'), '圈子卡片含上次聚会天数');
    assert.ok(picker.includes('cj-group-icon'), '微信群式九宫格圈头像');
    assert.ok(picker.indexOf('已有圈子') < picker.indexOf('周五麻将局') && picker.indexOf('周五麻将局') < picker.indexOf('新建圈子'), '已有圈子卡片在新建卡片之前');
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
    // 第 2 步：选活动项目（单选）+ 备注说明（非必填）
    let html = s.window.ProposeView.renderStep(2);
    assert.ok(html.includes('饭局') && html.includes('棋牌'), '项目类别齐全');
    assert.ok(!html.includes('可多选'), '回到单项目选择');
    assert.ok(html.includes('备注') && html.includes('非必填'), '项目下方有备注说明');
    s.window.ProposeView.pickProjectCategory('mahjong');
    s.window.ProposeView.pickProject('p8');
    assert.equal(s.window.ProposeView._projectId, 'p8', '单选生效');
    s.window.ProposeView.pickProjectCategory('dinner');
    s.window.ProposeView.pickProject('p1');
    assert.equal(s.window.ProposeView._projectId, 'p1', '重选替换原项目');
    s.window.ProposeView._note = '打完球附近一起吃个饭';
    s.window.ProposeView.gotoStep(3);
    // 第 3 步：时间+地点合并，上下两个明确区域
    html = s.window.ProposeView.renderStep(3);
    assert.ok(html.includes('什么时候聚'), '上区：时间');
    assert.ok(html.includes('去哪聚'), '下区：地点');
    assert.ok(html.includes('指定时间') && html.includes('时间候选'), '时间两种模式提示');
    assert.ok(html.includes('指定地点') && html.includes('地点候选'), '地点两种模式提示');
    // 提示语打磨：不暴露内部逻辑，话术通俗
    assert.ok(!html.includes('合作地点优先'), '不向用户暴露合作优先逻辑');
    assert.ok(!html.includes('优先推荐'), '不向用户暴露推荐优先级');
    assert.ok(!html.includes('大家表态选最齐的'), '去除生硬话术');
    assert.ok(html.includes('人最齐'), '通俗话术：人最齐的自动胜出');
    assert.equal((html.match(/去哪聚/g) || []).length, 1, '去哪聚标题与操作区同一张卡');
    assert.equal((html.match(/data-time/g) || []).length, 3, '默认 3 个时间候选');
    assert.ok(html.includes('望京小腰烧烤'), '地点候选按项目类别过滤（火锅局→餐厅）');
    s.window.ProposeView.toggleVenue('v1');
    assert.ok(s.window.ProposeView._venueIds.includes('v1'), '候选地点已选');
    // 下区模式 1：指定地点——合作地点优先 + 可自己输入
    s.window.ProposeView.pickVenueMode('fixed');
    html = s.window.ProposeView.renderStep(3);
    assert.ok(html.indexOf('西单烤鸭坊') >= 0 && html.indexOf('西单烤鸭坊') < html.indexOf('望京小腰烧烤'), '推荐列表合作地点优先');
    assert.ok(html.includes('自己输入'), '支持用户自己输入地点');
    s.window.ProposeView.pickFixedVenue('v6');
    assert.deepEqual(s.window.ProposeView._venueIds, ['v6'], '指定地点单选');
    s.window.ProposeView.setCustomVenue('老王家常菜馆');
    assert.equal(s.window.ProposeView._customVenue, '老王家常菜馆', '自定义地点生效');
    // 上区模式 1：指定时间——单个输入
    s.window.ProposeView.pickTimeMode('fixed');
    html = s.window.ProposeView.renderStep(3);
    assert.equal((html.match(/data-time/g) || []).length, 1, '指定时间=单个输入');
    // 第 4 步：生成邀请卡片
    s.window.ProposeView.gotoStep(4);
    html = s.window.ProposeView.renderStep(4);
    assert.ok(html.includes('组局邀请卡片'), '邀请卡预览');
    assert.ok(html.includes('火锅局'), '卡片含所选项目');
    assert.ok(html.includes('打完球附近一起吃个饭'), '卡片含备注说明');
    assert.ok(html.includes('老王家常菜馆'), '卡片含自定义地点');
    // 发出提案
    s.window.ProposeView.send();
    const c = s.window.GlobalData.circles.find(x => x.name === '周末新局');
    assert.ok(c.proposalId, '提案已发出');
    const p = s.window.GlobalData.proposals.find(x => x.id === c.proposalId);
    assert.equal(p.status, 'organizing');
    assert.equal(p.projectId, 'p1', '单项目');
    assert.equal(p.note, '打完球附近一起吃个饭', '备注写入提案');
    assert.equal(p.timeCandidates.length, 1, '指定时间=1 个候选');
    assert.equal(p.customVenue, '老王家常菜馆', '自定义地点写入提案');
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
    assert.ok(html.includes('结束投票'), '组局中阶段可手动结束投票');
    assert.ok(html.includes('组局中'), '组局中状态胶囊');
});

test('event_progress_ui', () => {
    const s = makeSandbox();
    // 场景1：mock 圈友待确认 → 名单区展示，由演示面板模拟确认
    const p = manualProposal(s, 'c3');
    s.window.Zuju.submitVotes(p.id, {
        time: { u1: { 0: true }, m2: { 1: true } },
        venue: { u1: 'v1' }
    });
    s.window.Zuju.endVoting(p.id);
    let html = s.window.EventView.render(p.id);
    assert.ok(html.includes('进行中'), '进行中状态胶囊');
    assert.ok(html.includes('已参加'), '已参加名单区');
    assert.ok(html.includes('待确认'), '待确认名单区');
    assert.ok(html.includes('等他们确认'), 'mock 圈友待确认提示（演示面板模拟）');
    assert.ok(html.includes('结束组局'), '发起人可结束组局');
    // 场景2：我待确认 → 显示确认按钮
    const p2 = manualProposal(s, 'c3');
    s.window.Zuju.submitVotes(p2.id, {
        time: { u1: { 1: true }, m1: { 0: true } },
        venue: { u1: 'v1' }
    });
    s.window.Zuju.endVoting(p2.id);
    html = s.window.EventView.render(p2.id);
    assert.ok(html.includes('我可以参加'), '待确认的我可确认');
    s.window.EventView._pid = p2.id;
    s.window.EventView.confirmMe();
    const g2 = s.window.GlobalData.gatherings.find(x => x.proposalId === p2.id);
    assert.ok(g2.attendees.includes('u1'), '确认后加入名单');
    assert.equal(g2.pendingConfirm.length, 0);
});

test('propose_deadline_hours', () => {
    const s = makeSandbox();
    const p = s.window.Zuju.buildProposalManual({
        circleId: 'c3', projectId: 'p5', venueIds: ['v9'], times: ['2026-11-21 14:00'],
        deadlineHours: 24
    });
    const now = s.window.Demo.getNow().getTime();
    const dl = new Date(p.deadline.replace(' ', 'T')).getTime();
    const h = (dl - now) / 3600000;
    assert.ok(h > 23.9 && h < 24.1, '截止时间为所选 24 小时');
});

test('decide_splits_attendees_and_pending', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    s.window.Zuju.submitVotes(p.id, {
        time: { u1: { 0: true }, m1: { 0: true }, m2: { 1: true }, m8: { 0: true } },
        venue: { u1: 'v1', m1: 'v1' }
    });
    s.window.Zuju.tryDecide(p.id, '2099-01-01 00:00');
    assert.equal(p.status, 'progress', '定案进入进行中');
    const g = s.window.GlobalData.gatherings.find(x => x.proposalId === p.id);
    assert.deepEqual(g.attendees.sort(), ['m1', 'm8', 'u1'].sort(), '投胜出时间者自动加入');
    assert.deepEqual(g.pendingConfirm, ['m2'], '投其他时间者待确认');
});

test('end_voting_manual', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    s.window.Zuju.submitVotes(p.id, {
        time: { u1: { 0: true }, m1: { 0: true } },
        venue: { u1: 'v1' }
    });
    // 不推进时间，发起人手动结束投票
    s.window.Zuju.endVoting(p.id);
    assert.equal(p.status, 'progress', '手动结束投票立即定案');
});

test('confirm_decline_join', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    s.window.Zuju.submitVotes(p.id, {
        time: { u1: { 0: true }, m2: { 1: true } },
        venue: { u1: 'v1' }
    });
    s.window.Zuju.tryDecide(p.id, '2099-01-01 00:00');
    const g = s.window.GlobalData.gatherings.find(x => x.proposalId === p.id);
    assert.deepEqual(g.pendingConfirm, ['m2']);
    s.window.Zuju.confirmAttend(p.id, 'm2');
    assert.ok(g.attendees.includes('m2'), '待确认者确认后加入');
    assert.equal(g.pendingConfirm.length, 0);
    s.window.Zuju.declineAttend(p.id, 'm9');
    assert.ok(!g.pendingConfirm.includes('m9'));
    s.window.Zuju.joinAttend(p.id, 'm9');
    assert.ok(g.attendees.includes('m9'), '未表态者可主动加入');
});

test('deadline_all_abstain_stays_open', () => {
    const s = makeSandbox();
    const p = manualProposal(s, 'c3');
    s.window.Demo.advanceTime(48);
    const now = s.window.Common.fmtDate(s.window.Demo.getNow());
    s.window.Zuju.tryDecide(p.id, now);
    assert.equal(p.status, 'organizing', '全部未表态不自动定案');
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
