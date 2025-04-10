import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-5xl font-bold mb-6">Welcome to TaskMaster</h1>
        <p class="text-xl mb-8">Organize your tasks efficiently and boost your productivity</p>
        <div class="space-x-4">
          <a routerLink="/login" 
             class="bg-task-orange text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
            Login
          </a>
          <a routerLink="/signup" 
             class="border-2 border-task-orange text-task-orange px-6 py-3 rounded-lg hover:bg-task-orange hover:text-white transition">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  `
})
export class IntroComponent {}