'use client';

import { useState, useEffect } from 'react';
import { FriendRequest } from '@/components/dashboard/FriendRequest';
import { api } from '@/lib/api';
import { Relationship } from '@/types/relationship';
import { Users, UserPlus } from 'lucide-react';

export default function FriendsPage() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted'>('all');

  useEffect(() => {
    loadRelationships();
  }, []);

  const loadRelationships = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ relationships: Relationship[] }>('/relationships');
      setRelationships(response.relationships || []);
    } catch (error) {
      console.error('Error loading relationships:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRelationships = relationships.filter((rel) => {
    if (activeTab === 'pending') return rel.status === 'PENDING';
    if (activeTab === 'accepted') return rel.status === 'ACCEPTED';
    return true;
  });

  const pendingCount = relationships.filter((r) => r.status === 'PENDING').length;
  const acceptedCount = relationships.filter((r) => r.status === 'ACCEPTED').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Friends</h1>
        <p className="text-gray-600">Manage your connections and friend requests</p>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All ({relationships.length})
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'accepted'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4" />
              Friends ({acceptedCount})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Pending ({pendingCount})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredRelationships.length > 0 ? (
            <div className="space-y-4">
              {filteredRelationships.map((rel) => (
                <FriendRequest
                  key={rel.id}
                  relationship={rel}
                  onUpdate={loadRelationships}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                {activeTab === 'pending'
                  ? 'No pending friend requests'
                  : activeTab === 'accepted'
                  ? 'No friends yet. Start connecting!'
                  : 'No relationships yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

