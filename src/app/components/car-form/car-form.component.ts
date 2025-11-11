import { Component, inject, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { Car, SessionUser } from '../../models/index';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss'
})
export class CarFormComponent implements OnInit, OnChanges {
  private storageService = inject(StorageService);
  private authService = inject(AuthService);

  @Input() isOpen = false;
  @Input() editingCarId: string | null = null;
  @Output() close = new EventEmitter<void>();

  currentYear = new Date().getFullYear();
  maxYear = this.currentYear + 1;

  form = {
    title: '',
    year: this.currentYear,
    seats: 5,
    price: 1000,
    image: ''
  };

  imagePreview: string | null = null;
  selectedFile: File | null = null;
  currentUser: SessionUser | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnChanges(): void {
    if (this.editingCarId) {
      const car = this.storageService.getCars().find(c => c.id === this.editingCarId);
      if (car) {
        this.form = {
          title: car.title,
          year: car.year,
          seats: car.seats,
          price: car.price_per_day,
          image: car.image
        };
        this.imagePreview = car.image;
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Only admins can create or update car listings.');
      return;
    }
    this.currentUser = currentUser;
    if (!this.form.title.trim() || !this.form.year || !this.form.seats || !this.form.price) {
      alert('Please fill in all fields');
      return;
    }

    if (!this.imagePreview && !this.editingCarId) {
      alert('Please upload an image');
      return;
    }

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.saveCar(e.target.result);
      };
      reader.readAsDataURL(this.selectedFile);
    } else if (this.editingCarId) {
      this.saveCar(this.imagePreview!);
    }
  }

  private saveCar(imageData: string): void {
    const existingCar = this.editingCarId
      ? this.storageService.getCars().find(c => c.id === this.editingCarId)
      : null;
    const owner = this.currentUser || this.authService.getCurrentUser();

    if (!owner) {
      alert('You must be logged in to list a car.');
      return;
    }

    const car: Car = {
      id: this.editingCarId || `car-${Date.now()}`,
      title: this.form.title,
      year: this.form.year,
      seats: this.form.seats as 4 | 5 | 7,
      price_per_day: this.form.price,
      image: imageData,
      ownerId: existingCar?.ownerId ?? owner.id,
      ownerName: existingCar?.ownerName ?? owner.name,
      ownerPhone: existingCar?.ownerPhone ?? owner.phone,
      createdAt: existingCar?.createdAt ?? new Date().toISOString()
    };

    this.storageService.saveCar(car);
    alert(this.editingCarId ? 'Listing updated' : 'Car listed successfully');
    this.onClose();
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  private resetForm(): void {
    this.form = { title: '', year: new Date().getFullYear(), seats: 5, price: 1000, image: '' };
    this.imagePreview = null;
    this.selectedFile = null;
    this.editingCarId = null;
  }
}
