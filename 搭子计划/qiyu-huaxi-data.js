// ==================== 奇遇华熙（华熙LIVE·五棵松）专题 数据 ====================
// 人格测试题与结果复用饺子题库（与天之"饺"子完全一致）。
// 题库内嵌在本文件顶部（由 dumpling-quiz-sync.cjs 从 dumpling-quiz-data.json 同步，勿手改），
// 页面不依赖 dumpling-quiz-data.js / dumpling-data.js，部署漏传时本页与测试详情页仍可用；
// 优惠券不走直接领取：先经奇遇大转盘抽"运气"，抽中哪种运气解锁对应券。
/* QUIZ_INLINE_BEGIN */
var QIYU_QUIZ = {
    "version": 1,
    "personalities": [
        {
            "id": "squid",
            "title": "鱿鱼馅·海王饺",
            "emoji": "🦑",
            "color": "from-brand-orange to-brand-yellow",
            "tags": [
                "海鲜控",
                "气氛担当",
                "声东击西"
            ],
            "quote": "不是海王，只是擅长在周末游回舒适区",
            "method": "适合声东击西式偷吃",
            "description": "你偷吃靠的不是手速，是节奏。先用话题把全场注意力带走，筷子再悄悄出手，等大家反应过来，你已经优雅地蘸完醋了。"
        },
        {
            "id": "tomatoegg",
            "title": "西红柿鸡蛋·甜丧饺",
            "emoji": "🍅",
            "color": "from-brand-pink to-brand-red",
            "tags": [
                "甜丧",
                "装乖选手",
                "突然袭击"
            ],
            "quote": "看着喜庆，其实内心酸甜交加",
            "method": "适合装乖后突然下手",
            "description": "你看起来人畜无害，其实是偷吃届的影帝。等所有人放松警惕的那一秒突然出手，酸甜都是你的武器。"
        },
        {
            "id": "cucumber",
            "title": "青瓜虾仁·脆皮饺",
            "emoji": "🥒",
            "color": "from-brand-teal to-brand-green",
            "tags": [
                "清爽",
                "工具鬼才",
                "出其不意"
            ],
            "quote": "表面清爽，咬开全是脆生生的",
            "method": "适合用离谱工具作案",
            "description": "筷子？太普通。你偷吃讲究一个创意，汤勺、公筷、吸管都能成为作案工具，越是离谱越是你的主场。"
        },
        {
            "id": "beef",
            "title": "香辣牛肉·暴躁饺",
            "emoji": "🌶️",
            "color": "from-brand-red to-brand-orange",
            "tags": [
                "重口味",
                "正面刚",
                "行动派"
            ],
            "quote": "工作日燃的火，周末用辣锅贴发出去",
            "method": "适合正面硬\"偷\"",
            "description": "偷吃还要藏？不存在的。你看中的饺子就光明正大地夹，被发现了还要问一句\"你要抢吗\"。"
        },
        {
            "id": "pork",
            "title": "猪肉白菜·老实饺",
            "emoji": "🐷",
            "color": "from-brand-blue to-brand-teal",
            "tags": [
                "低调",
                "稳定输出",
                "隐形吃货"
            ],
            "quote": "最不起眼，但每桌都得有一盘",
            "method": "适合低调连续\"作案\"",
            "description": "你是饭桌上的隐形人，但筷子从没停过。不声不响间三盘下肚，最后大家还觉得你没怎么吃。"
        },
        {
            "id": "chive",
            "title": "韭菜鸡蛋·社交悍匪饺",
            "emoji": "🥬",
            "color": "from-brand-green to-brand-yellow",
            "tags": [
                "社交悍匪",
                "组局王者",
                "同伙掩护"
            ],
            "quote": "味儿大，但局上没我不行",
            "method": "适合同伙掩护式偷吃",
            "description": "你偷吃从来不是单打独斗，同桌都是你的掩护。一个眼神过去，同伙就把整盘递到你手边。"
        },
        {
            "id": "suancai",
            "title": "酸菜油渣·东北在逃饺",
            "emoji": "🥟",
            "color": "from-brand-yellow to-brand-orange",
            "tags": [
                "东北在逃",
                "唠嗑达人",
                "热闹气氛"
            ],
            "quote": "一开口就是大茬子味，一出门就想整点热闹的",
            "method": "适合边唠边偷吃",
            "description": "你的偷吃是场单口相声，边讲段子边下筷子，大家笑得前仰后合，没人注意到盘子已经见底。"
        },
        {
            "id": "sanxian",
            "title": "三鲜·什么都沾点饺",
            "emoji": "🦐",
            "color": "from-brand-purple to-brand-pink",
            "tags": [
                "选择困难",
                "全能型",
                "雨露均沾"
            ],
            "quote": "选择困难，所以什么馅都来一点",
            "method": "什么工具都能用，建议保送",
            "description": "别问你最喜欢哪种馅，你的人生格言是\"都尝尝\"。什么工具都顺手，什么馅都沾一点，偷吃届的六边形战士。"
        }
    ],
    "questions": [
        {
            "text": "饺子刚上桌，全场目光聚焦，你的第一反应是？",
            "options": [
                {
                    "text": "猛夸\"这饺子捏得真好看\"，趁大家拍照已经夹走俩",
                    "scores": {
                        "squid": 1
                    }
                },
                {
                    "text": "低头假装回消息，筷子却精准伸向最远那盘",
                    "scores": {
                        "pork": 1
                    }
                },
                {
                    "text": "起身给大家分饺子，路过自己面前多留两个",
                    "scores": {
                        "chive": 1
                    }
                },
                {
                    "text": "目标明确：第一个夹走最大的那颗",
                    "scores": {
                        "beef": 1
                    }
                }
            ]
        },
        {
            "text": "偷吃被当场抓包，你会怎么解释？",
            "options": [
                {
                    "text": "\"我帮大家试试烫不烫，这是牺牲精神\"",
                    "scores": {
                        "tomatoegg": 1
                    }
                },
                {
                    "text": "\"这盘怎么少了一个？端上来就这样啊\"",
                    "scores": {
                        "squid": 1
                    }
                },
                {
                    "text": "\"对，我吃了，下一盘先给你夹\"",
                    "scores": {
                        "beef": 1
                    }
                },
                {
                    "text": "\"嗐，我刚跟这饺子唠嗑呢，它说想被吃掉\"",
                    "scores": {
                        "suancai": 1
                    }
                }
            ]
        },
        {
            "text": "偷吃饺子，你最顺手的\"作案工具\"是？",
            "options": [
                {
                    "text": "一双筷子走天下，稳准狠不露声色",
                    "scores": {
                        "pork": 1
                    }
                },
                {
                    "text": "汤勺漏勺小盘子，抓到什么用什么",
                    "scores": {
                        "sanxian": 1
                    }
                },
                {
                    "text": "公筷假装给别人夹，半路拐弯进自己碗",
                    "scores": {
                        "cucumber": 1
                    }
                },
                {
                    "text": "徒手，江湖儿女不讲那些虚的",
                    "scores": {
                        "suancai": 1
                    }
                }
            ]
        },
        {
            "text": "人多的饭局上，你最喜欢的出手时机是？",
            "options": [
                {
                    "text": "大家聊得正嗨、没人看盘子的时候",
                    "scores": {
                        "pork": 1
                    }
                },
                {
                    "text": "全场突然安静的那一秒，出其不意",
                    "scores": {
                        "tomatoegg": 1
                    }
                },
                {
                    "text": "自己正说到高潮、全场盯着你的时候，手在桌下操作",
                    "scores": {
                        "suancai": 1
                    }
                },
                {
                    "text": "上菜服务员转身离开的瞬间",
                    "scores": {
                        "cucumber": 1
                    }
                }
            ]
        },
        {
            "text": "一桌子饺子，你最先盯上的是哪盘？",
            "options": [
                {
                    "text": "每样都来一个，雨露均沾",
                    "scores": {
                        "sanxian": 1
                    }
                },
                {
                    "text": "韭菜馅的，味儿冲才是真香",
                    "scores": {
                        "chive": 1
                    }
                },
                {
                    "text": "猪肉白菜，最不起眼但最踏实",
                    "scores": {
                        "pork": 1
                    }
                },
                {
                    "text": "先观察哪盘蘸料最特别，再下手",
                    "scores": {
                        "cucumber": 1
                    }
                }
            ]
        },
        {
            "text": "被问\"你是不是偷吃饺子了\"，你的表情管理是？",
            "options": [
                {
                    "text": "眼睛瞪圆一脸无辜：\"没有啊，我吃的是空气\"",
                    "scores": {
                        "tomatoegg": 1
                    }
                },
                {
                    "text": "嘴还鼓着，疯狂用眼神向同桌求救",
                    "scores": {
                        "chive": 1
                    }
                },
                {
                    "text": "面不改色：\"我是在试毒，为大家的安全负责\"",
                    "scores": {
                        "squid": 1
                    }
                },
                {
                    "text": "\"吃了，怎么，你想抢吗？\"",
                    "scores": {
                        "beef": 1
                    }
                }
            ]
        },
        {
            "text": "立冬这天，你最理想的偷吃\"战果\"是？",
            "options": [
                {
                    "text": "所有馅都尝了一遍，没有遗憾",
                    "scores": {
                        "sanxian": 1
                    }
                },
                {
                    "text": "用离谱方式吃到最稀有的那颗",
                    "scores": {
                        "cucumber": 1
                    }
                },
                {
                    "text": "边唠边把一整盘悄悄端到自己手边",
                    "scores": {
                        "suancai": 1
                    }
                },
                {
                    "text": "整桌最好看的饺子都进了你的碗",
                    "scores": {
                        "squid": 1
                    }
                }
            ]
        },
        {
            "text": "偷吃被拍成小视频传群，你的反应？",
            "options": [
                {
                    "text": "\"剪得不错，配乐再骚一点就完美了\"",
                    "scores": {
                        "chive": 1
                    }
                },
                {
                    "text": "\"快删——等等，先转发给我自己欣赏\"",
                    "scores": {
                        "tomatoegg": 1
                    }
                },
                {
                    "text": "\"建议置顶，让全世界看看我会吃\"",
                    "scores": {
                        "beef": 1
                    }
                },
                {
                    "text": "\"拍得挺好，下次记得给我开个美颜\"",
                    "scores": {
                        "sanxian": 1
                    }
                }
            ]
        }
    ]
};
/* QUIZ_INLINE_END */

