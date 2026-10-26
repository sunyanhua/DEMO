/** @type {import('tailwindcss').Config} */
// 静态构建配置——与 common.js 里 Play CDN 的 tailwind.config 保持一致（v3 语义）
module.exports = {
    content: [
        './**/*.html',
        './**/*.js',
        '!./**/*.test.cjs',
        '!./vendor/**',
        '!./node_modules/**',
    ],
    safelist: [
        // message.html 通知图标颜色为动态拼接（bg-${bgColor} / text-${textColor}）
        'bg-blue-50', 'text-blue-500',
        'bg-green-50', 'text-green-500',
        'bg-red-50', 'text-red-500',
    ],
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
    },
    plugins: [],
}
