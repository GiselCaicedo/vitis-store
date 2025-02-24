import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  name: string;
  count: number;
  color: 'yellow' | 'blue' | 'pink' | 'red';
}

export const CategoryCard = ({ 
  icon: Icon,
  name, 
  count, 
  color 
}: CategoryCardProps) => {
  // Map color names to RGB values
  const getGlowColor = (colorName: CategoryCardProps['color']) => {
    switch (colorName) {
      case 'yellow': return 'rgb(255, 255, 0)';
      case 'blue': return 'rgb(0, 255, 255)';
      case 'pink': return 'rgb(255, 0, 255)';
      default: return 'rgb(255, 0, 0)';
    }
  };

  return (
    <div 
      className={`group cursor-pointer relative overflow-hidden bg-gray-900/30 
        backdrop-blur-sm p-4 rounded-lg border border-gray-800 
        hover:border-${color}-500/50 transition-all duration-300`}
      style={{
        boxShadow: `0 0 20px ${getGlowColor(color)}`
      }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-colors`}>
          {Icon && <Icon className={`h-5 w-5 text-${color}-400`} />}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-200">{name}</h3>
          <p className="text-xs text-gray-400">{count} items</p>
        </div>
        <ChevronRight className={`h-4 w-4 text-${color}-400 group-hover:translate-x-1 transition-transform`} />
      </div>
    </div>
  );
};

export default CategoryCard;