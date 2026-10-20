window.GlobalData = {
    user: {
        id: 'u1',
        name: 'ActiveExplorer',
        avatarUrl: 'https://picsum.photos/100/100',
        following: 42,
        followers: 108,
        activities: 5,
        moments: 12,
        intro: '热爱生活，喜欢探索城市的每一个角落。周末经常出没在各大公园和咖啡馆。',
        tags: ['摄影', '飞盘', '探店'],
        phone: '13800138000',
        realName: '张三',
        gender: 'male',
        birthDate: '1995-06-15',
        school: '北京大学',
        mbti: 'ENFP',
        role: 'user', // user: 普通用户, merchant: 合作商户, host: 主理人
        verified: false, // 是否已完成认证（兼容旧字段，表示合作认证）
        realNameVerified: true, // 实名认证状态，true为已认证
        cooperationVerified: false, // 合作认证状态，true为已认证
        points: 1250, // 积分
        wallet: 386.50, // 钱包余额（元）
        level: 3, // 当前等级
        nextLevelPoints: 2000, // 下一等级所需积分
        likes: 128, // 获赞数
        weekendPersonality: 'hutong' // 我的周末人格（测试结果，个人中心展示）
    },

    weekendCard: {
        title: '这个周末，北京怎么过？',
        subtitle: '测测你的周末人格，定制专属周末路线',
        buttons: [
            { id: 'b1', label: '开始周末人格测试', icon: 'sparkles', link: 'weekend-test.html', style: 'primary' },
            { id: 'b2', label: '定制周末路线', icon: 'map', link: 'weekend-route.html', style: 'outline' }
        ]
    },

    // 周末人格测试：8 种结果人格
    weekendPersonalities: [
        {
            id: 'hutong',
            title: '胡同街溜子',
            emoji: '🚶',
            color: 'from-brand-orange to-brand-yellow',
            quote: '我不赶路，我巡视胡同。',
            description: '你不爱排队打卡，偏爱钻进小街。咖啡要喝，烤鸭煎饼要吃，但最重要的是——不能像上班。',
            tags: ['一个人', '熟人', '慢聊搭子']
        },
        {
            id: 'beer',
            title: '精酿社交悍匪',
            emoji: '🍺',
            color: 'from-amber-400 to-orange-600',
            quote: '白天人畜无害，晚上精酿战神。',
            description: '你的周末从傍晚开始。喝点好的，认识点新的，顺便把下周的局也约了。',
            tags: ['找搭子', '陌生人组局', 'AA局']
        },
        {
            id: 'solo',
            title: '一人食孤勇者',
            emoji: '🍲',
            color: 'from-teal-400 to-cyan-600',
            quote: '一个人吃火锅，锅底就是我的结界。',
            description: '你不是社恐，你只是不想硬聊。一个人也能吃好逛好，舒服最重要。',
            tags: ['一个人', '低社交', '熟人']
        },
        {
            id: 'host',
            title: '搭子局攒局王',
            emoji: '📣',
            color: 'from-pink-500 to-rose-500',
            quote: '群里的@全体成员，都是我发的。',
            description: '你不想一个人玩，周末必须攒个局。桌游、羽毛球、饭局，缺人你补，没人你喊。',
            tags: ['找搭子', '陌生人组局', '熟人带新人']
        },
        {
            id: 'tourist',
            title: '京城首刷显眼包',
            emoji: '📸',
            color: 'from-sky-400 to-blue-600',
            quote: '第一次来北京，经典一个都不能少。',
            description: '第一次来北京，周末想一次把经典逛够、吃够、看够。别人说你游客，你说这叫认真体验。',
            tags: ['熟人', '找搭子', '陌生人组局']
        },
        {
            id: 'lazy',
            title: '周末躺平小废物',
            emoji: '🛌',
            color: 'from-gray-400 to-gray-600',
            quote: '床是我的充电桩，谁拔我跟谁急。',
            description: '周末不是用来赶路的，是用来回血的。公园、奶茶、书店，然后回家。',
            tags: ['一个人', '熟人', '低社交']
        },
        {
            id: 'budget',
            title: '预算特种兵',
            emoji: '💰',
            color: 'from-green-400 to-emerald-600',
            quote: '花小钱，办大周末。',
            description: '你不是没钱，你是会过。免费展、平价小吃、优惠券，一样能玩出花。',
            tags: ['学生搭子', 'AA局', '熟人']
        },
        {
            id: 'outdoor',
            title: '户外放电永动机',
            emoji: '🚴',
            color: 'from-lime-400 to-green-600',
            quote: '不出汗，等于没放假。',
            description: '周末就要动起来。骑行、徒步、球类、公园，出完汗再吃才香。',
            tags: ['运动搭子', '找搭子', '陌生人组局']
        }
    ],

    // 周末人格 → 推荐路线映射（测试结果页展示）
    weekendPersonalityRoutes: {
        hutong: ['r2', 'r9', 'r4'],
        beer: ['r2', 'r5', 'r6'],
        solo: ['r7', 'r9'],
        host: ['r6', 'r1'],
        tourist: ['r1', 'r2'],
        lazy: ['r4', 'r8'],
        budget: ['r7', 'r4'],
        outdoor: ['r3', 'r6']
    },

    // 同款搭子 mock（测试结果页按人格过滤展示，参考首页推荐搭子排版）
    weekendFellows: [
        { id: 'f1', name: '胡同观察员', avatarUrl: 'https://picsum.photos/100/100?random=31', personalityId: 'hutong', distance: '1.2km', tags: ['citywalk', '摄影'], intro: '周末就爱钻胡同，宫门口一带门儿清。', routeIds: ['r2', 'r4', 'r9'] },
        { id: 'f2', name: '慢速遛弯儿', avatarUrl: 'https://picsum.photos/100/100?random=32', personalityId: 'hutong', distance: '2.5km', tags: ['散步', '咖啡'], intro: '不打卡，只溜达。', routeIds: ['r4', 'r9'] },
        { id: 'f3', name: '精酿小李', avatarUrl: 'https://picsum.photos/100/100?random=33', personalityId: 'beer', distance: '0.8km', tags: ['精酿', '组局'], intro: '周五晚上北平机器常驻。', routeIds: ['r2', 'r5', 'r6'] },
        { id: 'f4', name: '微醺电台', avatarUrl: 'https://picsum.photos/100/100?random=34', personalityId: 'beer', distance: '3.1km', tags: ['酒馆', '聊天'], intro: '喝点好的，认识点新的。', routeIds: ['r5', 'r2'] },
        { id: 'f5', name: '孤勇干饭人', avatarUrl: 'https://picsum.photos/100/100?random=35', personalityId: 'solo', distance: '1.5km', tags: ['一人食', '火锅'], intro: '一个人吃火锅，谁也别劝。', routeIds: ['r7', 'r9'] },
        { id: 'f6', name: '局王本王', avatarUrl: 'https://picsum.photos/100/100?random=36', personalityId: 'host', distance: '0.9km', tags: ['桌游', '羽毛球'], intro: '缺人喊我，一喊一个准。', routeIds: ['r6', 'r1'] },
        { id: 'f7', name: '攒局小能手', avatarUrl: 'https://picsum.photos/100/100?random=37', personalityId: 'host', distance: '2.2km', tags: ['剧本杀', '饭局'], intro: '@全体成员是我的日常。', routeIds: ['r6', 'r2'] },
        { id: 'f8', name: '首刷特种兵', avatarUrl: 'https://picsum.photos/100/100?random=38', personalityId: 'tourist', distance: '4.0km', tags: ['打卡', '拍照'], intro: '第一次来北京，清单还有20项。', routeIds: ['r1', 'r2'] },
        { id: 'f9', name: '躺平协会会长', avatarUrl: 'https://picsum.photos/100/100?random=39', personalityId: 'lazy', distance: '1.1km', tags: ['宅家', '书店'], intro: '床是本体，出门随缘。', routeIds: ['r4', 'r8'] },
        { id: 'f10', name: '羊毛薅手', avatarUrl: 'https://picsum.photos/100/100?random=40', personalityId: 'budget', distance: '2.8km', tags: ['优惠券', '免费展'], intro: '免费展清单周更。', routeIds: ['r7', 'r4'] },
        { id: 'f11', name: '放电侠', avatarUrl: 'https://picsum.photos/100/100?random=41', personalityId: 'outdoor', distance: '3.5km', tags: ['骑行', '徒步'], intro: '奥森一圈起，两圈正常。', routeIds: ['r3', 'r6'] },
        { id: 'f12', name: '晨跑永动机', avatarUrl: 'https://picsum.photos/100/100?random=42', personalityId: 'outdoor', distance: '1.9km', tags: ['跑步', '球类'], intro: '早上六点的公园见。', routeIds: ['r3', 'r8'] }
    ],

    // 定制周末路线：表单配置
    weekendRouteForm: {
        situations: [
            { id: 'local', title: '本地周末', subtitle: '休息日不知道去哪', icon: 'home', color: 'bg-orange-100 text-orange-600' },
            { id: 'newbie', title: '初来北京', subtitle: '经典吃喝玩乐少踩雷', icon: 'camera', color: 'bg-blue-100 text-blue-600' },
            { id: 'solo', title: '一个人出门', subtitle: '轻松安全低压力', icon: 'user', color: 'bg-teal-100 text-teal-600' },
            { id: 'party', title: '搭子组局', subtitle: '适合聊天和成局', icon: 'users', color: 'bg-pink-100 text-pink-600' }
        ],
        areas: [
            { id: 'baitasi', label: '白塔寺 / 华熙 / 宫门口', icon: 'landmark' },
            { id: 'shichahai', label: '什刹海 / 鼓楼 / 南锣', icon: 'waves' },
            { id: 'sanlitun', label: '三里屯 / 朝阳公园 / 工体', icon: 'martini' },
            { id: 'aosen', label: '奥森 / 西山 / 温榆河', icon: 'tree-pine' }
        ],
        filters: [
            { id: 'time', label: '什么时候有空', options: ['周六上午', '周六下午', '周六晚上', '周日全天'] },
            { id: 'people', label: '几个人', options: ['1人', '2人', '3-5人', '6人以上'] },
            { id: 'budget', label: '人均预算', options: ['0-50', '50-150', '150-300', '300+'] },
            { id: 'partner', label: '是否找搭子', options: ['不找', '找熟人', '找平台搭子', '接受陌生人组局'] },
            { id: 'stranger', label: '是否接受陌生人组局', options: ['接受', '先聊再说', '不接受'] }
        ]
    },

    // 路线质量评价选项（全局一份，点一下即反馈，用于后续优化路线和店铺）
    routeRatingOptions: ['路线好用', '店铺不准', '价格不准', '太远了', '排队太久'],

    // 定制周末路线：路线数据
    // type 推荐优先顺序：recommend 诚意推荐 > classic 经典必逛 > smart 智能定制
    // areaId 对应表单片区（weekendRouteForm.areas），r5 为 798 额外路线（无片区，通过"换一条"切换查看）
    weekendRoutes: [
        {
            id: 'r1',
            type: 'recommend',
            tags: ['社交型', '治愈型', '文艺型'],
            name: '三里屯brunch与亮马河散步',
            areaId: 'sanlitun',
            schedule: [
                { time: '14:00', item: '三里屯brunch' },
                { time: '16:00', item: '精品咖啡' },
                { time: '18:00', item: '亮马河散步' },
                { time: '20:00', item: '蓝港晚餐' }
            ],
            nearbyActivities: ['a2', 'a1'],
            merchants: [
                { name: 'Element Fresh（三里屯店）', budget: '¥120-150/人', district: '三里屯', blurb: '适合想拍照、吃得健康、聊天放松的人。', tip: '周末热门时段座位紧张，建议提前订位。', primary: true },
                { name: 'Berry Beans（三里屯店）', budget: '¥40-60/人', district: '三里屯', blurb: '胡同风精品咖啡，适合下午茶歇脚。', tip: '座位少，建议下午茶时段错峰前往。', primary: false },
                { name: '茶百道（三里屯店）', budget: '¥15-25/人', district: '三里屯', blurb: '逛街间隙来一杯，常驻第二杯半价活动。', tip: '周末下午出杯慢，建议小程序先下单。', primary: false, partner: true, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', partnerId: 'm-teabadao-slt' }
            ],
            prep: [
                '核验主推荐店铺营业时间、排队和是否需要预约',
                '提前确认集合点、地铁站出口和返程方式',
                '按人均预算预留20-50元浮动费用',
                '先搜三里屯brunch候选，确认位置后再出发'
            ],
            budget: [
                { item: '餐饮', amount: 190 },
                { item: '咖啡', amount: 55 },
                { item: '交通', amount: 35 },
                { item: '备用', amount: 50 }
            ],
            budgetTotal: '约 330 元/人',
            reason: '适合想要精致一点、聊天环境舒服的周末。',
            guide: {
                transport: '三里屯、亮马河和蓝港之间建议用地铁或打车衔接。建议集合点：三里屯太古里南区入口。出发前确认营业时间、预约规则、排队情况和返程方式。',
                suitable: ['适合社交型、治愈型、文艺型用户。', '适合想聊天、组局或晚上放松的人。'],
                unsuitable: ['预算很紧时不建议优先选这条，餐饮波动比较明显。', '不适合特别怕人多、排队或不想拍照的人。'],
                alternatives: ['如果下雨，把户外段缩短，改去附近商场、咖啡店、书店或影院。', '想省钱时，把正餐换成简餐或小吃，预算通常能下降60-120元。', '如果临时找不到搭子，这条路线也可以拆成半日独自版。']
            }
        },
        {
            id: 'r2',
            type: 'classic',
            tags: ['治愈型', '文艺型', '美食型'],
            name: '鼓楼南锣鼓巷夜景与什刹海小吃',
            areaId: 'shichahai',
            schedule: [
                { time: '15:00', item: '鼓楼东大街漫步' },
                { time: '17:00', item: '南锣鼓巷胡同小店' },
                { time: '19:00', item: '什刹海夜景与小吃' },
                { time: '21:00', item: '后海晚风散步' }
            ],
            nearbyActivities: ['a8', 'a11'],
            merchants: [
                { name: '北平机器（方家胡同店）', budget: '¥80-120/人', district: '方家胡同', blurb: '精酿配老胡同，晚上氛围拉满。', tip: '周末晚间排队，建议先取号再逛。', primary: true, partner: true, image: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', partnerId: 'm-beiping-fangjia' },
                { name: '姚记炒肝店（鼓楼店）', budget: '¥30-50/人', district: '鼓楼', blurb: '老北京味道，适合第一次来北京想体验地道小吃的人。', tip: '饭点排队较长，建议错峰前往。', primary: false },
                { name: '茶汤李（什刹海店）', budget: '¥20-40/人', district: '什刹海', blurb: '老字号甜品，适合饭后解腻。', tip: '店面小，可打包边走边吃。', primary: false }
            ],
            prep: [
                '核验主推荐店铺营业时间与排队情况',
                '提前确认地铁8号线什刹海站出口与返程末班车',
                '按人均预算预留20-50元浮动费用',
                '胡同区域部分路段禁行机动车，建议地铁出行'
            ],
            budget: [
                { item: '小吃', amount: 80 },
                { item: '甜品咖啡', amount: 60 },
                { item: '交通', amount: 20 },
                { item: '备用', amount: 40 }
            ],
            budgetTotal: '约 200 元/人',
            reason: '适合想慢悠悠感受老北京烟火气与胡同夜景的周末。',
            guide: {
                transport: '鼓楼、南锣与什刹海之间步行串联，建议地铁8号线什刹海站进出。建议集合点：鼓楼东大街地铁站A口。出发前确认营业时间与排队情况。',
                suitable: ['适合治愈型、文艺型、喜欢老城烟火气的用户。', '适合一个人或两三人慢逛拍照。'],
                unsuitable: ['不喜欢排队、对老城人流敏感的不建议。', '预算极低时建议选更精简的版本。'],
                alternatives: ['如果下雨，改走室内路线：附近书店、咖啡馆与小型展览。', '人太多时提前离场，转去北锣鼓巷支巷。', '想省钱把甜品换成路边小吃，通常能省40-80元。']
            }
        },
        {
            id: 'r3',
            type: 'smart',
            tags: ['运动型', '治愈型'],
            name: '奥森绿道骑行与林间野餐',
            areaId: 'aosen',
            schedule: [
                { time: '09:00', item: '奥森南门集合热身' },
                { time: '10:00', item: '环园绿道骑行' },
                { time: '12:00', item: '林间野餐' },
                { time: '14:00', item: '湖边散步消食' }
            ],
            nearbyActivities: ['a3', 'a6'],
            merchants: [
                { name: '林间野餐盒（奥森公园店）', budget: '¥60-80/人', district: '奥森', blurb: '轻食野餐盒，适合骑行途中补给。', tip: '野餐盒需提前1天下单。', primary: true },
                { name: '茶百道（奥森南门店）', budget: '¥15-25/人', district: '奥森', blurb: '骑行补给站，冰饮恢复状态。', tip: '运动后别喝太冰，微糖更合适。', primary: false, partner: true, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', partnerId: 'm-teabadao-as' },
                { name: '温榆河畔农庄餐厅', budget: '¥80-120/人', district: '温榆河', blurb: '骑行终点农家菜，量大实惠。', tip: '距离较远，可打车前往。', primary: false }
            ],
            prep: [
                '核验主推荐店铺营业时间与野餐盒预订规则',
                '提前确认骑行路线与天气，雨天改期',
                '按人均预算预留20-50元浮动费用',
                '检查共享单车或自备车辆，确认集合点停车位置'
            ],
            budget: [
                { item: '野餐', amount: 80 },
                { item: '咖啡', amount: 35 },
                { item: '交通', amount: 30 },
                { item: '备用', amount: 45 }
            ],
            budgetTotal: '约 190 元/人',
            reason: '适合想动一动、呼吸新鲜空气、又不赶时间的周末。',
            guide: {
                transport: '奥森南门地铁8号线直达，骑行全程走园内绿道。建议集合点：奥森南门地铁站B口。出发前确认天气与骑行路线。',
                suitable: ['适合运动型、治愈型用户。', '适合想轻运动、野餐、拍照的人。'],
                unsuitable: ['不喜欢户外或体力一般的不建议全程骑行。', '雨天或大风天不建议走这条线。'],
                alternatives: ['如果下雨，改成室内羽毛球或游泳局。', '体力不够时，骑行段可改为湖边散步。', '想省钱，野餐盒可自备食材，能省40-60元。']
            }
        },
        {
            id: 'r4',
            type: 'classic',
            tags: ['文艺型', '治愈型'],
            name: '白塔寺胡同漫游与宫门口咖啡',
            areaId: 'baitasi',
            schedule: [
                { time: '14:00', item: '白塔寺胡同漫游' },
                { time: '16:00', item: '白塔寺红墙拍照' },
                { time: '17:30', item: '宫门口胡同咖啡' },
                { time: '19:00', item: '华熙LIVE晚餐夜景' }
            ],
            nearbyActivities: ['a9', 'a18'],
            merchants: [
                { name: '华熙LIVE商圈', budget: '¥80-120/人', district: '华熙', blurb: '晚餐选择多，夜景热闹，适合收尾一站。', tip: '周末饭点排队，可先取号再逛。', primary: true, partner: true, image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', partnerId: 'm-huaxi' },
                { name: '熊煮咖啡（白塔寺店）', budget: '¥35-50/人', district: '白塔寺', blurb: '红墙白塔景观位，适合拍照发呆。', tip: '景观位周末紧俏，建议提前去。', primary: false },
                { name: '宫门口馒头铺', budget: '¥10-20/人', district: '宫门口', blurb: '老字号主食铺，性价比高。', tip: '下午收摊早，别太晚去。', primary: false }
            ],
            prep: [
                '核验主推荐店铺营业时间与景观位情况',
                '提前确认地铁2号线阜成门站出口与返程方式',
                '按人均预算预留20-50元浮动费用',
                '胡同拍照注意居民隐私，部分胡同为私人区域'
            ],
            budget: [
                { item: '咖啡甜品', amount: 60 },
                { item: '小吃', amount: 30 },
                { item: '交通', amount: 25 },
                { item: '备用', amount: 45 }
            ],
            budgetTotal: '约 160 元/人',
            reason: '适合想安静走走胡同、拍拍照、喝杯咖啡的周末。',
            guide: {
                transport: '白塔寺与宫门口之间步行可达，晚餐建议地铁或打车去华熙LIVE。建议集合点：地铁2号线阜成门站B口。出发前确认营业时间与拍照位置。',
                suitable: ['适合文艺型、治愈型用户。', '适合喜欢胡同、拍照、安静咖啡的人。'],
                unsuitable: ['不喜欢走路或对胡同环境无感的不建议。', '华熙LIVE段人多，社恐可只走白塔寺半段。'],
                alternatives: ['如果下雨，改去附近书店或咖啡馆。', '白塔寺人多时，转去广济寺或历代帝王庙。', '想省钱，晚餐可换成宫门口一带的小馆子。']
            }
        },
        {
            id: 'r5',
            type: 'classic',
            tags: ['文艺型', '社交型'],
            name: '798艺术区咖啡与公园散步',
            areaId: null, // 额外路线，不绑定表单片区，通过推荐列表查看
            schedule: [
                { time: '13:00', item: '798画廊巡游' },
                { time: '15:00', item: '艺术区咖啡' },
                { time: '17:00', item: '751广场拍照' },
                { time: '19:00', item: '园区晚餐' }
            ],
            nearbyActivities: ['a10', 'a19'],
            merchants: [
                { name: '北平机器（798店）', budget: '¥90-130/人', district: '798艺术区', blurb: '厂房风精酿晚餐，看展后收尾首选。', tip: '周末晚餐建议订位。', primary: true, partner: true, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', partnerId: 'm-beiping-798' },
                { name: 'VOYAGE COFFEE（798店）', budget: '¥40-60/人', district: '798艺术区', blurb: '厂房改造咖啡馆，适合看展间隙歇脚。', tip: '周末下午人多，建议错峰。', primary: false },
                { name: '尤伦斯当代艺术中心商店', budget: '¥0-200/人', district: '798艺术区', blurb: '逛展+买周边，文艺感拉满。', tip: '部分展览需提前购票。', primary: false }
            ],
            prep: [
                '核验主推荐店铺营业时间与展览开放情况',
                '提前确认地铁14号线望京南站出口与返程方式',
                '按人均预算预留20-50元浮动费用',
                '提前查好想看的展览与是否需要预约购票'
            ],
            budget: [
                { item: '展览', amount: 80 },
                { item: '咖啡', amount: 50 },
                { item: '交通', amount: 30 },
                { item: '备用', amount: 40 }
            ],
            budgetTotal: '约 200 元/人',
            reason: '适合想逛展、拍照、喝咖啡，文艺氛围拉满的周末。',
            guide: {
                transport: '798园区较大，展馆之间步行串联，进出建议打车或地铁14号线望京南站。建议集合点：798艺术区南门。出发前确认展览开放时间。',
                suitable: ['适合文艺型、社交型用户。', '适合喜欢看展、拍照、逛园区的人。'],
                unsuitable: ['对当代艺术无感的不建议。', '不想走路的人建议只看核心展馆。'],
                alternatives: ['如果下雨，多安排室内展馆。', '想省钱，只逛免费展，能省50-80元。', '时间紧的话，只逛尤伦斯周边核心区域。']
            }
        },
        {
            id: 'r6',
            type: 'classic',
            tags: ['运动型', '社交型'],
            name: '工体夜跑与三里屯夜宵',
            areaId: 'sanlitun',
            schedule: [
                { time: '18:00', item: '工体北门集合热身' },
                { time: '19:00', item: '夜跑5公里' },
                { time: '20:00', item: '拉伸放松' },
                { time: '21:00', item: '三里屯夜宵局' }
            ],
            nearbyActivities: ['a1', 'a23'],
            merchants: [
                { name: '工体夜宵小馆', budget: '¥60-90/人', district: '工体', blurb: '夜跑后补充能量，热闹实惠。', tip: '晚间高峰需排队，可错峰到 21:30。', primary: true },
                { name: '茶百道（工体店）', budget: '¥15-25/人', district: '工体', blurb: '夜宵搭配冰饮，快乐加倍。', tip: '大杯第二份半价，建议拼单。', primary: false, partner: true, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', partnerId: 'm-teabadao-gt' },
                { name: '三里屯深夜食堂', budget: '¥50-80/人', district: '三里屯', blurb: '日式深夜食堂，安静收尾。', tip: '凌晨 1 点打烊，别太晚。', primary: false }
            ],
            prep: [
                '核验主推荐店铺营业时间与夜宵时段',
                '提前确认夜跑路线与照明情况，结伴出行',
                '按人均预算预留20-50元浮动费用',
                '带好替换衣物与运动补给'
            ],
            budget: [
                { item: '夜宵', amount: 100 },
                { item: '运动饮料', amount: 20 },
                { item: '交通', amount: 20 },
                { item: '备用', amount: 40 }
            ],
            budgetTotal: '约 180 元/人',
            reason: '适合白天上班、晚上想动一动再吃顿好的周末。',
            guide: {
                transport: '工体与三里屯步行可达，夜跑路线沿工体外围绿道。建议集合点：工体北门。出发前确认天气与夜跑路线。',
                suitable: ['适合运动型、社交型用户。', '适合想夜跑、夜宵、组局的人。'],
                unsuitable: ['膝盖不适或体力一般的不建议夜跑。', '怕晚上出门的不建议这条线。'],
                alternatives: ['如果下雨，夜跑改为室内羽毛球或健身房。', '跑不动就只走两圈，直接进夜宵环节。', '想省钱，夜宵换成便利店简餐，能省40-60元。']
            }
        },
        {
            id: 'r7',
            type: 'smart',
            tags: ['运动型', '美食型'],
            name: '后海晨骑与胡同早点',
            areaId: 'shichahai',
            schedule: [
                { time: '07:30', item: '后海环湖晨骑' },
                { time: '08:30', item: '胡同早点' },
                { time: '09:30', item: '鼓楼咖啡' },
                { time: '11:00', item: '什刹海晨光散步' }
            ],
            nearbyActivities: ['a8', 'a11'],
            merchants: [
                { name: '什刹海早点铺', budget: '¥20-35/人', district: '什刹海', blurb: '糖油饼配豆汁，胡同里的清晨味道。', tip: '早上 10 点后部分品类售罄。', primary: true },
                { name: '北平机器（方家胡同店）', budget: '¥80-120/人', district: '方家胡同', blurb: '白天是安静的胡同咖啡精酿馆。', tip: '上午人少，适合晨骑后歇脚。', primary: false, partner: true, image: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', partnerId: 'm-beiping-fangjia' },
                { name: '鼓楼社区咖啡', budget: '¥30-45/人', district: '鼓楼', blurb: '社区小店，早晨安静出片。', tip: '9 点开门，别去太早。', primary: false }
            ],
            prep: [
                '核验主推荐店铺营业时间（早餐时段）',
                '提前确认骑行路线与共享单车停放点',
                '按人均预算预留20-50元浮动费用',
                '清晨体感偏凉，带件薄外套'
            ],
            budget: [
                { item: '早点', amount: 30 },
                { item: '咖啡', amount: 40 },
                { item: '交通', amount: 15 },
                { item: '备用', amount: 35 }
            ],
            budgetTotal: '约 120 元/人',
            reason: '适合想用清晨运动开启一天、顺便吃顿地道早点的周末。',
            guide: {
                transport: '后海环湖绿道骑行，早点与咖啡均在步行范围内。建议集合点：什刹海地铁站A口。出发前确认天气与骑行路线。',
                suitable: ['适合运动型、美食型用户。', '适合早起、喜欢清晨北京的人。'],
                unsuitable: ['起不来早的不建议这条线。', '不喜欢豆汁等老北京口味的不建议。'],
                alternatives: ['如果下雨，改成室内早午餐。', '骑不动就散步环湖，节奏更慢。', '想省钱，咖啡换成豆浆，能省30元。']
            }
        },
        {
            id: 'r8',
            type: 'classic',
            tags: ['治愈型', '文艺型'],
            name: '温榆河露营风下午茶',
            areaId: 'aosen',
            schedule: [
                { time: '13:00', item: '温榆河公园漫步' },
                { time: '15:00', item: '露营风下午茶' },
                { time: '17:00', item: '河边日落拍照' },
                { time: '19:00', item: '返程晚餐自理' }
            ],
            nearbyActivities: ['a3', 'a6'],
            merchants: [
                { name: '温榆河畔茶室', budget: '¥70-100/人', district: '温榆河', blurb: '天幕帐篷下午茶，草地河边都好拍。', tip: '周末帐篷位需提前预约。', primary: true },
                { name: '茶百道（温榆河店）', budget: '¥15-25/人', district: '温榆河', blurb: '公园门口补给，回程路上带一杯。', tip: '出公园方向顺路，别绕行。', primary: false, partner: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', partnerId: 'm-teabadao-wyh' },
                { name: '奥森轻食店', budget: '¥40-60/人', district: '奥森', blurb: '返程前的轻食补给。', tip: '晚 7 点后停止点单。', primary: false }
            ],
            prep: [
                '核验主推荐店铺营业时间与帐篷位预约',
                '提前确认公园开放时间与返程交通',
                '按人均预算预留20-50元浮动费用',
                '户外注意防晒与蚊虫'
            ],
            budget: [
                { item: '下午茶', amount: 90 },
                { item: '交通', amount: 40 },
                { item: '备用', amount: 40 }
            ],
            budgetTotal: '约 170 元/人',
            reason: '适合想离开市区、在草地河边放松一下午的周末。',
            guide: {
                transport: '温榆河公园建议自驾或打车前往，公园内部步行。建议集合点：温榆河公园西园入口。出发前确认开放时间与天气。',
                suitable: ['适合治愈型、文艺型用户。', '适合想野餐、下午茶、拍日落的人。'],
                unsuitable: ['不想出远门的不建议这条线。', '蚊虫敏感体质不建议夏季前往。'],
                alternatives: ['如果下雨，改去室内咖啡馆。', '人多时改去奥森南园草坪。', '想省钱，下午茶自带简餐，能省60-80元。']
            }
        },
        {
            id: 'r9',
            type: 'recommend',
            tags: ['治愈型', '美食型', '文艺型'],
            name: '什刹海晨光散步与鼓楼早午餐',
            areaId: 'shichahai',
            schedule: [
                { time: '09:00', item: '什刹海晨光散步' },
                { time: '10:30', item: '鼓楼早午餐' },
                { time: '12:30', item: '胡同咖啡馆' },
                { time: '14:00', item: '南锣手作小店' }
            ],
            nearbyActivities: ['a8', 'a11'],
            merchants: [
                { name: '鼓楼早午餐小馆', budget: '¥80-110/人', district: '鼓楼', blurb: '胡同里的阳光早午餐，适合慢慢吃。', tip: '周末 10 点半后需排队。', primary: true },
                { name: '茶百道（鼓楼店）', budget: '¥15-25/人', district: '鼓楼', blurb: '饭后一杯，边喝边逛南锣。', tip: '热门款可能售罄，早去。', primary: false, partner: true, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', partnerId: 'm-teabadao-gl' },
                { name: '南锣手作咖啡', budget: '¥35-50/人', district: '南锣鼓巷', blurb: '手作与咖啡结合的小店，适合慢慢逛。', tip: '店内座位有限。', primary: false }
            ],
            prep: [
                '核验主推荐店铺营业时间与排队情况',
                '提前确认地铁8号线什刹海站出口',
                '按人均预算预留20-50元浮动费用',
                '清晨湖边微凉，带件外套'
            ],
            budget: [
                { item: '早午餐', amount: 110 },
                { item: '咖啡', amount: 45 },
                { item: '交通', amount: 20 },
                { item: '备用', amount: 45 }
            ],
            budgetTotal: '约 220 元/人',
            reason: '适合想用一顿舒服的早午餐开启周末、再慢逛胡同的人。',
            guide: {
                transport: '什刹海、鼓楼与南锣之间步行串联，建议地铁8号线什刹海站进出。建议集合点：什刹海荷花市场。出发前确认营业时间。',
                suitable: ['适合治愈型、美食型、文艺型用户。', '适合想慢节奏过周六的人。'],
                unsuitable: ['赶时间的不建议，这条线适合慢慢走。', '周末怕排队的不建议早午餐时段去。'],
                alternatives: ['如果下雨，早午餐后改逛室内小店。', '人多时跳过南锣，改走北锣支巷。', '想省钱，早午餐换胡同早点铺，能省50-70元。']
            }
        }
    ],

    // 个人中心 mock：我报名的活动 / 我收藏的动态与路线 / 我的溜达计划（未出行 pending / 已出行 done）
    myActivities: ['a1', 'a3', 'a21'],
    myFavoriteMoments: ['mo1', 'mo4'],
    myFavoriteRoutes: ['r1', 'r9'],
    myPlanRoutes: [
        { routeId: 'r1', status: 'pending' },
        { routeId: 'r9', status: 'pending' },
        { routeId: 'r2', status: 'done' }
    ],

    // 平台活动合作商家注册表（按 partnerId 索引，路线数据通过 partnerId 引用）
    partnerMerchants: {
        'm-teabadao-slt': {
            id: 'm-teabadao-slt',
            couponMode: 'code',
            name: '茶百道（三里屯店）',
            budget: '¥15-25/人',
            district: '三里屯',
            description: '三里屯核心商圈的连锁鲜果茶店，主打杨枝甘露与招牌奶茶，逛街歇脚首选。门店支持小程序提前点单，出杯快，是三里屯片区的热门饮品补给站。',
            notes: '周末下午出杯较慢，建议小程序提前下单，高峰时段建议外带。',
            images: [
                'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            address: '北京市朝阳区三里屯太古里南区 B1 层',
            location: { lng: 116.455, lat: 39.937 },
            coupons: [
                { id: 'c1', code: 'TB7F3K2Q', title: '第二杯半价', description: '全场饮品第二杯半价，可与朋友拼单', value: '第二杯半价' },
                { id: 'c2', code: 'TB2B4M9X', title: '新客立减5元', description: '首次小程序点单立减 5 元', value: '减5元' },
                { id: 'c3', code: 'TB6A1P8C', title: '满30减6', description: '单笔满 30 元减 6 元', value: '减6元' }
            ]
        },
        'm-beiping-fangjia': {
            id: 'm-beiping-fangjia',
            couponMode: 'qr',
            name: '北平机器（方家胡同店）',
            budget: '¥80-120/人',
            district: '方家胡同',
            description: '藏在方家胡同里的精酿酒吧，工业风装修配老胡同院墙，主打自酿 IPA 与酸啤。白天安静适合聊天，晚上气氛热闹，是鼓楼片区精酿爱好者的据点。',
            notes: '周末晚间人多，建议先取号再逛，部分酒款度数偏高请适量。',
            images: [
                'https://images.unsplash.com/photo-1541336032412-2048a678540d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            address: '北京市东城区方家胡同 46 号院',
            location: { lng: 116.407, lat: 39.939 },
            coupons: [
                { id: 'c1', code: 'BJ4R8T2W', title: '精酿第二杯半价', description: '指定精酿第二杯半价', value: '第二杯半价' },
                { id: 'c2', code: 'BJ5S9N1E', title: '下酒小食8折', description: '全场下酒小食 8 折', value: '8折' }
            ]
        },
        'm-teabadao-as': {
            id: 'm-teabadao-as',
            couponMode: 'code',
            name: '茶百道（奥森南门店）',
            budget: '¥15-25/人',
            district: '奥森',
            description: '奥森南门附近的连锁茶饮店，运动前后的补给站。主打清爽果茶系列，骑行、跑步后来一杯恢复状态，支持小程序下单到店自取。',
            notes: '运动后建议选择微糖或去冰，周末午后排队，建议上午前往。',
            images: [
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            address: '北京市朝阳区奥林匹克森林公园南门东侧',
            location: { lng: 116.393, lat: 40.011 },
            coupons: [
                { id: 'c1', code: 'TB3G6H1J', title: '运动日立减4元', description: '穿运动装备到店立减 4 元', value: '减4元' },
                { id: 'c2', code: 'TB8D5K4L', title: '第二杯半价', description: '全场饮品第二杯半价', value: '第二杯半价' }
            ]
        },
        'm-huaxi': {
            id: 'm-huaxi',
            couponMode: 'qr',
            name: '华熙LIVE商圈',
            budget: '¥80-120/人',
            district: '华熙',
            description: '华熙LIVE·五棵松是西四环的大型商业综合体，餐饮、酒吧、Livehouse 聚集，夜晚灯光氛围热闹。商圈内选择多，适合作为路线收尾站，吃逛一体。',
            notes: '周末饭点热门餐厅排队，建议先取号再逛，并提前看好店铺位置。',
            images: [
                'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            address: '北京市海淀区复兴路 69 号',
            location: { lng: 116.271, lat: 39.906 },
            coupons: [
                { id: 'c1', code: 'HX2W9P7M', title: '小吊梨汤（华熙店）满100减15', description: '小吊梨汤（华熙店）单笔满 100 元减 15 元', value: '减15元' },
                { id: 'c2', code: 'HX6C3A5B', title: '华熙LIVE商圈停车2小时免费', description: '商圈内消费满 200 元兑换 2 小时免费停车', value: '停车券' },
                { id: 'c3', code: 'HX1E8D4F', title: '湊湊火锅（华熙店）新店9折', description: '湊湊火锅（华熙店）全场 9 折', value: '9折' }
            ]
        },
        'm-beiping-798': {
            id: 'm-beiping-798',
            couponMode: 'qr',
            name: '北平机器（798店）',
            budget: '¥90-130/人',
            district: '798艺术区',
            description: '北平机器在 798 艺术区的分店，改造自老厂房，挑高空间配工业装置。主打精酿与西式简餐，看展之后来一杯的收尾选择，晚上常有现场演出。',
            notes: '周末晚餐建议提前订位，园区步行距离较远请预留时间。',
            images: [
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1541336032412-2048a678540d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            address: '北京市朝阳区酒仙桥路 4 号 798 艺术区 751 园区',
            location: { lng: 116.497, lat: 39.984 },
            coupons: [
                { id: 'c1', code: 'BJ7Q2V6Z', title: '精酿第二杯半价', description: '指定精酿第二杯半价', value: '第二杯半价' },
                { id: 'c2', code: 'BJ9M3X8Y', title: '工作日午市8.8折', description: '工作日午餐时段全场 8.8 折', value: '8.8折' }
            ]
        },
        'm-teabadao-gt': {
            id: 'm-teabadao-gt',
            couponMode: 'code',
            name: '茶百道（工体店）',
            budget: '¥15-25/人',
            district: '工体',
            description: '工体北门附近的连锁茶饮店，夜跑、看球后的补给点。主打冰饮与果茶，支持小程序点单，高峰期出杯依然稳定。',
            notes: '赛事日晚间客流大，建议提前下单并选择外带。',
            images: [
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            address: '北京市朝阳区工体北路 8 号',
            location: { lng: 116.444, lat: 39.932 },
            coupons: [
                { id: 'c1', code: 'TB5N2C7P', title: '大杯第二份半价', description: '大杯饮品第二份半价', value: '第二份半价' },
                { id: 'c2', code: 'TB1K9R4T', title: '满25减5', description: '单笔满 25 元减 5 元', value: '减5元' }
            ]
        },
        'm-teabadao-wyh': {
            id: 'm-teabadao-wyh',
            couponMode: 'code',
            name: '茶百道（温榆河店）',
            budget: '¥15-25/人',
            district: '温榆河',
            description: '温榆河公园附近的连锁茶饮店，露营、散步后的补给站。主打清爽果茶与奶盖系列，出公园方向顺路，支持小程序下单自取。',
            notes: '公园旺季周末排队较长，奶盖系列建议尽快饮用。',
            images: [
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            address: '北京市顺义区温榆河公园西园入口旁',
            location: { lng: 116.527, lat: 40.032 },
            coupons: [
                { id: 'c1', code: 'TB4V8B2W', title: '露营日立减5元', description: '出示露营装备立减 5 元', value: '减5元' },
                { id: 'c2', code: 'TB9Z6M3D', title: '第二杯半价', description: '全场饮品第二杯半价', value: '第二杯半价' }
            ]
        },
        'm-teabadao-gl': {
            id: 'm-teabadao-gl',
            couponMode: 'code',
            name: '茶百道（鼓楼店）',
            budget: '¥15-25/人',
            district: '鼓楼',
            description: '鼓楼东大街上的连锁茶饮店，逛胡同、看鼓楼时的歇脚点。主打杨枝甘露与柠檬茶系列，店内可小坐，窗边位能看街景。',
            notes: '热门款下午可能售罄建议早去，周末店内座位紧张。',
            images: [
                'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            address: '北京市东城区鼓楼东大街 120 号',
            location: { lng: 116.397, lat: 39.945 },
            coupons: [
                { id: 'c1', code: 'TB3J7Y5G', title: '第二杯半价', description: '全场饮品第二杯半价', value: '第二杯半价' },
                { id: 'c2', code: 'TB6E1H8S', title: '新客立减4元', description: '首次小程序点单立减 4 元', value: '减4元' },
                { id: 'c3', code: 'TB2Q4N9K', title: '满30减6', description: '单笔满 30 元减 6 元', value: '减6元' }
            ]
        }
    },

    // 周末人格测试：8 道题，每题 4 个选项，选项给对应人格加分
    weekendTestQuestions: [
        {
            id: 'q1',
            text: '周六早上醒来，你第一反应是？',
            options: [
                { text: '床：再续个钟，我是周末限定废物', scores: { lazy: 2, solo: 1 } },
                { text: '群：有没有人组局？没有我攒一个', scores: { host: 2, beer: 1 } },
                { text: '地图：这周去哪个没去过的地方', scores: { hutong: 2, outdoor: 1 } },
                { text: '收藏夹：按清单打卡，一个都不能少', scores: { tourist: 2, budget: 1 } }
            ]
        },
        {
            id: 'q2',
            text: '周末出门，你最容易被什么"勾走"？',
            options: [
                { text: '香味：烤鸭煎饼、小吃、新店出锅', scores: { solo: 2, hutong: 1 } },
                { text: '酒香：精酿、新酒、小酒馆的灯', scores: { beer: 2, host: 1 } },
                { text: '故事：展览、书店、胡同、老电影', scores: { hutong: 2, tourist: 1 } },
                { text: '风：公园、河边、山道、球场', scores: { outdoor: 2, host: 1 } }
            ]
        },
        {
            id: 'q3',
            text: '周末你想和谁混？',
            options: [
                { text: '一个人，别管我', scores: { solo: 2, lazy: 1 } },
                { text: '熟人，舒服', scores: { hutong: 1, host: 1 } },
                { text: '平台找个搭子，AA不尴尬', scores: { host: 2, outdoor: 1 } },
                { text: '陌生人，越热闹越好', scores: { beer: 2, host: 1 } }
            ]
        },
        {
            id: 'q4',
            text: '人均预算大概？',
            options: [
                { text: '0-50，白嫖使我快乐', scores: { budget: 2, lazy: 1 } },
                { text: '50-150，性价比战士', scores: { solo: 1, hutong: 1 } },
                { text: '150-300，体验感拉满', scores: { beer: 2, host: 1 } },
                { text: '300+，难得周末，冲', scores: { tourist: 1, beer: 1 } }
            ]
        },
        {
            id: 'q5',
            text: '这次更想干什么？',
            options: [
                { text: '吃：烤鸭煎饼、小吃、探店', scores: { solo: 2, hutong: 1 } },
                { text: '喝：精酿、新酒、夜宵', scores: { beer: 2, host: 1 } },
                { text: '看：展览、胡同、书店、电影', scores: { hutong: 2, tourist: 1 } },
                { text: '动：骑行、徒步、球类、公园', scores: { outdoor: 2, host: 1 } }
            ]
        },
        {
            id: 'q6',
            text: '你喜欢的周末节奏？',
            options: [
                { text: '睡到自然醒，随缘出门', scores: { lazy: 2, solo: 1 } },
                { text: '下午出门，晚上早点回', scores: { hutong: 1, solo: 1 } },
                { text: '傍晚开始，玩到夜里', scores: { beer: 2, host: 1 } },
                { text: '早起出发，排满一天', scores: { tourist: 2, outdoor: 1 } }
            ]
        },
        {
            id: 'q7',
            text: '如果找搭子，你对陌生人的态度？',
            options: [
                { text: '不太接受，最多熟人', scores: { solo: 2, lazy: 1 } },
                { text: '先线上聊，合适再约', scores: { hutong: 1, budget: 1 } },
                { text: '可以，看活动靠不靠谱', scores: { host: 2, outdoor: 1 } },
                { text: '主动发起，人多热闹', scores: { beer: 2, host: 1 } }
            ]
        },
        {
            id: 'q8',
            text: '你和北京的关系？',
            options: [
                { text: '第一次来，想打卡经典', scores: { tourist: 2, hutong: 1 } },
                { text: '来过几次，想玩点小众', scores: { hutong: 2, budget: 1 } },
                { text: '本地/常驻，但周末没处去', scores: { lazy: 1, solo: 1, beer: 1 } },
                { text: '常驻但想找搭子探索', scores: { host: 2, outdoor: 1 } }
            ]
        }
    ],

    categories: [
        { id: 'c1', label: '运动', icon: 'dribbble', color: 'bg-orange-100 text-orange-600' },
        { id: 'c2', label: '户外', icon: 'tent', color: 'bg-green-100 text-green-600' },
        { id: 'c3', label: '饭搭子', icon: 'utensils', color: 'bg-yellow-100 text-yellow-600' },
        { id: 'c7', label: '游戏', icon: 'gamepad-2', color: 'bg-indigo-100 text-indigo-600' },
        { id: 'c4', label: '看展', icon: 'palette', color: 'bg-purple-100 text-purple-600' },
        { id: 'c8', label: '旅行', icon: 'globe', color: 'bg-cyan-100 text-cyan-600' },
        { id: 'c5', label: '娱乐', icon: 'mic', color: 'bg-pink-100 text-pink-600' },
        { id: 'c9', label: '读书', icon: 'book-open', color: 'bg-emerald-100 text-emerald-600' },
        { id: 'c10', label: '音乐', icon: 'music', color: 'bg-rose-100 text-rose-600' }
    ],

    partners: [
        {
            id: 'p1',
            name: '滑雪大冒险',
            avatarUrl: 'https://picsum.photos/100/100?random=20',
            tags: ['单板', '自驾', '摄影'],
            intro: '崇礼周末往返，缺人拼车！',
            distance: '1.2km',
            realNameVerified: true,
            cooperationVerified: true,
            role: 'merchant',
            verified: true
        },
        {
            id: 'p2',
            name: 'CoffeeJane',
            avatarUrl: 'https://picsum.photos/100/100?random=21',
            tags: ['探店', '手冲', '阅读'],
            intro: '寻找三里屯附近的咖啡搭子。',
            distance: '0.5km',
            realNameVerified: true,
            cooperationVerified: false,
            role: 'user',
            verified: false
        },
        {
            id: 'p3',
            name: '健身狂魔',
            avatarUrl: 'https://picsum.photos/100/100?random=22',
            tags: ['举铁', '增肌', '早起'],
            intro: '每天早上6点健身房见。',
            distance: '3.0km',
            realNameVerified: true,
            cooperationVerified: false,
            role: 'user',
            verified: false
        },
        {
            id: 'p4',
            name: '剧本杀DM',
            avatarUrl: 'https://picsum.photos/100/100?random=23',
            tags: ['推理', '演绎'],
            intro: '缺1人，硬核本，速来！',
            distance: '5.2km',
            realNameVerified: true,
            cooperationVerified: true,
            role: 'host',
            verified: true
        }
    ],

    activities: [
        {
            id: 'a1',
            title: '朝阳公园飞盘新手局',
            description: '欢迎萌新！有专业教练指导，并在活动后一起聚餐。不用担心接不到盘，主要是为了快乐流汗！',
            category: 'SPORTS',
            imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '朝阳公园南门草坪',
            district: '朝阳区',
            date: '本周六 14:00',
            price: 39,
            organizer: { id: 'u2', name: '飞盘小队长', avatarUrl: 'https://picsum.photos/50/50?random=2', intro: '拥有3年飞盘经验的快乐修狗' },
            status: 'RECRUITING',
            currentParticipants: 12,
            maxParticipants: 20,
            tags: ['萌新友好', '含饮料', '社交']
        },
        {
            id: 'a2',
            title: '三里屯Bistro早午餐',
            description: '打卡网红Bistro，聊聊最近的工作和生活，寻找志同道合的朋友。餐厅环境很好，适合拍照。',
            category: 'DINING',
            imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '三里屯太古里北区',
            district: '朝阳区',
            date: '本周日 11:00',
            price: 0,
            organizer: { id: 'u3', name: 'FoodieJane', avatarUrl: 'https://picsum.photos/50/50?random=4', intro: '专注于寻找北京好吃的' },
            status: 'RECRUITING',
            currentParticipants: 3,
            maxParticipants: 6,
            tags: ['AA制', '拍照', '美食']
        },
        {
            id: 'a3',
            title: '奥森公园5km慢跑+拉伸',
            description: '不仅是跑步，更是为了呼吸新鲜空气。配速600，不卷。跑完会在草地上带大家做15分钟拉伸。',
            category: 'SPORTS',
            imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '奥林匹克森林公园南门',
            district: '朝阳区',
            date: '今晚 19:30',
            price: 0,
            organizer: { id: 'u4', name: '夜跑达人', avatarUrl: 'https://picsum.photos/50/50?random=6', intro: '自律即自由' },
            status: 'FULL',
            currentParticipants: 10,
            maxParticipants: 10,
            tags: ['免费', '健康', '夜跑']
        },
        {
            id: 'a4',
            title: '环球影城一日游搭子',
            description: '主要想刷霸天虎过山车，有没有一起的？最好有优速通。我性格随和，会拍照。',
            category: 'ENTERTAINMENT',
            imageUrl: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '北京环球度假区',
            district: '通州区',
            date: '下周五 全天',
            price: 0,
            organizer: { id: 'u5', name: '魔法师', avatarUrl: 'https://picsum.photos/50/50?random=8', intro: '霍格沃茨在读研究生' },
            status: 'RECRUITING',
            currentParticipants: 1,
            maxParticipants: 3,
            tags: ['哈利波特', '过山车']
        },
        {
            id: 'a5',
            title: '周末咖啡馆读书会',
            description: '寻找喜欢阅读的小伙伴，每周六下午在咖啡馆一起读书、分享心得。不限制书籍类型，重点是享受阅读时光。',
            category: 'READING',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '五道口雕刻时光咖啡馆',
            district: '海淀区',
            date: '每周六 14:00',
            price: 50,
            organizer: {
                id: 'u1',
                name: 'ActiveExplorer',
                avatarUrl: 'https://picsum.photos/50/50?random=1',
                intro: '热爱生活，喜欢探索城市的每一个角落。周末经常出没在各大公园和咖啡馆。',
                realNameVerified: true,
                cooperationVerified: false,
                role: 'user',
                verified: false
            },
            status: 'RECRUITING',
            currentParticipants: 3,
            maxParticipants: 8,
            tags: ['收费', '阅读', '社交']
        },
        // 新增活动数据
        {
            id: 'a6',
            title: '香山公园徒步登山',
            description: '周末一起去香山爬山，欣赏秋日红叶。路线为经典香山环线，适合初级徒步爱好者。',
            category: 'OUTDOORS',
            imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '香山公园东门',
            district: '海淀区',
            date: '本周日 09:00',
            price: 0,
            organizer: { id: 'u6', name: '登山爱好者', avatarUrl: 'https://picsum.photos/50/50?random=10', intro: '热爱大自然，每周都会去爬山' },
            status: 'RECRUITING',
            currentParticipants: 5,
            maxParticipants: 15,
            tags: ['徒步', '登山', '自然']
        },
        {
            id: 'a7',
            title: '坝上草原骑马体验',
            description: '周末坝上草原两日游，体验骑马、篝火晚会、星空露营。适合想要逃离城市喧嚣的朋友。',
            category: 'OUTDOORS',
            imageUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '丰宁坝上草原',
            district: '河北省',
            date: '下周末 两天一夜',
            price: 680,
            organizer: { id: 'p5', name: '草原向导', avatarUrl: 'https://picsum.photos/50/50?random=11', intro: '本地牧民，熟悉草原路线' },
            status: 'RECRUITING',
            currentParticipants: 3,
            maxParticipants: 8,
            tags: ['骑马', '露营', '草原']
        },
        {
            id: 'a8',
            title: '北海公园划船赏荷',
            description: '夏日荷花盛开，一起在北海公园划船，欣赏湖光山色，拍照留念。',
            category: 'OUTDOORS',
            imageUrl: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '北海公园游船码头',
            district: '西城区',
            date: '本周六 15:00',
            price: 40,
            organizer: { id: 'u7', name: '划船达人', avatarUrl: 'https://picsum.photos/50/50?random=12', intro: '喜欢水上运动，擅长划船' },
            status: 'RECRUITING',
            currentParticipants: 2,
            maxParticipants: 6,
            tags: ['划船', '荷花', '摄影']
        },
        {
            id: 'a9',
            title: '国家博物馆文物展参观',
            description: '参观国家博物馆最新特展「中国古代青铜器」，有专业讲解员带领，深入了解历史文化。',
            category: 'CULTURE',
            imageUrl: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '国家博物馆',
            district: '东城区',
            date: '本周六 10:00',
            price: 60,
            organizer: { id: 'u8', name: '历史爱好者', avatarUrl: 'https://picsum.photos/50/50?random=13', intro: '博物馆常客，对历史文物有深入研究' },
            status: 'RECRUITING',
            currentParticipants: 4,
            maxParticipants: 10,
            tags: ['博物馆', '文物', '历史']
        },
        {
            id: 'a10',
            title: '798艺术区画廊巡游',
            description: '一起探索798艺术区的当代艺术画廊，打卡网红展览，交流艺术观点。',
            category: 'CULTURE',
            imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '798艺术区',
            district: '朝阳区',
            date: '本周日 14:00',
            price: 0,
            organizer: { id: 'u9', name: '艺术策展人', avatarUrl: 'https://picsum.photos/50/50?random=14', intro: '艺术行业从业者，熟悉各大画廊' },
            status: 'RECRUITING',
            currentParticipants: 6,
            maxParticipants: 12,
            tags: ['艺术', '画廊', '展览']
        },
        {
            id: 'a11',
            title: '故宫深度游览讲解',
            description: '由资深导游带领，深度游览故宫，了解宫廷历史、建筑艺术和文物故事。',
            category: 'CULTURE',
            imageUrl: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '故宫博物院午门',
            district: '东城区',
            date: '下周六 09:30',
            price: 120,
            organizer: { id: 'p6', name: '故宫讲解员', avatarUrl: 'https://picsum.photos/50/50?random=15', intro: '专业导游，五年故宫讲解经验' },
            status: 'RECRUITING',
            currentParticipants: 8,
            maxParticipants: 15,
            tags: ['故宫', '历史', '讲解']
        },
        {
            id: 'a12',
            title: '桌游之夜：狼人杀局',
            description: '周末桌游局，主打狼人杀，也有其他桌游可选。新手老手都欢迎，有主持人带玩。',
            category: 'GAMING',
            imageUrl: 'https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '望京桌游吧',
            district: '朝阳区',
            date: '本周五 19:00',
            price: 50,
            organizer: { id: 'p4', name: '剧本杀DM', avatarUrl: 'https://picsum.photos/50/50?random=23', intro: '缺1人，硬核本，速来！' },
            status: 'RECRUITING',
            currentParticipants: 7,
            maxParticipants: 12,
            tags: ['桌游', '狼人杀', '社交']
        },
        {
            id: 'a13',
            title: '电竞观赛：英雄联盟决赛',
            description: '一起在电竞酒吧观看英雄联盟全球总决赛，为喜欢的战队加油，氛围热烈。',
            category: 'GAMING',
            imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '五道口电竞主题酒吧',
            district: '海淀区',
            date: '本周六 20:00',
            price: 80,
            organizer: { id: 'u10', name: '电竞迷', avatarUrl: 'https://picsum.photos/50/50?random=16', intro: '资深电竞爱好者，喜欢观看各类比赛' },
            status: 'RECRUITING',
            currentParticipants: 9,
            maxParticipants: 20,
            tags: ['电竞', '观赛', '英雄联盟']
        },
        {
            id: 'a14',
            title: 'Switch游戏派对',
            description: '提供多台Switch游戏机，可玩马里奥赛车、舞力全开、任天堂明星大乱斗等游戏。',
            category: 'GAMING',
            imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '三里屯游戏体验馆',
            district: '朝阳区',
            date: '本周日 15:00',
            price: 60,
            organizer: { id: 'u11', name: '游戏主机收藏家', avatarUrl: 'https://picsum.photos/50/50?random=17', intro: '拥有各种游戏主机，喜欢组织游戏派对' },
            status: 'RECRUITING',
            currentParticipants: 4,
            maxParticipants: 8,
            tags: ['Switch', '游戏派对', '马里奥']
        },
        {
            id: 'a15',
            title: 'IMAX影院《流浪地球3》观影',
            description: '一起观看科幻大片《流浪地球3》IMAX版，观影后可以一起讨论剧情和特效。',
            category: 'MOVIE',
            imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '朝阳大悦城金逸影城',
            district: '朝阳区',
            date: '本周六 19:30',
            price: 65,
            organizer: { id: 'u12', name: '科幻电影迷', avatarUrl: 'https://picsum.photos/50/50?random=18', intro: '热爱科幻电影，尤其是国产科幻' },
            status: 'RECRUITING',
            currentParticipants: 5,
            maxParticipants: 10,
            tags: ['IMAX', '科幻', '电影']
        },
        {
            id: 'a16',
            title: '经典老电影放映会',
            description: '在私人影院放映《罗马假日》、《卡萨布兰卡》等经典老电影，配红酒和小食。',
            category: 'MOVIE',
            imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '三里屯私人影院',
            district: '朝阳区',
            date: '本周五 20:00',
            price: 100,
            organizer: { id: 'u13', name: '电影收藏家', avatarUrl: 'https://picsum.photos/50/50?random=19', intro: '收藏了大量经典电影蓝光碟' },
            status: 'RECRUITING',
            currentParticipants: 3,
            maxParticipants: 8,
            tags: ['经典电影', '私人影院', '文艺']
        },
        {
            id: 'a17',
            title: '恐怖片之夜',
            description: '胆子大的朋友一起来看恐怖片！备有毛毯和零食，保证刺激又安全。',
            category: 'MOVIE',
            imageUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '朋友家的家庭影院',
            district: '海淀区',
            date: '本周六 22:00',
            price: 0,
            organizer: { id: 'u14', name: '恐怖片爱好者', avatarUrl: 'https://picsum.photos/50/50?random=20', intro: '阅片无数，尤其喜欢恐怖悬疑片' },
            status: 'RECRUITING',
            currentParticipants: 4,
            maxParticipants: 6,
            tags: ['恐怖片', '惊悚', '夜场']
        },
        {
            id: 'a18',
            title: 'Livehouse独立音乐现场',
            description: '去MAO Livehouse观看独立乐队演出，感受现场音乐的魅力。',
            category: 'MUSIC',
            imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: 'MAO Livehouse',
            district: '东城区',
            date: '本周六 20:30',
            price: 120,
            organizer: { id: 'u15', name: '音乐现场常客', avatarUrl: 'https://picsum.photos/50/50?random=21', intro: '每周都会去各种音乐现场' },
            status: 'RECRUITING',
            currentParticipants: 6,
            maxParticipants: 10,
            tags: ['Livehouse', '独立音乐', '现场']
        },
        {
            id: 'a19',
            title: 'KTV欢唱三小时',
            description: '周末放松一下，去KTV欢唱三小时，可以点各种风格的歌曲，有自助餐和饮料。',
            category: 'MUSIC',
            imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '钱柜KTV国贸店',
            district: '朝阳区',
            date: '本周六 14:00',
            price: 70,
            organizer: { id: 'u16', name: '麦霸', avatarUrl: 'https://picsum.photos/50/50?random=22', intro: 'KTV常客，擅长各种歌曲' },
            status: 'RECRUITING',
            currentParticipants: 5,
            maxParticipants: 8,
            tags: ['KTV', '唱歌', '娱乐']
        },
        {
            id: 'a20',
            title: '古典音乐会欣赏',
            description: '在国家大剧院欣赏古典音乐会，曲目包括贝多芬、莫扎特等大师作品。',
            category: 'MUSIC',
            imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '国家大剧院音乐厅',
            district: '西城区',
            date: '下周六 19:30',
            price: 280,
            organizer: { id: 'u17', name: '古典乐迷', avatarUrl: 'https://picsum.photos/50/50?random=23', intro: '资深古典音乐爱好者，熟悉各大乐团' },
            status: 'RECRUITING',
            currentParticipants: 3,
            maxParticipants: 6,
            tags: ['古典音乐', '音乐会', '高雅']
        },
        {
            id: 'a21',
            title: '羽毛球双打局',
            description: '周末羽毛球活动，主要打双打，有场地和球提供，适合各个水平的玩家。',
            category: 'SPORTS',
            imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '工人体育馆羽毛球馆',
            district: '朝阳区',
            date: '本周日 16:00',
            price: 40,
            organizer: { id: 'u18', name: '羽毛球爱好者', avatarUrl: 'https://picsum.photos/50/50?random=24', intro: '每周都会打羽毛球，技术中等' },
            status: 'RECRUITING',
            currentParticipants: 6,
            maxParticipants: 12,
            tags: ['羽毛球', '双打', '运动']
        },
        {
            id: 'a22',
            title: '游泳健身局',
            description: '一起去游泳馆游泳，锻炼身体，放松心情。提供基础游泳指导。',
            category: 'SPORTS',
            imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '水立方游泳馆',
            district: '朝阳区',
            date: '本周六 10:00',
            price: 60,
            organizer: { id: 'u19', name: '游泳教练', avatarUrl: 'https://picsum.photos/50/50?random=25', intro: '专业游泳教练，擅长教初学者' },
            status: 'RECRUITING',
            currentParticipants: 4,
            maxParticipants: 8,
            tags: ['游泳', '健身', '教学']
        },
        {
            id: 'a23',
            title: '火锅聚餐局',
            description: '冬天就是要吃火锅！去海底捞享受美味的火锅，聊聊天，认识新朋友。',
            category: 'DINING',
            imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '海底捞火锅王府井店',
            district: '东城区',
            date: '本周五 18:30',
            price: 0,
            organizer: { id: 'u20', name: '火锅爱好者', avatarUrl: 'https://picsum.photos/50/50?random=26', intro: '无火锅不欢，每周必吃一次' },
            status: 'RECRUITING',
            currentParticipants: 4,
            maxParticipants: 8,
            tags: ['火锅', '聚餐', 'AA制']
        },
        {
            id: 'a24',
            title: '日式居酒屋小酌',
            description: '下班后去居酒屋放松一下，品尝日式烤串、刺身和清酒，聊聊工作和生活。',
            category: 'DINING',
            imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '三里屯居酒屋',
            district: '朝阳区',
            date: '本周四 19:00',
            price: 0,
            organizer: { id: 'u21', name: '日料达人', avatarUrl: 'https://picsum.photos/50/50?random=27', intro: '熟悉各种日料，喜欢居酒屋氛围' },
            status: 'RECRUITING',
            currentParticipants: 3,
            maxParticipants: 6,
            tags: ['居酒屋', '日料', '小酌']
        },
        {
            id: 'a25',
            title: '密室逃脱挑战',
            description: '挑战最新的恐怖主题密室逃脱，团队合作解谜，考验智力和勇气。',
            category: 'ENTERTAINMENT',
            imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '朝阳区密室逃脱馆',
            district: '朝阳区',
            date: '本周六 15:00',
            price: 120,
            organizer: { id: 'p4', name: '剧本杀DM', avatarUrl: 'https://picsum.photos/50/50?random=23', intro: '缺1人，硬核本，速来！' },
            status: 'RECRUITING',
            currentParticipants: 3,
            maxParticipants: 6,
            tags: ['密室逃脱', '解谜', '恐怖']
        }
    ],

    moments: [
        {
            id: 'mo1',
            userId: 'u1',
            content: '今天天气真好，在亮马河边发呆，有没有一起喝咖啡的？☕️ #亮马河 #咖啡',
            images: ['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 45,
            comments: 12,
            time: '10分钟前',
            location: '亮马河国际风情水岸'
        },
        {
            id: 'mo2',
            userId: 'p1',
            content: '崇礼万龙开板啦！雪质无敌！这个周末还要来冲！🎿',
            images: [
                'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1565992441121-4367c2967103?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            likes: 128,
            comments: 34,
            time: '1小时前',
            location: '万龙滑雪场'
        },
        {
            id: 'mo3',
            userId: 'u3',
            content: '发现一家宝藏Brunch，班尼迪克蛋绝绝子！',
            images: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 89,
            comments: 5,
            time: '2小时前',
            location: '三里屯'
        },
        {
            id: 'mo4',
            userId: 'u2',
            content: '飞盘局大合影！大家都太棒了！下周继续约起！🥏',
            images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 210,
            comments: 56,
            time: '昨天',
            location: '朝阳公园'
        },
        {
            id: 'mo5',
            userId: 'p4',
            content: '新的剧本到了，《古木吟》，周五晚车位充足，来硬核玩家！',
            images: ['https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 12,
            comments: 8,
            time: '昨天',
            location: '望京SOHO'
        },
        {
            id: 'mo6',
            userId: 'u5',
            content: '环球影城的黄油啤酒真的太好喝了！',
            images: ['https://images.unsplash.com/photo-1618331835717-801e976710b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 67,
            comments: 2,
            time: '2天前',
            location: '北京环球度假区'
        }
    ],
    
    messages: [
        { id: 'm1', userId: 'u2', name: '飞盘小队长', avatarUrl: 'https://picsum.photos/50/50?random=2', lastMessage: '这周六记得穿运动鞋哦！', time: '10:30', unread: 2, timestamp: 700 },
        { id: 'm2', userId: 'u3', name: 'FoodieJane', avatarUrl: 'https://picsum.photos/50/50?random=4', lastMessage: '好的，那就约11点在餐厅门口见。', time: '昨天', unread: 0, timestamp: 600 },
        { id: 'm3', userId: 'p4', name: '剧本杀DM', avatarUrl: 'https://picsum.photos/50/50?random=23', lastMessage: '我们这边还差一个人，你要来吗？', time: '星期一', unread: 0, timestamp: 300 },
        { id: 'm4', userId: 'p1', name: '滑雪大冒险', avatarUrl: 'https://picsum.photos/50/50?random=20', lastMessage: '崇礼滑雪周末团，你有兴趣吗？我这边已经有3个人了。', time: '刚刚', unread: 5, timestamp: 900 },
        { id: 'm5', userId: 'u4', name: '夜跑达人', avatarUrl: 'https://picsum.photos/50/50?random=6', lastMessage: '今晚跑步改成7点，因为天气有点热。', time: '10:20', unread: 1, timestamp: 800 },
        { id: 'm6', userId: 'u5', name: '魔法师', avatarUrl: 'https://picsum.photos/50/50?random=8', lastMessage: '环球影城的哈利波特园区太棒了，下次一起吧！', time: '昨天', unread: 0, timestamp: 500 },
        { id: 'm7', userId: 'p2', name: 'CoffeeJane', avatarUrl: 'https://picsum.photos/50/50?random=21', lastMessage: '发现了一家新的手冲咖啡馆，豆子很特别。', time: '星期三', unread: 0, timestamp: 400 },
        { id: 'm8', userId: 'p3', name: '健身狂魔', avatarUrl: 'https://picsum.photos/50/50?random=22', lastMessage: '早上6点健身房，别忘了带水壶。', time: '2026/2/18', unread: 0, timestamp: 200 },
        { id: 'm9', userId: 'system', name: '搭子小助手', avatarUrl: 'https://picsum.photos/50/50?random=99', lastMessage: '欢迎使用私信功能，有任何问题可以随时咨询。', time: '2026/2/15', unread: 0, timestamp: 100 }
    ],
    
    notifications: [
        { id: 'n5', title: '评论点赞通知', content: '用户滑雪大冒险点赞了你的评论“这家咖啡确实不错！”', time: '10分钟前', type: 'comment_like', momentId: 'mo1' },
        { id: 'n6', title: '评论回复通知', content: '用户CoffeeJane回复了你的评论“下次一起去呀！”', time: '15分钟前', type: 'comment_reply', momentId: 'mo2' },
        { id: 'n7', title: '关注通知', content: '用户夜跑达人关注了你', time: '20分钟前', type: 'follow', userId: 'u4' },
        { id: 'n8', title: '评论通知', content: '用户FoodieJane评论了你的动态“今天天气真好，在亮马河边发呆”', time: '25分钟前', type: 'comment', momentId: 'mo1' },
        { id: 'n9', title: '评论点赞通知', content: '用户飞盘小队长点赞了你的评论“拍得真好看！”', time: '30分钟前', type: 'comment_like', momentId: 'mo4' },
        { id: 'n10', title: '评论回复通知', content: '用户剧本杀DM回复了你的评论“这个本子推理难度如何？”', time: '35分钟前', type: 'comment_reply', momentId: 'mo5' },
        { id: 'n11', title: '关注通知', content: '用户健身狂魔关注了你', time: '40分钟前', type: 'follow', userId: 'p3' },
        { id: 'n12', title: '评论通知', content: '用户魔法师评论了你的动态“环球影城的黄油啤酒真的太好喝了！”', time: '45分钟前', type: 'comment', momentId: 'mo6' },
        { id: 'n3', title: '点赞通知', content: '用户滑雪大冒险点赞了你的动态“今天天气真好，一起去爬山吧！”', time: '1小时前', type: 'like', momentId: 'mo1' },
        { id: 'n1', title: '活动报名成功', content: '您已成功报名“朝阳公园飞盘新手局”，请准时参加。', time: '2小时前', type: 'success' },
        { id: 'n4', title: '点赞通知', content: '用户CoffeeJane点赞了你的动态“发现一家超好吃的火锅店”', time: '2小时前', type: 'like', momentId: 'mo2' },
        { id: 'n2', title: '系统消息', content: '欢迎加入搭子计划！完善个人资料可以让更多人认识你。', time: '3天前', type: 'info' }
    ],

    pointsRecords: [
        { id: 'pr1', type: 'daily_login', description: '每日登录', points: 10, time: '今天 08:30' },
        { id: 'pr2', type: 'activity_participation', description: '参与活动', points: 50, time: '昨天 15:20' },
        { id: 'pr3', type: 'content_publish', description: '发布动态', points: 20, time: '前天 11:45' },
        { id: 'pr4', type: 'comment_interaction', description: '评论互动', points: 5, time: '2026/2/19 09:30' },
        { id: 'pr5', type: 'complete_profile', description: '完善资料', points: 100, time: '2026/2/18 14:15' },
        { id: 'pr6', type: 'invite_friend', description: '邀请好友', points: 200, time: '2026/2/17 16:40' },
        { id: 'pr7', type: 'activity_organize', description: '组织活动', points: 150, time: '2026/2/16 20:10' }
    ],

    walletRecords: [
        { id: 'wr1', type: 'income', description: '朝阳公园飞盘新手局报名收费', amount: 195.00, time: '今天 10:15', status: 'completed' },
        { id: 'wr2', type: 'income', description: '三里屯Bistro早午餐报名收费', amount: 240.00, time: '昨天 14:30', status: 'completed' },
        { id: 'wr3', type: 'withdraw', description: '提现', amount: -200.00, time: '前天 16:45', status: 'completed' },
        { id: 'wr4', type: 'income', description: '奥森公园慢跑活动报名收费', amount: 120.00, time: '2026/2/19 11:20', status: 'completed' },
        { id: 'wr5', type: 'withdraw', description: '提现', amount: -150.00, time: '2026/2/18 09:10', status: 'completed' },
        { id: 'wr6', type: 'income', description: '环球影城一日游报名收费', amount: 320.00, time: '2026/2/17 19:35', status: 'completed' }
    ],

    users: [
        { id: 'u1', name: 'ActiveExplorer', avatarUrl: 'https://picsum.photos/100/100', intro: '热爱生活，喜欢探索城市的每一个角落。周末经常出没在各大公园和咖啡馆。' },
        { id: 'u2', name: '滑雪大冒险', avatarUrl: 'https://picsum.photos/100/100?random=20', intro: '崇礼周末往返，缺人拼车！' },
        { id: 'u3', name: 'CoffeeJane', avatarUrl: 'https://picsum.photos/100/100?random=21', intro: '寻找三里屯附近的咖啡搭子。' },
        { id: 'u4', name: '健身狂魔', avatarUrl: 'https://picsum.photos/100/100?random=22', intro: '每天早上6点健身房见。' },
        { id: 'u5', name: '剧本杀DM', avatarUrl: 'https://picsum.photos/100/100?random=23', intro: '缺1人，硬核本，速来！' },
        { id: 'u6', name: '夜跑达人', avatarUrl: 'https://picsum.photos/100/100?random=24', intro: '每晚8点奥森公园夜跑，约吗？' },
        { id: 'u7', name: '魔法师', avatarUrl: 'https://picsum.photos/100/100?random=25', intro: '哈利波特主题酒吧常客。' }
    ],

    orders: [
        { id: 'o1', activityId: 'a1', activityTitle: '朝阳公园飞盘新手局', amount: 39.00, status: 'paid', time: '今天 10:15', participants: 1, userId: 'u1' },
        { id: 'o2', activityId: 'a2', activityTitle: '三里屯Bistro早午餐', amount: 0.00, status: 'paid', time: '昨天 14:30', participants: 1, userId: 'u2' },
        { id: 'o3', activityId: 'a4', activityTitle: '环球影城一日游搭子', amount: 0.00, status: 'cancelled', time: '前天 16:20', participants: 1, userId: 'u3' },
        { id: 'o4', activityId: 'a1', activityTitle: '朝阳公园飞盘新手局', amount: 39.00, status: 'refunded', time: '2026/2/19 09:45', participants: 2, userId: 'u4' },
        { id: 'o5', activityId: 'a3', activityTitle: '奥森公园5km慢跑+拉伸', amount: 0.00, status: 'paid', time: '2026/2/18 20:10', participants: 1, userId: 'u5' },
        { id: 'o6', activityId: 'a5', activityTitle: '周末咖啡馆读书会', amount: 50.00, status: 'paid', time: '今天 09:30', participants: 1, userId: 'u2' },
        { id: 'o7', activityId: 'a5', activityTitle: '周末咖啡馆读书会', amount: 50.00, status: 'paid', time: '昨天 15:20', participants: 1, userId: 'u3' },
        { id: 'o8', activityId: 'a5', activityTitle: '周末咖啡馆读书会', amount: 50.00, status: 'paid', time: '前天 11:45', participants: 1, userId: 'u4' }
    ],

    levelRules: [
        { level: 1, minPoints: 0, maxPoints: 500, privileges: ['浏览所有活动', '报名免费活动', '每日登录奖励+10积分'] },
        { level: 2, minPoints: 501, maxPoints: 1000, privileges: ['报名收费活动', '发布动态', '评论互动+5积分', '活动参与+50积分'] },
        { level: 3, minPoints: 1001, maxPoints: 2000, privileges: ['创建免费活动', '活动组织+150积分', '完善资料+100积分', '邀请好友+200积分'] },
        { level: 4, minPoints: 2001, maxPoints: 3000, privileges: ['优先报名热门活动', '专属等级标识', '提现额度提升至1000元/笔'] },
        { level: 5, minPoints: 3001, maxPoints: 4000, privileges: ['创建收费活动', '活动推广特权', '平台手续费9折'] },
        { level: 6, minPoints: 4001, maxPoints: 5000, privileges: ['专属客服', '活动置顶特权', '平台手续费8折'] },
        { level: 7, minPoints: 5001, maxPoints: 6000, privileges: ['高级认证标识', '定制活动功能', '平台手续费7折'] },
        { level: 8, minPoints: 6001, maxPoints: 7000, privileges: ['平台合伙人资格', '收入分成优惠', '专属活动推荐位'] },
        { level: 9, minPoints: 7001, maxPoints: 8000, privileges: ['至尊等级标识', '全平台尊享特权', '平台年度大会邀请'] },
        { level: 10, minPoints: 8001, maxPoints: 999999, privileges: ['搭子计划终身荣誉会员', '所有特权最大化', '平台战略合作伙伴资格'] }
    ]
};

// 从sessionStorage恢复用户认证状态（确保页面刷新后状态保持）
if (sessionStorage.getItem('user_realNameVerified') === 'true') {
    window.GlobalData.user.realNameVerified = true;
}
if (sessionStorage.getItem('user_cooperationVerified') === 'true') {
    window.GlobalData.user.cooperationVerified = true;
    window.GlobalData.user.verified = true; // 兼容旧字段
}
if (sessionStorage.getItem('user_verified') === 'true') {
    window.GlobalData.user.verified = true;
}