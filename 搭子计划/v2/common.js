// 配置 Tailwind
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    brand: {
                        orange: '#FF6B00',
                        yellow: '#FFD000',
                        blue: '#42A5F5',
                        teal: '#00A99D',
                        purple: '#7B1FA2',
                        pink: '#FF4081',
                        green: '#00C853',
                        red: '#FF3D00',
                        bg: '#F8F9FA'
                    },
                    vibrant: {
                        pink: '#FF4081',
                        orange: '#FF6B00',
                        yellow: '#FFD000',
                        green: '#00C853',
                        teal: '#00BFA5',
                        blue: '#2962FF',
                        purple: '#7B1FA2',
                        red: '#FF3D00'
                    }
                },
                fontFamily: {
                    sans: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
                },
                padding: {
                    'safe': 'env(safe-area-inset-bottom)'
                }
            }
        }
    }
}

window.Common = {
    // 渲染底部导航
    renderBottomNav(activeTabId) {
        const tabs = [
            { id: 'home', label: '首页', icon: 'home', href: 'index.html' },
            { id: 'discover', label: '发现', icon: 'compass', href: 'category.html' }, 
            { id: 'publish', label: '发布', icon: 'plus', isSpecial: true, href: 'publish.html' },
            { id: 'message', label: '消息', icon: 'message-square-more', href: 'message.html' },
            { id: 'me', label: '我的', icon: 'user', href: 'me.html' },
        ];

        const buttonsHtml = tabs.map(tab => {
            if (tab.isSpecial) {
                return `
                <a href="${tab.href}" class="flex flex-col items-center justify-end w-16 -mt-6 transition-all duration-200 group no-underline">
                  <div class="w-12 h-12 bg-gradient-to-tr from-brand-orange to-brand-yellow rounded-full flex items-center justify-center shadow-lg publish-btn-shadow border-4 border-white group-active:scale-95 transition-transform ${activeTabId === tab.id ? 'ring-2 ring-brand-orange/20' : ''}">
                    <i data-lucide="${tab.icon}" class="w-7 h-7 text-white" stroke-width="3"></i>
                  </div>
                  <span class="text-[10px] font-medium text-gray-500 mt-1">${tab.label}</span>
                </a>
                `;
            }

            const isActive = activeTabId === tab.id;
            const iconClass = isActive ? 'text-brand-orange fill-brand-orange' : 'text-gray-400';
            const textClass = isActive ? 'text-brand-orange' : 'text-gray-400';
            const bgClass = isActive ? 'bg-brand-orange/10' : 'bg-transparent';
            const strokeWidth = isActive ? 2.5 : 2;

            return `
            <a href="${tab.href}" class="flex flex-col items-center justify-center w-16 space-y-1 transition-all duration-200 no-underline">
              <div class="p-1.5 rounded-full transition-colors ${bgClass}">
                <i data-lucide="${tab.icon}" class="w-6 h-6 ${iconClass}" stroke-width="${strokeWidth}"></i>
              </div>
              <span class="text-[10px] font-medium ${textClass}">${tab.label}</span>
            </a>
            `;
        }).join('');

        return `
        <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
          <div class="flex justify-between items-end pb-2 h-[50px]">
            ${buttonsHtml}
          </div>
        </div>
        `;
    },

    // 简单的 Toast 提示
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg z-[100] text-sm fade-in`;
        toast.innerText = message;
        document.body.appendChild(toast);
        this.initIcons();
        setTimeout(() => {
            toast.remove();
        }, 2000);
    },

    // 渲染图标 - 增加重试机制确保加载
    initIcons() {
        if(typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide not loaded yet, retrying in 200ms');
            setTimeout(() => {
               if(typeof lucide !== 'undefined') lucide.createIcons();
            }, 200);
        }
    },

    // 活动报名流程
    async processActivityRegistration(activityId, activityTitle, price) {
        // 检查活动是否已满
        const activity = window.GlobalData.activities.find(a => a.id === activityId);
        if (!activity) {
            this.showToast('活动不存在');
            return false;
        }

        if (activity.currentParticipants >= activity.maxParticipants) {
            this.showToast('活动名额已满');
            return false;
        }

        // 免费活动直接报名
        if (price === 0) {
            return this.createOrder(activityId, activityTitle, price);
        }

        // 收费活动显示支付确认
        return this.showPaymentModal(activityId, activityTitle, price);
    },

    // 显示支付模态框
    showPaymentModal(activityId, activityTitle, price) {
        return new Promise((resolve) => {
            // 移除已存在的支付模态框
            const existingOverlay = document.querySelector('.payment-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }

            // 创建唯一的模态框ID
            const modalId = 'payment-modal-' + Date.now();

            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4 fade-in';
            overlay.classList.add('payment-overlay');

            // 支付内容
            overlay.innerHTML = `
                <div id="${modalId}" class="bg-white rounded-2xl w-full max-w-sm p-5 fade-in" onclick="event.stopPropagation()">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-gray-900">支付确认</h3>
                        <button onclick="window.Common.closePaymentModal()" class="p-1 hover:bg-gray-100 rounded-full">
                            <i data-lucide="x" class="w-5 h-5 text-gray-400"></i>
                        </button>
                    </div>

                    <div class="mb-6">
                        <div class="text-center mb-4">
                            <div class="text-3xl font-black text-brand-orange mb-1">¥${price.toFixed(2)}</div>
                            <div class="text-sm text-gray-500">${activityTitle}</div>
                        </div>

                        <div class="bg-gray-50 rounded-xl p-4 mb-4">
                            <div class="flex items-center justify-between text-sm mb-2">
                                <span class="text-gray-600">支付方式</span>
                                <span class="font-bold text-gray-900">微信支付</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600">订单号</span>
                                <span class="text-gray-500">${new Date().getTime()}</span>
                            </div>
                        </div>

                        <div class="text-xs text-gray-500 mb-6 text-center">
                            此为模拟支付，不会产生真实扣款
                        </div>
                    </div>

                    <div class="space-y-3">
                        <button onclick="window.Common.handlePaymentConfirm('${activityId}', '${activityTitle.replace(/'/g, "\\'")}', ${price}, '${modalId}')" class="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full shadow-sm">
                            确认支付 ¥${price.toFixed(2)}
                        </button>
                        <button onclick="window.Common.closePaymentModal()" class="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-full">
                            取消
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            this.initIcons();

            // 点击遮罩层关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closePaymentModal();
                }
            });

            // 定义关闭函数
            window.Common.closePaymentModal = () => {
                overlay.remove();
                resolve(false); // 用户取消支付
            };

            // 定义支付确认函数
            window.Common.handlePaymentConfirm = (id, title, amount, targetModalId) => {
                // 确保点击的是当前模态框的确认按钮
                if (modalId !== targetModalId) return;

                overlay.remove();
                this.createOrder(id, title, amount).then(success => {
                    resolve(success);
                });
            };
        });
    },

    // 创建订单
    async createOrder(activityId, activityTitle, amount) {
        try {
            // 生成订单ID
            const orderId = 'o' + (window.GlobalData.orders.length + 1);
            const currentTime = new Date();
            const timeStr = currentTime.getHours() < 12 ? '今天 ' + currentTime.getHours() + ':' + (currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes() :
                          '今天 ' + currentTime.getHours() + ':' + (currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes();

            // 创建新订单
            const newOrder = {
                id: orderId,
                activityId: activityId,
                activityTitle: activityTitle,
                amount: amount,
                status: 'paid',
                time: timeStr,
                participants: 1,
                userId: window.GlobalData.user.id
            };

            // 添加到订单列表
            window.GlobalData.orders.unshift(newOrder);

            // 更新活动报名人数
            const activity = window.GlobalData.activities.find(a => a.id === activityId);
            if (activity) {
                activity.currentParticipants += 1;
                // 如果报满，更新状态
                if (activity.currentParticipants >= activity.maxParticipants) {
                    activity.status = 'FULL';
                }
            }

            // 添加钱包记录（如果是收费活动）
            if (amount > 0) {
                const walletRecordId = 'wr' + (window.GlobalData.walletRecords.length + 1);
                window.GlobalData.walletRecords.unshift({
                    id: walletRecordId,
                    type: 'expense',
                    description: `报名活动"${activityTitle}"`,
                    amount: -amount,
                    time: timeStr,
                    status: 'completed'
                });
            }

            // 显示成功提示
            const successMessage = amount > 0 ?
                `支付成功！已报名${activityTitle}` :
                `报名成功！${activityTitle}`;
            this.showToast(successMessage);

            // 添加通知
            const notificationId = 'n' + (window.GlobalData.notifications.length + 1);
            window.GlobalData.notifications.unshift({
                id: notificationId,
                title: '活动报名成功',
                content: `您已成功报名"${activityTitle}"${amount > 0 ? '，费用¥' + amount.toFixed(2) : ''}。请准时参加。`,
                time: '刚刚',
                type: 'success'
            });

            // 刷新页面以更新显示（如果是详情页）
            setTimeout(() => {
                if (window.location.pathname.includes('detail.html')) {
                    location.reload();
                }
            }, 1500);

            return true;
        } catch (error) {
            console.error('创建订单失败:', error);
            this.showToast('报名失败，请重试');
            return false;
        }
    }
};