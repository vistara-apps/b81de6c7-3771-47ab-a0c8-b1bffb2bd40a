'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { Header } from '@/components/Header';
import { ProfileCard } from '@/components/ProfileCard';
import { MatchButton } from '@/components/MatchButton';
import { User, Match } from '@/lib/types';
import { Coffee, Users, Settings, Plus, Loader2 } from 'lucide-react';

export default function HomePage() {
  const { context } = useMiniKit();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'profile'>('discover');
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Authenticate user on mount
  useEffect(() => {
    const authenticateUser = async () => {
      if (!context?.user?.id) return;

      try {
        const response = await fetch('/api/auth/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telegramId: context.user.id,
            initData: context.initData || '',
            userData: {
              displayName: context.user.displayName,
            },
          }),
        });

        const data = await response.json();
        if (data.success) {
          setAuthToken(data.token);
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };

    authenticateUser();
  }, [context]);

  // Load data when authenticated
  useEffect(() => {
    if (!authToken) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // Load recommendations
        const recommendationsResponse = await fetch('/api/matches?action=recommendations', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        const recommendationsData = await recommendationsResponse.json();
        if (recommendationsData.success) {
          setPotentialMatches(recommendationsData.recommendations.map((r: any) => r.user));
        }

        // Load user matches
        const matchesResponse = await fetch('/api/matches', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        const matchesData = await matchesResponse.json();
        if (matchesData.success) {
          setUserMatches(matchesData.matches);
        }

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authToken]);

  const handleRequestMatch = async (targetUser: User) => {
    if (!currentUser || !authToken) return;

    try {
      setActionLoading(true);

      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          targetUserId: targetUser.userId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Remove the matched user from potential matches
        setPotentialMatches(prev => prev.filter(user => user.userId !== targetUser.userId));
        alert(`Coffee chat requested with ${targetUser.displayName || targetUser.xHandle}! They'll be notified.`);
      } else {
        alert('Failed to request match. Please try again.');
      }

    } catch (error) {
      console.error('Error requesting match:', error);
      alert('Failed to request match. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConnectX = async () => {
    if (!authToken) return;

    try {
      const response = await fetch('/api/auth/twitter', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = data.authUrl;
      } else {
        alert('Failed to initiate X connection. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting to X:', error);
      alert('Failed to connect to X. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading your coffee connections...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="card text-center py-8 max-w-sm">
          <Coffee className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className="font-medium text-text-primary mb-2">
            Welcome to CircleUp
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            Connect your Telegram account to get started with professional networking.
          </p>
        </div>
      </div>
    );
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
                  actionLabel={actionLoading ? "Requesting..." : "Request Coffee Chat"}
                  actionVariant="accent"
                  disabled={actionLoading}
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

          {userMatches.length === 0 ? (
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
          ) : (
            <div className="space-y-4">
              {userMatches.map((match) => {
                const otherUser = match.initiator.userId === currentUser.userId
                  ? match.recipient
                  : match.initiator;

                return (
                  <div key={match.matchId} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {otherUser.displayName?.charAt(0) || otherUser.xHandle?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">
                            {otherUser.displayName || otherUser.xHandle || 'Anonymous'}
                          </h3>
                          <p className="text-xs text-text-secondary">
                            Match Score: {match.matchScore}%
                          </p>
                          <p className="text-xs text-text-secondary capitalize">
                            Status: {match.status}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {match.status === 'pending' && match.recipient.userId === currentUser.userId && (
                          <div className="flex gap-2">
                            <button className="btn-secondary text-xs px-3 py-1">
                              Decline
                            </button>
                            <button className="btn-primary text-xs px-3 py-1">
                              Accept
                            </button>
                          </div>
                        )}
                        {match.status === 'accepted' && (
                          <button className="btn-accent text-xs px-3 py-1">
                            Schedule
                          </button>
                        )}
                        {match.status === 'scheduled' && match.scheduledTime && (
                          <div className="text-xs text-text-secondary">
                            {new Date(match.scheduledTime).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

          <ProfileCard
            user={currentUser}
            variant="detailed"
          />

          {!currentUser.xHandle && (
            <div className="card text-center py-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-text-primary mb-2">
                Connect Your X Account
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Get personalized matches based on your professional interests
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
