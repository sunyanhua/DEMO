import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="px-4 py-3">
      <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-blue">
        {/* Decorative elements imitating the poster */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-blue/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
          <div className="flex items-start gap-2 mb-1">
             <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium">BRTV</span>
             <span className="text-xs font-light tracking-widest opacity-90">北京广播电视台</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-wide drop-shadow-md mb-2">
            搭子计划
          </h1>
          <p className="text-lg font-medium opacity-90 mb-4">
            找搭子，就现在！
          </p>
          <button className="self-start bg-white text-brand-orange px-5 py-1.5 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform">
            立即发布活动
          </button>
        </div>

        {/* Abstract shapes/illustrations */}
        <div className="absolute bottom-0 right-4 w-28 h-28 opacity-90">
             {/* Simple geometric representation of city buildings/people from poster */}
             <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                <rect x="60" y="40" width="30" height="60" rx="2" fill="#42A5F5" />
                <rect x="20" y="60" width="30" height="40" rx="2" fill="#FFD000" />
                <circle cx="80" cy="30" r="10" fill="white" fillOpacity="0.8" />
             </svg>
        </div>
      </div>
    </div>
  );
};

export default Banner;