import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
// import {name} from "tailwindcss";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-96 task-card">
        <h2 class="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input type="text" formControlName="name"
                   class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-task-orange">
            <div *ngIf="signupForm.get('name')?.touched && signupForm.get('name')?.invalid">
              <p class="text-red-500 text-sm mt-1">Name is required</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input type="email" formControlName="email"
                   class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-task-orange">
            <div *ngIf="signupForm.get('email')?.touched && signupForm.get('email')?.invalid">
              <p class="text-red-500 text-sm mt-1">Please enter a valid email</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input type="password" formControlName="password"
                   class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-task-orange">
            <div *ngIf="signupForm.get('password')?.touched && signupForm.get('password')?.invalid">
              <p class="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
            </div>
          </div>
          <div *ngIf="errorMessage">
            <p class="text-red-500 text-sm text-center">{{ errorMessage }}</p>
          </div>
          <button type="submit"
                  [disabled]="!signupForm.valid"
                  [ngClass]="signupForm.valid ? 'w-full bg-task-orange text-white py-2 rounded-lg hover:opacity-90 transition' : 'w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed'">
            Sign Up
          </button>
        </form>

        <p class="mt-4 text-center">
          Already have an account? 
          <a routerLink="/login" class="text-task-orange hover:underline">Login</a>
        </p>
      </div>
    </div>
  `
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.authService.register(name, email, password).subscribe(
          (response) => {
            // Navigate to login page after successful registration
            this.router.navigate(['/login']);
          },
          (error) => {
            // Handle error and show error message
            if (error.status === 400) {
              this.errorMessage = 'Email already registered';
            } else {
              this.errorMessage = 'An error occurred during registration';
            }
          }
      );
    }
  }

}