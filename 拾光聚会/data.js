window.GlobalData = {
    user: {
        id: 'u1',
        name: '车友小明',
        avatarUrl: 'https://picsum.photos/100/100',
        following: 42,
        followers: 108,
        activities: 5,
        moments: 12,
        intro: '北京交通广播103.9忠实听众，热爱汽车文化，喜欢参加各类车友活动。',
        tags: ['车友', '自驾游', '汽车改装'],
        phone: '13800138000',
        realName: '张三',
        gender: 'male',
        birthDate: '1990-05-20',
        school: '北京理工大学',
        mbti: 'ISTJ',
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
        "https://tingtingfm.vbegin.com.cn/upload/2026/0213/361e30f4fbb04a669befd8f6aed93639.png",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],

    categories: [
        { id: 'c1', label: '车展活动', icon: 'car', color: 'bg-orange-100 text-orange-600' },
        { id: 'c2', label: '生活节', icon: 'music', color: 'bg-green-100 text-green-600' },
        { id: 'c3', label: '购车优惠', icon: 'tag', color: 'bg-yellow-100 text-yellow-600' },
        { id: 'c4', label: '广播收听', icon: 'radio', color: 'bg-indigo-100 text-indigo-600' },
        { id: 'c5', label: '互动社区', icon: 'message-square', color: 'bg-purple-100 text-purple-600' },
        { id: 'c6', label: '商家展示', icon: 'store', color: 'bg-cyan-100 text-cyan-600' },
        { id: 'c7', label: '交通资讯', icon: 'newspaper', color: 'bg-pink-100 text-pink-600' },
        { id: 'c8', label: '车主服务', icon: 'wrench', color: 'bg-emerald-100 text-emerald-600' },
        { id: 'c9', label: '自驾游', icon: 'map-pin', color: 'bg-rose-100 text-rose-600' },
        { id: 'c10', label: '二手车', icon: 'repeat', color: 'bg-blue-100 text-blue-600' }
    ],

    partners: [
        {
            id: 'p1',
            name: '奥迪4S店',
            avatarUrl: 'https://picsum.photos/100/100?random=20',
            tags: ['豪华车', '购车优惠', '试驾'],
            intro: '奥迪全系车型优惠，最高直降10万！',
            distance: '1.2km',
            realNameVerified: true,
            cooperationVerified: true,
            role: 'merchant',
            verified: true,
            address: '北京市朝阳区建国路88号',
            phone: '010-88886666',
            businessHours: '周一至周日 9:00-18:00',
            description: '奥迪官方授权4S店，提供奥迪全系车型销售、售后服务、维修保养、金融贷款等一站式服务。店内设有豪华展厅、客户休息区、专业维修车间，拥有资深销售顾问和认证技师团队。',
            images: [
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.8,
            followers: 1250
        },
        {
            id: 'p2',
            name: '宝马体验中心',
            avatarUrl: 'https://picsum.photos/100/100?random=21',
            tags: ['新能源', '科技体验'],
            intro: '宝马i系列试驾体验，预约即送礼品。',
            distance: '0.5km',
            realNameVerified: true,
            cooperationVerified: true,
            role: 'merchant',
            verified: true,
            address: '北京市海淀区中关村大街1号',
            phone: '010-66668888',
            businessHours: '周一至周日 8:30-20:00',
            description: '宝马官方体验中心，集品牌展示、科技体验、试驾服务为一体。拥有全系宝马车型，特别突出新能源i系列车型，提供深度试驾体验和个性化定制服务。',
            images: [
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.9,
            followers: 980
        },
        {
            id: 'p3',
            name: '特斯拉服务中心',
            avatarUrl: 'https://picsum.photos/100/100?random=22',
            tags: ['电动车', '充电服务'],
            intro: '特斯拉超充站免费体验一周。',
            distance: '3.0km',
            realNameVerified: true,
            cooperationVerified: true,
            role: 'merchant',
            verified: true,
            address: '北京市大兴区亦庄经济技术开发区',
            phone: '010-77779999',
            businessHours: '周一至周日 9:00-19:00',
            description: '特斯拉官方授权服务中心，提供车辆销售、维修保养、超充服务、配件销售等。拥有专业特斯拉认证技师，配备原厂诊断设备和专用工具。',
            images: [
                'https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.7,
            followers: 2100
        },
        {
            id: 'p4',
            name: '奔驰旗舰店',
            avatarUrl: 'https://picsum.photos/100/100?random=23',
            tags: ['商务车', '金融方案'],
            intro: '奔驰E级专属金融方案，首付低至15%。',
            distance: '5.2km',
            realNameVerified: true,
            cooperationVerified: true,
            role: 'merchant',
            verified: true,
            address: '北京市东城区王府井大街200号',
            phone: '010-55556666',
            businessHours: '周一至周日 9:30-20:30',
            description: '奔驰旗舰店是奔驰品牌在华北地区最大的展示中心，提供全系奔驰车型销售、金融方案定制、售后服务等。店内设有豪华VIP休息区、儿童游乐区、咖啡吧等设施。',
            images: [
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.8,
            followers: 1800
        },
        {
            id: 'p5',
            name: '蔚来中心',
            avatarUrl: 'https://picsum.photos/100/100?random=24',
            tags: ['电动车', '换电服务'],
            intro: '蔚来全系车型试驾，赠送NIO Life礼品。',
            distance: '2.5km',
            realNameVerified: true,
            cooperationVerified: true,
            role: 'merchant',
            verified: true,
            address: '北京市朝阳区三里屯太古里南区',
            phone: '010-44445555',
            businessHours: '周一至周日 10:00-22:00',
            description: '蔚来中心是蔚来品牌的线下体验空间，集车辆展示、试驾体验、用户社区、咖啡休闲于一体。拥有全系蔚来车型，提供换电服务体验和NIO Life产品展示。',
            images: [
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.9,
            followers: 3200
        },
        {
            id: 'p6',
            name: '汽车美容连锁',
            avatarUrl: 'https://picsum.photos/100/100?random=25',
            tags: ['洗车', '美容', '保养'],
            intro: '专业汽车美容服务，新车镀晶8折优惠。',
            distance: '1.8km',
            realNameVerified: true,
            cooperationVerified: true,
            role: 'merchant',
            verified: true,
            address: '北京市丰台区南四环西路188号',
            phone: '010-33332222',
            businessHours: '周一至周日 8:00-21:00',
            description: '专业汽车美容连锁店，提供洗车、打蜡、镀晶、内饰清洗、发动机清洗等全方位汽车美容服务。采用进口美容产品，拥有专业施工团队，确保服务质量。',
            images: [
                'https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.6,
            followers: 850
        }
    ],

    activities: [
        {
            id: 'a1',
            title: '汽车生活节',
            description: '北京交通广播103.9拾光聚会专场，特邀听众参与，现场有抽奖、优惠购车、明星主播见面会等活动。',
            category: '生活节',
            imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '冰丝带体育馆',
            district: '朝阳区',
            date: '2026年4月20日',
            price: 0,
            status: 'RECRUITING',
            currentParticipants: 120,
            tags: ['免费', '抽奖', '主播见面'],
            subsidyTotal: 1000000,
            subsidyClaimed: 330000,
            subsidySteps: [
                { id: 1, name: '现场抢券', completed: true, description: '现场扫码领取优惠券' },
                { id: 2, name: '补充材料', completed: true, description: '提交个人资料和购车意向' },
                { id: 3, name: '初审', completed: false, description: '平台审核材料真实性' },
                { id: 4, name: '补贴发放', completed: false, description: '审核通过后补贴发放至账户' }
            ]
        },
        {
            id: 'a2',
            title: '103.9生活节·汽车文化市集',
            description: '集结汽车文化、美食、音乐、手作，打造周末休闲好去处。现场有乐队演出、美食摊位、儿童游乐区。',
            category: '生活节',
            imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '798艺术区',
            district: '朝阳区',
            date: '上周日 10:00-20:00',
            price: 0,
            status: 'ENDED',
            currentParticipants: 80,
            tags: ['市集', '音乐', '亲子']
        },
        {
            id: 'a3',
            title: '新能源汽车试驾体验会',
            description: '特斯拉、蔚来、小鹏等主流新能源车型集中试驾，专业讲解员陪同，现场订车享专属优惠。',
            category: '购车优惠',
            imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '奥林匹克公园',
            district: '朝阳区',
            date: '上周六 09:00-17:00',
            price: 0,
            status: 'ENDED',
            currentParticipants: 50,
            tags: ['试驾', '新能源', '优惠']
        },
        {
            id: 'a4',
            title: '老司机自驾游·坝上草原',
            description: '北京交通广播老司机俱乐部组织的坝上草原自驾游，两天一夜，包含住宿、餐饮、篝火晚会。',
            category: '自驾游',
            imageUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '丰宁坝上草原',
            district: '河北省',
            date: '上周末 两天一夜',
            price: 680,
            status: 'ENDED',
            currentParticipants: 15,
            tags: ['自驾', '草原', '住宿']
        },
        {
            id: 'a5',
            title: '二手车拍卖会',
            description: '精品二手车拍卖，车辆经过专业检测，提供质保服务。现场有评估师免费评估二手车。',
            category: '二手车',
            imageUrl: 'https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '花乡二手车市场',
            district: '丰台区',
            date: '上周六 13:00-17:00',
            price: 0,
            status: 'ENDED',
            currentParticipants: 45,
            tags: ['二手车', '拍卖', '评估']
        },
        {
            id: 'a6',
            title: '汽车保养知识讲座',
            description: '资深技师讲解汽车日常保养知识，延长爱车寿命。现场提问有礼品赠送。',
            category: '车主服务',
            imageUrl: 'https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: '海淀区汽车服务中心',
            district: '海淀区',
            date: '上周二 19:00-21:00',
            price: 0,
            status: 'ENDED',
            currentParticipants: 30,
            tags: ['保养', '讲座', '免费']
        }
    ],

    radioPrograms: [
        {
            id: 'r1',
            title: '拾光聚会20260225期',
            description: '北京交通广播103.9每晚19:00-20:00，主播与听众互动，分享汽车生活、交通资讯、活动预告。',
            host: '王戈/嘉明',
            time: '今天 19:00-20:00',
            live: true,
            listeners: 12500,
            coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'r2',
            title: '拾光聚会20260224期',
            description: '回顾昨天节目精彩内容：汽车保养小技巧，听众互动问答。',
            host: '王戈/贾天阳',
            time: '昨天 19:00-20:00',
            live: false,
            listeners: 9800,
            coverUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'r3',
            title: '拾光聚会20260223期',
            description: '新能源汽车发展趋势分析，专家访谈环节。',
            host: '嘉明/贾天阳',
            time: '前天 19:00-20:00',
            live: false,
            listeners: 8700,
            coverUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'r4',
            title: '拾光聚会20260224期',
            description: '汽车安全驾驶知识讲解，交通事故案例分析。',
            host: '王戈/嘉明',
            time: '周三 19:00-20:00',
            live: false,
            listeners: 9200,
            coverUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'r5',
            title: '拾光聚会20260223期',
            description: '二手车购买指南，如何鉴别事故车、泡水车。',
            host: '王戈/贾天阳',
            time: '周二 19:00-20:00',
            live: false,
            listeners: 8500,
            coverUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'r6',
            title: '拾光聚会20260222期',
            description: '周末自驾游路线推荐，装备准备注意事项。',
            host: '嘉明/贾天阳',
            time: '周一 19:00-20:00',
            live: false,
            listeners: 7900,
            coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'r7',
            title: '拾光聚会20260221期',
            description: '一周精彩内容回顾，听众来信回复。',
            host: '王戈/嘉明',
            time: '周日 19:00-20:00',
            live: false,
            listeners: 8100,
            coverUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'r8',
            title: '拾光聚会20260220期',
            description: '汽车文化历史，经典车型赏析。',
            host: '王戈/贾天阳',
            time: '周六 19:00-20:00',
            live: false,
            listeners: 8300,
            coverUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
    ],

    moments: [
        {
            id: 'mo1',
            userId: 'u1',
            content: '今天去4S店看了新款奥迪A6L，优惠力度真大！有没有一起团购的车友？#奥迪 #购车优惠',
            images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 45,
            comments: 12,
            time: '10分钟前',
            location: '奥迪4S店'
        },
        {
            id: 'mo2',
            userId: 'p1',
            content: '本周六我们店有专场优惠活动，奥迪Q5L直降8万，还有礼品赠送！欢迎车友到店咨询。#奥迪 #优惠',
            images: [
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            likes: 128,
            comments: 34,
            time: '1小时前',
            location: '奥迪4S店'
        },
        {
            id: 'mo3',
            userId: 'u2',
            content: '刚参加了103.9生活节，现场氛围太棒了！美食、音乐、车展应有尽有，孩子玩得特别开心。#生活节 #亲子',
            images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 89,
            comments: 5,
            time: '2小时前',
            location: '798艺术区'
        },
        {
            id: 'mo4',
            userId: 'u3',
            content: '特斯拉Model Y提车啦！感谢特斯拉服务中心的周到服务，超充体验很棒。#特斯拉 #电动车',
            images: ['https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 210,
            comments: 56,
            time: '昨天',
            location: '特斯拉服务中心'
        },
        {
            id: 'mo5',
            userId: 'p4',
            content: '奔驰E级新款到店，欢迎预约试驾！金融方案灵活，首付低至15%。#奔驰 #金融方案',
            images: ['https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 12,
            comments: 8,
            time: '昨天',
            location: '奔驰旗舰店'
        },
        {
            id: 'mo6',
            userId: 'u5',
            content: '坝上草原自驾游太美了！蓝天白云，草原广阔，晚上还有篝火晚会。感谢老司机俱乐部的组织！#自驾游 #草原',
            images: ['https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            likes: 67,
            comments: 2,
            time: '2天前',
            location: '坝上草原'
        }
    ],

    messages: [
        { id: 'm1', userId: 'u2', name: '北京交通广播', avatarUrl: 'https://picsum.photos/50/50?random=2', lastMessage: '本周六车展活动记得准时参加哦！', time: '10:30', unread: 2, timestamp: 700 },
        { id: 'm2', userId: 'p1', name: '奥迪4S店', avatarUrl: 'https://picsum.photos/50/50?random=20', lastMessage: '您的奥迪A6L试驾预约已确认，请准时到店。', time: '昨天', unread: 0, timestamp: 600 },
        { id: 'm3', userId: 'p4', name: '奔驰旗舰店', avatarUrl: 'https://picsum.photos/50/50?random=23', lastMessage: '奔驰E级金融方案已发送至您的邮箱。', time: '星期一', unread: 0, timestamp: 300 },
        { id: 'm4', userId: 'u5', name: '老司机俱乐部', avatarUrl: 'https://picsum.photos/50/50?random=8', lastMessage: '坝上草原自驾游集合时间调整为周六早7点。', time: '刚刚', unread: 5, timestamp: 900 },
        { id: 'm5', userId: 'p3', name: '特斯拉服务中心', avatarUrl: 'https://picsum.photos/50/50?random=22', lastMessage: '您的特斯拉超充体验券已激活，有效期7天。', time: '10:20', unread: 1, timestamp: 800 },
        { id: 'm6', userId: 'p2', name: '宝马体验中心', avatarUrl: 'https://picsum.photos/50/50?random=21', lastMessage: '宝马iX试驾活动本周日举行，欢迎参加。', time: '昨天', unread: 0, timestamp: 500 },
        { id: 'm7', userId: 'p5', name: '蔚来中心', avatarUrl: 'https://picsum.photos/50/50?random=24', lastMessage: '蔚来ET7试驾车已到店，预约体验送礼品。', time: '星期三', unread: 0, timestamp: 400 },
        { id: 'm8', userId: 'p6', name: '汽车美容连锁', avatarUrl: 'https://picsum.photos/50/50?random=25', lastMessage: '您的爱车镀晶服务已完成，欢迎取车。', time: '2026/2/18', unread: 0, timestamp: 200 },
        { id: 'm9', userId: 'system', name: '拾光聚会小助手', avatarUrl: 'https://picsum.photos/50/50?random=99', lastMessage: '欢迎使用拾光聚会，有任何问题可以随时咨询。', time: '2026/2/15', unread: 0, timestamp: 100 }
    ],

    notifications: [
        { id: 'n5', title: '评论点赞通知', content: '用户奥迪4S店点赞了你的评论"这款车性价比真高！"', time: '10分钟前', type: 'comment_like', momentId: 'mo1' },
        { id: 'n6', title: '评论回复通知', content: '用户宝马体验中心回复了你的评论"新能源车续航怎么样？"', time: '15分钟前', type: 'comment_reply', momentId: 'mo2' },
        { id: 'n7', title: '关注通知', content: '用户老司机俱乐部关注了你', time: '20分钟前', type: 'follow', userId: 'u5' },
        { id: 'n8', title: '评论通知', content: '用户特斯拉服务中心评论了你的动态"特斯拉Model Y提车啦！"', time: '25分钟前', type: 'comment', momentId: 'mo4' },
        { id: 'n9', title: '评论点赞通知', content: '用户北京交通广播点赞了你的评论"活动办得太好了！"', time: '30分钟前', type: 'comment_like', momentId: 'mo3' },
        { id: 'n10', title: '评论回复通知', content: '用户奔驰旗舰店回复了你的评论"金融方案利率是多少？"', time: '35分钟前', type: 'comment_reply', momentId: 'mo5' },
        { id: 'n11', title: '关注通知', content: '用户蔚来中心关注了你', time: '40分钟前', type: 'follow', userId: 'p5' },
        { id: 'n12', title: '评论通知', content: '用户汽车美容连锁评论了你的动态"爱车镀晶后真亮！"', time: '45分钟前', type: 'comment', momentId: 'mo6' },
        { id: 'n3', title: '点赞通知', content: '用户奥迪4S店点赞了你的动态"今天去4S店看了新款奥迪A6L"', time: '1小时前', type: 'like', momentId: 'mo1' },
        { id: 'n1', title: '活动报名成功', content: '您已成功报名"北京国际车展·拾光聚会专场"，请准时参加。', time: '2小时前', type: 'success' },
        { id: 'n4', title: '点赞通知', content: '用户宝马体验中心点赞了你的动态"宝马iX试驾体验"', time: '2小时前', type: 'like', momentId: 'mo2' },
        { id: 'n2', title: '系统消息', content: '欢迎加入拾光聚会！完善个人资料可以让更多人认识你。', time: '3天前', type: 'info' }
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
        { id: 'wr1', type: 'income', description: '坝上草原自驾游报名收费', amount: 680.00, time: '今天 10:15', status: 'completed' },
        { id: 'wr2', type: 'income', description: '二手车拍卖会报名收费', amount: 0.00, time: '昨天 14:30', status: 'completed' },
        { id: 'wr3', type: 'withdraw', description: '提现', amount: -200.00, time: '前天 16:45', status: 'completed' },
        { id: 'wr4', type: 'income', description: '汽车保养知识讲座报名收费', amount: 0.00, time: '2026/2/19 11:20', status: 'completed' },
        { id: 'wr5', type: 'withdraw', description: '提现', amount: -150.00, time: '2026/2/18 09:10', status: 'completed' },
        { id: 'wr6', type: 'income', description: '新能源汽车试驾体验会报名收费', amount: 0.00, time: '2026/2/17 19:35', status: 'completed' }
    ],

    users: [
        { id: 'u1', name: '车友小明', avatarUrl: 'https://picsum.photos/100/100', intro: '北京交通广播103.9忠实听众，热爱汽车文化，喜欢参加各类车友活动。' },
        { id: 'u2', name: '北京交通广播', avatarUrl: 'https://picsum.photos/100/100?random=2', intro: '北京交通广播103.9官方账号' },
        { id: 'u3', name: '拾光聚会组委会', avatarUrl: 'https://picsum.photos/100/100?random=4', intro: '拾光聚会活动主办方' },
        { id: 'u4', name: '新能源汽车联盟', avatarUrl: 'https://picsum.photos/100/100?random=6', intro: '新能源汽车推广平台' },
        { id: 'u5', name: '老司机俱乐部', avatarUrl: 'https://picsum.photos/100/100?random=8', intro: '北京交通广播官方自驾游俱乐部' },
        { id: 'u6', name: '主播小光', avatarUrl: 'https://picsum.photos/100/100?random=10', intro: '拾光聚会节目主持人' },
        { id: 'u7', name: '新能源达人', avatarUrl: 'https://picsum.photos/100/100?random=12', intro: '新能源车评节目主持人' }
    ],

    orders: [
        { id: 'o1', activityId: 'a1', activityTitle: '北京国际车展·拾光聚会专场', amount: 0.00, status: 'paid', time: '今天 10:15', participants: 1, userId: 'u1' },
        { id: 'o2', activityId: 'a2', activityTitle: '103.9生活节·汽车文化市集', amount: 0.00, status: 'paid', time: '昨天 14:30', participants: 1, userId: 'u2' },
        { id: 'o3', activityId: 'a4', activityTitle: '老司机自驾游·坝上草原', amount: 680.00, status: 'cancelled', time: '前天 16:20', participants: 1, userId: 'u3' },
        { id: 'o4', activityId: 'a1', activityTitle: '北京国际车展·拾光聚会专场', amount: 0.00, status: 'refunded', time: '2026/2/19 09:45', participants: 2, userId: 'u4' },
        { id: 'o5', activityId: 'a3', activityTitle: '新能源汽车试驾体验会', amount: 0.00, status: 'paid', time: '2026/2/18 20:10', participants: 1, userId: 'u5' },
        { id: 'o6', activityId: 'a5', activityTitle: '二手车拍卖会', amount: 0.00, status: 'paid', time: '今天 09:30', participants: 1, userId: 'u2' },
        { id: 'o7', activityId: 'a6', activityTitle: '汽车保养知识讲座', amount: 0.00, status: 'paid', time: '昨天 15:20', participants: 1, userId: 'u3' },
        { id: 'o8', activityId: 'a4', activityTitle: '老司机自驾游·坝上草原', amount: 680.00, status: 'paid', time: '前天 11:45', participants: 1, userId: 'u4' }
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
        { level: 10, minPoints: 8001, maxPoints: 999999, privileges: ['拾光聚会终身荣誉会员', '所有特权最大化', '平台战略合作伙伴资格'] }
    ]
};

// 随机化广播节目主播：王戈、嘉铭、贾天阳 三人中随机选择两人
(function randomizeHosts() {
    const hosts = ['王戈', '嘉铭', '贾天阳'];
    const combinations = [
        [hosts[0], hosts[1]], // 王戈/嘉铭
        [hosts[0], hosts[2]], // 王戈/贾天阳
        [hosts[1], hosts[2]]  // 嘉铭/贾天阳
    ];

    if (window.GlobalData && window.GlobalData.radioPrograms) {
        window.GlobalData.radioPrograms.forEach(program => {
            // 随机选择一个组合
            const randomIndex = Math.floor(Math.random() * combinations.length);
            const selected = combinations[randomIndex];
            program.host = selected.join('/');
        });
    }
})();

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