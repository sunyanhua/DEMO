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

    // 测试结果页配套查询：按人格映射的推荐路线（返回路线对象数组）
    function routesForPersonality(personalityId) {
        const g = (typeof window !== 'undefined' && window.GlobalData) || {};
        const map = g.weekendPersonalityRoutes || {};
        const routes = g.weekendRoutes || [];
        return (map[personalityId] || [])
            .map(id => routes.find(r => r.id === id))
            .filter(Boolean);
    }

    // 平台最新活动：按 id 数字降序取前 count 条
    function latestActivities(count) {
        const g = (typeof window !== 'undefined' && window.GlobalData) || {};
        return [...(g.activities || [])]
            .sort((a, b) => (parseInt(b.id.replace(/\D/g, '')) || 0) - (parseInt(a.id.replace(/\D/g, '')) || 0))
            .slice(0, count || 3);
    }

    // 同款搭子：按人格过滤
    function fellowsForPersonality(personalityId) {
        const g = (typeof window !== 'undefined' && window.GlobalData) || {};
        return (g.weekendFellows || []).filter(f => f.personalityId === personalityId);
    }

    window.WeekendTest = { score, pickWinner, calculate, routesForPersonality, latestActivities, fellowsForPersonality };
})();
