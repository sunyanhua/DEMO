// ==================== 天之"饺"子·立冬偷吃饺子小赛 数据 ====================
window.GlobalData.dumpling = {
    // 人格结果与测试题唯一来源：dumpling-quiz-data.json（经 dumpling-quiz-data.js 同步引入）
    // 修改测验数据请编辑 JSON 后运行: npm run quiz:sync
    personalities: window.GlobalData.dumplingQuiz.personalities,
    questions: window.GlobalData.dumplingQuiz.questions,

    // 每种人格一条推荐路线：1 家饺子店 + 时间轴 + 人均预算 + 一句推荐理由 + 详情字段
    routes: [
        { id: 'dr-squid', personalityId: 'squid', typeLabel: '海鲜偷吃专线', shop: '船歌鱼水饺（蓝色港湾店）',
          tags: ['海鲜', '亮马河', '错峰'],
          schedule: [
              { time: '17:30', item: '错峰到店，避开等位高峰' },
              { time: '17:45', item: '点单：墨鱼水饺 + 鱿鱼馅各来一份' },
              { time: '18:00', item: '开吃，先拍照后动筷' },
              { time: '18:40', item: '沿亮马河散步消食' },
              { time: '19:20', item: '蓝色港湾夜景收尾' }
          ],
          highlights: [
              { name: '船歌鱼水饺', district: '朝阳区·蓝色港湾', budget: '人均¥45', primary: true,
                blurb: '墨鱼皮黑饺子配鱿鱼馅，海味拉满，偷吃界的气氛担当。', tip: '鱿鱼馅每日限量，晚到常沽清。' },
              { name: '亮马河步道', district: '朝阳区', budget: '免费', primary: false,
                blurb: '饭后沿河遛一圈，冬夜灯光很出片。', tip: '河边风大，戴好围巾。' }
          ],
          preparation: ['提前1天电话确认鱿鱼馅当日有货', '穿方便走路的鞋，饭后步道约2km', '带充电宝，夜景拍照耗电'],
          budgetDetail: [
              { item: '墨鱼水饺（拼）', amount: '¥18' },
              { item: '鱿鱼馅水饺（拼）', amount: '¥20' },
              { item: '醋碟小菜', amount: '¥7' },
              { item: '人均合计', amount: '¥45' }
          ],
          tips: [
              { title: '交通', content: '地铁14号线枣营站A口步行5分钟。' },
              { title: '时间', content: '17:30前到基本不等位，18:30后开始排队。' },
              { title: '避坑', content: '鱿鱼馅口味偏淡，重口选手蘸料调重一点。' }
          ],
          budget: '人均 ¥45',
          reason: '海鲜馅控的本命店，声东击西式偷吃选手来了会爱上这里的水汽和热闹。' },
        { id: 'dr-tomatoegg', personalityId: 'tomatoegg', typeLabel: '甜丧探店线', shop: '金谷园饺子馆（北师大店）',
          tags: ['西红柿鸡蛋', '校园系', '性价比'],
          schedule: [
              { time: '11:30', item: '开门即到，抢窗边位置' },
              { time: '11:40', item: '点单：西红柿鸡蛋 + 猪肉白菜' },
              { time: '12:00', item: '开吃，先甜后咸' },
              { time: '13:00', item: '酸奶木瓜解腻' },
              { time: '13:40', item: '北师大校园遛弯' }
          ],
          highlights: [
              { name: '金谷园饺子馆', district: '海淀区·北师大南门', budget: '人均¥35', primary: true,
                blurb: '西红柿鸡蛋馅只有他家做得出那种"喜庆又伤感"的劲儿。', tip: '学生党多，12点前到不用排队。' },
              { name: '北师大校园', district: '海淀区', budget: '免费', primary: false,
                blurb: '饭后逛校园银杏大道，甜丧感直接拉满。', tip: '周末凭登记可入校。' }
          ],
          preparation: ['11:30前到，晚于12点等位超20分钟', '酸奶木瓜是隐藏菜单，主动问', '带学生卡可逛北师大图书馆周边'],
          budgetDetail: [
              { item: '西红柿鸡蛋水饺', amount: '¥18' },
              { item: '猪肉白菜水饺（拼）', amount: '¥15' },
              { item: '酸奶木瓜', amount: '¥12' },
              { item: '人均合计', amount: '¥35' }
          ],
          tips: [
              { title: '交通', content: '地铁10号线牡丹园站C口步行10分钟。' },
              { title: '时间', content: '避开12:00-12:30学生下课高峰。' },
              { title: '避坑', content: '番茄馅偏甜，不喜甜慎点。' }
          ],
          budget: '人均 ¥35',
          reason: '酸甜交加的西红柿鸡蛋馅，只有他家做得出那种"喜庆又伤感"的劲儿。' },
        { id: 'dr-cucumber', personalityId: 'cucumber', typeLabel: '脆皮猎奇线', shop: '馅老满·宫廷饺子（鼓楼店）',
          tags: ['虾仁', '鼓楼', '猎奇'],
          schedule: [
              { time: '18:30', item: '到店，先取号' },
              { time: '18:40', item: '点单：招牌虾仁 + 开花饺子' },
              { time: '19:00', item: '开吃，先脆后鲜' },
              { time: '19:45', item: '鼓楼胡同夜逛' },
              { time: '20:30', item: '南锣北口收尾' }
          ],
          highlights: [
              { name: '馅老满·宫廷饺子', district: '东城区·鼓楼东大街', budget: '人均¥55', primary: true,
                blurb: '宫廷风排场，虾仁馅脆生生一口爆汁，配得上你的工具鬼才。', tip: '开花饺子每日限量30份。' },
              { name: '鼓楼东大街', district: '东城区', budget: '免费', primary: false,
                blurb: '老北京胡同夜景，饭后消食动线顺。', tip: '21点后店铺陆续打烊。' }
          ],
          preparation: ['提前1小时取号（过号作废）', '穿厚点，胡同夜风硬', '手机充满电，夜景出片'],
          budgetDetail: [
              { item: '招牌虾仁水饺（拼）', amount: '¥26' },
              { item: '开花饺子（拼）', amount: '¥22' },
              { item: '菊花茶', amount: '¥7' },
              { item: '人均合计', amount: '¥55' }
          ],
          tips: [
              { title: '交通', content: '地铁8号线什刹海站A口步行8分钟。' },
              { title: '时间', content: '开花饺子18:30开售，先到先得。' },
              { title: '避坑', content: '周末是热门店，必须提前取号。' }
          ],
          budget: '人均 ¥55',
          reason: '虾仁馅脆生生一口爆汁，店里的老北京排场配得上你的工具鬼才。' },
        { id: 'dr-beef', personalityId: 'beef', typeLabel: '暴躁硬吃线', shop: '满姐饺子（工体店）',
          tags: ['香辣', '锅贴', '工体'],
          schedule: [
              { time: '19:00', item: '到店直奔香辣牛肉锅贴' },
              { time: '19:10', item: '加辣加醋，正面开造' },
              { time: '19:40', item: '酸汤水饺解辣' },
              { time: '20:20', item: '工体西路散步消辣' },
              { time: '21:00', item: '三里屯夜景收尾' }
          ],
          highlights: [
              { name: '满姐饺子', district: '朝阳区·工体西路', budget: '人均¥42', primary: true,
                blurb: '锅贴界的暴躁担当，皮脆汁足，热辣滚烫。', tip: '香辣牛肉锅贴每日限量。' },
              { name: '工体西路', district: '朝阳区', budget: '免费', primary: false,
                blurb: '夜跑人群和酒吧街混搭，散步消辣正合适。', tip: '周末夜间人流大。' }
          ],
          preparation: ['能吃辣的直接点重辣，别怂', '带瓶矿泉水，辣度超预期', '工体有球赛时提前1小时到'],
          budgetDetail: [
              { item: '香辣牛肉锅贴', amount: '¥24' },
              { item: '酸汤水饺', amount: '¥12' },
              { item: '冰镇饮料', amount: '¥6' },
              { item: '人均合计', amount: '¥42' }
          ],
          tips: [
              { title: '交通', content: '地铁2号线东四十条站步行12分钟。' },
              { title: '时间', content: '避开球赛散场时段。' },
              { title: '避坑', content: '重辣是真辣，微辣保命。' }
          ],
          budget: '人均 ¥42',
          reason: '锅贴界的暴躁担当，热辣滚烫正适合你正面硬吃的性格。' },
        { id: 'dr-pork', personalityId: 'pork', typeLabel: '老实人专线', shop: '老边饺子馆（前门店）',
          tags: ['百年老店', '猪肉白菜', '前门'],
          schedule: [
              { time: '11:30', item: '赶开门第一波，不等位' },
              { time: '11:40', item: '点单：猪肉白菜两盘' },
              { time: '12:00', item: '开吃，蘸蒜泥' },
              { time: '12:50', item: '大栅栏遛食' },
              { time: '13:40', item: '杨梅竹斜街喝茶' }
          ],
          highlights: [
              { name: '老边饺子馆', district: '东城区·前门大街', budget: '人均¥38', primary: true,
                blurb: '百年老店，最不起眼的猪肉白菜就是招牌，跟你一样稳。', tip: '11:30开门，12点后排队。' },
              { name: '杨梅竹斜街', district: '东城区', budget: '免费', primary: false,
                blurb: '前门最安静的文艺胡同，遛食喝茶两相宜。', tip: '小店周末下午人少。' }
          ],
          preparation: ['11:30前到，抢第一波出餐', '蒜泥+醋是灵魂，自助台自己调', '前门游客多，预留排队时间'],
          budgetDetail: [
              { item: '猪肉白菜水饺两盘（拼）', amount: '¥24' },
              { item: '蒜泥醋碟', amount: '¥3' },
              { item: '茉莉花茶', amount: '¥6' },
              { item: '凉菜小拼', amount: '¥5' },
              { item: '人均合计', amount: '¥38' }
          ],
          tips: [
              { title: '交通', content: '地铁2号线前门站C口步行5分钟。' },
              { title: '时间', content: '工作日上午人最少。' },
              { title: '避坑', content: '前门商圈拉客的别理。' }
          ],
          budget: '人均 ¥38',
          reason: '百年老店，最不起眼的猪肉白菜就是招牌，跟你一样稳。' },
        { id: 'dr-chive', personalityId: 'chive', typeLabel: '组局专线', shop: '小恒水饺（合生汇店）',
          tags: ['组局', '韭菜鸡蛋', '合生汇'],
          schedule: [
              { time: '18:00', item: '呼朋引伴到店，先占大桌' },
              { time: '18:10', item: '点单：韭菜鸡蛋 + 羊肉双拼开局' },
              { time: '18:30', item: '开吃，边吃边攒局' },
              { time: '19:30', item: '转场合生汇逛街' },
              { time: '20:00', item: 'KTV继续下半场' }
          ],
          highlights: [
              { name: '小恒水饺', district: '朝阳区·合生汇', budget: '人均¥40', primary: true,
                blurb: '连锁出餐快，适合多人局，韭菜鸡蛋是你的社交燃料。', tip: '大桌限时1.5小时，先点先吃。' },
              { name: '合生汇商圈', district: '朝阳区', budget: '免费', primary: false,
                blurb: '吃完直接逛，组局动线顺。', tip: '周末停车场排队，建议地铁。' }
          ],
          preparation: ['提前在群里点好菜，到店直接下单', '4人以上提前订位', '吃完转场前先结账AA'],
          budgetDetail: [
              { item: '韭菜鸡蛋水饺', amount: '¥16' },
              { item: '羊肉水饺（拼）', amount: '¥18' },
              { item: '凉菜拼盘', amount: '¥6' },
              { item: '人均合计', amount: '¥40' }
          ],
          tips: [
              { title: '交通', content: '地铁7号线/14号线九龙山站直达。' },
              { title: '时间', content: '大桌18:00前到不用等。' },
              { title: '避坑', content: '韭菜味大，约会前慎选。' }
          ],
          budget: '人均 ¥40',
          reason: '局上没你不行，这家店的韭菜鸡蛋就是你社交悍匪的燃料。' },
        { id: 'dr-suancai', personalityId: 'suancai', typeLabel: '东北唠嗑线', shop: '东北饺子王（亚运村店）',
          tags: ['酸菜油渣', '东北馆子', '亚运村'],
          schedule: [
              { time: '17:30', item: '到店先跟老板唠五分钟' },
              { time: '17:40', item: '点单：酸菜油渣 + 茴香' },
              { time: '18:00', item: '开吃，饺子就段子' },
              { time: '18:50', item: '唠到兴起加单第二盘' },
              { time: '19:30', item: '奥森南门遛弯消食' }
          ],
          highlights: [
              { name: '东北饺子王', district: '朝阳区·亚运村', budget: '人均¥45', primary: true,
                blurb: '大茬子味拉满的东北馆子，酸菜油渣一绝。', tip: '老板话多，着急吃先说明。' },
              { name: '奥森南门', district: '朝阳区', budget: '免费', primary: false,
                blurb: '饭后遛弯消食动线顺。', tip: '冬季19点后闭园，别太晚。' }
          ],
          preparation: ['带足话匣子，老板爱唠', '酸菜油渣卖得快，先点上', '饭后奥森遛弯带保温杯'],
          budgetDetail: [
              { item: '酸菜油渣水饺', amount: '¥20' },
              { item: '茴香猪肉（拼）', amount: '¥14' },
              { item: '凉菜小拼', amount: '¥6' },
              { item: '饮料', amount: '¥5' },
              { item: '人均合计', amount: '¥45' }
          ],
          tips: [
              { title: '交通', content: '地铁5号线惠新西街北口步行10分钟。' },
              { title: '时间', content: '17:00-18:00最热闹。' },
              { title: '避坑', content: '别跟老板比酒量。' }
          ],
          budget: '人均 ¥45',
          reason: '大茬子味拉满的东北馆子，边唠边吃你最懂。' },
        { id: 'dr-sanxian', personalityId: 'sanxian', typeLabel: '选择困难救援线', shop: '天津百饺园（西单店）',
          tags: ['百种饺子', '三鲜', '西单'],
          schedule: [
              { time: '12:00', item: '到店对着菜单挑花眼' },
              { time: '12:15', item: '点单：三鲜全家福拼盘' },
              { time: '12:40', item: '开吃，每样沾一点' },
              { time: '13:30', item: '西单大悦城逛街' },
              { time: '14:30', item: '老佛爷百货下午茶' }
          ],
          highlights: [
              { name: '天津百饺园', district: '西城区·西单', budget: '人均¥60', primary: true,
                blurb: '百种饺子任选，全家福拼盘救选择困难。', tip: '拼盘需提前10分钟下单。' },
              { name: '西单大悦城', district: '西城区', budget: '免费', primary: false,
                blurb: '饭后逛街动线顺。', tip: '周末人流大，错峰14点后。' }
          ],
          preparation: ['提前看菜单做功课，别现场懵', '全家福拼盘可备注混合馅', '商场寄存外套再逛'],
          budgetDetail: [
              { item: '三鲜全家福拼盘', amount: '¥45' },
              { item: '时令小菜', amount: '¥8' },
              { item: '酸梅汤', amount: '¥7' },
              { item: '人均合计', amount: '¥60' }
          ],
          tips: [
              { title: '交通', content: '地铁1/4号线西单站直达。' },
              { title: '时间', content: '12:30后等位高峰，12点前到。' },
              { title: '避坑', content: '拼盘量大，两人以上再点。' }
          ],
          budget: '人均 ¥60',
          reason: '百种饺子任选，选择困难的你来了就是主场。' }
    ],

    // 商户优惠券（mode: code 券码模式 / qr 核销二维码模式）
    coupons: [
        { id: 'dc1', shop: '船歌鱼水饺', title: '立冬限定·海王套餐券', value: '满100减20', deadline: '有效期至 11月30日', mode: 'code', code: 'SG-CN-1128' },
        { id: 'dc2', shop: '小恒水饺', title: '偷吃搭子券', value: '全场立减15元', deadline: '有效期至 11月30日', mode: 'qr', code: 'XH-1130-0618' },
        { id: 'dc3', shop: '金谷园饺子馆', title: '甜丧第二盘券', value: '第二盘半价', deadline: '有效期至 11月15日', mode: 'code', code: 'JGY-2026-0718' },
        { id: 'dc4', shop: '满姐饺子', title: '暴躁锅贴券', value: '锅贴买一送一', deadline: '有效期至 11月15日', mode: 'qr', code: 'MJ-1115-0926' }
    ],

    // 人格测试有奖分享规则
    shareRules: {
        title: '人格测试有奖分享',
        period: '活动时间：2026年11月7日 00:00 - 11月30日 23:59',
        howTo: '完成饺子人格测试后，在搭子计划发布动态并带上话题 #我的饺子人格#，即视为成功参与。',
        scoring: '互动值 = 点赞数 + 评论数 × 2 + 转发数 × 3，以活动截止时的数据为准，同一账号多条动态取互动值最高的一条。',
        awards: [
            { name: '一等奖（1名）', desc: '互动值第1名', gift: '立冬饺子全家福大礼包：100元饺子堂食券 + 定制搪瓷饺子盘 + 搭子计划贴纸包' },
            { name: '二等奖（3名）', desc: '互动值第2-4名', gift: '50元饺子优惠券 + 立冬限定冰箱贴' },
            { name: '参与奖（10名）', desc: '互动值第5-14名', gift: '搭子计划立冬限定贴纸包' }
        ],
        announce: '获奖名单将于12月3日在话题页公示，并通过站内私信通知领奖。',
        notes: ['动态内容需原创，且与饺子/立冬话题相关', '禁止刷量（机器点赞、恶意刷评论等），一经发现取消获奖资格', '礼品以实物为准，最终解释权归搭子计划所有']
    },

    // #我的饺子人格# 动态
    moments: [
        { id: 'dm1', name: '立冬预备选手', avatar: 'images/avatar-3.png', text: '测出来了！我是鱿鱼馅海王饺，声东击西偷吃法在线招募搭子 #我的饺子人格#', image: 'images/cover-6.png', likes: 128, comments: 23, time: '10分钟前' },
        { id: 'dm2', name: '甜丧少女', avatar: 'images/avatar-7.png', text: '装乖后突然下手，说的就是我本人了 #我的饺子人格#', image: 'images/cover-11.png', likes: 96, comments: 15, time: '25分钟前' },
        { id: 'dm3', name: '脆皮选手阿青', avatar: 'images/avatar-2.png', text: '离谱工具作战成功，汤勺捞饺第一人 #我的饺子人格#', image: 'images/cover-8.png', likes: 74, comments: 9, time: '50分钟前' },
        { id: 'dm4', name: '暴躁老哥', avatar: 'images/avatar-5.png', text: '正面硬偷，不玩虚的。香辣牛肉就是我的命 #我的饺子人格#', image: 'images/cover-20.png', likes: 156, comments: 31, time: '1小时前' },
        { id: 'dm5', name: '老实人小北', avatar: 'images/avatar-9.png', text: '低调连续作案中，第三盘了，还没人发现 #我的饺子人格#', image: 'images/cover-2.png', likes: 88, comments: 12, time: '1小时前' },
        { id: 'dm6', name: '局王阿韭', avatar: 'images/avatar-4.png', text: '同伙掩护式偷吃大成功，兄弟们给力 #我的饺子人格#', image: 'images/cover-15.png', likes: 203, comments: 44, time: '2小时前' },
        { id: 'dm7', name: '东北在逃大花', avatar: 'images/avatar-11.png', text: '边唠边吃，饺子就着段子，香迷糊了 #我的饺子人格#', image: 'images/cover-1.png', likes: 167, comments: 38, time: '2小时前' },
        { id: 'dm8', name: '选择困难症晚期', avatar: 'images/avatar-8.png', text: '三鲜人格实锤，这顿每样都沾了一点 #我的饺子人格#', image: 'images/cover-10.png', likes: 112, comments: 19, time: '3小时前' }
    ]
};
