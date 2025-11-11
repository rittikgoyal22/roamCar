import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { CarsListComponent } from './components/cars-list/cars-list.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { LoginModalComponent } from './components/auth/login-modal/login-modal.component';
import { RegisterModalComponent } from './components/auth/register-modal/register-modal.component';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    HeaderComponent,
    CarsListComponent,
    CarFormComponent,
    BookingModalComponent,
    LoginModalComponent,
    RegisterModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  title = 'RoamCar Rental';

  showCarFormModal = false;
  showBookingModal = false;
  showMyListingsModal = false;
  showMyBookingsModal = false;
  showLoginModal = false;
  showRegisterModal = false;
  currentViewMode: 'all' | 'my-listings' | 'my-bookings' = 'all';
  editingCarId: string | null = null;
  editingBookingId: string | null = null;
  preselectedCarId: string | null = null;

  openCarForm(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showLoginModal = true;
      return;
    }

    if (currentUser.role !== 'admin') {
      alert('Only admins can create listings. Switch to an admin account.');
      return;
    }

    this.editingCarId = null;
    this.showCarFormModal = true;
  }

  openEditCar(carId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showLoginModal = true;
      return;
    }

    if (currentUser.role !== 'admin') {
      alert('Only admins can edit listings.');
      return;
    }

    const car = this.storageService.getCars().find(c => c.id === carId);
    if (!car || car.ownerId !== currentUser.id) {
      alert('You can only edit your own car listings.');
      return;
    }

    this.editingCarId = carId;
    this.showCarFormModal = true;
  }

  closeCarForm(): void {
    this.showCarFormModal = false;
    this.editingCarId = null;
  }

  closeBooking(): void {
    this.showBookingModal = false;
    this.editingBookingId = null;
  }

  closeMyListings(): void {
    this.showMyListingsModal = false;
    this.currentViewMode = 'all';
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

  openLogin(): void {
    this.showLoginModal = true;
    this.showRegisterModal = false;
  }

  closeLogin(): void {
    this.showLoginModal = false;
  }

  openRegister(): void {
    this.showRegisterModal = true;
    this.showLoginModal = false;
  }

  closeRegister(): void {
    this.showRegisterModal = false;
  }

  handleLoginSuccess(): void {
    this.showLoginModal = false;
  }

  handleRegisterSuccess(): void {
    this.showRegisterModal = false;
  }

  handleLogout(): void {
    this.authService.logout();
    this.showCarFormModal = false;
    this.showBookingModal = false;
    this.showMyListingsModal = false;
    this.showMyBookingsModal = false;
    this.editingCarId = null;
    this.editingBookingId = null;
    this.preselectedCarId = null;
    this.goHome();
  }

  openMyListings(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showLoginModal = true;
      return;
    }

    if (currentUser.role !== 'admin') {
      alert('Only admins have personal listings.');
      return;
    }

    this.showMyListingsModal = true;
    this.currentViewMode = 'my-listings';
  }

  openMyBookings(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showLoginModal = true;
      return;
    }

    this.showMyBookingsModal = true;
    this.currentViewMode = 'my-bookings';
  }

  openBooking(carId?: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showLoginModal = true;
      return;
    }

    if (currentUser.role !== 'user') {
      alert('Only user accounts can book cars.');
      return;
    }

    this.preselectedCarId = carId || null;
    this.editingBookingId = null;
    this.showBookingModal = true;
  }
}
