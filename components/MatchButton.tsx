'use client';

import { Coffee, Heart, X, Clock } from 'lucide-react';

interface MatchButtonProps {
  variant: 'primary' | 'secondary' | 'destructive';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function MatchButton({ 
  variant, 
  onClick, 
  disabled = false, 
  loading = false,
  children 
}: MatchButtonProps) {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-accent text-white hover:opacity-90 active:scale-95",
    secondary: "bg-gray-200 text-text-primary hover:bg-gray-300",
    destructive: "bg-red-500 text-white hover:bg-red-600 active:scale-95",
  };

  const getIcon = () => {
    if (loading) return <Clock className="w-4 h-4 animate-spin" />;
    
    switch (variant) {
      case 'primary':
        return <Coffee className="w-4 h-4" />;
      case 'secondary':
        return <Heart className="w-4 h-4" />;
      case 'destructive':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {getIcon()}
      <span>{children}</span>
    </button>
  );
}
