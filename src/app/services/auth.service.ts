import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionUser, UserAccount, UserRole } from '../models';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEYS = {
    USERS: 'roamcar_users_v1',
    SESSION: 'roamcar_session_v1'
  };

  private usersSubject = new BehaviorSubject<UserAccount[]>([]);
  users$ = this.usersSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<SessionUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUsers();
    this.loadSession();
  }

  register(payload: RegisterPayload): { success: true; user: SessionUser } | { success: false; error: string } {
    const users = this.getUsers();
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedPhone = payload.phone.trim();

    if (!payload.name.trim() || !normalizedEmail || !normalizedPhone || !payload.password.trim()) {
      return { success: false, error: 'All fields are required.' };
    }

    if (payload.password.trim().length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (!this.isValidEmail(normalizedEmail)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (users.some(user => user.email === normalizedEmail)) {
      return { success: false, error: 'An account already exists with this email.' };
    }

    if (users.some(user => user.phone === normalizedPhone)) {
      return { success: false, error: 'An account already exists with this phone number.' };
    }

    const now = new Date().toISOString();
    const account: UserAccount = {
      id: `user-${Date.now()}`,
      name: payload.name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      role: payload.role,
      passwordHash: this.hashPassword(payload.password),
      createdAt: now
    };

    this.saveUsersToStorage([account, ...users]);

    const sessionUser = this.toSessionUser(account);
    this.setSessionUser(sessionUser);

    return { success: true, user: sessionUser };
  }

  login(payload: LoginPayload): { success: true; user: SessionUser } | { success: false; error: string } {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const candidate = this.getUsers().find(user => user.email === normalizedEmail);

    if (!candidate) {
      return { success: false, error: 'No account found with that email.' };
    }

    if (!this.verifyPassword(payload.password, candidate.passwordHash)) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const sessionUser = this.toSessionUser(candidate);
    this.setSessionUser(sessionUser);
    return { success: true, user: sessionUser };
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEYS.SESSION);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): SessionUser | null {
    return this.currentUserSubject.value;
  }

  getUsers(): UserAccount[] {
    return this.usersSubject.value;
  }

  private loadUsers(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.USERS);
      if (!stored) {
        this.usersSubject.next([]);
        return;
      }

      const parsed = JSON.parse(stored) as UserAccount[];
      const normalized = parsed.map(user => ({
        ...user,
        email: user.email?.trim().toLowerCase() ?? '',
        phone: user.phone?.trim() ?? '',
        role: (user.role === 'admin' ? 'admin' : 'user') as UserRole
      })) as UserAccount[];

      this.usersSubject.next(normalized);
    } catch {
      this.usersSubject.next([]);
      localStorage.removeItem(this.STORAGE_KEYS.USERS);
    }
  }

  private saveUsersToStorage(users: UserAccount[]): void {
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    this.usersSubject.next(users);
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.SESSION);
      if (!stored) {
        this.currentUserSubject.next(null);
        return;
      }

      const parsed = JSON.parse(stored) as SessionUser;
      const matchingUser = this.getUsers().find(user => user.id === parsed.id);

      if (!matchingUser) {
        this.logout();
        return;
      }

      const sessionUser = this.toSessionUser(matchingUser);
      this.currentUserSubject.next(sessionUser);
      localStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    } catch {
      this.logout();
    }
  }

  private setSessionUser(user: SessionUser): void {
    this.currentUserSubject.next(user);
    localStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(user));
  }

  private toSessionUser(account: UserAccount): SessionUser {
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      phone: account.phone,
      role: account.role
    };
  }

  private hashPassword(password: string): string {
    try {
      return typeof window !== 'undefined' && window.btoa ? window.btoa(password) : password;
    } catch {
      return password;
    }
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

