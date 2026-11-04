/**
 * 测验数据同步脚本（node dumpling-quiz-sync.cjs / npm run quiz:sync）
 * 从 dumpling-quiz-data.json（唯一数据来源）生成 dumpling-quiz-data.js，
 * 供离线页面以 <script> 方式引入（fetch 在 file:// 下不可用）。
 * 修改题目/人格后必须运行本脚本同步，npm test 会校验一致性。
 */
const fs = require('node:fs');
const path = require('node:path');

const dir = __dirname;
const jsonPath = path.join(dir, 'dumpling-quiz-data.json');
const outPath = path.join(dir, 'dumpling-quiz-data.js');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 基本结构校验：人格结果与测试题必须为非空数组
if (!Array.isArray(data.personalities) || data.personalities.length === 0) {
    throw new Error('dumpling-quiz-data.json 缺少 personalities 数组（人格测试结果）');
}
if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('dumpling-quiz-data.json 缺少 questions 数组（人格测试题）');
}
const pidSet = new Set(data.personalities.map(p => p.id));
for (const q of data.questions) {
    if (!Array.isArray(q.options) || q.options.length === 0) {
        throw new Error('题目缺少选项: ' + (q.text || '(无文本)'));
    }
    for (const opt of q.options) {
        for (const pid of Object.keys(opt.scores || {})) {
            if (!pidSet.has(pid)) throw new Error('选项分值指向未知人格: ' + pid);
        }
    }
}

const header = [
    '// 本文件由 dumpling-quiz-sync.cjs 从 dumpling-quiz-data.json 自动生成，请勿手改。',
    '// 修改题目/人格请编辑 JSON 后运行: npm run quiz:sync',
    ''
].join('\n');

fs.writeFileSync(outPath, header + 'window.GlobalData.dumplingQuiz = ' + JSON.stringify(data, null, 4) + ';\n', 'utf8');

// 题库兜底同步：页面不再引用 dumpling-quiz-data.js（部署漏传会 404），
// 改为把同一题库内嵌进 dumpling-data.js（该文件被所有专题/详情页加载），
// 唯一数据来源仍是 dumpling-quiz-data.json。
const dataPath = path.join(dir, 'dumpling-data.js');
const dataSrc = fs.readFileSync(dataPath, 'utf8');
const beginTag = '/* QUIZ_INLINE_BEGIN */';
const endTag = '/* QUIZ_INLINE_END */';
const inlineBlock = [
    '// ==================== 题库内嵌（由 dumpling-quiz-sync.cjs 从 dumpling-quiz-data.json 生成，请勿手改） ====================',
    'window.GlobalData.dumplingQuiz = ' + JSON.stringify(data, null, 4) + ';',
    ''
].join('\n');
const beginIdx = dataSrc.indexOf(beginTag);
const endIdx = dataSrc.indexOf(endTag);
if (beginIdx === -1 || endIdx === -1 || endIdx < beginIdx) {
    throw new Error('dumpling-data.js 缺少题库内嵌标记 ' + beginTag + ' / ' + endTag + '，请先运行一次修复或手动补上标记');
}
const next = dataSrc.slice(0, beginIdx + beginTag.length) + '\n' + inlineBlock + dataSrc.slice(endIdx);
fs.writeFileSync(dataPath, next, 'utf8');

// 奇遇华熙数据文件内嵌（自包含兜底：部署漏传 dumpling-data.js / dumpling-quiz-data.js 时页面仍可用）
const qiyuPath = path.join(dir, 'qiyu-huaxi-data.js');
const qiyuSrc = fs.readFileSync(qiyuPath, 'utf8');
const qiyuBeginIdx = qiyuSrc.indexOf(beginTag);
const qiyuEndIdx = qiyuSrc.indexOf(endTag);
if (qiyuBeginIdx === -1 || qiyuEndIdx === -1 || qiyuEndIdx < qiyuBeginIdx) {
    throw new Error('qiyu-huaxi-data.js 缺少题库内嵌标记 ' + beginTag + ' / ' + endTag);
}
const qiyuInline = 'var QIYU_QUIZ = ' + JSON.stringify(data, null, 4) + ';';
const qiyuNext = qiyuSrc.slice(0, qiyuBeginIdx + beginTag.length) + '\n' + qiyuInline + '\n' + qiyuSrc.slice(qiyuEndIdx);
fs.writeFileSync(qiyuPath, qiyuNext, 'utf8');

console.log('题库已同步：dumpling-quiz-data.js + dumpling-data.js 内嵌 + qiyu-huaxi-data.js 内嵌（人格 ' + data.personalities.length + ' 种 / 题目 ' + data.questions.length + ' 道）');
