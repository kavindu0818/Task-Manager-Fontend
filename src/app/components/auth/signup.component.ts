import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import {MatFormField} from "@angular/material/input";
// import {name} from "tailwindcss";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MatFormField],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-96 task-card">
        <h2 class="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-4">

          <!-- Name Input -->
          <mat-form-field class="w-full">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter your name"
                   [class.is-invalid]="signupForm.get('name')?.touched && signupForm.get('name')?.invalid">
            <mat-error *ngIf="signupForm.get('name')?.touched && signupForm.get('name')?.invalid">
              Name is required
            </mat-error>
          </mat-form-field>

          <!-- Email Input -->
          <mat-form-field class="w-full">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Enter your email"
                   [class.is-invalid]="signupForm.get('email')?.touched && signupForm.get('email')?.invalid">
            <mat-error *ngIf="signupForm.get('email')?.touched && signupForm.get('email')?.invalid">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <!-- Password Input -->
          <mat-form-field class="w-full">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Enter your password"
                   [class.is-invalid]="signupForm.get('password')?.touched && signupForm.get('password')?.invalid">
            <mat-error *ngIf="signupForm.get('password')?.touched && signupForm.get('password')?.invalid">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>

          <!-- Error Message -->
          <div *ngIf="errorMessage">
            <p class="text-red-500 text-sm text-center">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button mat-raised-button
                  type="submit"
                  [disabled]="!signupForm.valid"
                  [ngClass]="{
                'bg-task-orange text-white': signupForm.valid,
                'bg-gray-300 text-gray-500': !signupForm.valid
              }"
                  class="w-full py-2 rounded-lg hover:opacity-90 transition">
            Sign Up
          </button>
        </form>

        <!-- Login link -->
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