import React, { useState } from 'react';
import { MOCK_ACTIVITIES } from '../../constants';
import ActivityCard from '../Shared/ActivityCard';
import { Sparkles, Filter } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const [filterType, setFilterType] = useState<'latest' | 'nearest'>('latest');

  return (
    <div className="px-4 pb-24 pt-4">
      {/* Feed Header */}
      <div className="flex items-center justify-between mb-4 sticky top-[60px] z-30 bg-gray-50/95 backdrop-blur py-2">
        <div className="flex items-center gap-1">
          <Sparkles className="text-brand-orange" size={20} fill="currentColor" />
          <h2 className="text-xl font-black text-gray-800 italic">热门推荐</h2>
        </div>
        <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
           <button 
             onClick={() => setFilterType('latest')}
             className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${filterType === 'latest' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             最新
           </button>
           <button 
             onClick={() => setFilterType('nearest')}
             className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${filterType === 'nearest' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             离我最近
           </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
      
      <div className="mt-6 text-center text-gray-400 text-xs">
        已经到底啦 ~
      </div>
    </div>
  );
};

export default ActivityFeed;