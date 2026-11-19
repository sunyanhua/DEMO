/**
 * 常聚曲水流觞游戏引擎（rng 注入；觞令卡牌堆内部洗牌、抽完重洗）
 */
window.Liushang = (function () {
    const CARDS = [
        // 真心话 truth
        { type: 'truth', text: '最近一次忍不住笑出声，是因为什么？' },
        { type: 'truth', text: '你最近做过最暖心的一件事是什么？' },
        { type: 'truth', text: '说出一个你最想感谢的人，为什么？' },
        { type: 'truth', text: '如果明天放假，你最想和谁一起做什么？' },
        { type: 'truth', text: '你最怀念和这群人在一起的哪个瞬间？' },
        // 大冒险 dare
        { type: 'dare', text: '给圈外的一个朋友发一句"想你了"，给大家看回复' },
        { type: 'dare', text: '模仿在场一个人的口头禅，让大家猜是谁' },
        { type: 'dare', text: '用家乡话说一句"常聚常伴，圈子不散"' },
        { type: 'dare', text: '做 10 个开合跳，边跳边说"为了下次聚会"' },
        // 表演 act
        { type: 'act', text: '表演一个你的拿手绝活（30 秒）' },
        { type: 'act', text: '用动作演一部经典电影，让全场猜' },
        { type: 'act', text: '来一段 15 秒即兴脱口秀，夸夸在场的每个人' },
        { type: 'act', text: '模仿一位名人的声音说"我们下周还聚"' },
        // 吟诗 poem
        { type: 'poem', text: '背一句带"酒"的诗' },
        { type: 'poem', text: '背一句带"月"的诗' },
        { type: 'poem', text: '背一句关于朋友的诗' },
        { type: 'poem', text: '自创一句七言诗，送给这个圈子' }
    ];

    let deck = [];

    function shuffle(rng) {
        deck = CARDS.slice();
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.min(i, Math.floor(rng() * (i + 1)));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    // 漂流时长（毫秒）：均匀分布 [min, max]
    function driftDuration({ rng, min = 8000, max = 20000 }) {
        return min + Math.floor(rng() * (max - min + 1));
    }

    // 停杯目标：索引 [0, memberCount)
    function stopIndex({ memberCount, rng }) {
        if (!memberCount || memberCount <= 0) return 0;
        return Math.min(memberCount - 1, Math.floor(rng() * memberCount));
    }

    // 抽觞令卡：牌堆抽完自动重洗
    function drawCard({ rng }) {
        if (deck.length === 0) shuffle(rng);
        return deck.pop();
    }

    return { driftDuration, stopIndex, drawCard };
})();
