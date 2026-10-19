/**
 * 周末人格测试引擎（weekend-test.html 使用）
 * 依赖 window.GlobalData.weekendPersonalities / weekendTestQuestions
 * 纯逻辑模块：计分、同分随机取最高，DOM 渲染由页面负责
 */
(function () {
    function getData() {
        const g = (typeof window !== 'undefined' && window.GlobalData) || {};
        return {
            personalities: g.weekendPersonalities || [],
            questions: g.weekendTestQuestions || []
        };
    }

    // 根据每题所选选项下标计算各人格得分
    function score(answers) {
        const { questions } = getData();
        if (!Array.isArray(answers) || answers.length !== questions.length) {
            throw new Error('答案数量与题目数量不一致');
        }
        const scores = {};
        answers.forEach((optIndex, qIndex) => {
            const question = questions[qIndex];
            if (!question || !Array.isArray(question.options)) {
                throw new Error('题目数据缺失: 第 ' + (qIndex + 1) + ' 题');
            }
            const option = question.options[optIndex];
            if (!option) {
                throw new Error('选项下标非法: 第 ' + (qIndex + 1) + ' 题第 ' + optIndex + ' 项');
            }
            for (const [pid, pts] of Object.entries(option.scores || {})) {
                scores[pid] = (scores[pid] || 0) + pts;
            }
        });
        return scores;
    }

    // 从得分表中选出胜出人格 id：最高分，同分随机
    function pickWinner(scores, random) {
        const entries = Object.entries(scores);
        if (entries.length === 0) {
            throw new Error('得分表为空，无法计算人格结果');
        }
        const maxScore = Math.max(...entries.map(([, pts]) => pts));
        const candidates = entries.filter(([, pts]) => pts === maxScore).map(([pid]) => pid);
        const rnd = typeof random === 'function' ? random() : Math.random();
        const index = Math.min(candidates.length - 1, Math.floor(rnd * candidates.length));
        return candidates[index];
    }

    // 一步算出最终结果：{ id, scores }
    function calculate(answers, random) {
        const scores = score(answers);
        return { id: pickWinner(scores, random), scores };
    }

    window.WeekendTest = { score, pickWinner, calculate };
})();
