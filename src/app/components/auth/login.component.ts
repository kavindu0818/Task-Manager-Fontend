import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import {MatFormField} from "@angular/material/input";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MatFormField],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-96 task-card">
        <h2 class="text-3xl font-bold mb-6 text-center">Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">

          <!-- Username Input -->
          <mat-form-field class="w-full">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Enter your username"
                   [class.is-invalid]="loginForm.get('username')?.touched && loginForm.get('username')?.invalid">
            <mat-error *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.invalid">
              Please enter a valid username
            </mat-error>
          </mat-form-field>

          <!-- Password Input -->
          <mat-form-field class="w-full">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Enter your password"
                   [class.is-invalid]="loginForm.get('password')?.touched && loginForm.get('password')?.invalid">
            <mat-error *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>

          <!-- Error Message -->
          <p *ngIf="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

          <!-- Submit Button -->
          <button mat-raised-button
                  type="submit"
                  [disabled]="!loginForm.valid"
                  [ngClass]="{
                'bg-task-orange text-white': loginForm.valid,
                'bg-gray-300 text-gray-500': !loginForm.valid
              }"
                  class="w-full py-2 rounded-lg hover:opacity-90 transition">
            Login
          </button>
        </form>

        <!-- Sign up link -->
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
