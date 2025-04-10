import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-96 task-card">
        <h2 class="text-3xl font-bold mb-6 text-center">Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Username</label>
            <input type="text" formControlName="username"
                   class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-task-orange">
            <p *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.invalid" class="text-red-500 text-sm mt-1">
              Please enter a valid username
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input type="password" formControlName="password"
                   class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-task-orange">
            <p *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-red-500 text-sm mt-1">
              Password must be at least 6 characters
            </p>
          </div>
          <p *ngIf="errorMessage" class="text-red-500 text-sm text-center">{{errorMessage}}</p>
          <button type="submit"
                  [disabled]="!loginForm.valid"
                  [class]="loginForm.valid ? 
                    'w-full bg-task-orange text-white py-2 rounded-lg hover:opacity-90 transition' :
                    'w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed'">
            Login
          </button>
        </form>
        <p class="mt-4 text-center">
          Don't have an account?
          <a routerLink="/signup" class="text-task-orange hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // LoginComponent

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
          (token: string) => {  // Expecting a string response here
            console.log(token);
            this.authService.setAuthToken(token);  // Save token in localStorage
            this.router.navigate(['/tasks']);
          },
          (error) => {
            this.errorMessage = 'Invalid username or password';
          }
      );
    }
  }

}
