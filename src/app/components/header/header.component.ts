import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { UserProfile } from '../../models/index';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private storageService = inject(StorageService);
  profile$ = this.storageService.profile$;

  @Output() openListModal = new EventEmitter<void>();
  @Output() openBookingModal = new EventEmitter<void>();
  @Output() openMyListings = new EventEmitter<void>();
  @Output() openMyBookings = new EventEmitter<void>();
  @Output() openProfile = new EventEmitter<void>();
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
}
