'use client';

import { Coffee } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ 
  title = "CircleUp", 
  subtitle = "Find Your Coffee Buddy",
  action 
}: HeaderProps) {
  return (
    <header className="text-center py-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Coffee className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
      </div>
      
      {subtitle && (
        <p className="text-text-secondary text-sm mb-4">{subtitle}</p>
      )}
      
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </header>
  );
}