// 题库兜底：dumplingQuiz 缺失时补全；并保证测验引擎依赖的 GlobalData.dumpling 至少有题目/人格
if (!window.GlobalData.dumplingQuiz) {
    window.GlobalData.dumplingQuiz = QIYU_QUIZ;
}
var __dumplingBase = window.GlobalData.dumpling;
if (!__dumplingBase || !Array.isArray(__dumplingBase.questions) || !__dumplingBase.questions.length) {
    window.GlobalData.dumpling = Object.assign({}, __dumplingBase, {
        personalities: QIYU_QUIZ.personalities,
        questions: QIYU_QUIZ.questions
    });
}

window.GlobalData.qiyuHuaxi = {
    // 人格结果与测试题：直接用内嵌题库（唯一来源 dumpling-quiz-data.json）
    personalities: QIYU_QUIZ.personalities,
    questions: QIYU_QUIZ.questions,

    // 六种好运（转盘顺序）→ 各自对应一组华熙商户优惠券（同一运气多张，仅可领取一张）
    fortunes: [
        { id: 'love',   name: '桃花运', color: '#ff4d88', weight: 0.17 },
        { id: 'wealth', name: '财富运', color: '#ffb300', weight: 0.12 },
        { id: 'joy',    name: '快乐运', color: '#ff8a3d', weight: 0.18 },
        { id: 'career', name: '事业运', color: '#42a5f5', weight: 0.17 },
        { id: 'noble',  name: '贵人运', color: '#9c5cff', weight: 0.18 },
        { id: 'safe',   name: '平安运', color: '#2ecc71', weight: 0.18 }
    ],

    // 商户优惠券（mode: code 券码模式 / qr 核销二维码模式）：luckId 归属运气组，抽中该运气后展示该组
    coupons: [
        { id: 'qh1',  luckId: 'love',   shop: '华熙国际影城',        title: '奇遇双人观影券',   value: '买一送一',    short: '观影买一送一', deadline: '有效期至 12月15日', mode: 'qr', code: 'HX-CN-1201' },
        { id: 'qh2',  luckId: 'love',   shop: 'DQ（华熙店）',        title: '桃花甜蜜冰品券',   value: '第二份半价',  short: '第二份半价',   deadline: '有效期至 12月15日', mode: 'qr', code: 'DQ-1208-0618' },
        { id: 'qh3',  luckId: 'wealth', shop: '华熙LIVE会员',        title: '奇遇满减券',       value: '满200减50',  short: '满200减50',    deadline: '有效期至 12月15日', mode: 'qr',   code: 'HX-1215-0208' },
        { id: 'qh4',  luckId: 'wealth', shop: '小米之家（华熙店）',  title: '财富加码券',       value: '满500减100', short: '满500减100',   deadline: '有效期至 12月15日', mode: 'qr', code: 'XM-1210-0315' },
        { id: 'qh5',  luckId: 'wealth', shop: '宜家家居',            title: '焕新家居券',       value: '满300减60',  short: '满300减60',    deadline: '有效期至 12月15日', mode: 'qr', code: 'IKEA-60-1120' },
        { id: 'qh6',  luckId: 'joy',    shop: '茶百道（华熙店）',    title: '快乐第二杯券',     value: '第二杯半价',  short: '第二杯半价',   deadline: '有效期至 12月15日', mode: 'qr', code: 'CBD-2026-0718' },
        { id: 'qh7',  luckId: 'joy',    shop: '肯德基（华熙店）',    title: '快乐小食券',       value: '满50减10',   short: '满50减10',     deadline: '有效期至 12月15日', mode: 'qr',   code: 'KFC-1201-0917' },
        { id: 'qh8',  luckId: 'career', shop: '调色师THE COLORIST',  title: '事业变美券',       value: '满100减30',  short: '满100减30',    deadline: '有效期至 12月15日', mode: 'qr',   code: 'TCS-1203-1105' },
        { id: 'qh9',  luckId: 'career', shop: '星巴克（华熙店）',    title: '事业提神券',       value: '中杯升大杯',  short: '中杯升大杯',   deadline: '有效期至 12月15日', mode: 'qr', code: 'SB-1205-0401' },
        { id: 'qh10', luckId: 'noble',  shop: '宜家餐厅（五棵松）',  title: '贵人请客券',       value: '10元无门槛', short: '10元无门槛',   deadline: '有效期至 12月15日', mode: 'qr', code: 'IKEA-10-0921' },
        { id: 'qh11', luckId: 'noble',  shop: '华熙国际影城',        title: '贵人观影小食券',   value: '爆米花套餐',  short: '爆米花套餐',   deadline: '有效期至 12月15日', mode: 'qr', code: 'HX-PC-1128' },
        { id: 'qh12', luckId: 'safe',   shop: '玩具反斗城',          title: '平安童趣券',       value: '全场88折',   short: '全场88折',     deadline: '有效期至 12月15日', mode: 'qr', code: 'TRU-88-1130' },
        { id: 'qh13', luckId: 'safe',   shop: '名创优品（华熙店）',  title: '平安小物券',       value: '满50减15',   short: '满50减15',     deadline: '有效期至 12月15日', mode: 'qr', code: 'MC-1212-0716' }
    ],

    // 人格测试有奖分享规则（主体：奇遇华熙）
    shareRules: {
        title: '奇遇华熙有奖分享',
        period: '活动时间：2026年11月7日 00:00 - 12月15日 23:59',
        howTo: '完成人格测试后，在搭子计划发布动态并带上话题 #奇遇华熙#，即视为成功参与。',
        scoring: '互动值 = 点赞数 + 评论数 × 2 + 转发数 × 3，以活动截止时的数据为准，同一账号多条动态取互动值最高的一条。',
        awards: [
            { name: '一等奖（1名）', desc: '互动值第1名', gift: '华熙国际影城双人观影月卡 + 奇遇华熙定制周边大礼包' },
            { name: '二等奖（3名）', desc: '互动值第2-4名', gift: '华熙LIVE 100元商户消费券 + 茶百道畅饮券' },
            { name: '参与奖（10名）', desc: '互动值第5-14名', gift: '奇遇华熙限定冰箱贴 + 搭子计划贴纸包' }
        ],
        announce: '获奖名单将于12月18日在话题页公示，并通过站内私信通知领奖。',
        notes: ['动态内容需原创，且与奇遇华熙/现场打卡相关', '禁止刷量（机器点赞、恶意刷评论等），一经发现取消获奖资格', '礼品以实物为准，最终解释权归搭子计划所有']
    },

    // #奇遇华熙# 动态
    moments: [
        { id: 'qh1', name: '华熙常驻选手', avatar: 'images/avatar-3.png', text: '测完人格直奔大转盘，一把转出桃花运，双人观影券到手！ #奇遇华熙#', image: 'images/cover-6.png', likes: 132, comments: 24, time: '10分钟前' },
        { id: 'qh2', name: '晚风骑手', avatar: 'images/avatar-7.png', text: '华熙夜景太出片了，奇遇打卡第一天 #奇遇华熙#', image: 'images/cover-11.png', likes: 98, comments: 15, time: '25分钟前' },
        { id: 'qh3', name: '奶茶续命中', avatar: 'images/avatar-2.png', text: '快乐运！茶百道第二杯半价，和搭子一人一杯 #奇遇华熙#', image: 'images/cover-8.png', likes: 76, comments: 9, time: '50分钟前' },
        { id: 'qh4', name: '滑板新人', avatar: 'images/avatar-5.png', text: '华熙广场偶遇滑板局，当场加入，这就是奇遇吧 #奇遇华熙#', image: 'images/cover-20.png', likes: 158, comments: 31, time: '1小时前' },
        { id: 'qh5', name: '看展搭子', avatar: 'images/avatar-9.png', text: '新展打卡成功，转出事业运，调色师满减券已领 #奇遇华熙#', image: 'images/cover-2.png', likes: 90, comments: 12, time: '1小时前' },
        { id: 'qh6', name: '剧本杀队长', avatar: 'images/avatar-4.png', text: '今晚华熙上车，差一人的剧本杀局秒满 #奇遇华熙#', image: 'images/cover-15.png', likes: 205, comments: 44, time: '2小时前' },
        { id: 'qh7', name: '干饭第一名', avatar: 'images/avatar-11.png', text: '宜家餐厅10元无门槛，贵人运诚不欺我 #奇遇华熙#', image: 'images/cover-1.png', likes: 169, comments: 38, time: '2小时前' },
        { id: 'qh8', name: '夜骑长安街', avatar: 'images/avatar-8.png', text: '夜骑路过华熙，转盘抽中平安运，好运常伴 #奇遇华熙#', image: 'images/cover-10.png', likes: 114, comments: 19, time: '3小时前' }
    ]
};
