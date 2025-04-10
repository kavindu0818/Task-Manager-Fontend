import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private users: { email: string; password: string }[] = [];

  register(email: string, password: string): boolean {
    const userExists = this.users.some(user => user.email === email);
    if (userExists) {
      return false;
    }
    this.users.push({ email, password });
    return true;
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.isAuthenticated.next(true);
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated.next(false);
  }

  isLoggedIn() {
    return this.isAuthenticated.asObservable();
  }
}