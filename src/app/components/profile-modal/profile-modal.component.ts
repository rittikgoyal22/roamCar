import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { UserProfile } from '../../models/index';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.scss'
})
export class ProfileModalComponent implements OnInit {
  private storageService = inject(StorageService);

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  profile: UserProfile = { name: '', phone: '' };

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profile = this.storageService.getProfile();
  }

  onSubmit(): void {
    if (!this.profile.name.trim() || !this.profile.phone.trim()) {
      alert('Please fill in all fields');
      return;
    }
    this.storageService.saveProfile(this.profile);
    alert('Profile saved successfully');
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }
}
