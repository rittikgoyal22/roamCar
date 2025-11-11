import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { CarsListComponent } from './components/cars-list/cars-list.component';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    HeaderComponent,
    CarsListComponent,
    ProfileModalComponent,
    CarFormComponent,
    BookingModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'RoamCar Rental';

  showProfileModal = false;
  showCarFormModal = false;
  showBookingModal = false;
  showMyListingsModal = false;
  showMyBookingsModal = false;
  currentViewMode: 'all' | 'my-listings' | 'my-bookings' = 'all';
  editingCarId: string | null = null;
  editingBookingId: string | null = null;
  preselectedCarId: string | null = null;

  openProfile(): void {
    this.showProfileModal = true;
  }

  closeProfile(): void {
    this.showProfileModal = false;
  }

  openCarForm(): void {
    this.editingCarId = null;
    this.showCarFormModal = true;
  }

  openEditCar(carId: string): void {
    this.editingCarId = carId;
    this.showCarFormModal = true;
  }

  closeCarForm(): void {
    this.showCarFormModal = false;
    this.editingCarId = null;
  }

  openBooking(carId?: string): void {
    this.preselectedCarId = carId || null;
    this.editingBookingId = null;
    this.showBookingModal = true;
  }

  closeBooking(): void {
    this.showBookingModal = false;
    this.editingBookingId = null;
  }

  openMyListings(): void {
    this.showMyListingsModal = true;
    this.currentViewMode = 'my-listings';
  }

  closeMyListings(): void {
    this.showMyListingsModal = false;
    this.currentViewMode = 'all';
  }

  openMyBookings(): void {
    this.showMyBookingsModal = true;
    this.currentViewMode = 'my-bookings';
  }

  closeMyBookings(): void {
    this.showMyBookingsModal = false;
    this.currentViewMode = 'all';
  }

  goHome(): void {
    this.currentViewMode = 'all';
    this.showMyListingsModal = false;
    this.showMyBookingsModal = false;
  }
}
