import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { Booking, Car } from '../../models/index';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.scss'
})
export class BookingModalComponent implements OnInit {
  private storageService = inject(StorageService);

  @Input() isOpen = false;
  @Input() editingBookingId: string | null = null;
  @Input() preselectedCarId: string | null = null;
  @Output() close = new EventEmitter<void>();

  form = {
    carId: '',
    startDate: this.getTodayString(),
    endDate: this.getTomorrowString(),
    name: '',
    phone: ''
  };

  cars: Car[] = [];

  ngOnInit(): void {
    this.loadCars();
    const profile = this.storageService.getProfile();
    if (profile.name) this.form.name = profile.name;
    if (profile.phone) this.form.phone = profile.phone;
  }

  ngOnChanges(): void {
    if (this.preselectedCarId) {
      this.form.carId = this.preselectedCarId;
    }
    if (this.editingBookingId) {
      const booking = this.storageService.getBookings().find(b => b.id === this.editingBookingId);
      if (booking) {
        this.form = {
          carId: booking.carId,
          startDate: booking.start,
          endDate: booking.end,
          name: booking.name,
          phone: booking.phone
        };
      }
    }
  }

  loadCars(): void {
    this.cars = this.storageService.getCars();
  }

  getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  getTomorrowString(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  calculateDays(): number {
    const start = new Date(this.form.startDate);
    const end = new Date(this.form.endDate);
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }

  calculateTotal(): number {
    const car = this.cars.find(c => c.id === this.form.carId);
    const days = this.calculateDays();
    return Math.round(days * (car?.price_per_day || 0));
  }

  onSubmit(): void {
    if (!this.form.carId || !this.form.startDate || !this.form.endDate || !this.form.name || !this.form.phone) {
      alert('Please fill in all fields');
      return;
    }

    const car = this.cars.find(c => c.id === this.form.carId);
    if (!car) return;

    const days = this.calculateDays();
    const total = this.calculateTotal();

    const booking: Booking = {
      id: this.editingBookingId || `bk-${Date.now()}`,
      carId: this.form.carId,
      carTitle: car.title,
      start: this.form.startDate,
      end: this.form.endDate,
      name: this.form.name,
      phone: this.form.phone,
      days,
      total,
      createdAt: new Date().toISOString()
    };

    this.storageService.saveBooking(booking);
    alert(`Booking ${this.editingBookingId ? 'updated' : 'confirmed'}. Total: ₹${total}`);
    this.onClose();
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  private resetForm(): void {
    this.form = {
      carId: '',
      startDate: this.getTodayString(),
      endDate: this.getTomorrowString(),
      name: '',
      phone: ''
    };
    this.editingBookingId = null;
  }
}
