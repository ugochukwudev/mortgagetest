import { User } from './user';

export type RelationshipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED';

export interface Relationship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: RelationshipStatus;
  createdAt: string;
  updatedAt: string;
  requester: User;
  addressee: User;
}

export interface RelationshipRequest {
  addresseeId: string;
}

export interface UpdateRelationship {
  status: 'ACCEPTED' | 'BLOCKED';
}

