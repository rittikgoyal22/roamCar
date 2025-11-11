import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Car, Booking, UserProfile } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEYS = {
    CARS: 'roamcar_cars_v1',
    BOOKINGS: 'roamcar_bookings_v1',
    PROFILE: 'roamcar_profile_v1'
  };

  private carsSubject = new BehaviorSubject<Car[]>([]);
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  private profileSubject = new BehaviorSubject<UserProfile>({ name: '', phone: '' });

  cars$ = this.carsSubject.asObservable();
  bookings$ = this.bookingsSubject.asObservable();
  profile$ = this.profileSubject.asObservable();

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    this.seedCars();
    this.loadProfile();
    this.loadCars();
    this.loadBookings();
  }

  private seedCars(): void {
    // Disabled: No demo cars seeded. Users list their own cars.
    // To clear existing demo cars, you can manually clear localStorage
    // localStorage.removeItem(this.STORAGE_KEYS.CARS);
  }

  // Cars CRUD
  loadCars(): void {
    const cars = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CARS) || '[]') as Car[];
    this.carsSubject.next(cars);
  }

  getCars(): Car[] {
    return this.carsSubject.value;
  }

  saveCar(car: Car): void {
    const cars = this.getCars();
    const index = cars.findIndex(c => c.id === car.id);
    if (index >= 0) {
      cars[index] = { ...cars[index], ...car, updatedAt: new Date().toISOString() };
    } else {
      cars.unshift({ ...car, createdAt: new Date().toISOString() });
    }
    this.saveCarsToStorage(cars);
  }

  deleteCar(carId: string): void {
    const cars = this.getCars().filter(c => c.id !== carId);
    this.saveCarsToStorage(cars);
  }

  private saveCarsToStorage(cars: Car[]): void {
    localStorage.setItem(this.STORAGE_KEYS.CARS, JSON.stringify(cars));
    this.carsSubject.next(cars);
  }

  // Bookings CRUD
  loadBookings(): void {
    const bookings = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BOOKINGS) || '[]') as Booking[];
    this.bookingsSubject.next(bookings);
  }

  getBookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  saveBooking(booking: Booking): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === booking.id);
    if (index >= 0) {
      bookings[index] = { ...bookings[index], ...booking, updatedAt: new Date().toISOString() };
    } else {
      bookings.push({ ...booking, createdAt: new Date().toISOString() });
    }
    this.saveBookingsToStorage(bookings);
  }

  deleteBooking(bookingId: string): void {
    const bookings = this.getBookings().filter(b => b.id !== bookingId);
    this.saveBookingsToStorage(bookings);
  }

  private saveBookingsToStorage(bookings: Booking[]): void {
    localStorage.setItem(this.STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.bookingsSubject.next(bookings);
  }

  // Profile
  loadProfile(): void {
    const profile = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PROFILE) || '{"name":"","phone":""}') as UserProfile;
    this.profileSubject.next(profile);
  }

  getProfile(): UserProfile {
    return this.profileSubject.value;
  }

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(this.STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    this.profileSubject.next(profile);
  }
}
