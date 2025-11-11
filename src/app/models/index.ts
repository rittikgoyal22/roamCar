export interface Car {
  id: string;
  title: string;
  year: number;
  seats: 4 | 5 | 7;
  price_per_day: number;
  image: string;
  ownerId: string | null;
  ownerName: string | null;
  ownerPhone: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  carId: string;
  carTitle: string;
  start: string;
  end: string;
  userId: string;
  userName: string;
  userPhone: string;
  carOwnerId: string | null;
  days: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}
