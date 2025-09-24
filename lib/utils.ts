import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function generateVideoCallLink(): string {
  // In a real app, this would integrate with Zoom, Google Meet, etc.
  const meetingId = Math.random().toString(36).substring(2, 15);
  return `https://meet.circleup.app/${meetingId}`;
}

export function calculateMatchScore(user1Interests: string[], user2Interests: string[]): number {
  const commonInterests = user1Interests.filter(interest => 
    user2Interests.includes(interest)
  );
  
  if (user1Interests.length === 0 || user2Interests.length === 0) return 0;
  
  const totalInterests = new Set([...user1Interests, ...user2Interests]).size;
  return Math.round((commonInterests.length / totalInterests) * 100);
}

export function getInterestIcon(interest: string): string {
  const iconMap: Record<string, string> = {
    technology: '💻',
    programming: '👨‍💻',
    design: '🎨',
    business: '💼',
    marketing: '📈',
    photography: '📸',
    sports: '⚽',
    fitness: '💪',
    music: '🎵',
    travel: '✈️',
    food: '🍕',
    books: '📚',
    writing: '✍️',
    gaming: '🎮',
    ai: '🤖',
    blockchain: '⛓️',
    startup: '🚀',
    finance: '💰',
  };
  
  return iconMap[interest.toLowerCase()] || '🔥';
}
