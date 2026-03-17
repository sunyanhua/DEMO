// 弹幕功能
document.addEventListener('DOMContentLoaded', function() {
    // 弹幕相关元素
    const danmuDisplay = document.getElementById('danmuDisplay');
    const danmuInput = document.getElementById('danmuInput');
    const sendDanmuBtn = document.getElementById('sendDanmu');

    // 预设用户数据
    const presetUsers = [
        { name: "小雅", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
        { name: "慧慧", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
        { name: "莉莉", avatar: "https://randomuser.me/api/portraits/women/56.jpg" },
        { name: "小敏", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
        { name: "芳芳", avatar: "https://randomuser.me/api/portraits/women/23.jpg" },
        { name: "婷婷", avatar: "https://randomuser.me/api/portraits/women/78.jpg" },
        { name: "悦悦", avatar: "https://randomuser.me/api/portraits/women/89.jpg" },
        { name: "小雨", avatar: "https://randomuser.me/api/portraits/women/12.jpg" }
    ];

    // 预设弹幕内容
    const presetDanmus = [
        "妇女节快乐！每一位女性都闪闪发光✨",
        "致敬伟大的女性力量！",
        "和搭子一起过节太开心啦～",
        "女性可以成为任何她想成为的人",
        "今天要对自己好一点🌸",
        "姐妹们的聚会好嗨皮！",
        "感谢所有女性为社会做出的贡献",
        "自信、独立、美丽，做自己的女神",
        "插花活动太有趣了，下次还要参加",
        "女性互助，温暖前行💕"
    ];

    // 初始化预设弹幕
    function initPresetDanmus() {
        // 先清空
        danmuDisplay.innerHTML = '';

        // 添加预设弹幕，随机分配用户
        presetDanmus.forEach((text, index) => {
            setTimeout(() => {
                const randomUser = presetUsers[Math.floor(Math.random() * presetUsers.length)];
                createDanmu(text, randomUser);
            }, index * 1000); // 每隔1秒添加一个
        });
    }

    // 轨道系统：避免弹幕重叠
    const danmuTracks = 4; // 4个轨道
    const trackHeight = 60; // 每个轨道高度
    const trackLastLaunchTime = new Array(danmuTracks).fill(0); // 每个轨道上次发射时间
    const minLaunchInterval = 4000; // 同一轨道最小发射间隔（毫秒）

    // 创建弹幕元素
    function createDanmu(text, user = null) {
        const danmuItem = document.createElement('div');
        danmuItem.className = 'danmu-item';

        // 随机选择一个用户（如果没有提供）
        const selectedUser = user || presetUsers[Math.floor(Math.random() * presetUsers.length)];

        // 创建弹幕内容HTML
        danmuItem.innerHTML = `
            <div class="danmu-user">
                <img src="${selectedUser.avatar}" alt="${selectedUser.name}" class="danmu-avatar">
                <span class="danmu-username">${selectedUser.name}</span>
            </div>
            <div class="danmu-text">${text}</div>
        `;

        // 随机颜色
        const colors = [
            '#FF6B00', '#FF8C42', '#A8EDEA', '#FAD0C4',
            '#FFD166', '#06D6A0', '#118AB2', '#EF476F'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        danmuItem.style.border = `2px solid ${color}80`; // 80表示50%透明度

        // 分配轨道：选择距离上次发射时间最久的轨道
        let trackIndex = 0;
        let longestInterval = 0;
        const now = Date.now();

        for (let i = 0; i < danmuTracks; i++) {
            const interval = now - trackLastLaunchTime[i];
            if (interval > longestInterval) {
                longestInterval = interval;
                trackIndex = i;
            }
        }

        // 记录该轨道的发射时间
        trackLastLaunchTime[trackIndex] = now;

        // 计算垂直位置（基于轨道）
        const top = 10 + trackIndex * trackHeight;
        danmuItem.style.top = `${top}px`;

        // 给弹幕添加轨道标识，便于后续释放
        danmuItem.dataset.track = trackIndex;

        // 随机字体大小
        const fontSize = 14 + Math.random() * 6;
        danmuItem.querySelector('.danmu-text').style.fontSize = `${fontSize}px`;
        danmuItem.querySelector('.danmu-text').style.color = color;

        // 随机动画时长
        const duration = 15 + Math.random() * 10;
        danmuItem.style.animationDuration = `${duration}s`;

        // 添加到显示区域
        danmuDisplay.appendChild(danmuItem);

        // 动画结束后移除元素
        danmuItem.addEventListener('animationend', function() {
            danmuItem.remove();
        });

        // 如果弹幕被暂停/继续，也需要处理轨道状态
        // 但这里我们只处理动画结束，因为暂停时弹幕还在原位置
    }

    // 发送弹幕
    function sendDanmu() {
        const text = danmuInput.value.trim();
        if (!text) {
            alert('请输入弹幕内容！');
            return;
        }

        if (text.length > 30) {
            alert('弹幕内容不能超过30字！');
            return;
        }

        // 随机选择一个用户
        const randomUser = presetUsers[Math.floor(Math.random() * presetUsers.length)];
        createDanmu(text, randomUser);
        danmuInput.value = '';

        // 保存到本地存储（包含用户信息）
        saveDanmuToLocal(text, randomUser);
    }

    // 保存弹幕到本地存储
    function saveDanmuToLocal(text, user) {
        let danmus = localStorage.getItem('womenDayDanmus');
        if (!danmus) {
            danmus = [];
        } else {
            danmus = JSON.parse(danmus);
        }

        danmus.push({
            text: text,
            user: user,
            time: new Date().toISOString()
        });

        // 只保存最近50条
        if (danmus.length > 50) {
            danmus = danmus.slice(-50);
        }

        localStorage.setItem('womenDayDanmus', JSON.stringify(danmus));
    }

    // 加载本地存储的弹幕
    function loadLocalDanmus() {
        const danmus = localStorage.getItem('womenDayDanmus');
        if (danmus) {
            const parsed = JSON.parse(danmus);
            // 每隔一段时间显示一条历史弹幕
            parsed.forEach((item, index) => {
                setTimeout(() => {
                    // 使用保存的用户信息，如果没有则随机分配
                    const user = item.user || presetUsers[Math.floor(Math.random() * presetUsers.length)];
                    createDanmu(item.text, user);
                }, (index + presetDanmus.length) * 1500);
            });
        }
    }

    // 事件监听
    sendDanmuBtn.addEventListener('click', sendDanmu);

    danmuInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendDanmu();
        }
    });

    // 发布按钮功能
    const postButton = document.getElementById('postButton');
    const postModal = document.getElementById('postModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const submitBtn = document.querySelector('.submit-btn');

    postButton.addEventListener('click', function() {
        postModal.style.display = 'flex';
    });

    function closePostModal() {
        postModal.style.display = 'none';
    }

    closeModal.addEventListener('click', closePostModal);
    cancelBtn.addEventListener('click', closePostModal);

    // 点击模态框外部关闭
    postModal.addEventListener('click', function(e) {
        if (e.target === postModal) {
            closePostModal();
        }
    });

    // 提交按钮（演示用）
    submitBtn.addEventListener('click', function() {
        const textarea = document.querySelector('.modal-body textarea');
        if (textarea.value.trim()) {
            alert('动态发布成功！（演示功能）');
            closePostModal();
            textarea.value = '';
        } else {
            alert('请填写动态内容！');
        }
    });

    // 动态点赞功能
    document.querySelectorAll('.dynamic-actions button').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const text = this.textContent.trim();

            if (icon.classList.contains('fa-heart')) {
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.innerHTML = '<i class="fas fa-heart"></i> 已点赞';
                    this.style.color = '#FF6B00';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.innerHTML = '<i class="far fa-heart"></i> 点赞';
                    this.style.color = '';
                }
            } else if (icon.classList.contains('fa-comment')) {
                alert('评论功能暂未开放，敬请期待！');
            } else if (icon.classList.contains('fa-share')) {
                alert('分享功能暂未开放，敬请期待！');
            }
        });
    });

    // 活动预约按钮 - 跳转到对应活动页面
    const activityLinks = {
        "女神专属下午茶": "https://ttfm-h5.liteweb.cn/v5/2025/cheng/partner/activity/afternoon-tea",
        "女性力量瑜伽课": "https://ttfm-h5.liteweb.cn/v5/2025/cheng/partner/activity/yoga-class",
        "香薰蜡烛手作": "https://ttfm-h5.liteweb.cn/v5/2025/cheng/partner/activity/candle-making",
        "芳香精油SPA": "https://ttfm-h5.liteweb.cn/v5/2025/cheng/partner/activity/spa-treatment",
        "法式烘焙体验课": "https://ttfm-h5.liteweb.cn/v5/2025/cheng/partner/activity/baking-class",
        "女性塑形私教课": "https://ttfm-h5.liteweb.cn/v5/2025/cheng/partner/activity/fitness-training"
    };

    document.querySelectorAll('.activity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const activityTitle = this.closest('.activity-content').querySelector('h3').textContent;
            const link = activityLinks[activityTitle];

            if (link) {
                // 跳转到对应活动页面
                window.open(link, '_blank');
            } else {
                // 如果找不到对应链接，显示提示
                alert(`已预约 "${activityTitle}" 活动！我们将尽快与您联系确认。`);
            }
        });
    });

    // 初始化
    initPresetDanmus();
    loadLocalDanmus();

    // 每隔一段时间随机添加一条预设弹幕
    setInterval(() => {
        const randomText = presetDanmus[Math.floor(Math.random() * presetDanmus.length)];
        createDanmu(randomText);
    }, 8000); // 每8秒添加一条

    // 模拟弹幕区域点击可以暂停/继续
    let danmuPaused = false;
    danmuDisplay.addEventListener('click', function() {
        danmuPaused = !danmuPaused;
        const danmus = document.querySelectorAll('.danmu-item');

        if (danmuPaused) {
            danmus.forEach(d => {
                d.style.animationPlayState = 'paused';
                d.style.opacity = '0.7';
            });
            this.style.backgroundColor = 'rgba(255, 107, 0, 0.05)';
            this.style.borderColor = '#FF6B00';
            this.style.boxShadow = 'inset 0 0 0 2px rgba(255, 107, 0, 0.3)';
        } else {
            danmus.forEach(d => {
                d.style.animationPlayState = 'running';
                d.style.opacity = '1';
            });
            this.style.backgroundColor = '#f8f9fa';
            this.style.borderColor = '#FFC8A2';
            this.style.boxShadow = 'none';
        }
    });
});