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
        likes: 128 // 获赞数
    },

    bannerImages: [
        "https://tingtingfm.vbegin.com.cn/upload/2026/0213/20bd5e9111a64c1aba3ac649691e4bff.png",
        "https://tingtingfm.vbegin.com.cn/upload/2026/0213/361e30f4fbb04a669befd8f6aed93639.png"
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