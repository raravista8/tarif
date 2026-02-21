import React from 'react';
import { cn } from '@/lib/utils';
import { USER_PROFILES, type UserProfile } from '@/lib/scoring';
import { Check } from 'lucide-react';

interface ProfileSelectorProps {
  selectedProfile: UserProfile;
  onSelect: (profile: UserProfile) => void;
  className?: string;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  selectedProfile,
  onSelect,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Выберите ваш профиль использования
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.values(USER_PROFILES).map((profile) => {
          const isSelected = selectedProfile === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => onSelect(profile.id)}
              className={cn(
                'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                'hover:shadow-md',
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="text-2xl mb-2">{profile.emoji}</div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                {profile.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {profile.description}
              </div>
              
              {/* Веса */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Цена:</span>
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${profile.weights.price * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Интернет:</span>
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${profile.weights.internet * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSelector;
