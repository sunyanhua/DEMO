import React from 'react';
import { CATEGORIES } from '../../constants';

const CategoryGrid: React.FC = () => {
  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-4 gap-y-4 gap-x-2">
        {CATEGORIES.slice(0, 4).map((cat) => (
          <div key={cat.id} className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm group-active:scale-95 transition-transform`}>
              {cat.icon}
            </div>
            <span className="text-xs text-gray-600 font-medium">{cat.label}</span>
          </div>
        ))}
         {/* Second row can be different or hardcoded for layout variety */}
         <div className="col-span-4 flex justify-between px-2 pt-2">
            <div className="w-[48%] bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded-xl flex items-center justify-between cursor-pointer border border-pink-200/50">
               <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-sm">周末好去处</span>
                  <span className="text-[10px] text-gray-500">解锁城市新玩法</span>
               </div>
               <span className="text-xl">🎡</span>
            </div>
            <div className="w-[48%] bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl flex items-center justify-between cursor-pointer border border-blue-200/50">
               <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-sm">官方活动</span>
                  <span className="text-[10px] text-gray-500">BRTV特别策划</span>
               </div>
               <span className="text-xl">📺</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CategoryGrid;