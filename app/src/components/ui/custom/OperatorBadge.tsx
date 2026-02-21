import React from 'react';
import { cn } from '@/lib/utils';
import type { Operator } from '@/types';

interface OperatorBadgeProps {
  operator: Operator;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const OperatorBadge: React.FC<OperatorBadgeProps> = ({
  operator,
  size = 'md',
  showName = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };
  
  const nameSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-xl flex items-center justify-center font-bold text-white shadow-md',
          sizeClasses[size]
        )}
        style={{ backgroundColor: operator.color }}
      >
        {operator.name.charAt(0)}
      </div>
      {showName && (
        <span className={cn('font-medium text-slate-700 dark:text-slate-300', nameSizeClasses[size])}>
          {operator.name}
        </span>
      )}
    </div>
  );
};

export default OperatorBadge;
