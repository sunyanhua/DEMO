/**
 * 常聚轮值引擎测试（node rotation.test.cjs）
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadRotation() {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(__dirname, 'rotation.js'), 'utf8'), sandbox);
    return sandbox.window.Rotation;
}
const R = loadRotation();

const members = [
    { id: 'u1', joinOrder: 1 },
    { id: 'm1', joinOrder: 2 },
    { id: 'm2', joinOrder: 3 }
];

test('initial_host_is_owner', () => {
    assert.equal(R.initialHost({ ownerId: 'u1' }), 'u1');
});

test('draw_includes_non_attendees_and_respects_rng', () => {
    // memberIds 可以是全体圈友（含未出席者），抽签范围不因出席状态变化
    const ids = ['u1', 'm1', 'm2', 'm3'];
    assert.equal(R.drawNextHost({ memberIds: ids, rng: () => 0 }), 'u1');
    assert.equal(R.drawNextHost({ memberIds: ids, rng: () => 0.5 }), 'm2');
    assert.equal(R.drawNextHost({ memberIds: ids, rng: () => 0.99 }), 'm3');
});

test('pass_wraps_to_first_joinOrder', () => {
    assert.equal(R.passHost({ members, currentHostId: 'm2' }), 'u1', '末尾回卷到 joinOrder 最小');
    assert.equal(R.passHost({ members, currentHostId: 'u1' }), 'm1', '顺延到 joinOrder 下一位');
});

test('rhythm_due_at_exact_boundary', () => {
    const circle = { rhythm: { unit: 'week', n: 2 } };
    const r14 = R.checkRhythm({ circle, lastGatheringTime: '2026-11-03 19:00', now: '2026-11-17 12:00' });
    assert.equal(r14.daysSince, 14);
    assert.equal(r14.due, true, '边界天数等于节律也触发');
    const r13 = R.checkRhythm({ circle, lastGatheringTime: '2026-11-04 19:00', now: '2026-11-17 12:00' });
    assert.equal(r13.daysSince, 13);
    assert.equal(r13.due, false);
});

test('rhythm_no_config_or_no_last', () => {
    const noRhythm = R.checkRhythm({ circle: { rhythm: null }, lastGatheringTime: '2026-11-03 19:00', now: '2026-11-17 12:00' });
    assert.equal(noRhythm.due, false);
    const noLast = R.checkRhythm({ circle: { rhythm: { unit: 'week', n: 2 } }, lastGatheringTime: null, now: '2026-11-17 12:00' });
    assert.equal(noLast.due, false);
});

test('reminder_has_photo_reference', () => {
    const circle = { name: '周末球局', rhythm: { unit: 'week', n: 2 } };
    const gathering = { time: '2026-09-20 10:00', photos: ['images/moment-5.jpg'] };
    const withPhoto = R.buildReminderText({ circle, gathering, now: '2026-11-17 12:00' });
    assert.ok(withPhoto.includes('58'), '文案含天数');
    assert.ok(withPhoto.includes('moment-5.jpg'), '文案含上次合影照片引用');
    assert.ok(withPhoto.includes('周末球局'), '文案含圈名');
    const without = R.buildReminderText({ circle, gathering: null, now: '2026-11-17 12:00' });
    assert.ok(!without.includes('.jpg'), '无上次聚会不含照片句');
    assert.ok(without.includes('没聚'), '仍含思念文案');
});
