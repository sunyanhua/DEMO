/**
 * 常聚 · Gatherly 全局 mock 数据
 * 时间格式统一为 'YYYY-MM-DD HH:mm'（引擎内部用 new Date 解析）
 */
window.GlobalData = {
    city: '北京',

    user: {
        id: 'u1',
        name: '阿Sun',
        avatarUrl: 'images/avatar-1.png',
        phone: '13800138000',
        gender: 'male',
        birthDate: '1995-06-15',
        mbti: 'ENFP',
        freeTime: ['周末及节假日', '工作日晚上'],
        workArea: '国贸',
        homeArea: '朝阳',
        tags: ['麻将', '羽毛球', '探店'],
        position: { district: '朝阳' },
        work: { type: '白班', district: '国贸' },
        spendTier: 'mid'
    },

    circles: [
        {
            id: 'c1',
            name: '周五麻将局',
            type: 'boardgame',
            city: '北京',
            createdAt: '2026-09-01',
            ownerId: 'u1',
            members: [
                { id: 'u1', name: '阿Sun', avatarUrl: 'images/avatar-1.png', joinOrder: 1, tags: ['麻将', '羽毛球', '探店'], position: { district: '朝阳' }, work: { type: '白班', district: '国贸' }, spendTier: 'mid' },
                { id: 'm1', name: '老王', avatarUrl: 'images/avatar-2.png', joinOrder: 2, tags: ['麻将', '钓鱼'], position: { district: '朝阳' }, work: { type: '白班', district: '望京' }, spendTier: 'mid' },
                { id: 'm2', name: '小李', avatarUrl: 'images/avatar-3.png', joinOrder: 3, tags: ['麻将', '游戏'], position: { district: '海淀' }, work: { type: '晚班', district: '中关村' }, spendTier: 'economy' },
                { id: 'm3', name: '大周', avatarUrl: 'images/avatar-4.png', joinOrder: 4, tags: ['麻将', '红酒'], position: { district: '朝阳' }, work: { type: '自由', district: '三里屯' }, spendTier: 'premium' },
                { id: 'm4', name: '阿婷', avatarUrl: 'images/avatar-5.png', joinOrder: 5, tags: ['麻将', '烘焙'], position: { district: '西城' }, work: { type: '白班', district: '西单' }, spendTier: 'mid' }
            ],
            hostId: 'm1',
            rhythm: { unit: 'week', n: 2 },
            lastGatheringId: 'g1',
            proposalId: 'p1'
        },
        {
            id: 'c2',
            name: '老同学',
            type: 'dinner',
            city: '北京',
            createdAt: '2026-09-15',
            ownerId: 'u1',
            members: [
                { id: 'u1', name: '阿Sun', avatarUrl: 'images/avatar-1.png', joinOrder: 1, tags: ['麻将', '羽毛球', '探店'], position: { district: '朝阳' }, work: { type: '白班', district: '国贸' }, spendTier: 'mid' },
                { id: 'm5', name: '老赵', avatarUrl: 'images/avatar-6.png', joinOrder: 2, tags: ['烤鸭', '相声'], position: { district: '朝阳' }, work: { type: '白班', district: '国贸' }, spendTier: 'premium' },
                { id: 'm6', name: '陈陈', avatarUrl: 'images/avatar-7.png', joinOrder: 3, tags: ['摄影', '展览'], position: { district: '东城' }, work: { type: '自由', district: '东城' }, spendTier: 'mid' },
                { id: 'm7', name: '二狗', avatarUrl: 'images/avatar-8.png', joinOrder: 4, tags: ['游戏', '篮球'], position: { district: '朝阳' }, work: { type: '晚班', district: '望京' }, spendTier: 'economy' }
            ],
            hostId: 'm5',
            rhythm: { unit: 'month', n: 1 },
            lastGatheringId: 'g2',
            proposalId: null
        },
        {
            id: 'c4',
            name: '同事搭子',
            type: 'colleague',
            city: '北京',
            createdAt: '2026-11-10',
            ownerId: 'u1',
            members: [
                { id: 'u1', name: '阿Sun', avatarUrl: 'images/avatar-1.png', joinOrder: 1, tags: ['麻将', '羽毛球', '探店'], position: { district: '朝阳' }, work: { type: '白班', district: '国贸' }, spendTier: 'mid' },
                { id: 'm1', name: '老王', avatarUrl: 'images/avatar-2.png', joinOrder: 2, tags: ['麻将', '钓鱼'], position: { district: '朝阳' }, work: { type: '白班', district: '望京' }, spendTier: 'mid' },
                { id: 'm2', name: '小李', avatarUrl: 'images/avatar-3.png', joinOrder: 3, tags: ['麻将', '游戏'], position: { district: '海淀' }, work: { type: '晚班', district: '中关村' }, spendTier: 'economy' }
            ],
            hostId: 'u1',
            rhythm: null,
            lastGatheringId: null,
            proposalId: null
        },
        {
            id: 'c3',
            name: '周末球局',
            type: 'sport',
            city: '北京',
            createdAt: '2026-08-20',
            ownerId: 'u1',
            members: [
                { id: 'u1', name: '阿Sun', avatarUrl: 'images/avatar-1.png', joinOrder: 1, tags: ['麻将', '羽毛球', '探店'], position: { district: '朝阳' }, work: { type: '白班', district: '国贸' }, spendTier: 'mid' },
                { id: 'm1', name: '老王', avatarUrl: 'images/avatar-2.png', joinOrder: 2, tags: ['麻将', '钓鱼'], position: { district: '朝阳' }, work: { type: '白班', district: '望京' }, spendTier: 'mid' },
                { id: 'm2', name: '小李', avatarUrl: 'images/avatar-3.png', joinOrder: 3, tags: ['麻将', '游戏'], position: { district: '海淀' }, work: { type: '晚班', district: '中关村' }, spendTier: 'economy' },
                { id: 'm8', name: '飞哥', avatarUrl: 'images/avatar-9.png', joinOrder: 4, tags: ['羽毛球', '跑步'], position: { district: '朝阳' }, work: { type: '白班', district: '亚运村' }, spendTier: 'mid' },
                { id: 'm9', name: '小美', avatarUrl: 'images/avatar-10.png', joinOrder: 5, tags: ['羽毛球', '瑜伽'], position: { district: '海淀' }, work: { type: '自由', district: '海淀' }, spendTier: 'mid' }
            ],
            hostId: 'u1',
            rhythm: { unit: 'week', n: 2 },
            lastGatheringId: 'g3',
            proposalId: null
        }
    ],

    venues: [
        { id: 'v1', name: '雀神会所', city: '北京', district: '朝阳', businessArea: '三里屯', category: 'fun', spendTier: 'premium', rating: 4.8, tags: ['包间', '夜宵', '停车方便'], cover: 'images/cover-1.png', isPartner: true, coupon: { title: '新客首单免茶水费' } },
        { id: 'v2', name: '中关村棋牌汇', city: '北京', district: '海淀', businessArea: '中关村', category: 'fun', spendTier: 'economy', rating: 4.2, tags: ['平价', '自助茶水'], cover: 'images/cover-2.png', isPartner: false, coupon: null },
        { id: 'v3', name: '老北京棋牌室', city: '北京', district: '东城', businessArea: '南锣鼓巷', category: 'fun', spendTier: 'mid', rating: 4.5, tags: ['胡同院子', '老北京味'], cover: 'images/cover-3.png', isPartner: false, coupon: null },
        { id: 'v4', name: '望京小腰烧烤', city: '北京', district: '朝阳', businessArea: '望京', category: 'dinner', spendTier: 'mid', rating: 4.6, tags: ['烧烤', '啤酒', '深夜营业'], cover: 'images/cover-4.png', isPartner: false, coupon: null },
        { id: 'v5', name: '国贸金鼎轩', city: '北京', district: '朝阳', businessArea: '国贸', category: 'dinner', spendTier: 'premium', rating: 4.4, tags: ['粤菜', '商务', '包间'], cover: 'images/cover-5.png', isPartner: false, coupon: null },
        { id: 'v6', name: '西单烤鸭坊', city: '北京', district: '西城', businessArea: '西单', category: 'dinner', spendTier: 'mid', rating: 4.7, tags: ['烤鸭', '京味', '家庭聚餐'], cover: 'images/cover-6.png', isPartner: true, coupon: { title: '8 人以上赠果盘' } },
        { id: 'v7', name: '簋街胡大饭馆', city: '北京', district: '东城', businessArea: '簋街', category: 'dinner', spendTier: 'mid', rating: 4.5, tags: ['小龙虾', '夜宵', '排队王'], cover: 'images/cover-7.png', isPartner: false, coupon: null },
        { id: 'v8', name: '五道口家常菜', city: '北京', district: '海淀', businessArea: '五道口', category: 'dinner', spendTier: 'economy', rating: 4.3, tags: ['家常菜', '学生友好', '量大'], cover: 'images/cover-8.png', isPartner: false, coupon: null },
        { id: 'v9', name: '奥体羽毛球馆', city: '北京', district: '朝阳', businessArea: '亚运村', category: 'ball', spendTier: 'economy', rating: 4.4, tags: ['羽毛球', '塑胶场地', '地铁直达'], cover: 'images/cover-9.png', isPartner: false, coupon: null },
        { id: 'v10', name: '朝阳公园网球场', city: '北京', district: '朝阳', businessArea: '团结湖', category: 'ball', spendTier: 'mid', rating: 4.6, tags: ['网球', '户外', '环境好'], cover: 'images/cover-10.png', isPartner: false, coupon: null },
        { id: 'v11', name: '海淀体育馆羽毛球', city: '北京', district: '海淀', businessArea: '苏州街', category: 'ball', spendTier: 'mid', rating: 4.3, tags: ['羽毛球', '高手多'], cover: 'images/cover-11.png', isPartner: false, coupon: null },
        { id: 'v12', name: '香山公园', city: '北京', district: '海淀', businessArea: '香山', category: 'outdoor', spendTier: 'economy', rating: 4.8, tags: ['爬山', '红叶', '秋季'], cover: 'images/cover-12.png', isPartner: false, coupon: null },
        { id: 'v13', name: '温榆河公园', city: '北京', district: '朝阳', businessArea: '孙河', category: 'outdoor', spendTier: 'economy', rating: 4.5, tags: ['野餐', '骑行', '遛娃'], cover: 'images/cover-13.png', isPartner: false, coupon: null },
        { id: 'v14', name: '天天棋牌社', city: '北京', district: '西城', businessArea: '德胜门', category: 'fun', spendTier: 'economy', rating: 4.4, tags: ['平价', '街坊老店'], cover: 'images/cover-14.png', isPartner: false, coupon: null },
        { id: 'v15', name: '五棵松篮球公园', city: '北京', district: '海淀', businessArea: '五棵松', category: 'ball', spendTier: 'economy', rating: 4.5, tags: ['篮球', '室外场'], cover: 'images/cover-15.png', isPartner: false, coupon: null },
        { id: 'v16', name: '朝阳体育馆羽毛球', city: '北京', district: '朝阳', businessArea: '六里屯', category: 'ball', spendTier: 'mid', rating: 4.4, tags: ['羽毛球', '室内场'], cover: 'images/cover-16.png', isPartner: false, coupon: null },
        { id: 'v17', name: '奥林匹克森林公园', city: '北京', district: '朝阳', businessArea: '奥森', category: 'outdoor', spendTier: 'economy', rating: 4.7, tags: ['跑步', '野餐', '遛娃'], cover: 'images/cover-17.png', isPartner: false, coupon: null }
    ],

    projects: [
        { id: 'p1', name: '火锅局', category: 'dinner', season: ['winter'], tags: ['火锅', '热闹'] },
        { id: 'p2', name: '烧烤局', category: 'dinner', season: ['summer'], tags: ['烧烤', '啤酒'] },
        { id: 'p3', name: '烤鸭宴', category: 'dinner', season: [], tags: ['烤鸭', '京味'] },
        { id: 'p4', name: '家常菜小聚', category: 'dinner', season: [], tags: ['家常菜', '轻松'] },
        { id: 'p18', name: '日料局', category: 'dinner', season: [], tags: ['日料', '寿司'] },
        { id: 'p19', name: '韩式烤肉', category: 'dinner', season: [], tags: ['烤肉', '韩餐'] },
        { id: 'p20', name: '西餐牛排', category: 'dinner', season: [], tags: ['西餐', '牛排'] },
        { id: 'p21', name: '海鲜大餐', category: 'dinner', season: [], tags: ['海鲜', '大餐'] },
        { id: 'p22', name: '早茶局', category: 'dinner', season: [], tags: ['早茶', '点心'] },
        { id: 'p23', name: '早午餐 Brunch', category: 'dinner', season: [], tags: ['brunch', '周末'] },
        { id: 'p24', name: '涮羊肉', category: 'dinner', season: ['winter'], tags: ['涮肉', '铜锅'] },
        { id: 'p25', name: '川湘菜局', category: 'dinner', season: [], tags: ['川菜', '辣'] },
        { id: 'p26', name: '素食局', category: 'dinner', season: [], tags: ['素食', '健康'] },
        { id: 'p27', name: '夜宵局', category: 'dinner', season: [], tags: ['夜宵', '深夜'] },
        { id: 'p28', name: '小龙虾局', category: 'dinner', season: ['summer'], tags: ['小龙虾', '啤酒'] },
        { id: 'p29', name: '私房菜', category: 'dinner', season: [], tags: ['私房菜', '精致'] },
        { id: 'p5', name: '羽毛球', category: 'ball', season: [], tags: ['运动', '羽毛球'] },
        { id: 'p6', name: '网球', category: 'ball', season: ['spring', 'autumn'], tags: ['运动', '网球'] },
        { id: 'p7', name: '篮球半场', category: 'ball', season: [], tags: ['运动', '篮球'] },
        { id: 'p30', name: '足球', category: 'ball', season: [], tags: ['运动', '足球'] },
        { id: 'p31', name: '乒乓球', category: 'ball', season: [], tags: ['运动', '乒乓'] },
        { id: 'p32', name: '台球', category: 'ball', season: [], tags: ['运动', '台球'] },
        { id: 'p33', name: '保龄球', category: 'ball', season: [], tags: ['运动', '保龄'] },
        { id: 'p34', name: '游泳', category: 'ball', season: ['summer'], tags: ['运动', '游泳'] },
        { id: 'p35', name: '跑步', category: 'ball', season: [], tags: ['运动', '跑步'] },
        { id: 'p36', name: '飞盘', category: 'ball', season: ['spring', 'autumn'], tags: ['运动', '飞盘'] },
        { id: 'p37', name: '滑雪', category: 'ball', season: ['winter'], tags: ['运动', '滑雪'] },
        { id: 'p38', name: '攀岩', category: 'ball', season: [], tags: ['运动', '攀岩'] },
        { id: 'p10', name: '爬山·香山红叶', category: 'outdoor', season: ['autumn'], tags: ['爬山', '红叶', '秋游'] },
        { id: 'p11', name: '公园徒步野餐', category: 'outdoor', season: ['spring', 'autumn'], tags: ['野餐', '徒步', '遛娃'] },
        { id: 'p39', name: '露营', category: 'outdoor', season: ['summer', 'autumn'], tags: ['露营', '帐篷'] },
        { id: 'p40', name: '钓鱼', category: 'outdoor', season: ['spring', 'summer'], tags: ['钓鱼', '安静'] },
        { id: 'p41', name: '城市漫步 Citywalk', category: 'outdoor', season: [], tags: ['散步', '城市'] },
        { id: 'p42', name: '逛公园', category: 'outdoor', season: [], tags: ['公园', '轻松'] },
        { id: 'p43', name: '赏花', category: 'outdoor', season: ['spring'], tags: ['赏花', '拍照'] },
        { id: 'p44', name: '观鸟', category: 'outdoor', season: [], tags: ['观鸟', '自然'] },
        { id: 'p8', name: '血战到底麻将', category: 'fun', season: [], tags: ['棋牌', '麻将'] },
        { id: 'p9', name: '推倒胡麻将', category: 'fun', season: [], tags: ['棋牌', '麻将'] },
        { id: 'p14', name: 'KTV 欢唱夜', category: 'fun', season: [], tags: ['唱歌', '欢唱'] },
        { id: 'p15', name: '桌游之夜', category: 'fun', season: [], tags: ['桌游', '聚会'] },
        { id: 'p16', name: '德州扑克', category: 'fun', season: [], tags: ['扑克', '竞技'] },
        { id: 'p17', name: '三国杀', category: 'fun', season: [], tags: ['桌游', '角色扮演'] },
        { id: 'p45', name: '剧本杀', category: 'fun', season: [], tags: ['剧本杀', '推理'] },
        { id: 'p46', name: '密室逃脱', category: 'fun', season: [], tags: ['密室', '解谜'] },
        { id: 'p47', name: '狼人杀', category: 'fun', season: [], tags: ['桌游', '推理'] },
        { id: 'p48', name: '电竞开黑', category: 'fun', season: [], tags: ['电竞', '游戏'] },
        { id: 'p49', name: 'Switch 游戏局', category: 'fun', season: [], tags: ['游戏', '聚会'] },
        { id: 'p50', name: '脱口秀', category: 'fun', season: [], tags: ['脱口秀', '搞笑'] },
        { id: 'p51', name: 'Livehouse', category: 'fun', season: [], tags: ['现场', '音乐'] },
        { id: 'p52', name: '抓娃娃', category: 'fun', season: [], tags: ['电玩', '轻松'] },
        { id: 'p53', name: '电玩城', category: 'fun', season: [], tags: ['电玩', '街机'] },
        { id: 'p54', name: '卡牌对战', category: 'fun', season: [], tags: ['卡牌', '对战'] },
        { id: 'p12', name: '美术馆看展', category: 'exhibit', season: [], tags: ['展览', '文艺'] },
        { id: 'p13', name: '博物馆漫游', category: 'exhibit', season: [], tags: ['展览', '历史'] },
        { id: 'p55', name: '电影', category: 'exhibit', season: [], tags: ['电影', '约会'] },
        { id: 'p56', name: '读书会', category: 'exhibit', season: [], tags: ['读书', '安静'] },
        { id: 'p57', name: '话剧', category: 'exhibit', season: [], tags: ['话剧', '文艺'] },
        { id: 'p58', name: '摄影展', category: 'exhibit', season: [], tags: ['展览', '摄影'] }
    ],

    proposals: [
        {
            id: 'p1',
            circleId: 'c1',
            proposerId: 'u1',
            projectId: 'p8',
            venueIds: ['v1', 'v2', 'v3'],
            timeCandidates: ['2026-11-21 14:00', '2026-11-22 14:00', '2026-11-22 19:00'],
            votes: { time: {}, venue: {} },
            status: 'organizing',
            deadline: '2026-11-19 12:00'
        }
    ],

    gatherings: [
        {
            id: 'g1', circleId: 'c1', title: '老王手气爆棚之夜', summary: '老王连庄五把，这顿饭请得应该',
            projectId: 'p8', venueId: 'v1', time: '2026-11-08 19:00',
            attendees: ['u1', 'm1', 'm2', 'm3'],
            photos: ['images/moment-1.jpg', 'images/moment-2.jpg'], done: true,
            buyMode: 'host', payerId: 'm1', billId: 'b1'
        },
        {
            id: 'g2', circleId: 'c2', title: '毕业十年，一个没少', summary: '十年之约，下次还聚',
            projectId: 'p3', venueId: 'v6', time: '2026-11-15 18:30',
            attendees: ['u1', 'm5', 'm6', 'm7'],
            photos: ['images/moment-3.jpg', 'images/moment-4.jpg'], done: true,
            buyMode: 'aa', payerId: null, billId: 'b2'
        },
        {
            id: 'g3', circleId: 'c3', title: '秋日羽毛球混双', summary: '',
            projectId: 'p5', venueId: 'v9', time: '2026-09-20 10:00',
            attendees: ['u1', 'm1', 'm2', 'm8', 'm9'],
            photos: ['images/moment-5.jpg'], done: true,
            buyMode: 'aa', payerId: null, billId: null
        },
        {
            id: 'g4', circleId: 'c1', title: '第一次麻将局', summary: '三缺一开局，从此入坑',
            projectId: 'p8', venueId: 'v2', time: '2026-10-11 19:00',
            attendees: ['u1', 'm1', 'm2', 'm3', 'm4'],
            photos: ['images/moment-6.jpg'], done: true,
            buyMode: 'random', payerId: 'm4', billId: null
        },
        {
            id: 'g5', circleId: 'c1', title: '老王的生日局', summary: '蛋糕藏到最后一刻',
            projectId: 'p8', venueId: 'v3', time: '2026-09-06 18:30',
            attendees: ['u1', 'm1', 'm2', 'm3', 'm4'],
            photos: ['images/moment-7.jpg'], done: true,
            buyMode: 'host', payerId: 'm1', billId: null
        },
        {
            id: 'g6', circleId: 'c2', title: '五一同学会', summary: '十年不见，还是老样子',
            projectId: 'p1', venueId: 'v5', time: '2026-05-02 12:00',
            attendees: ['u1', 'm5', 'm6', 'm7'],
            photos: ['images/moment-8.jpg'], done: true,
            buyMode: 'aa', payerId: null, billId: null
        },
        {
            id: 'g7', circleId: 'c3', title: '春季羽毛球局', summary: '开春第一拍',
            projectId: 'p5', venueId: 'v11', time: '2026-08-15 10:00',
            attendees: ['u1', 'm1', 'm2', 'm8', 'm9'],
            photos: ['images/moment-5.jpg'], done: true,
            buyMode: 'aa', payerId: null, billId: null
        },
        {
            id: 'g8', circleId: 'c1', title: '跨年麻将夜', summary: '从去年打到今年',
            projectId: 'p9', venueId: 'v1', time: '2026-01-01 20:00',
            attendees: ['u1', 'm1', 'm3', 'm4'],
            photos: ['images/moment-4.jpg'], done: true,
            buyMode: 'random', payerId: 'm3', billId: null
        }
    ],

    bills: [
        {
            id: 'b1', gatheringId: 'g1',
            entries: [
                { id: 'e1', title: '包厢茶水费', amount: 188, payerId: 'm1', participants: ['u1', 'm1', 'm2', 'm3'] },
                { id: 'e2', title: '夜宵烧烤', amount: 240, payerId: 'u1', participants: ['u1', 'm1', 'm2', 'm3'] }
            ],
            settled: { u1: true, m1: true, m2: true, m3: true }
        },
        {
            id: 'b2', gatheringId: 'g2',
            entries: [
                { id: 'e3', title: '烤鸭宴餐费', amount: 680, payerId: 'm5', participants: ['u1', 'm5', 'm6', 'm7'] },
                { id: 'e4', title: '果盘加餐', amount: 120, payerId: 'm6', participants: ['u1', 'm5', 'm6', 'm7'] }
            ],
            settled: { m5: true }
        }
    ],

    notifications: [
        { id: 'n1', circleId: 'c3', type: 'rhythm', text: '周末球局已经 58 天没聚啦，该张罗啦！', read: false },
        { id: 'n2', circleId: 'c1', type: 'respond', text: '周五麻将局的新提案等你表态', read: false },
        { id: 'n3', circleId: 'c2', type: 'miss', text: '老赵想大家了：下周抽空聚聚？', read: false }
    ]
};
