/**
 * 常聚演示主线全链路测试（node flow.test.cjs）
 * 建圈 → 提案 → 表态 → 定案 → 散场 → AA → 下一轮 + 隐私快照
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

const PAGES = ['index.html', 'create.html', 'circle.html', 'propose.html', 'vote.html', 'event.html',
    'end-event.html', 'record.html', 'ledger.html', 'memory.html', 'message.html', 'me.html', 'merchant.html'];

function makeSandbox() {
    const document = makeDocument();
    const sandbox = {
        window: { location: { href: '', reload() {} } },
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
    vm.runInContext(fs.readFileSync(path.join(dir, 'settle.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'zuju.js'), 'utf8'), sandbox);
    PAGES.forEach(p => vm.runInContext(inlineScriptOf(p), sandbox));
    return sandbox;
}

test('flow_create_circle', () => {
    const s = makeSandbox();
    const c = s.window.CreateCircle.submit({ name: '流程测试圈', type: 'dinner', mode: 'blank' });
    s.window.CreateCircle.simulateJoin(c.id);
    assert.equal(c.ownerId, 'u1');
    assert.equal(c.hostId, 'u1');
    assert.equal(c.members.length, 4);
});

test('flow_build_proposal', () => {
    const s = makeSandbox();
    const c = s.window.CreateCircle.submit({ name: '流程测试圈', type: 'dinner', mode: 'blank' });
    s.window.CreateCircle.simulateJoin(c.id);
    const p = s.window.Zuju.buildProposalManual({ circleId: c.id, projectId: 'p3', venueIds: ['v6', 'v4', 'v7'], times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'] });
    assert.equal(p.status, 'open');
    assert.equal(p.timeCandidates.length, 3);
    assert.equal(p.venueIds.length, 3);
});

test('flow_simulate_votes', () => {
    const s = makeSandbox();
    const c = s.window.CreateCircle.submit({ name: '流程测试圈', type: 'dinner', mode: 'blank' });
    s.window.CreateCircle.simulateJoin(c.id);
    const p = s.window.Zuju.buildProposalManual({ circleId: c.id, projectId: 'p3', venueIds: ['v6', 'v4', 'v7'], times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'] });
    s.window.Demo.simulateVotes(p.id);
    const mockIds = c.members.filter(m => m.id !== 'u1').map(m => m.id);
    mockIds.forEach(id => {
        assert.ok(p.votes.time[id], '圈友 ' + id + ' 有时间表态');
        assert.ok(p.votes.venue[id], '圈友 ' + id + ' 有地点表态');
    });
});

test('flow_decide_after_deadline', () => {
    const s = makeSandbox();
    const c = s.window.CreateCircle.submit({ name: '流程测试圈', type: 'dinner', mode: 'blank' });
    s.window.CreateCircle.simulateJoin(c.id);
    const p = s.window.Zuju.buildProposalManual({ circleId: c.id, projectId: 'p3', venueIds: ['v6', 'v4', 'v7'], times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'] });
    s.window.Demo.simulateVotes(p.id);
    s.window.Demo.advanceTime(48);
    s.window.Zuju.tryDecide(p.id, s.window.Common.fmtDate(s.window.Demo.getNow()));
    assert.equal(p.status, 'decided');
    const g = s.window.GlobalData.gatherings.find(x => x.proposalId === p.id);
    assert.ok(g, '定案生成聚会');
    assert.ok(g.attendees.length >= 1, '有出席者');
});

test('flow_end_event_three_steps', () => {
    const s = makeSandbox();
    const c = s.window.CreateCircle.submit({ name: '流程测试圈', type: 'dinner', mode: 'blank' });
    s.window.CreateCircle.simulateJoin(c.id);
    const p = s.window.Zuju.buildProposalManual({ circleId: c.id, projectId: 'p3', venueIds: ['v6', 'v4', 'v7'], times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'] });
    s.window.Demo.simulateVotes(p.id);
    s.window.Demo.advanceTime(48);
    s.window.Zuju.tryDecide(p.id, s.window.Common.fmtDate(s.window.Demo.getNow()));
    const g = s.window.GlobalData.gatherings.find(x => x.proposalId === p.id);
    const hostBefore = c.hostId;
    s.window.EndView.draw(g.id, () => 0.99);
    assert.notEqual(c.hostId, hostBefore, '散场抽签交接当值');
    s.window.EndView.finish(g.id, { title: '第一局', summary: '流程通了', photos: ['images/moment-1.jpg'] });
    assert.equal(g.title, '第一局');
    assert.equal(c.lastGatheringId, g.id, '圈子记录更新');
});

test('flow_ledger_settle', () => {
    const s = makeSandbox();
    const c = s.window.CreateCircle.submit({ name: '流程测试圈', type: 'dinner', mode: 'blank' });
    s.window.CreateCircle.simulateJoin(c.id);
    const p = s.window.Zuju.buildProposalManual({ circleId: c.id, projectId: 'p3', venueIds: ['v6', 'v4', 'v7'], times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'] });
    s.window.Demo.simulateVotes(p.id);
    s.window.Demo.advanceTime(48);
    s.window.Zuju.tryDecide(p.id, s.window.Common.fmtDate(s.window.Demo.getNow()));
    const g = s.window.GlobalData.gatherings.find(x => x.proposalId === p.id);
    const bill = s.window.LedgerView.getBill(g.id);
    s.window.LedgerView.addEntry(g.id, { title: '餐费', amount: 400, payerId: 'u1', participants: c.members.map(m => m.id) });
    const shares = s.window.Settle.computeShares({ entries: bill.entries, memberIds: c.members.map(m => m.id) });
    const transfers = s.window.Settle.consolidate(shares);
    assert.equal(transfers.length, 3, '4 人 1 笔垫付→3 笔转账');
    c.members.forEach(m => s.window.LedgerView.markSettled(g.id, m.id));
    assert.equal(s.window.Settle.billState({ bill, settled: bill.settled }), 'settled');
});

test('flow_next_round_rhythm', () => {
    const s = makeSandbox();
    const c = s.window.CreateCircle.submit({ name: '流程测试圈', type: 'dinner', mode: 'blank' });
    s.window.CreateCircle.simulateJoin(c.id);
    const p = s.window.Zuju.buildProposalManual({ circleId: c.id, projectId: 'p3', venueIds: ['v6', 'v4', 'v7'], times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'] });
    s.window.Demo.simulateVotes(p.id);
    s.window.Demo.advanceTime(48);
    s.window.Zuju.tryDecide(p.id, s.window.Common.fmtDate(s.window.Demo.getNow()));
    const g = s.window.GlobalData.gatherings.find(x => x.proposalId === p.id);
    s.window.EndView.finish(g.id, { title: '第一局', summary: '', photos: [] });
    const r = s.window.Rotation.checkRhythm({ circle: c, lastGatheringTime: g.time, now: g.time });
    assert.equal(r.due, false, '刚聚完不触发提醒');
    const p2 = s.window.Zuju.buildProposalManual({ circleId: c.id, projectId: 'p3', venueIds: ['v6', 'v4', 'v7'], times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'] });
    assert.equal(p2.status, 'open', '下一轮提案可发起');
});

test('flow_new_user_zuju_guide_index', () => {
    const s = makeSandbox();
    // 新用户：默认组局 tab，高格调引导
    s.window.IndexView._tab = 'zuju';
    s.window.IndexView._registered = false;
    const guide = s.window.IndexView.render();
    assert.ok(guide.includes('多久没聚'), '组局引导话术');
    assert.ok(guide.includes('马上开始组局'), '组局入口按钮');
    assert.ok(guide.includes('auth.html'), '点击先走手机号授权');
    assert.ok(!guide.includes('周五麻将局'), '新用户引导不显示圈子列表');
    // 引导视觉：大图 + 大字号
    assert.ok(guide.includes('width:170px'), '引导拍立得大图 170px');
    assert.ok(guide.includes('font-size:30px'), '引导标题 30px');
    assert.ok(guide.includes('font-size:15px'), '引导文案 15px');
    // 引导动效：拍立得飘落 + 静置浮动 + 内容逐行浮现
    assert.ok(guide.includes('cj-anim-drop'), '拍立得入场动效');
    assert.ok(guide.includes('cj-float'), '拍立得静置浮动');
    assert.ok((guide.match(/cj-anim-fadeup/g) || []).length >= 3, '标题/文案/按钮逐行浮现');
    // 圈子 tab 仍是圈子列表
    s.window.IndexView._tab = 'circles';
    const normal = s.window.IndexView.render();
    assert.ok(normal.includes('周五麻将局'), '圈子 tab 显示圈子列表');
    assert.ok(!normal.includes('多久没聚'), '圈子 tab 不显示组局引导');
});

test('flow_zuju_list_index', () => {
    const s = makeSandbox();
    s.window.IndexView._tab = 'zuju';
    s.window.IndexView._registered = true;
    const html = s.window.IndexView.render();
    // 有组局 → 显示列表而非引导
    assert.ok(!html.includes('多久没聚'), '已有组局不显示引导');
    assert.ok(html.includes('进行中') && html.includes('已完成'), '进行中/已完成分区');
    assert.ok(html.indexOf('进行中') < html.indexOf('已完成'), '进行中在上、已完成在下');
    // 进行中卡：p1 提案（组局内容/时间/圈友）
    assert.ok(html.includes('血战到底麻将'), '进行中卡含组局内容');
    assert.ok(html.includes('投票中'), '进行中卡含状态');
    // 已完成卡：聚会记录
    assert.ok(html.includes('老王手气爆棚之夜'), '已完成卡含聚会记录');
    // 无组局时回到引导
    s.window.GlobalData.proposals = [];
    s.window.GlobalData.gatherings = [];
    const empty = s.window.IndexView.render();
    assert.ok(empty.includes('多久没聚'), '无组局时显示引导');
});

test('flow_no_privacy_leak', () => {
    const s = makeSandbox();
    const c = s.window.CreateCircle.submit({ name: '流程测试圈', type: 'dinner', mode: 'blank' });
    s.window.CreateCircle.simulateJoin(c.id);
    const p = s.window.Zuju.buildProposalManual({ circleId: c.id, projectId: 'p3', venueIds: ['v6', 'v4', 'v7'], times: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'] });
    s.window.Demo.simulateVotes(p.id);
    s.window.Demo.advanceTime(48);
    s.window.Zuju.tryDecide(p.id, s.window.Common.fmtDate(s.window.Demo.getNow()));
    const g = s.window.GlobalData.gatherings.find(x => x.proposalId === p.id);
    const snapshots = [
        s.window.CircleView.render(c.id),
        s.window.VoteView.render(p.id),
        s.window.EventView.render(p.id),
        s.window.RecordView.render(g.id),
        s.window.LedgerView.render(g.id),
        s.window.MemoryView.render(c.id)
    ];
    snapshots.forEach((html, i) => {
        assert.ok(!html.includes('economy') && !html.includes('premium'), '快照 ' + i + ' 泄漏消费档位');
        assert.ok(!html.includes('spendTier'), '快照 ' + i + ' 泄漏字段名');
    });
});
