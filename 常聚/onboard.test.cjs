/**
 * 常聚手机号授权 + 注册页测试（node onboard.test.cjs）
 * 两条路线共用：授权弹层（auth.html）→ 注册资料（register.html）→ 跳回目标页
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;

function makeStorage(seed) {
    const m = {};
    if (seed) Object.keys(seed).forEach(k => { m[k] = seed[k]; });
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

function makeSandbox(page, storageSeed) {
    const document = makeDocument();
    const sandbox = {
        window: { location: { href: '' } },
        document,
        localStorage: makeStorage(),
        sessionStorage: makeStorage(storageSeed),
        navigator: {},
        URLSearchParams,
        setTimeout, clearTimeout
    };
    sandbox.window.document = document;
    sandbox.window.localStorage = sandbox.localStorage;
    sandbox.window.sessionStorage = sandbox.sessionStorage;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(path.join(dir, 'common.js'), 'utf8'), sandbox);
    vm.runInContext(inlineScriptOf(page), sandbox);
    return sandbox;
}

test('auth_renders_phone_sheet', () => {
    const s = makeSandbox('auth.html');
    assert.ok(s.document._html.includes('申请获取你的手机号'), '授权弹层标题');
    assert.ok(s.document._html.includes('允许'), '有允许按钮');
    assert.ok(s.document._html.includes('不同意'), '有拒绝入口');
    assert.ok(s.document._html.includes('138 **** 8000'), '手机号脱敏展示');
    assert.ok(s.document._html.includes('隐私协议'), '含隐私协议（他俩能成同款）');
    assert.ok(s.document._html.includes('cj-popup'), '居中弹窗样式');
});

test('auth_allow_sets_authed_and_redirects_to_register', () => {
    const s = makeSandbox('auth.html');
    s.window.AuthView._next = 'vote.html?proposal=p1';
    s.window.AuthView.allow();
    assert.equal(s.sessionStorage.getItem('cj_authed'), '1', '授权状态已记录');
    assert.equal(s.window.location.href, 'register.html?next=vote.html%3Fproposal%3Dp1', '跳注册页并带目标');
});

test('auth_deny_no_authed', () => {
    const s = makeSandbox('auth.html');
    s.window.AuthView.deny();
    assert.equal(s.sessionStorage.getItem('cj_authed'), null, '拒绝不记录授权');
});

test('auth_preauthed_skips', () => {
    const s = makeSandbox('auth.html', { cj_authed: '1' });
    s.window.AuthView._next = 'index.html?new=1';
    s.window.AuthView.skipIfAuthed();
    assert.equal(s.window.location.href, 'index.html?new=1', '已授权直接跳目标页');
});

test('register_submit_persists_user_and_redirects', () => {
    const s = makeSandbox('register.html');
    s.window.RegisterView._next = 'index.html?new=1';
    s.window.RegisterView._gender = 'male';
    s.window.RegisterView.submit({ name: '新朋友', avatar: 'images/avatar-5.png' });
    const saved = JSON.parse(s.localStorage.getItem('cj.user'));
    assert.equal(saved.name, '新朋友');
    assert.equal(saved.avatar, 'images/avatar-5.png');
    assert.equal(saved.gender, 'male', '性别随注册保存');
    assert.equal(saved.phone, '13800138000', '手机号与授权一致');
    assert.equal(s.window.location.href, 'profile.html?next=index.html%3Fnew%3D1', '注册完成后进入资料完善页');
});

test('profile_renders_sections', () => {
    const s = makeSandbox('profile.html');
    for (const label of ['出生日期', '个人爱好', 'MBTI', '空闲时间', '工作地点', '住处']) {
        assert.ok(s.document._html.includes(label), '资料完善含：' + label);
    }
    assert.ok(s.document._html.includes('定位'), '地点为定位式选择');
    assert.ok(s.document._html.includes('商圈'), '地点为商圈级，不需要具体地址');
    assert.ok(s.document._html.includes('跳过'), '可跳过以后完善');
});

test('profile_submit_persists_and_redirects', () => {
    const s = makeSandbox('profile.html');
    s.window.ProfileView._next = 'propose.html?new=1';
    s.window.ProfileView._birth = '1998-08-08';
    s.window.ProfileView._hobbies = ['麻将', '羽毛球'];
    s.window.ProfileView._mbti = 'ENTP';
    s.window.ProfileView._freeTime = ['周末'];
    s.window.ProfileView._workArea = '中关村';
    s.window.ProfileView._homeArea = '望京';
    s.window.ProfileView.submit();
    const saved = JSON.parse(s.localStorage.getItem('cj.user'));
    assert.equal(saved.birthDate, '1998-08-08');
    assert.equal(saved.mbti, 'ENTP');
    assert.deepEqual(saved.hobbies, ['麻将', '羽毛球']);
    assert.deepEqual(saved.freeTime, ['周末']);
    assert.equal(saved.workArea, '中关村');
    assert.equal(saved.homeArea, '望京');
    assert.equal(s.window.location.href, 'propose.html?new=1', '完成后跳最终目标');
});

test('profile_skip_goes_next', () => {
    const s = makeSandbox('profile.html');
    s.window.ProfileView._next = 'vote.html?proposal=p1';
    s.window.ProfileView.skip();
    assert.equal(s.window.location.href, 'vote.html?proposal=p1', '跳过直接去目标');
    assert.equal(s.localStorage.getItem('cj.user'), null, '跳过后资料未落库');
});

test('register_renders_avatar_pool_and_phone', () => {
    const s = makeSandbox('register.html');
    assert.ok(s.document._html.includes('注册常聚'), '注册页标题');
    assert.ok((s.document._html.match(/avatar-\d+\.png/g) || []).length >= 12, '头像池至少 12 个');
    assert.ok(s.document._html.includes('138 **** 8000'), '手机号回显');
    assert.ok(s.document._html.includes('手机号'), '手机号字段');
    assert.ok(s.document._html.includes('男') && s.document._html.includes('女'), '性别单选存在');
    assert.ok(s.document._html.includes('disabled'), '手机号不可修改（与授权一致）');
    assert.ok(s.document._html.includes('不可修改'), 'amber 提示条');
    assert.ok(s.document._html.includes('cj-steps'), '步骤条（注册→资料完善）');
    assert.ok(s.document._html.includes('cj-wiz-card'), '白卡表单样式（他俩能成同款）');
});
