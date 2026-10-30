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
console.log('dumpling-quiz-data.js 已同步（人格 ' + data.personalities.length + ' 种 / 题目 ' + data.questions.length + ' 道）');
