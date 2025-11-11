import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { Car, UserProfile } from '../../models/index';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss'
})
export class CarFormComponent implements OnInit {
  private storageService = inject(StorageService);

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
  profile: UserProfile = { name: '', phone: '' };

  ngOnInit(): void {
    this.profile = this.storageService.getProfile();
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
    if (!this.profile.phone) {
      alert('Please set your profile phone first (Profile button)');
      return;
    }

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
    const car: Car = {
      id: this.editingCarId || `car-${Date.now()}`,
      title: this.form.title,
      year: this.form.year,
      seats: this.form.seats as 4 | 5 | 7,
      price_per_day: this.form.price,
      image: imageData,
      ownerPhone: this.profile.phone,
      ownerName: this.profile.name,
      createdAt: new Date().toISOString()
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
