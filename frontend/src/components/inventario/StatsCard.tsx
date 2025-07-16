import React from 'react';


export const StatsCard = ({ icon: Icon, title, value, trend, color }) => (
  <div className={`relative overflow-hidden bg-gray-900/50 backdrop-blur-lg p-6 rounded-xl border border-gray-800 
    hover:border-${color}-500 transition-all duration-300 group cursor-pointer
    hover:shadow-[0_0_30px_rgba(var(--stats-glow),0.15)]`}
    style={{ '--stats-glow': color === 'yellow' ? '255,255,0' : 
                            color === 'blue' ? '0,255,255' : 
                            color === 'pink' ? '255,0,255' : '255,0,0' }}>
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-800/50" />
    <div className="relative flex items-center justify-between">
      <div>
        <p className={`text-${color}-400 text-sm mb-1 font-medium tracking-wide`}>{title}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-colors`}>
        <Icon className={`h-6 w-6 text-${color}-400`} />
      </div>
    </div>
  </div>
);