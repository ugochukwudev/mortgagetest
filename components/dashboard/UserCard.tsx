'use client';

import { User } from '@/types/user';
import { RelationshipButton } from './RelationshipButton';

interface UserCardProps {
  user: User;
  currentUserId?: string;
}

export function UserCard({ user, currentUserId }: UserCardProps) {
  const isCurrentUser = user.id === currentUserId;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
          {user.bio && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{user.bio}</p>
          )}
        </div>

        {!isCurrentUser && (
          <div className="flex-shrink-0">
            <RelationshipButton userId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
}

