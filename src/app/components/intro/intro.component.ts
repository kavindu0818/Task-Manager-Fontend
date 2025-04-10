import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [RouterLink, MatCard],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <mat-card class="text-center w-96 p-8">
        <h1 class="text-5xl font-bold mb-6">Welcome to TaskMaster</h1>
        <p class="text-xl mb-8">Organize your tasks efficiently and boost your productivity</p>
        <div class="space-x-4">
          <!-- Login Button -->
          <button mat-raised-button color="primary" routerLink="/login" class="w-full">
            Login
          </button>

          <!-- Sign Up Button -->
          <button mat-raised-button color="accent" routerLink="/signup" class="w-full">
            Sign Up
          </button>
        </div>
      </mat-card>
    </div>

  `
})
export class IntroComponent {}