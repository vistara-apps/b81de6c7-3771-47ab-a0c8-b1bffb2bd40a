'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { Header } from '@/components/Header';
import { ProfileCard } from '@/components/ProfileCard';
import { MatchButton } from '@/components/MatchButton';
import { User, Match } from '@/lib/types';
import { calculateMatchScore, generateVideoCallLink } from '@/lib/utils';
import { generateConversationStarters } from '@/lib/api';
import { Coffee, Users, Settings, Plus } from 'lucide-react';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    userId: '1',
    telegramId: '123456789',
    xHandle: 'techfounder',
    displayName: 'Alex Chen',
    bio: 'Full-stack developer passionate about React, AI, and building great products.',
    extractedInterests: ['React', 'AI', 'Startups', 'Product Design', 'TypeScript'],
    preferences: { industries: ['Technology'], meetingDuration: 30 },
    timezone: 'America/Los_Angeles',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: '2',
    telegramId: '987654321',
    xHandle: 'designguru',
    displayName: 'Sarah Kim',
    bio: 'UX Designer helping startups create beautiful, user-centered products.',
    extractedInterests: ['UX Design', 'Product Design', 'Startups', 'Figma', 'User Research'],
    preferences: { industries: ['Design', 'Technology'], meetingDuration: 45 },
    timezone: 'America/New_York',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: '3',
    telegramId: '456789123',
    xHandle: 'airesearcher',
    displayName: 'Dr. Michael Zhang',
    bio: 'AI researcher exploring the intersection of machine learning and human creativity.',
    extractedInterests: ['Machine Learning', 'AI', 'Research', 'Python', 'Deep Learning'],
    preferences: { industries: ['Research', 'Technology'], meetingDuration: 60 },
    timezone: 'America/Chicago',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: '4',
    telegramId: '789123456',
    xHandle: 'marketingpro',
    displayName: 'Emma Rodriguez',
    bio: 'Growth marketer helping B2B SaaS companies scale through data-driven strategies.',
    extractedInterests: ['Growth Marketing', 'SaaS', 'Analytics', 'B2B', 'Strategy'],
    preferences: { industries: ['Marketing', 'SaaS'], meetingDuration: 30 },
    timezone: 'Europe/London',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function HomePage() {
  const { context } = useMiniKit();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'profile'>('discover');

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      // In a real app, this would fetch the current user's data
      const mockCurrentUser: User = {
        userId: 'current',
        telegramId: context?.user?.id || 'unknown',
        displayName: context?.user?.displayName || 'You',
        extractedInterests: ['React', 'TypeScript', 'Product Design', 'Startups'],
        preferences: { meetingDuration: 30 },
        timezone: 'America/Los_Angeles',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setCurrentUser(mockCurrentUser);
      setPotentialMatches(mockUsers);
      setLoading(false);
    }, 1000);
  }, [context]);

  const handleRequestMatch = async (targetUser: User) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Calculate match score
      const matchScore = calculateMatchScore(
        currentUser.extractedInterests,
        targetUser.extractedInterests
      );

      // Generate conversation starters
      const conversationStarters = await generateConversationStarters(
        currentUser.extractedInterests,
        targetUser.extractedInterests
      );

      // Create match (in a real app, this would be an API call)
      const newMatch: Match = {
        matchId: `match_${Date.now()}`,
        user1Id: currentUser.userId,
        user2Id: targetUser.userId,
        matchScore,
        status: 'pending',
        conversationStarters,
        createdAt: new Date(),
      };

      console.log('Match requested:', newMatch);
      
      // Remove the matched user from potential matches
      setPotentialMatches(prev => prev.filter(user => user.userId !== targetUser.userId));
      
      // Show success message (in a real app, this would be a toast notification)
      alert(`Coffee chat requested with ${targetUser.displayName}! They'll be notified.`);
      
    } catch (error) {
      console.error('Error requesting match:', error);
      alert('Failed to request match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectX = () => {
    // In a real app, this would initiate X OAuth flow
    alert('X OAuth integration would be implemented here');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-4 space-y-6">
      <Header />

      {/* Navigation Tabs */}
      <div className="flex bg-surface rounded-lg p-1 shadow-card">
        {[
          { id: 'discover', label: 'Discover', icon: Coffee },
          { id: 'matches', label: 'Matches', icon: Users },
          { id: 'profile', label: 'Profile', icon: Settings },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === id
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Discover Coffee Buddies
            </h2>
            <p className="text-text-secondary text-sm">
              Connect with professionals who share your interests
            </p>
          </div>

          {potentialMatches.length === 0 ? (
            <div className="card text-center py-8">
              <Coffee className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h3 className="font-medium text-text-primary mb-2">
                No more matches for now
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Check back later for new coffee buddies!
              </p>
              <button className="btn-secondary">
                Expand Search Criteria
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {potentialMatches.map((user) => (
                <ProfileCard
                  key={user.userId}
                  user={user}
                  variant="detailed"
                  onAction={() => handleRequestMatch(user)}
                  actionLabel="Request Coffee Chat"
                  actionVariant="accent"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Your Matches
            </h2>
            <p className="text-text-secondary text-sm">
              Pending and scheduled coffee chats
            </p>
          </div>

          <div className="card text-center py-8">
            <Users className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="font-medium text-text-primary mb-2">
              No matches yet
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Start discovering and requesting coffee chats!
            </p>
            <button
              onClick={() => setActiveTab('discover')}
              className="btn-primary"
            >
              Find Coffee Buddies
            </button>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Your Profile
            </h2>
            <p className="text-text-secondary text-sm">
              Manage your interests and preferences
            </p>
          </div>

          {currentUser ? (
            <ProfileCard
              user={currentUser}
              variant="detailed"
            />
          ) : (
            <div className="card text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-medium text-text-primary mb-2">
                Complete Your Profile
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Connect your X account to get started with personalized matches
              </p>
              <button
                onClick={handleConnectX}
                className="btn-primary"
              >
                Connect X Account
              </button>
            </div>
          )}

          <div className="card">
            <h3 className="font-medium text-text-primary mb-3">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">Notifications</span>
                <button className="w-10 h-6 bg-accent rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">Auto-match</span>
                <button className="w-10 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
