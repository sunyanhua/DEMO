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
        tags: ['麻将', '羽毛球', '探店'],
        position: { district: '朝阳' },
        work: { type: '白班', district: '国贸' },
        spendTier: 'mid'
    },

    circles: [
        {
            id: 'c1',
            name: '周五麻将局',
            type: 'mahjong',
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
            id: 'c3',
            name: '周末球局',
            type: 'ball',
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
        { id: 'v1', name: '雀神会所', city: '北京', district: '朝阳', businessArea: '三里屯', category: 'mahjong', spendTier: 'premium', rating: 4.8, tags: ['包间', '夜宵', '停车方便'], cover: 'images/cover-1.png', isPartner: true, coupon: { title: '新客首单免茶水费' } },
        { id: 'v2', name: '中关村棋牌汇', city: '北京', district: '海淀', businessArea: '中关村', category: 'mahjong', spendTier: 'economy', rating: 4.2, tags: ['平价', '自助茶水'], cover: 'images/cover-2.png', isPartner: false, coupon: null },
        { id: 'v3', name: '老北京棋牌室', city: '北京', district: '东城', businessArea: '南锣鼓巷', category: 'mahjong', spendTier: 'mid', rating: 4.5, tags: ['胡同院子', '老北京味'], cover: 'images/cover-3.png', isPartner: false, coupon: null },
        { id: 'v4', name: '望京小腰烧烤', city: '北京', district: '朝阳', businessArea: '望京', category: 'dinner', spendTier: 'mid', rating: 4.6, tags: ['烧烤', '啤酒', '深夜营业'], cover: 'images/cover-4.png', isPartner: false, coupon: null },
        { id: 'v5', name: '国贸金鼎轩', city: '北京', district: '朝阳', businessArea: '国贸', category: 'dinner', spendTier: 'premium', rating: 4.4, tags: ['粤菜', '商务', '包间'], cover: 'images/cover-5.png', isPartner: false, coupon: null },
        { id: 'v6', name: '西单烤鸭坊', city: '北京', district: '西城', businessArea: '西单', category: 'dinner', spendTier: 'mid', rating: 4.7, tags: ['烤鸭', '京味', '家庭聚餐'], cover: 'images/cover-6.png', isPartner: true, coupon: { title: '8 人以上赠果盘' } },
        { id: 'v7', name: '簋街胡大饭馆', city: '北京', district: '东城', businessArea: '簋街', category: 'dinner', spendTier: 'mid', rating: 4.5, tags: ['小龙虾', '夜宵', '排队王'], cover: 'images/cover-7.png', isPartner: false, coupon: null },
        { id: 'v8', name: '五道口家常菜', city: '北京', district: '海淀', businessArea: '五道口', category: 'dinner', spendTier: 'economy', rating: 4.3, tags: ['家常菜', '学生友好', '量大'], cover: 'images/cover-8.png', isPartner: false, coupon: null },
        { id: 'v9', name: '奥体羽毛球馆', city: '北京', district: '朝阳', businessArea: '亚运村', category: 'ball', spendTier: 'economy', rating: 4.4, tags: ['羽毛球', '塑胶场地', '地铁直达'], cover: 'images/cover-9.png', isPartner: false, coupon: null },
        { id: 'v10', name: '朝阳公园网球场', city: '北京', district: '朝阳', businessArea: '团结湖', category: 'ball', spendTier: 'mid', rating: 4.6, tags: ['网球', '户外', '环境好'], cover: 'images/cover-10.png', isPartner: false, coupon: null },
        { id: 'v11', name: '海淀体育馆羽毛球', city: '北京', district: '海淀', businessArea: '苏州街', category: 'ball', spendTier: 'mid', rating: 4.3, tags: ['羽毛球', '高手多'], cover: 'images/cover-11.png', isPartner: false, coupon: null },
        { id: 'v12', name: '香山公园', city: '北京', district: '海淀', businessArea: '香山', category: 'outdoor', spendTier: 'economy', rating: 4.8, tags: ['爬山', '红叶', '秋季'], cover: 'images/cover-12.png', isPartner: false, coupon: null },
        { id: 'v13', name: '温榆河公园', city: '北京', district: '朝阳', businessArea: '孙河', category: 'outdoor', spendTier: 'economy', rating: 4.5, tags: ['野餐', '骑行', '遛娃'], cover: 'images/cover-13.png', isPartner: false, coupon: null }
    ],

    projects: [
        { id: 'p1', name: '火锅局', category: 'dinner', season: ['winter'], tags: ['火锅', '热闹'] },
        { id: 'p2', name: '烧烤局', category: 'dinner', season: ['summer'], tags: ['烧烤', '啤酒'] },
        { id: 'p3', name: '烤鸭宴', category: 'dinner', season: [], tags: ['烤鸭', '京味'] },
        { id: 'p4', name: '家常菜小聚', category: 'dinner', season: [], tags: ['家常菜', '轻松'] },
        { id: 'p5', name: '羽毛球', category: 'ball', season: [], tags: ['运动', '羽毛球'] },
        { id: 'p6', name: '网球', category: 'ball', season: ['spring', 'autumn'], tags: ['运动', '网球'] },
        { id: 'p7', name: '篮球半场', category: 'ball', season: [], tags: ['运动', '篮球'] },
        { id: 'p8', name: '血战到底麻将', category: 'mahjong', season: [], tags: ['棋牌', '麻将'] },
        { id: 'p9', name: '推倒胡麻将', category: 'mahjong', season: [], tags: ['棋牌', '麻将'] },
        { id: 'p10', name: '爬山·香山红叶', category: 'outdoor', season: ['autumn'], tags: ['爬山', '红叶', '秋游'] },
        { id: 'p11', name: '公园徒步野餐', category: 'outdoor', season: ['spring', 'autumn'], tags: ['野餐', '徒步', '遛娃'] },
        { id: 'p12', name: '美术馆看展', category: 'exhibit', season: [], tags: ['展览', '文艺'] },
        { id: 'p13', name: '博物馆漫游', category: 'exhibit', season: [], tags: ['展览', '历史'] },
        { id: 'p14', name: 'KTV 欢唱夜', category: 'ktv', season: [], tags: ['唱歌', '欢唱'] }
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
            status: 'open',
            deadline: '2026-11-19 12:00'
        }
    ],

    gatherings: [
        {
            id: 'g1', circleId: 'c1', title: '老王手气爆棚之夜', summary: '老王连庄五把，这顿饭请得应该',
            projectId: 'p8', venueId: 'v1', time: '2026-11-08 19:00',
            attendees: ['u1', 'm1', 'm2', 'm3'],
            photos: ['images/moment-1.jpg', 'images/moment-2.jpg'],
            buyMode: 'host', payerId: 'm1', billId: 'b1'
        },
        {
            id: 'g2', circleId: 'c2', title: '毕业十年，一个没少', summary: '十年之约，下次还聚',
            projectId: 'p3', venueId: 'v6', time: '2026-11-15 18:30',
            attendees: ['u1', 'm5', 'm6', 'm7'],
            photos: ['images/moment-3.jpg', 'images/moment-4.jpg'],
            buyMode: 'aa', payerId: null, billId: 'b2'
        },
        {
            id: 'g3', circleId: 'c3', title: '秋日羽毛球混双', summary: '',
            projectId: 'p5', venueId: 'v9', time: '2026-09-20 10:00',
            attendees: ['u1', 'm1', 'm2', 'm8', 'm9'],
            photos: ['images/moment-5.jpg'],
            buyMode: 'aa', payerId: null, billId: null
        },
        {
            id: 'g4', circleId: 'c1', title: '第一次麻将局', summary: '三缺一开局，从此入坑',
            projectId: 'p8', venueId: 'v2', time: '2026-10-11 19:00',
            attendees: ['u1', 'm1', 'm2', 'm3', 'm4'],
            photos: ['images/moment-6.jpg'],
            buyMode: 'random', payerId: 'm4', billId: null
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
