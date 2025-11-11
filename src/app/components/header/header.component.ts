import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  @Output() openListModal = new EventEmitter<void>();
  @Output() openBookingModal = new EventEmitter<void>();
  @Output() openMyListings = new EventEmitter<void>();
  @Output() openMyBookings = new EventEmitter<void>();
  @Output() openLogin = new EventEmitter<void>();
  @Output() openRegister = new EventEmitter<void>();
  @Output() requestLogout = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  onListCar(): void {
    this.openListModal.emit();
  }

  onBookCar(): void {
    this.openBookingModal.emit();
  }

  onMyListings(): void {
    this.openMyListings.emit();
  }

  onMyBookings(): void {
    this.openMyBookings.emit();
  }

  onBrandClick(): void {
    this.goHome.emit();
  }

  onLogin(): void {
    this.openLogin.emit();
  }

  onRegister(): void {
    this.openRegister.emit();
  }

  onLogout(): void {
    this.requestLogout.emit();
  }
}
