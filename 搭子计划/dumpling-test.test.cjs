/**
 * 饺子人格测试引擎测试（node dumpling-test.test.cjs）
 * 在浏览器语义沙箱中执行 data.js + dumpling-test.js，测试与线上运行完全相同的代码。
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;
// 浏览器 API 垫片：data.js 顶层会读取 sessionStorage 恢复认证状态
const sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const sandbox = { window: {}, sessionStorage };
sandbox.window.sessionStorage = sessionStorage;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-quiz-data.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-data.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(dir, 'dumpling-test.js'), 'utf8'), sandbox);

const { GlobalData, DumplingTest } = sandbox.window;
const { score, pickWinner, calculate, routeForPersonality } = DumplingTest;

const PIDS = ['squid', 'tomatoegg', 'cucumber', 'beef', 'pork', 'chive', 'suancai', 'sanxian'];

test('测验数据与 JSON 唯一来源一致（dumpling-quiz-data.json ↔ 运行时）', () => {
    const json = JSON.parse(fs.readFileSync(path.join(dir, 'dumpling-quiz-data.json'), 'utf8'));
    // vm 跨域对象原型不同，JSON 序列化后比较
    assert.deepStrictEqual(
        JSON.parse(JSON.stringify(GlobalData.dumpling.personalities)),
        json.personalities,
        '人格结果数据应与 JSON 一致（改 JSON 后运行 npm run quiz:sync）'
    );
    assert.deepStrictEqual(
        JSON.parse(JSON.stringify(GlobalData.dumpling.questions)),
        json.questions,
        '人格测试题数据应与 JSON 一致（改 JSON 后运行 npm run quiz:sync）'
    );
});

test('人格数据完整：8 种饺子人格且字段齐全', () => {
    const ps = GlobalData.dumpling.personalities;
    assert.strictEqual(ps.length, 8);
    const ids = new Set();
    for (const p of ps) {
        assert.ok(p.id && !ids.has(p.id), `人格 id 唯一且非空: ${p.id}`);
        ids.add(p.id);
        assert.ok(p.title, `${p.id} 缺少 title`);
        assert.ok(p.quote && p.quote.length > 6, `${p.id} 缺少人设台词 quote`);
        assert.ok(p.method && p.method.length > 4, `${p.id} 缺少作案方式 method`);
        assert.ok(p.emoji && p.color, `${p.id} 缺少 emoji/color`);
    }
    assert.deepStrictEqual([...ids].sort(), [...PIDS].sort(), '人格 id 集合');
});

test('题目数据完整：8 题 × 4 选项，分值指向有效人格且每人格恰好 4 个槽位', () => {
    const qs = GlobalData.dumpling.questions;
    const ps = GlobalData.dumpling.personalities;
    assert.strictEqual(qs.length, 8);
    const pidSet = new Set(ps.map(p => p.id));
    const slotCount = {};
    qs.forEach((q, qi) => {
        assert.ok(q.text, `第 ${qi + 1} 题缺少 text`);
        assert.strictEqual(q.options.length, 4, `第 ${qi + 1} 题应有 4 个选项`);
        const qIds = new Set();
        q.options.forEach((opt, oi) => {
            assert.ok(opt.text, `第 ${qi + 1} 题选项 ${oi} 缺少 text`);
            const entries = Object.entries(opt.scores);
            assert.strictEqual(entries.length, 1, `第 ${qi + 1} 题选项 ${oi} 应恰好指向 1 个人格`);
            for (const [pid, pts] of entries) {
                assert.ok(pidSet.has(pid), `第 ${qi + 1} 题选项 ${oi} 分值指向未知人格: ${pid}`);
                assert.strictEqual(pts, 1, `第 ${qi + 1} 题选项 ${oi} 分值应为 1`);
                qIds.add(pid);
                slotCount[pid] = (slotCount[pid] || 0) + 1;
            }
        });
        assert.strictEqual(qIds.size, 4, `第 ${qi + 1} 题 4 个选项应指向 4 个不同人格`);
    });
    for (const pid of PIDS) {
        assert.strictEqual(slotCount[pid], 4, `人格 ${pid} 应恰好有 4 个选项槽位，实际 ${slotCount[pid]}`);
    }
});

test('score：按选项分值正确计分', () => {
    const answers = [0, 1, 2, 3, 0, 1, 2, 3];
    const scores = score(answers);
    const qs = GlobalData.dumpling.questions;
    const expected = {};
    answers.forEach((optIndex, qIndex) => {
        for (const [pid, pts] of Object.entries(qs[qIndex].options[optIndex].scores)) {
            expected[pid] = (expected[pid] || 0) + pts;
        }
    });
    // vm 跨域对象原型不同，需展开为宿主域对象再比较
    assert.deepStrictEqual({ ...scores }, { ...expected });
});

test('score：答案数量不合法时抛错', () => {
    assert.throws(() => score([0, 1]), /答案数量与题目数量不一致/);
    assert.throws(() => score([9, 9, 9, 9, 9, 9, 9, 9]), /选项下标非法/);
});

test('pickWinner：最高分胜出', () => {
    assert.strictEqual(pickWinner({ squid: 1, beef: 3, pork: 2 }, () => 0), 'beef');
});

test('pickWinner：同分随机且由传入随机数决定', () => {
    const scores = { squid: 2, beef: 2 };
    assert.strictEqual(pickWinner(scores, () => 0), 'squid', 'rnd=0 取第一个');
    assert.strictEqual(pickWinner(scores, () => 0.9), 'beef', 'rnd=0.9 取第二个');
});

test('calculate：返回胜出人格 id 与得分表', () => {
    const result = calculate([0, 0, 0, 0, 0, 0, 0, 0], () => 0);
    assert.ok(PIDS.includes(result.id));
    assert.strictEqual(typeof result.scores, 'object');
});

test('八种人格全部可达：穷举 4^8 种作答，每种人格都能达到最高分', () => {
    const qs = GlobalData.dumpling.questions;
    const total = 4 ** qs.length; // 65536 种组合
    const reachable = new Set();
    for (let combo = 0; combo < total; combo++) {
        let c = combo;
        const answers = [];
        for (let i = 0; i < qs.length; i++) {
            answers.push(c % 4);
            c = Math.floor(c / 4);
        }
        const s = score(answers);
        const max = Math.max(...Object.values(s));
        for (const pid of PIDS) {
            if (s[pid] === max) reachable.add(pid);
        }
    }
    for (const pid of PIDS) {
        assert.ok(reachable.has(pid), `人格 ${pid} 不可达`);
    }
});

test('路线数据完整：8 条路线一一对应人格，含饺子店/时间轴/人均预算/推荐理由', () => {
    const routes = GlobalData.dumpling.routes;
    assert.strictEqual(routes.length, 8);
    const pidSet = new Set();
    for (const r of routes) {
        assert.ok(r.id && r.personalityId, `${r.id} 缺少 id/personalityId`);
        assert.ok(PIDS.includes(r.personalityId), `${r.id} 指向未知人格`);
        assert.ok(!pidSet.has(r.personalityId), `人格 ${r.personalityId} 路线应唯一`);
        pidSet.add(r.personalityId);
        assert.ok(r.shop && r.shop.length > 2, `${r.id} 缺少饺子店`);
        assert.ok(Array.isArray(r.schedule) && r.schedule.length >= 3, `${r.id} 时间轴应至少 3 步`);
        r.schedule.forEach(s => {
            assert.ok(s.time && s.item, `${r.id} 时间轴步骤缺 time/item`);
        });
        assert.ok(r.budget && r.budget.includes('¥'), `${r.id} 缺少人均预算`);
        assert.ok(r.reason && r.reason.length > 8, `${r.id} 缺少推荐理由`);
    }
    assert.deepStrictEqual([...pidSet].sort(), [...PIDS].sort(), '路线应覆盖全部人格');
});

test('路线详情字段完整：类型标签/标签/沿途推荐/准备/预算明细/攻略', () => {
    for (const r of GlobalData.dumpling.routes) {
        assert.ok(r.typeLabel && r.typeLabel.length > 2, `${r.id} 缺少类型标签`);
        assert.ok(Array.isArray(r.tags) && r.tags.length >= 2, `${r.id} 标签应至少 2 个`);
        assert.ok(r.schedule.length >= 5, `${r.id} 详情时间轴应至少 5 步（实际 ${r.schedule.length}）`);
        assert.ok(Array.isArray(r.highlights) && r.highlights.length >= 1, `${r.id} 缺少沿途推荐`);
        assert.strictEqual(r.highlights[0].primary, true, `${r.id} 首个沿途推荐应为主推荐`);
        for (const h of r.highlights) {
            assert.ok(h.name && h.district && h.budget && h.blurb && h.tip, `${r.id} 沿途推荐字段不全`);
        }
        assert.ok(Array.isArray(r.preparation) && r.preparation.length >= 3, `${r.id} 路线准备应至少 3 条`);
        assert.ok(Array.isArray(r.budgetDetail) && r.budgetDetail.length >= 3, `${r.id} 预算明细应至少 3 行`);
        assert.ok(r.budgetDetail.some(b => b.item.includes('合计')), `${r.id} 预算明细应有合计行`);
        for (const b of r.budgetDetail) {
            assert.ok(b.item && b.amount && b.amount.includes('¥'), `${r.id} 预算明细字段不全`);
        }
        assert.ok(Array.isArray(r.tips) && r.tips.length >= 3, `${r.id} 攻略应至少 3 条`);
        for (const t of r.tips) {
            assert.ok(t.title && t.content, `${r.id} 攻略字段不全`);
        }
    }
});

test('routeForPersonality：按人格返回对应路线', () => {
    for (const pid of PIDS) {
        const r = routeForPersonality(pid);
        assert.ok(r, `人格 ${pid} 应有推荐路线`);
        assert.strictEqual(r.personalityId, pid);
    }
    assert.strictEqual(routeForPersonality('not-exist'), null);
});

test('优惠券与动态数据：页面素材齐全', () => {
    const { coupons, moments } = GlobalData.dumpling;
    assert.ok(coupons.length >= 3, '优惠券应至少 3 张');
    for (const c of coupons) {
        assert.ok(c.id && c.shop && c.title && c.value, `${c.id} 优惠券字段不全`);
        assert.ok(c.mode === 'code' || c.mode === 'qr', `${c.id} 应有使用模式（code/qr）`);
        assert.ok(c.code && c.code.length >= 6, `${c.id} 应有券码/核销码`);
    }
    assert.ok(moments.length >= 6, '动态应至少 6 条');
    for (const m of moments) {
        assert.ok(m.id && m.name && m.text && m.image && m.avatar, `${m.id} 动态字段不全`);
        assert.ok(m.text.includes('#我的饺子人格#'), `${m.id} 动态应带话题标签`);
    }
});

test('有奖分享规则数据：时间/参与方式/互动公式/奖项/公示齐全', () => {
    const rules = GlobalData.dumpling.shareRules;
    assert.ok(rules, '应有 shareRules 数据');
    assert.ok(rules.period && rules.period.includes('2026'), '应有活动时间');
    assert.ok(rules.howTo && rules.howTo.includes('#我的饺子人格#'), '参与方式应带话题');
    assert.ok(rules.scoring && rules.scoring.includes('互动值'), '应有互动值计算公式');
    assert.ok(Array.isArray(rules.awards) && rules.awards.length >= 3, '奖项应至少 3 档');
    for (const a of rules.awards) {
        assert.ok(a.name && a.desc && a.gift, `${a.name} 奖项字段不全`);
    }
    assert.ok(rules.announce && rules.announce.includes('公示'), '应有获奖公示说明');
    assert.ok(Array.isArray(rules.notes) && rules.notes.length >= 2, '注意事项应至少 2 条');
});

test('线下活动数据：a26 JKFUN 立冬偷吃小赛字段齐全', () => {
    const activity = GlobalData.activities.find(a => a.id === 'a26');
    assert.ok(activity, 'activities 应有 a26');
    assert.ok(activity.title.includes('立冬饺子偷吃小赛'), '标题应为主题活动');
    assert.ok(activity.date.includes('11月14日'), '时间应为11月14日');
    assert.ok(activity.location.includes('JKFUN'), '地点应为 JKFUN');
    assert.strictEqual(activity.price, 0, '活动应免费');
    assert.strictEqual(activity.status, 'RECRUITING', '应为报名中');
    assert.ok(activity.maxParticipants > activity.currentParticipants, '应有剩余名额');
    assert.ok(activity.description.length > 30, '活动介绍应完整');
});
