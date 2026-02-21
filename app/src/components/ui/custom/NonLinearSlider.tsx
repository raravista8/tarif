import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SliderOption {
  label: string;
  value: number;
  isUnlimited?: boolean;
}

interface NonLinearSliderProps {
  label: string;
  options: SliderOption[];
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  className?: string;
}

export const NonLinearSlider: React.FC<NonLinearSliderProps> = ({
  label,
  options,
  value,
  onChange,
  icon,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
  // Находим текущий индекс
  const currentIndex = useMemo(() => {
    const index = options.findIndex(opt => opt.value === value);
    return index >= 0 ? index : 0;
  }, [value, options]);
  
  // Получаем отображаемое значение
  const displayValue = useMemo(() => {
    const option = options[currentIndex];
    if (!option) return '';
    if (option.isUnlimited) return 'Безлимит';
    return option.label;
  }, [currentIndex, options]);
  
  // Вычисляем индекс из позиции
  const calculateIndexFromPosition = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return currentIndex;
    
    const rect = track.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return Math.round(percentage * (options.length - 1));
  }, [currentIndex, options.length]);
  
  // Обработчик клика/тапа по треку
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newIndex = calculateIndexFromPosition(clientX);
    onChange(options[newIndex]?.value ?? options[0]?.value ?? 0);
  }, [calculateIndexFromPosition, options, onChange]);
  
  // Обработчик начала перетаскивания (мышь)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const newIndex = calculateIndexFromPosition(e.clientX);
      onChange(options[newIndex]?.value ?? options[0]?.value ?? 0);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [calculateIndexFromPosition, options, onChange]);
  
  // Обработчик начала касания (touch)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const newIndex = calculateIndexFromPosition(touch.clientX);
      onChange(options[newIndex]?.value ?? options[0]?.value ?? 0);
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
  }, [calculateIndexFromPosition, options, onChange]);
  
  // Обработчик касания по треку
  const handleTrackTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const newIndex = calculateIndexFromPosition(touch.clientX);
    onChange(options[newIndex]?.value ?? options[0]?.value ?? 0);
  }, [calculateIndexFromPosition, options, onChange]);
  
  // Процент заполнения
  const fillPercentage = (currentIndex / (options.length - 1)) * 100;
  
  return (
    <div className={cn('w-full select-none', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-500">{icon}</span>}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
        </div>
        <span className={cn(
          'text-sm font-semibold px-3 py-1 rounded-full transition-all duration-200',
          'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
          isDragging && 'scale-110 bg-indigo-200'
        )}>
          {displayValue}
        </span>
      </div>
      
      {/* Трек слайдера */}
      <div
        ref={trackRef}
        className={cn(
          'relative h-4 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer touch-none',
          'transition-all duration-200',
          isDragging && 'h-5 sm:h-4'
        )}
        onClick={handleTrackClick}
        onTouchStart={handleTrackTouch}
      >
        {/* Заполненная часть */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-150"
          style={{ width: `${fillPercentage}%` }}
        />
        
        {/* Метки значений */}
        <div className="absolute inset-0 flex justify-between items-center px-0 pointer-events-none">
          {options.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-200',
                index <= currentIndex
                  ? 'bg-white/50'
                  : 'bg-slate-400/50 dark:bg-slate-500/50'
              )}
              style={{ marginLeft: index === 0 ? '0' : undefined }}
            />
          ))}
        </div>
        
        {/* Ползунок (thumb) */}
        <div
          ref={thumbRef}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
            'w-7 h-7 sm:w-6 sm:h-6 bg-white dark:bg-slate-200 rounded-full shadow-lg',
            'border-2 border-indigo-500 cursor-grab touch-none',
            'transition-all duration-200',
            'hover:scale-110 hover:shadow-xl',
            'active:scale-125 active:shadow-2xl active:border-purple-500',
            isDragging && 'scale-125 cursor-grabbing shadow-2xl border-purple-500'
          )}
          style={{ left: `${fillPercentage}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Пульсация при перетаскивании */}
          {isDragging && (
            <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping" />
          )}
        </div>
      </div>
      
      {/* Метки под слайдером */}
      <div className="flex justify-between mt-2 text-xs text-slate-400 dark:text-slate-500">
        <span>{options[0]?.isUnlimited ? 'Безлимит' : options[0]?.label}</span>
        <span>{options[options.length - 1]?.isUnlimited ? 'Безлимит' : options[options.length - 1]?.label}</span>
      </div>
    </div>
  );
};

export default NonLinearSlider;
