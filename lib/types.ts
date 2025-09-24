export interface User {
  userId: string;
  telegramId: string;
  xProfileUrl?: string;
  xHandle?: string;
  extractedInterests: string[];
  preferences: UserPreferences;
  timezone: string;
  profilePicture?: string;
  displayName?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  industries?: string[];
  skills?: string[];
  topics?: string[];
  meetingDuration?: number; // in minutes
  availableDays?: string[];
  availableHours?: { start: string; end: string };
}

export interface Match {
  matchId: string;
  user1Id: string;
  user2Id: string;
  matchScore: number;
  status: 'pending' | 'scheduled' | 'completed' | 'declined';
  scheduledTime?: Date;
  videoCallLink?: string;
  conversationStarters?: string[];
  createdAt: Date;
}

export interface Interest {
  name: string;
  category: 'technology' | 'business' | 'creative' | 'sports' | 'lifestyle' | 'other';
  confidence: number;
}

export interface SchedulingSlot {
  datetime: Date;
  available: boolean;
  timezone: string;
}

export interface ConversationStarter {
  id: string;
  text: string;
  category: string;
  relevantInterests: string[];
}
