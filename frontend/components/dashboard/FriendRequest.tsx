'use client';

import { Relationship } from '@/types/relationship';
import { useAuth } from '@/lib/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { UserCheck, UserX, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface FriendRequestProps {
  relationship: Relationship;
  onUpdate: () => void;
}

export function FriendRequest({ relationship, onUpdate }: FriendRequestProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isRequester = relationship.requesterId === user?.id;
  const otherUser = isRequester ? relationship.addressee : relationship.requester;

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await api.put(`/relationships/${relationship.id}`, { status: 'ACCEPTED' });
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'Failed to accept request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await api.delete(`/relationships/${relationship.id}`);
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'Failed to remove relationship');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {otherUser.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
            <p className="text-sm text-gray-600">{otherUser.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {relationship.status === 'PENDING' && !isRequester && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                isLoading={isLoading}
                className="flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                isLoading={isLoading}
              >
                Decline
              </Button>
            </>
          )}

          {relationship.status === 'PENDING' && isRequester && (
            <span className="text-sm text-gray-600">Pending</span>
          )}

          {relationship.status === 'ACCEPTED' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              isLoading={isLoading}
              className="flex items-center gap-2"
            >
              <UserX className="w-4 h-4" />
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

