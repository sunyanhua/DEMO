import React from 'react';
import { MapPin, ChevronDown, Bell, Search, SlidersHorizontal } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Location Selector */}
        <div className="flex items-center gap-0.5 cursor-pointer min-w-fit">
          <span className="text-gray-900 font-bold text-base">北京</span>
          <ChevronDown size={14} className="text-gray-600" />
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="找搭子、找活动..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-800"
            />
            <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>
            <SlidersHorizontal size={16} className="text-gray-500 cursor-pointer" />
          </div>
        </div>

        {/* Notification */}
        <button className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={22} className="text-gray-800" />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;