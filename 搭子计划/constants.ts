import { Activity, ActivityCategory, ActivityStatus, CategoryItem, Partner } from './types';

export const MOCK_USER = {
  id: 'u1',
  name: 'ActiveExplorer',
  avatarUrl: 'https://picsum.photos/100/100'
};

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: '滑雪大冒险',
    avatarUrl: 'https://picsum.photos/100/100?random=20',
    tags: ['单板', '自驾', '摄影'],
    intro: '崇礼周末往返，缺人拼车！',
    distance: '1.2km'
  },
  {
    id: 'p2',
    name: 'CoffeeJane',
    avatarUrl: 'https://picsum.photos/100/100?random=21',
    tags: ['探店', '手冲', '阅读'],
    intro: '寻找三里屯附近的咖啡搭子。',
    distance: '0.5km'
  },
   {
    id: 'p3',
    name: '健身狂魔',
    avatarUrl: 'https://picsum.photos/100/100?random=22',
    tags: ['举铁', '增肌', '早起'],
    intro: '每天早上6点健身房见。',
    distance: '3.0km'
  },
   {
    id: 'p4',
    name: '剧本杀DM',
    avatarUrl: 'https://picsum.photos/100/100?random=23',
    tags: ['推理', '演绎'],
    intro: '缺1人，硬核本，速来！',
    distance: '5.2km'
  }
];

export const CATEGORIES: CategoryItem[] = [
  { id: 'c1', label: '运动', icon: '🏀', color: 'bg-orange-100 text-orange-600', type: ActivityCategory.SPORTS },
  { id: 'c2', label: '户外', icon: '⛺', color: 'bg-green-100 text-green-600', type: ActivityCategory.OUTDOORS },
  { id: 'c3', label: '饭搭子', icon: '🥘', color: 'bg-yellow-100 text-yellow-600', type: ActivityCategory.DINING },
  { id: 'c4', label: '看展', icon: '🎨', color: 'bg-purple-100 text-purple-600', type: ActivityCategory.CULTURE },
  { id: 'c5', label: '娱乐', icon: '🎤', color: 'bg-pink-100 text-pink-600', type: ActivityCategory.ENTERTAINMENT },
  { id: 'c6', label: '其他', icon: '🧩', color: 'bg-blue-100 text-blue-600', type: ActivityCategory.OTHER },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: '朝阳公园飞盘新手局',
    description: '欢迎萌新！有专业教练指导，并在活动后一起聚餐。',
    category: ActivityCategory.SPORTS,
    imageUrl: 'https://picsum.photos/400/300?random=1',
    location: '朝阳公园南门草坪',
    district: '朝阳区',
    date: '本周六 14:00',
    price: 39,
    organizer: { id: 'u2', name: '飞盘小队长', avatarUrl: 'https://picsum.photos/50/50?random=2' },
    status: ActivityStatus.RECRUITING,
    currentParticipants: 12,
    maxParticipants: 20,
    tags: ['萌新友好', '含饮料', '社交']
  },
  {
    id: 'a2',
    title: '三里屯Bistro早午餐',
    description: '打卡网红Bistro，聊聊最近的工作和生活，寻找志同道合的朋友。',
    category: ActivityCategory.DINING,
    imageUrl: 'https://picsum.photos/400/300?random=3',
    location: '三里屯太古里北区',
    district: '朝阳区',
    date: '本周日 11:00',
    price: 0, // AA制 usually
    organizer: { id: 'u3', name: 'FoodieJane', avatarUrl: 'https://picsum.photos/50/50?random=4' },
    status: ActivityStatus.RECRUITING,
    currentParticipants: 3,
    maxParticipants: 6,
    tags: ['AA制', '拍照', '美食']
  },
  {
    id: 'a3',
    title: '奥森公园5km慢跑+拉伸',
    description: '不仅是跑步，更是为了呼吸新鲜空气。配速600，不卷。',
    category: ActivityCategory.SPORTS,
    imageUrl: 'https://picsum.photos/400/300?random=5',
    location: '奥林匹克森林公园南门',
    district: '朝阳区',
    date: '今晚 19:30',
    price: 0,
    organizer: { id: 'u4', name: '夜跑达人', avatarUrl: 'https://picsum.photos/50/50?random=6' },
    status: ActivityStatus.FULL,
    currentParticipants: 10,
    maxParticipants: 10,
    tags: ['免费', '健康', '夜跑']
  },
  {
    id: 'a4',
    title: '环球影城一日游搭子',
    description: '主要想刷霸天虎过山车，有没有一起的？最好有优速通。',
    category: ActivityCategory.ENTERTAINMENT,
    imageUrl: 'https://picsum.photos/400/300?random=7',
    location: '北京环球度假区',
    district: '通州区',
    date: '下周五 全天',
    price: 0,
    organizer: { id: 'u5', name: '魔法师', avatarUrl: 'https://picsum.photos/50/50?random=8' },
    status: ActivityStatus.RECRUITING,
    currentParticipants: 1,
    maxParticipants: 3,
    tags: ['哈利波特', '过山车']
  }
];