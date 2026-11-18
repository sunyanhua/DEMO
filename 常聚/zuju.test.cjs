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

test('build_proposal_defaults', () => {
    const s = makeSandbox();
    const p = s.window.Zuju.buildProposal('c3');
    assert.ok(p, '生成提案');
    assert.equal(p.timeCandidates.length, 3, '默认 3 个时间候选');
    assert.equal(p.venueIds.length, 3, '默认 3 个地点候选');
    assert.ok(p.projectId, '项目非空');
    assert.equal(p.status, 'open');
    const c3 = s.window.GlobalData.circles.find(c => c.id === 'c3');
    assert.equal(c3.proposalId, p.id, '圈子记录进行中提案');
});

test('build_proposal_respects_circle_category', () => {
    const s = makeSandbox();
    const p1 = s.window.Zuju.buildProposal('c1');
    const proj1 = s.window.GlobalData.projects.find(x => x.id === p1.projectId);
    assert.equal(proj1.category, 'mahjong', '麻将圈默认推荐麻将类项目');
    const p3 = s.window.Zuju.buildProposal('c3', { category: 'ball' });
    const proj3 = s.window.GlobalData.projects.find(x => x.id === p3.projectId);
    assert.equal(proj3.category, 'ball', '显式指定方向生效');
});

test('vote_matrix_and_best_time', () => {
    const s = makeSandbox();
    const p = s.window.Zuju.buildProposal('c3');
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
    const p = s.window.Zuju.buildProposal('c3');
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
    const p = s.window.Zuju.buildProposal('c3');
    s.window.Demo.advanceTime(48);
    const now = s.window.Common.fmtDate(s.window.Demo.getNow());
    s.window.Zuju.tryDecide(p.id, now);
    assert.equal(p.status, 'open', '全部未表态不自动定案');
    assert.equal(s.window.GlobalData.gatherings.some(g => g.proposalId === p.id), false, '不生成空聚会');
});

test('remind_non_voters', () => {
    const s = makeSandbox();
    const p = s.window.Zuju.buildProposal('c3');
    const before = s.window.GlobalData.notifications.length;
    s.window.Zuju.remindNonVoters(p.id);
    const G = s.window.GlobalData;
    assert.equal(G.notifications.length, before + 1, '新增提醒');
    assert.equal(G.notifications[G.notifications.length - 1].type, 'respond');
});
