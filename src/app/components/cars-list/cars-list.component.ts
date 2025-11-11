import { Component, inject, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { Car, Booking, SessionUser } from '../../models/index';

@Component({
  selector: 'app-cars-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cars-list.component.html',
  styleUrl: './cars-list.component.scss'
})
export class CarsListComponent implements OnInit, OnChanges, OnDestroy {
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  @Input() viewMode: 'all' | 'my-listings' | 'my-bookings' = 'all';
  @Output() onBookCar = new EventEmitter<string>();
  @Output() onEditCar = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();

  searchQuery = '';
  selectedSeats: string = '';
  filteredCars: Car[] = [];
  filteredBookings: Booking[] = [];
  cars$ = this.storageService.cars$;
  bookings$ = this.storageService.bookings$;
  currentUser$ = this.authService.currentUser$;

  currentView: 'all' | 'my-listings' | 'my-bookings' = 'all';
  
  // Pagination
  itemsPerPage = 8;
  currentPage = 1;
  paginatedCars: Car[] = [];
  totalPages = 1;

  ngOnInit(): void {
    // Subscribe to cars changes for real-time updates
    this.cars$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });

    // Subscribe to bookings changes for real-time updates
    this.bookings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });

    this.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });

    this.applyFilters();
  }

  ngOnChanges(): void {
    this.currentView = this.viewMode;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const currentUser = this.authService.getCurrentUser();

    if (this.currentView === 'my-bookings') {
      if (!currentUser) {
        this.filteredBookings = [];
        return;
      }

      this.filteredBookings = currentUser.role === 'admin'
        ? this.storageService.getBookingsByCarOwner(currentUser.id)
        : this.storageService.getBookingsByUser(currentUser.id);
      return;
    }

    let filtered = this.storageService.getCars();

    if (this.currentView === 'my-listings') {
      if (!currentUser) {
        filtered = [];
      } else {
        filtered = filtered.filter((car: Car) => this.isCarOwnedByUser(car, currentUser));
      }
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((car: Car) => car.title.toLowerCase().includes(query));
    }

    if (this.selectedSeats) {
      filtered = filtered.filter((car: Car) => String(car.seats) === this.selectedSeats);
    }

    this.filteredCars = filtered;
    this.totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    this.updatePaginatedCars();
  }

  updatePaginatedCars(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCars = this.filteredCars.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCars();
      window.scrollTo(0, 0);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterSeats(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  bookCar(carId: string): void {
    this.onBookCar.emit(carId);
  }

  editCar(carId: string): void {
    const currentUser = this.authService.getCurrentUser();
    const car = this.storageService.getCars().find(c => c.id === carId);
    if (car && currentUser && this.isCarOwnedByUser(car, currentUser)) {
      this.onEditCar.emit(carId);
    } else {
      alert('You can only edit your own listings.');
    }
  }

  deleteCar(carId: string): void {
    const currentUser = this.authService.getCurrentUser();
    const car = this.storageService.getCars().find(c => c.id === carId);
    if (!car || !currentUser || !this.isCarOwnedByUser(car, currentUser)) {
      alert('You can only delete your own listings.');
      return;
    }

    if (confirm('Delete this listing?')) {
      this.storageService.deleteCar(carId);
      this.applyFilters();
    }
  }

  deleteBooking(bookingId: string): void {
    if (confirm('Delete this booking?')) {
      this.storageService.deleteBooking(bookingId);
      this.applyFilters();
    }
  }

  setView(view: 'all' | 'my-listings' | 'my-bookings'): void {
    this.currentView = view;
    this.currentPage = 1;
    this.searchQuery = '';
    this.selectedSeats = '';
    this.applyFilters();
  }

  closeView(): void {
    this.currentView = 'all';
    this.onClose.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private isCarOwnedByUser(car: Car, user: SessionUser): boolean {
    return !!car.ownerId && car.ownerId === user.id;
  }

  canManageBooking(booking: Booking): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    if (currentUser.role === 'admin') {
      return booking.carOwnerId === currentUser.id;
    }

    return booking.userId === currentUser.id;
  }
}
