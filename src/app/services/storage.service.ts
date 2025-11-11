import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Car, Booking } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEYS = {
    CARS: 'roamcar_cars_v1',
    BOOKINGS: 'roamcar_bookings_v1'
  };

  private carsSubject = new BehaviorSubject<Car[]>([]);
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  cars$ = this.carsSubject.asObservable();
  bookings$ = this.bookingsSubject.asObservable();

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    this.seedCars();
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
    const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CARS) || '[]') as Array<Record<string, any>>;
    const normalized = stored.map(raw => ({
      ...raw,
      ownerId: raw['ownerId'] ?? null,
      ownerName: raw['ownerName'] ?? null,
      ownerPhone: raw['ownerPhone'] ?? null
    })) as Car[];
    this.carsSubject.next(normalized);
  }

  getCars(): Car[] {
    return this.carsSubject.value;
  }

  saveCar(car: Car): void {
    const normalizedCar: Car = {
      ...car,
      ownerId: car.ownerId ?? null,
      ownerName: car.ownerName ?? null,
      ownerPhone: car.ownerPhone ?? null
    };

    const cars = this.getCars();
    const index = cars.findIndex(c => c.id === normalizedCar.id);
    if (index >= 0) {
      cars[index] = {
        ...cars[index],
        ...normalizedCar,
        createdAt: cars[index].createdAt,
        updatedAt: new Date().toISOString()
      };
    } else {
      cars.unshift({
        ...normalizedCar,
        createdAt: new Date().toISOString()
      });
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
    const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BOOKINGS) || '[]') as Array<Record<string, any>>;
    const normalized = stored.map(raw => {
      const legacy = raw as unknown as Record<string, any>;
      return {
        ...raw,
        userId: raw['userId'] ?? legacy['userId'] ?? '',
        userName: raw['userName'] ?? legacy['userName'] ?? legacy['name'] ?? '',
        userPhone: raw['userPhone'] ?? legacy['userPhone'] ?? legacy['phone'] ?? '',
        carOwnerId: raw['carOwnerId'] ?? legacy['carOwnerId'] ?? null,
        carTitle: raw['carTitle'] ?? legacy['carTitle'] ?? ''
      } as Booking;
    });
    this.bookingsSubject.next(normalized);
  }

  getBookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  saveBooking(booking: Booking): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === booking.id);
    const car = this.getCars().find(c => c.id === booking.carId);
    const bookingPayload: Booking = {
      ...booking,
      userId: booking.userId ?? '',
      userName: booking.userName ?? '',
      userPhone: booking.userPhone ?? '',
      carOwnerId: car?.ownerId ?? booking.carOwnerId ?? null,
      carTitle: car?.title ?? booking.carTitle ?? ''
    };
    if (index >= 0) {
      bookings[index] = {
        ...bookings[index],
        ...bookingPayload,
        createdAt: bookings[index].createdAt,
        updatedAt: new Date().toISOString()
      };
    } else {
      bookings.push({
        ...bookingPayload,
        createdAt: new Date().toISOString()
      });
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

  getBookingsByCarOwner(ownerId: string): Booking[] {
    return this.getBookings().filter(booking => booking.carOwnerId === ownerId);
  }

  getBookingsByUser(userId: string): Booking[] {
    return this.getBookings().filter(booking => booking.userId === userId);
  }
}
