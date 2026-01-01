'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Relationship, RelationshipStatus } from '@/types/relationship';
import { UserPlus, UserCheck, UserX, Loader2 } from 'lucide-react';

interface RelationshipButtonProps {
  userId: string;
}

export function RelationshipButton({ userId }: RelationshipButtonProps) {
  const { user } = useAuth();
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    loadRelationship();
  }, [userId]);

  const loadRelationship = async () => {
    try {
      const response = await api.get<{ relationships: Relationship[] }>('/relationships');
      const rel = response.relationships?.find(
        (r) => r.requesterId === userId || r.addresseeId === userId
      );
      setRelationship(rel || null);
    } catch (error) {
      console.error('Error loading relationship:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    setIsActionLoading(true);
    try {
      await api.post('/relationships/request', { addresseeId: userId });
      await loadRelationship();
    } catch (error: any) {
      alert(error.message || 'Failed to send friend request');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!relationship) return;
    setIsActionLoading(true);
    try {
      await api.put(`/relationships/${relationship.id}`, { status: 'ACCEPTED' });
      await loadRelationship();
    } catch (error: any) {
      alert(error.message || 'Failed to accept request');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!relationship) return;
    setIsActionLoading(true);
    try {
      await api.delete(`/relationships/${relationship.id}`);
      setRelationship(null);
    } catch (error: any) {
      alert(error.message || 'Failed to remove relationship');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (!relationship) {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={handleSendRequest}
        isLoading={isActionLoading}
        className="flex items-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Add Friend
      </Button>
    );
  }

  const isRequester = relationship.requesterId === user?.id;
  const status = relationship.status;

  if (status === 'PENDING') {
    if (isRequester) {
      return (
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Pending
        </Button>
      );
    } else {
      return (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleAccept}
            isLoading={isActionLoading}
            className="flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            isLoading={isActionLoading}
          >
            Decline
          </Button>
        </div>
      );
    }
  }

  if (status === 'ACCEPTED') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleRemove}
        isLoading={isActionLoading}
        className="flex items-center gap-2"
      >
        <UserX className="w-4 h-4" />
        Remove
      </Button>
    );
  }

  return null;
}

