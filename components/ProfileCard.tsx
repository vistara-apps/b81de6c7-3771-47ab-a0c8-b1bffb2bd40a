'use client';

import { User } from '@/lib/types';
import { getInterestIcon } from '@/lib/utils';
import { MapPin, Clock } from 'lucide-react';

interface ProfileCardProps {
  user: User;
  variant?: 'compact' | 'detailed';
  onAction?: () => void;
  actionLabel?: string;
  actionVariant?: 'primary' | 'secondary' | 'accent';
}

export function ProfileCard({ 
  user, 
  variant = 'compact',
  onAction,
  actionLabel,
  actionVariant = 'primary'
}: ProfileCardProps) {
  const buttonClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
  }[actionVariant];

  return (
    <div className="card animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm">
            {user.displayName?.charAt(0) || user.xHandle?.charAt(0) || 'U'}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-text-primary truncate">
              {user.displayName || user.xHandle || 'Anonymous'}
            </h3>
            {user.xHandle && (
              <span className="text-xs text-text-secondary">@{user.xHandle}</span>
            )}
          </div>
          
          {variant === 'detailed' && user.bio && (
            <p className="text-sm text-text-secondary mb-2 line-clamp-2">
              {user.bio}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{user.timezone.split('/')[1]?.replace('_', ' ') || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Available</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {user.extractedInterests.slice(0, variant === 'compact' ? 3 : 6).map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs text-text-primary rounded-sm"
              >
                <span>{getInterestIcon(interest)}</span>
                <span>{interest}</span>
              </span>
            ))}
            {user.extractedInterests.length > (variant === 'compact' ? 3 : 6) && (
              <span className="text-xs text-text-secondary px-2 py-1">
                +{user.extractedInterests.length - (variant === 'compact' ? 3 : 6)} more
              </span>
            )}
          </div>
          
          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className={`w-full ${buttonClass} text-sm`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
