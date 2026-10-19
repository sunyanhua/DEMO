import React from 'react';
import { MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import { Activity, ActivityStatus } from '../../types';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const isFull = activity.status === ActivityStatus.FULL;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 mb-4 group cursor-pointer relative">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={activity.imageUrl}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-bold rounded-full backdrop-blur-md ${
            activity.status === ActivityStatus.RECRUITING
              ? 'bg-brand-orange text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {activity.status === ActivityStatus.RECRUITING ? '招募中' : '已满员'}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
           <div className="flex gap-2">
             {activity.tags.map((tag, idx) => (
               <span key={idx} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-md border border-white/30">
                 #{tag}
               </span>
             ))}
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{activity.title}</h3>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-brand-blue" />
            <span>{activity.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-brand-blue" />
            <span className="line-clamp-1">{activity.district} · {activity.location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={activity.organizer.avatarUrl} alt="Organizer" className="w-6 h-6 rounded-full border border-gray-200" />
            <span className="text-xs text-gray-500 truncate max-w-[80px]">{activity.organizer.name}</span>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center text-xs text-gray-400">
                <Users size={14} className="mr-1" />
                <span>{activity.currentParticipants}/{activity.maxParticipants}</span>
             </div>
             <button disabled={isFull} className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
               isFull 
               ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
               : 'bg-gradient-to-r from-brand-orange to-brand-yellow text-white shadow-brand-orange/30 shadow-lg'
             }`}>
               {isFull ? '已满' : '去报名'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;