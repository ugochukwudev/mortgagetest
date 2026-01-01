export interface User {
  id: string;
  email: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
}

