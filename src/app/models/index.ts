export interface Car {
  id: string;
  title: string;
  year: number;
  seats: 4 | 5 | 7;
  price_per_day: number;
  image: string;
  ownerPhone: string | null;
  ownerName: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  carId: string;
  carTitle: string;
  start: string;
  end: string;
  name: string;
  phone: string;
  days: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
}
