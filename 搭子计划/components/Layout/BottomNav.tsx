import React from 'react';
import { Home, MessageSquareMore, Compass, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'message', label: '消息', icon: MessageSquareMore },
    { id: 'discover', label: '发现', icon: Compass },
    { id: 'me', label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center w-16 space-y-1 transition-all duration-200"
            >
              <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-brand-orange/10' : 'bg-transparent'}`}>
                <Icon
                  size={24}
                  className={`${isActive ? 'text-brand-orange fill-brand-orange' : 'text-gray-400'}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-brand-orange' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;