import { Component, inject, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { Car } from '../../models/index';

@Component({
  selector: 'app-cars-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cars-list.component.html',
  styleUrl: './cars-list.component.scss'
})
export class CarsListComponent implements OnInit, OnChanges, OnDestroy {
  private storageService = inject(StorageService);
  private destroy$ = new Subject<void>();

  @Input() viewMode: 'all' | 'my-listings' | 'my-bookings' = 'all';
  @Output() onBookCar = new EventEmitter<string>();
  @Output() onEditCar = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();

  searchQuery = '';
  selectedSeats: string = '';
  filteredCars: Car[] = [];
  filteredBookings: any[] = [];
  cars$ = this.storageService.cars$;
  profile$ = this.storageService.profile$;
  bookings$ = this.storageService.bookings$;

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

    this.applyFilters();
  }

  ngOnChanges(): void {
    this.currentView = this.viewMode;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.currentView === 'my-bookings') {
      const profile = this.storageService.getProfile();
      this.filteredBookings = this.storageService.getBookings().filter(
        (b: any) => b.phone === profile.phone
      );
      return;
    }

    let filtered = this.storageService.getCars();

    if (this.currentView === 'my-listings') {
      const profile = this.storageService.getProfile();
      filtered = filtered.filter((car: Car) => car.ownerPhone === profile.phone);
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
    this.onEditCar.emit(carId);
  }

  deleteCar(carId: string): void {
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
}
