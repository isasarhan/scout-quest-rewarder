
import { Rank } from '@/data/ranks';

interface RankBadgeProps {
  rank: Rank;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const RankBadge = ({ 
  rank, 
  size = 'md', 
  showName = true,
  className = ''
}: RankBadgeProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  const fontSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className={`${rank.color} rounded-full flex items-center justify-center ${sizeClasses[size]} border-4 border-white dark:border-gray-800 shadow-md transition-all duration-300 hover:scale-105`}
      >
        <img 
          src={rank.image} 
          alt={rank.name} 
          className="w-2/3 h-2/3 object-contain"
        />
      </div>
      {showName && (
        <span className={`mt-2 font-semibold ${fontSizeClasses[size]}`}>
          {rank.name}
        </span>
      )}
    </div>
  );
};

export default RankBadge;
