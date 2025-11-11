import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterPayload } from '../../../services/auth.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss'
})
export class RegisterModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  form: RegisterPayload & { passwordConfirm: string } = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    passwordConfirm: ''
  };

  errorMessage = '';
  isSubmitting = false;

  private authService = inject(AuthService);

  ngOnChanges(): void {
    if (this.isOpen) {
      this.errorMessage = '';
      this.form.password = '';
      this.form.passwordConfirm = '';
    }
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    const name = this.form.name.trim();
    const email = this.form.email.trim().toLowerCase();
    const phone = this.form.phone.trim();
    const password = this.form.password;
    const role = this.form.role;

    if (!name || !email || !phone || !password.trim()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (password !== this.form.passwordConfirm) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    const result = this.authService.register({
      name,
      email,
      phone,
      password,
      role
    });
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

  onSwitchToLogin(): void {
    this.switchToLogin.emit();
  }
}

