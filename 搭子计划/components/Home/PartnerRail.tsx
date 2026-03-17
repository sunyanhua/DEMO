import React from 'react';
import { MOCK_PARTNERS } from '../../constants';
import { Sparkles, UserPlus } from 'lucide-react';

const PartnerRail: React.FC = () => {
  return (
    <div className="pt-6 pb-2">
      <div className="px-4 flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-brand-yellow/20 rounded-md">
            <Sparkles className="text-brand-orange" size={16} fill="currentColor" />
          </div>
          <h2 className="text-lg font-black text-gray-900">为你推荐</h2>
        </div>
        <button className="text-xs text-gray-400 flex items-center">
          查看更多 <span className="ml-1">&gt;</span>
        </button>
      </div>

      <div className="flex overflow-x-auto px-4 gap-3 no-scrollbar pb-2">
        {MOCK_PARTNERS.map((partner) => (
          <div 
            key={partner.id} 
            className="flex-shrink-0 w-36 bg-white rounded-xl p-3 shadow-sm border border-gray-100 relative overflow-hidden group"
          >
            {/* Decorative background circle */}
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-brand-orange/10 to-brand-yellow/10 rounded-full blur-xl"></div>

            <div className="flex flex-col items-center relative z-10">
              <div className="relative mb-2">
                <img 
                  src={partner.avatarUrl} 
                  alt={partner.name} 
                  className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-brand-blue text-[8px] text-white px-1.5 py-0.5 rounded-full border border-white">
                  {partner.distance}
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 text-sm mb-1 truncate w-full text-center">
                {partner.name}
              </h3>
              
              <div className="flex flex-wrap justify-center gap-1 mb-2 h-5 overflow-hidden">
                {partner.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded-md border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-[10px] text-gray-400 text-center line-clamp-2 h-8 leading-tight w-full mb-2 bg-gray-50/50 rounded p-1">
                "{partner.intro}"
              </p>

              <button className="w-full py-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-[10px] font-bold rounded-full shadow-lg shadow-gray-200 active:scale-95 transition-transform flex items-center justify-center gap-1">
                <UserPlus size={10} />
                <span>搭讪</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerRail;