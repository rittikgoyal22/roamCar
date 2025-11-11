import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  form = {
    email: '',
    password: ''
  };

  errorMessage = '';
  isSubmitting = false;

  private authService = inject(AuthService);

  ngOnChanges(): void {
    if (this.isOpen) {
      this.errorMessage = '';
      this.form.email = this.form.email.trim().toLowerCase();
      this.form.password = '';
    }
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    const email = this.form.email.trim().toLowerCase();
    const password = this.form.password;

    if (!email || !password.trim()) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isSubmitting = true;
    const result = this.authService.login({ email, password });
    this.isSubmitting = false;

    if (!result.success) {
      this.errorMessage = result.error;
      return;
    }

    this.errorMessage = '';
    this.success.emit();
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  onSwitchToRegister(): void {
    this.switchToRegister.emit();
  }
}

