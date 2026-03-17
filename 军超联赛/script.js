// 军超联赛交互脚本
let tempRegistrationData = null; // 临时存储报名数据

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initEventsData();
    initFormSubmission();
    initFloatingButton();
    initModal();
    initScrollSpy();

    // 检查报名状态并初始化界面
    checkRegistrationStatus();

    // 页面加载完成后添加一些动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// 1. 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const logo = document.querySelector('.logo');

    // logo点击返回顶部
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 移动端菜单切换
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 2. 动态加载比赛项目数据
function initEventsData() {
    const eventsGrid = document.querySelector('.events-grid');

    if (!eventsGrid) return;

    const events = [
        {
            id: 1,
            name: "泸定急行军",
            description: "山地武装越野2.4公里，要求携带指定装备（训练枪、挎包、水壶）。",
            difficulty: "hard"
        },
        {
            id: 2,
            name: "突破封锁线",
            description: "团队战术接力，按高姿匍匐、低姿匍匐、侧姿匍匐和持枪跃进四种战术通过80米距离。",
            difficulty: "medium"
        },
        {
            id: 3,
            name: "运送弹药箱",
            description: "运输10公斤弹药箱进行50米折返跑。",
            difficulty: "medium"
        },
        {
            id: 4,
            name: "飞夺泸定桥",
            description: "团队接力铺桥板通过铁索桥。",
            difficulty: "medium"
        },
        {
            id: 5,
            name: "奇袭腊子口",
            description: "手榴弹投准，团队需投中指定3个位置各2枚，距离分别为10米、15米。",
            difficulty: "hard"
        },
        {
            id: 6,
            name: "爬雪山",
            description: "按指定路线翻越一座山峰，禁止借助外力。",
            difficulty: "hard"
        },
        {
            id: 7,
            name: "过草地",
            description: "团队协力通过50米泥潭地。",
            difficulty: "medium"
        },
        {
            id: 8,
            name: "强渡大渡河",
            description: "团队操舟渡河50米。",
            difficulty: "medium"
        },
        {
            id: 9,
            name: "开路神枪手",
            description: "模拟实弹射击，团队途中需用模拟射击装备击中起倒靶6个。",
            difficulty: "hard"
        },
        {
            id: 10,
            name: "朱毛粮道",
            description: "利用扁担或独轮车快速运送军粮。",
            difficulty: "easy"
        }
    ];

    // 清空现有内容
    eventsGrid.innerHTML = '';

    // 生成比赛项目卡片
    events.forEach(event => {
        const difficultyClass = getDifficultyClass(event.difficulty);
        const difficultyText = getDifficultyText(event.difficulty);

        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-number">${event.id}</div>
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <div class="event-difficulty ${difficultyClass}">${difficultyText}</div>
        `;

        eventsGrid.appendChild(eventCard);
    });
}

// 获取难度对应的CSS类
function getDifficultyClass(difficulty) {
    switch(difficulty) {
        case 'easy': return 'difficulty-easy';
        case 'medium': return 'difficulty-medium';
        case 'hard': return 'difficulty-hard';
        default: return 'difficulty-medium';
    }
}

// 获取难度显示文本
function getDifficultyText(difficulty) {
    switch(difficulty) {
        case 'easy': return '难度：较低';
        case 'medium': return '难度：中等';
        case 'hard': return '难度：较高';
        default: return '难度：中等';
    }
}

// 计算参赛人数（根据组别）
function calculateParticipants(groupType) {
    if (groupType.startsWith('家庭')) {
        return 3; // 家庭亲子联赛为3人
    } else {
        return 4; // 其他联赛为4人
    }
}

// 获取组别显示名称
function getGroupDisplayName(groupValue) {
    const groupNames = {
        '职工青年': '职工联赛-青年组',
        '职工中年': '职工联赛-中年组',
        '职工老年': '职工联赛-老年组',
        '小学': '学校联赛-小学组',
        '初中': '学校联赛-初中组',
        '高中': '学校联赛-高中组',
        '大学': '学校联赛-大学组',
        '家庭小学': '家庭亲子联赛-小学家庭组',
        '家庭初中': '家庭亲子联赛-初中家庭组'
    };
    return groupNames[groupValue] || groupValue;
}

// 获取参赛类型显示名称
function getEventTypeDisplayName(eventValue) {
    if (eventValue === 'training') {
        return '训练体验（200元/人）';
    } else if (eventValue === 'competition') {
        return '正式比赛（300元/人）';
    }
    return eventValue;
}

// 获取人均费用
function getFeePerPerson(eventType) {
    if (eventType === 'training') {
        return 200;
    } else if (eventType === 'competition') {
        return 300;
    }
    return 0;
}

// 计算总费用
function calculateTotalFee(participants, feePerPerson) {
    return participants * feePerPerson;
}

// 参赛人员信息表单生成函数
function generateParticipantsForm(participantsCount, leaderName) {
    const formFieldsContainer = document.getElementById('participantsFormFields');
    if (!formFieldsContainer) return;

    // 清空现有内容
    formFieldsContainer.innerHTML = '';

    // 生成参赛人员表单字段
    for (let i = 0; i < participantsCount; i++) {
        const isLeader = i === 0;
        const participantNumber = i + 1;

        const participantSection = document.createElement('div');
        participantSection.className = 'participant-section';
        participantSection.innerHTML = `
            <h5 class="participant-header">
                <i class="fas fa-user${isLeader ? '-tie' : ''}"></i>
                队员 ${participantNumber}${isLeader ? '（领队）' : ''}
            </h5>
            <div class="participant-fields">
                <div class="form-group">
                    <label for="participantName${participantNumber}">
                        <i class="fas fa-user"></i> 姓名
                    </label>
                    <input type="text"
                           id="participantName${participantNumber}"
                           name="participantName${participantNumber}"
                           placeholder="请输入队员姓名"
                           required
                           ${isLeader ? `value="${leaderName}" readonly` : ''}>
                    ${isLeader ? '<small class="field-note">（领队姓名，不可修改）</small>' : ''}
                </div>
                <div class="form-group">
                    <label for="participantId${participantNumber}">
                        <i class="fas fa-id-card"></i> 身份证号
                    </label>
                    <input type="text"
                           id="participantId${participantNumber}"
                           name="participantId${participantNumber}"
                           placeholder="请输入18位身份证号码"
                           required
                           pattern="[0-9]{17}[0-9Xx]"
                           title="请输入有效的18位身份证号码">
                </div>
            </div>
        `;

        formFieldsContainer.appendChild(participantSection);
    }

    // 添加测试数据填充按钮（仅用于演示）
    const testDataButton = document.createElement('button');
    testDataButton.type = 'button';
    testDataButton.className = 'btn btn-secondary btn-test-data';
    testDataButton.innerHTML = '<i class="fas fa-magic"></i> 填充测试数据（演示）';
    testDataButton.onclick = function() {
        fillParticipantsTestData(participantsCount);
    };
    formFieldsContainer.appendChild(testDataButton);
}

// 计算身份证校验码（根据GB 11643-1999标准）
function calculateIDCheckCode(first17) {
    if (!/^\d{17}$/.test(first17)) {
        return '0'; // 如果前17位不是数字，返回默认值
    }

    // 权重因子
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码对应表
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    // 计算加权和
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        sum += parseInt(first17.charAt(i), 10) * weights[i];
    }

    // 取模得到校验码索引
    const mod = sum % 11;
    return checkCodes[mod];
}

// 生成合规的测试用身份证号
function generateValidIDNumber() {
    // 地区码：110101 北京市市辖区（东城区）
    const areaCode = '110101';
    // 随机出生年份：1970-2010年（16-56岁，覆盖主要参赛年龄）
    const year = 1970 + Math.floor(Math.random() * 41);
    // 随机月份：01-12
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    // 随机日期：01-28（避免2月30日等无效日期）
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    // 顺序码：001-999（3位数字）
    const sequence = String(Math.floor(Math.random() * 899) + 100);

    // 生成前17位
    const first17 = `${areaCode}${year}${month}${day}${sequence}`;
    // 计算校验码
    const checkCode = calculateIDCheckCode(first17);

    return first17 + checkCode;
}

// 填充参赛人员测试数据函数
function fillParticipantsTestData(participantsCount) {
    // 常用姓氏和名字
    const surnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴'];
    const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '洋', '艳', '勇', '军', '杰'];

    // 生成测试数据
    for (let i = 0; i < participantsCount; i++) {
        const participantNumber = i + 1;
        const nameInput = document.getElementById(`participantName${participantNumber}`);
        const idInput = document.getElementById(`participantId${participantNumber}`);

        if (nameInput && !nameInput.readOnly) {
            // 随机生成姓名
            const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
            const randomGivenName = givenNames[Math.floor(Math.random() * givenNames.length)];
            const randomName = randomSurname + randomGivenName;
            nameInput.value = randomName;
        }

        if (idInput) {
            // 生成合规的测试用身份证号（通过校验验证）
            const idNumber = generateValidIDNumber();
            idInput.value = idNumber;
        }
    }
}

// 3. 表单提交功能
function initFormSubmission() {
    const form = document.getElementById('demoRegistrationForm');
    const feeModal = document.getElementById('successModal');
    const paymentSuccessModal = document.getElementById('paymentSuccessModal');
    const groupTypeSelect = document.getElementById('groupType');
    const eventTypeSelect = document.getElementById('eventType');
    const feeCalculationDiv = document.getElementById('feeCalculation');

    if (!form) return;

    // 参赛人员信息表单提交处理
    const participantsForm = document.getElementById('participantsForm');
    if (participantsForm) {
        participantsForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const participantsCount = tempRegistrationData?.participants || 0;
            const participantsList = [];

            // 验证并收集所有参赛人员信息
            let isValid = true;
            for (let i = 0; i < participantsCount; i++) {
                const participantNumber = i + 1;
                const nameInput = document.getElementById(`participantName${participantNumber}`);
                const idInput = document.getElementById(`participantId${participantNumber}`);

                if (!nameInput || !idInput) {
                    isValid = false;
                    break;
                }

                const name = nameInput.value.trim();
                const idNumber = idInput.value.trim();

                // 验证必填字段
                if (!name || !idNumber) {
                    alert(`请填写队员 ${participantNumber} 的姓名和身份证号！`);
                    isValid = false;
                    break;
                }

                // 验证身份证号格式（简单验证）
                const idRegex = /^[0-9]{17}[0-9Xx]$/;
                if (!idRegex.test(idNumber)) {
                    alert(`队员 ${participantNumber} 的身份证号码格式不正确！请输入18位有效身份证号码。`);
                    isValid = false;
                    break;
                }

                participantsList.push({
                    number: participantNumber,
                    name: name,
                    idNumber: idNumber,
                    isLeader: i === 0
                });
            }

            if (!isValid) return;

            // 将参赛人员信息添加到临时报名数据
            if (tempRegistrationData) {
                tempRegistrationData.participantsList = participantsList;
            }

            // 关闭参赛人员信息模态框
            const participantsModal = document.getElementById('participantsModal');
            if (participantsModal) {
                participantsModal.classList.remove('active');
            }

            // 显示费用确认模态框
            if (feeModal) {
                feeModal.classList.add('active');
            }
        });
    }

    // 实时费用计算函数
    function updateFeeCalculation() {
        const groupType = groupTypeSelect.value;
        const eventType = eventTypeSelect.value;

        if (!groupType || !eventType) {
            feeCalculationDiv.style.display = 'none';
            return;
        }

        // 计算费用
        const participants = calculateParticipants(groupType);
        const feePerPerson = getFeePerPerson(eventType);
        const totalFee = calculateTotalFee(participants, feePerPerson);

        // 更新显示
        document.getElementById('calculatedParticipants').textContent = `${participants}人`;
        document.getElementById('feePerPerson').textContent = `${feePerPerson}元/人`;
        document.getElementById('totalFee').textContent = `${totalFee}元`;

        // 显示费用计算区域
        feeCalculationDiv.style.display = 'block';
    }

    // 实时监听组别和类型变化
    groupTypeSelect.addEventListener('change', updateFeeCalculation);
    eventTypeSelect.addEventListener('change', updateFeeCalculation);

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 表单验证
        const teamName = document.getElementById('teamName').value.trim();
        const leaderName = document.getElementById('leaderName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const groupType = groupTypeSelect.value;
        const eventType = eventTypeSelect.value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // 验证必填字段
        if (!teamName || !leaderName || !phone || !email || !groupType || !eventType) {
            alert('请填写所有必填字段！');
            return;
        }

        if (!agreeTerms) {
            alert('请阅读并同意《参赛声明》和《健康承诺书》！');
            return;
        }

        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            alert('请输入有效的手机号码！');
            return;
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('请输入有效的电子邮箱！');
            return;
        }

        // 计算费用
        const participants = calculateParticipants(groupType);
        const feePerPerson = getFeePerPerson(eventType);
        const totalFee = calculateTotalFee(participants, feePerPerson);

        // 更新模态框内容
        document.getElementById('summaryTeamName').textContent = teamName;
        document.getElementById('summaryGroupType').textContent = getGroupDisplayName(groupType);
        document.getElementById('summaryParticipants').textContent = `${participants}人`;
        document.getElementById('summaryEventType').textContent = getEventTypeDisplayName(eventType);
        document.getElementById('summaryFeePerPerson').textContent = `${feePerPerson}元/人`;
        document.getElementById('summaryTotalFee').textContent = `${totalFee}元`;

        // 存储报名数据到临时变量（实际应用中会发送到服务器）
        tempRegistrationData = {
            teamName,
            leaderName,
            phone,
            email,
            groupType,
            eventType,
            participants,
            feePerPerson,
            totalFee,
            timestamp: new Date().toISOString()
        };

        // 显示参赛人员信息收集模态框
        const participantsModal = document.getElementById('participantsModal');
        if (participantsModal) {
            // 更新模态框中显示的参赛人数
            document.getElementById('modalParticipantsCount').textContent = participants;
            // 生成参赛人员表单
            generateParticipantsForm(participants, leaderName);
            participantsModal.classList.add('active');
        }
    });

    // 支付按钮事件处理
    const paymentButton = document.getElementById('paymentButton');
    if (paymentButton) {
        paymentButton.addEventListener('click', function() {
            // 模拟支付成功
            if (feeModal) {
                feeModal.classList.remove('active');
            }

            // 生成订单号
            const orderId = 'JCB' + new Date().getTime().toString().slice(-8);
            const paymentTime = new Date().toLocaleString('zh-CN');

            // 存储完成报名的数据
            if (tempRegistrationData) {
                const registrationData = {
                    ...tempRegistrationData,
                    orderId,
                    paymentTime,
                    status: 'paid'
                };

                // 保存到localStorage
                localStorage.setItem('junbeiRegistration', JSON.stringify(registrationData));

                // 更新成功模态框内容
                document.getElementById('paymentOrderId').textContent = orderId;
                document.getElementById('paymentTime').textContent = paymentTime;

                // 显示支付成功模态框
                if (paymentSuccessModal) {
                    paymentSuccessModal.classList.add('active');
                }
            }
        });
    }

    // 查看报名信息按钮事件
    const viewRegistrationBtn = document.getElementById('viewRegistrationBtn');
    if (viewRegistrationBtn) {
        viewRegistrationBtn.addEventListener('click', function() {
            if (paymentSuccessModal) {
                paymentSuccessModal.classList.remove('active');
            }
            // 切换到报名信息展示
            showRegistrationInfo();
            // 更新悬浮按钮文本
            updateFloatingButtonText();
        });
    }

    // 初始检查一次费用计算
    updateFeeCalculation();

    // 修改信息按钮事件处理
    const editRegistrationBtn = document.getElementById('editRegistrationBtn');
    if (editRegistrationBtn) {
        editRegistrationBtn.addEventListener('click', function() {
            // 清除报名数据（演示版）
            localStorage.removeItem('junbeiRegistration');

            // 显示表单，隐藏报名信息
            showRegistrationForm();

            // 更新悬浮按钮
            updateFloatingButtonText();

            // 滚动到表单区域
            const registrationSection = document.getElementById('registration');
            if (registrationSection) {
                registrationSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // 下载凭证按钮事件处理（演示版）
    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', function() {
            alert('下载功能为演示版本。实际报名凭证可在官方平台下载。');
        });
    }
}


// 显示报名信息，隐藏表单
function showRegistrationInfo() {
    const form = document.getElementById('demoRegistrationFormBox');
    const infoDisplay = document.getElementById('registrationInfoDisplay');
    const registrationSection = document.querySelector('.registration-section');
    const registrationContainer = document.querySelector('.registration-container');

    if (form && infoDisplay) {
        form.style.display = 'none';
        infoDisplay.style.display = 'block';
    }

    // 切换到信息模式布局
    if (registrationContainer) {
        registrationContainer.classList.add('info-mode');
    }

    // 滚动到报名区域
    if (registrationSection) {
        registrationSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // 加载报名数据
    loadRegistrationData();
}

// 显示表单，隐藏报名信息
function showRegistrationForm() {
    const form = document.getElementById('demoRegistrationFormBox');
    const infoDisplay = document.getElementById('registrationInfoDisplay');
    const registrationContainer = document.querySelector('.registration-container');

    if (form && infoDisplay) {
        form.style.display = 'block';
        infoDisplay.style.display = 'none';
    }

    // 恢复到正常表单布局
    if (registrationContainer) {
        registrationContainer.classList.remove('info-mode');
    }
}

// 加载报名数据到显示区域
function loadRegistrationData() {
    const registrationData = JSON.parse(localStorage.getItem('junbeiRegistration'));

    if (!registrationData) return;

    // 更新显示区域
    document.getElementById('displayTeamName').textContent = registrationData.teamName;
    document.getElementById('displayLeaderName').textContent = registrationData.leaderName;
    document.getElementById('displayPhone').textContent = registrationData.phone;
    document.getElementById('displayEmail').textContent = registrationData.email;
    document.getElementById('displayGroupType').textContent = getGroupDisplayName(registrationData.groupType);
    document.getElementById('displayParticipants').textContent = `${registrationData.participants}人`;
    document.getElementById('displayEventType').textContent = getEventTypeDisplayName(registrationData.eventType);
    document.getElementById('displayFeePerPerson').textContent = `${registrationData.feePerPerson}元/人`;
    document.getElementById('displayTotalFee').textContent = `${registrationData.totalFee}元`;
    document.getElementById('displayOrderId').textContent = registrationData.orderId || 'JCB20260001';
    document.getElementById('displayRegistrationTime').textContent = registrationData.paymentTime || new Date().toLocaleString('zh-CN');

    // 显示参赛人员名单
    const participantsListContainer = document.getElementById('displayParticipantsList');
    if (participantsListContainer) {
        if (registrationData.participantsList && registrationData.participantsList.length > 0) {
            let participantsHTML = '';
            registrationData.participantsList.forEach(participant => {
                participantsHTML += `
                    <div class="participant-item">
                        <div class="participant-number">${participant.number}.</div>
                        <div class="participant-name">${participant.name}</div>
                        <div class="participant-role">
                            ${participant.isLeader ? '<span class="role-badge leader"><i class="fas fa-crown"></i> 领队</span>' : '<span class="role-badge member"><i class="fas fa-user"></i> 队员</span>'}
                        </div>
                    </div>
                `;
            });
            participantsListContainer.innerHTML = participantsHTML;
        } else {
            participantsListContainer.innerHTML = '<p class="empty-list">暂无参赛人员信息</p>';
        }
    }
}

// 更新悬浮按钮文本
function updateFloatingButtonText() {
    const floatingBtn = document.getElementById('floatingRegisterBtn');
    const registrationData = JSON.parse(localStorage.getItem('junbeiRegistration'));

    if (floatingBtn) {
        if (registrationData && registrationData.status === 'paid') {
            // 已报名，显示"我的报名"
            floatingBtn.querySelector('i').className = 'fas fa-clipboard-check';
            floatingBtn.querySelector('span').textContent = '我的报名';

            // 更新点击事件 - 跳转到报名信息
            floatingBtn.onclick = function() {
                showRegistrationInfo();
            };
        } else {
            // 未报名，显示"立即报名"
            floatingBtn.querySelector('i').className = 'fas fa-user-plus';
            floatingBtn.querySelector('span').textContent = '立即报名';

            // 恢复原来的点击事件
            floatingBtn.onclick = function() {
                const registrationSection = document.getElementById('registration');
                if (registrationSection) {
                    registrationSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            };
        }
    }
}

// 填充测试数据到表单
function fillTestData() {
    const teamNameInput = document.getElementById('teamName');
    const leaderNameInput = document.getElementById('leaderName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const groupTypeSelect = document.getElementById('groupType');
    const eventTypeSelect = document.getElementById('eventType');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');

    // 检查是否所有字段都为空，避免覆盖用户输入
    if (teamNameInput && teamNameInput.value.trim() === '' &&
        leaderNameInput && leaderNameInput.value.trim() === '' &&
        phoneInput && phoneInput.value.trim() === '' &&
        emailInput && emailInput.value.trim() === '' &&
        groupTypeSelect && groupTypeSelect.value === '' &&
        eventTypeSelect && eventTypeSelect.value === '' &&
        agreeTermsCheckbox && !agreeTermsCheckbox.checked) {

        // 填充测试数据
        if (teamNameInput) teamNameInput.value = '长征先锋队';
        if (leaderNameInput) leaderNameInput.value = '张卫国';
        if (phoneInput) phoneInput.value = '13800138000';
        if (emailInput) emailInput.value = 'zhangweiguo@example.com';
        if (groupTypeSelect) groupTypeSelect.value = '职工青年';
        if (eventTypeSelect) eventTypeSelect.value = 'training';
        if (agreeTermsCheckbox) agreeTermsCheckbox.checked = true;

        // 触发费用计算更新
        if (groupTypeSelect && eventTypeSelect) {
            groupTypeSelect.dispatchEvent(new Event('change'));
            eventTypeSelect.dispatchEvent(new Event('change'));
        }
    }
}

// 将fillTestData函数暴露给全局，方便在控制台手动调用
if (typeof window !== 'undefined') {
    window.fillTestData = fillTestData;
}

// 检查报名状态并初始化界面
function checkRegistrationStatus() {
    const registrationData = JSON.parse(localStorage.getItem('junbeiRegistration'));

    if (registrationData && registrationData.status === 'paid') {
        // 已报名，显示报名信息
        showRegistrationInfo();
    } else {
        // 未报名，显示表单
        showRegistrationForm();
        // 填充测试数据（如果所有字段都为空）
        fillTestData();
    }

    // 更新悬浮按钮
    updateFloatingButtonText();
}

// 4. 悬浮报名按钮功能
function initFloatingButton() {
    const floatingBtn = document.getElementById('floatingRegisterBtn');
    const heroSection = document.querySelector('.hero');
    const registrationSection = document.getElementById('registration');

    if (!floatingBtn || !heroSection) return;

    // 监听滚动事件，控制悬浮按钮显示/隐藏
    window.addEventListener('scroll', () => {
        const heroHeight = heroSection.offsetHeight;
        const registrationTop = registrationSection ? registrationSection.offsetTop : Infinity;
        const registrationHeight = registrationSection ? registrationSection.offsetHeight : 0;

        // 判断是否在报名区域内
        const isInRegistrationSection = registrationSection &&
            window.scrollY >= registrationTop - 100 &&
            window.scrollY <= registrationTop + registrationHeight - 100;

        // 判断是否在hero区域之后
        const isAfterHero = window.scrollY > heroHeight - 100;

        // 显示规则：
        // 1. 在hero区域之后显示
        // 2. 但如果滚动到报名区域内则隐藏
        if (isAfterHero && !isInRegistrationSection) {
            floatingBtn.classList.add('show');
        } else {
            floatingBtn.classList.remove('show');
        }
    });

    // 点击悬浮按钮滚动到报名区域
    floatingBtn.addEventListener('click', () => {
        if (registrationSection) {
            registrationSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });

    // 初始检查一次
    const heroHeight = heroSection.offsetHeight;
    const registrationTop = registrationSection ? registrationSection.offsetTop : Infinity;
    const registrationHeight = registrationSection ? registrationSection.offsetHeight : 0;

    const isInRegistrationSection = registrationSection &&
        window.scrollY >= registrationTop - 100 &&
        window.scrollY <= registrationTop + registrationHeight - 100;
    const isAfterHero = window.scrollY > heroHeight - 100;

    if (isAfterHero && !isInRegistrationSection) {
        floatingBtn.classList.add('show');
    }
}

// 5. 模态框功能
function initModal() {
    // 需要初始化的模态框ID
    const modalIds = ['successModal', 'paymentSuccessModal', 'termsModal', 'healthModal', 'participantsModal'];

    modalIds.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // 为该模态框查找关闭按钮和确认按钮
        const modalClose = modal.querySelector('.modal-close');
        const modalConfirm = modal.querySelector('.modal-confirm');

        // 关闭该模态框的函数
        function closeModal() {
            modal.classList.remove('active');
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (modalConfirm) {
            modalConfirm.addEventListener('click', closeModal);
        }

        // 点击模态框背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });

    // ESC键关闭所有活动的模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalIds.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            });
        }
    });

    // 为参赛声明和健康承诺书链接添加点击事件
    const termsLinks = document.querySelectorAll('.terms-link');
    termsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            if (modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                }
            }
        });
    });

    // 为参赛人员信息模态框的返回按钮添加事件
    const modalBackBtn = document.querySelector('.modal-back-btn');
    if (modalBackBtn) {
        modalBackBtn.addEventListener('click', function() {
            const participantsModal = document.getElementById('participantsModal');
            if (participantsModal) {
                participantsModal.classList.remove('active');
            }
        });
    }
}

// 6. 滚动监听激活导航项
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= (sectionTop - 200) && scrollY < (sectionTop + sectionHeight - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 7. 页面加载动画
window.addEventListener('load', () => {
    // 添加加载完成类
    document.body.classList.add('page-loaded');

    // 移除加载动画（如果有）
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
    }
});

// 8. 添加一些视觉效果
function addVisualEffects() {
    // 为卡片添加交错动画
    const cards = document.querySelectorAll('.about-card, .schedule-card, .event-card, .award-card');

    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // 鼠标移动视差效果（可选）
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        // 为hero区域添加轻微视差
        const hero = document.querySelector('.hero-content');
        if (hero) {
            hero.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        }
    });
}

// 初始化视觉特效
addVisualEffects();

// 9. 倒计时功能（如果赛事有具体日期）
function initCountdown() {
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown-container';
    countdownElement.innerHTML = `
        <div class="countdown">
            <h3>距离赛事启动还有</h3>
            <div class="countdown-timer">
                <div class="countdown-item">
                    <span class="countdown-number" id="days">00</span>
                    <span class="countdown-label">天</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="hours">00</span>
                    <span class="countdown-label">时</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="minutes">00</span>
                    <span class="countdown-label">分</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="seconds">00</span>
                    <span class="countdown-label">秒</span>
                </div>
            </div>
        </div>
    `;

    // 将倒计时插入到hero区域之后
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.insertAdjacentElement('afterend', countdownElement);

        // 设置目标日期：2026年3月22日
        const targetDate = new Date('2026-03-22T00:00:00').getTime();

        // 更新倒计时
        function updateCountdown() {
            const now = new Date().getTime();
            const timeLeft = targetDate - now;

            if (timeLeft < 0) {
                countdownElement.innerHTML = '<div class="countdown"><h3>赛事已启动！</h3></div>';
                return;
            }

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }

        // 每秒更新一次
        updateCountdown();
        setInterval(updateCountdown, 1000);

        // 添加倒计时样式
        const style = document.createElement('style');
        style.textContent = `
            .countdown-container {
                background: var(--gradient-red);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .countdown h3 {
                font-size: 1.8rem;
                margin-bottom: 20px;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
            }
            .countdown-timer {
                display: flex;
                justify-content: center;
                gap: 20px;
                flex-wrap: wrap;
            }
            .countdown-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 80px;
            }
            .countdown-number {
                font-size: 2.5rem;
                font-weight: 900;
                background: rgba(255,255,255,0.2);
                padding: 10px 15px;
                border-radius: 8px;
                margin-bottom: 5px;
                min-width: 70px;
                display: inline-block;
            }
            .countdown-label {
                font-size: 1rem;
                opacity: 0.9;
            }
            @media (max-width: 768px) {
                .countdown-timer {
                    gap: 10px;
                }
                .countdown-item {
                    min-width: 60px;
                }
                .countdown-number {
                    font-size: 2rem;
                    min-width: 50px;
                    padding: 8px 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 可选：启用倒计时功能
// initCountdown();