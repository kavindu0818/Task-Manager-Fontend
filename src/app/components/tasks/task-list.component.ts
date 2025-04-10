import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from './task-form.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, FormsModule, MatButtonModule, MatInputModule, MatSelectModule, MatCardModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="min-h-screen bg-dark-theme">
      <!-- Header -->
      <nav class="mat-elevation-z4 bg-task-dark-orange p-4">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">TaskMaster</h1>
          <div class="flex items-center space-x-4">
            <button mat-button (click)="toggleTheme()" class="px-4 py-2 rounded-lg bg-white text-task-orange hover:bg-opacity-90 transition">
              🌓 Theme
            </button>
            <button mat-button (click)="logout()" class="px-4 py-2 rounded-lg bg-white text-task-orange hover:bg-opacity-90 transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div class="text-center mt-8 mb-8">
        <h2 class="text-3xl font-bold text-task-orange mb-2">Your Tasks</h2>
        <p class="text-lg text-gray-400">Welcome back! Here's your task overview.</p>
      </div>
      <!-- Stats Section (Center Aligned) -->
      <div class="flex justify-center items-center mt-8">
        <mat-card class="task-card p-6 w-1/4 rounded-xl shadow-lg border border-gray-300">
          <h3 class="text-xl font-semibold mb-2">Total Tasks</h3>
          <p class="text-4xl font-bold text-task-orange">{{ stats.total }}</p>
        </mat-card>

        <mat-card class="task-card p-6 w-1/4 rounded-xl shadow-lg border border-gray-300 mx-4">
          <h3 class="text-xl font-semibold mb-2">Completed</h3>
          <p class="text-4xl font-bold text-green-500">{{ stats.completed }}</p>
        </mat-card>

        <mat-card class="task-card p-6 w-1/4 rounded-xl shadow-lg border border-gray-300">
          <h3 class="text-xl font-semibold mb-2">Pending</h3>
          <p class="text-4xl font-bold text-yellow-500">{{ stats.pending }}</p>
        </mat-card>
      </div>

      <!-- Task Form -->

      <!-- Task List Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div *ngFor="let task of tasks$ | async; trackBy: trackById"
             class="task-card p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
             [@fadeInOut]>
          <div class="flex justify-between items-start mb-4">
            <div class="flex-grow">
              <div *ngIf="editingTaskId === task.id; else displayTask">
                <mat-form-field appearance="fill" class="w-full mb-2">
                  <input matInput [(ngModel)]="editingTask.title" placeholder="Task Title" class="w-full">
                </mat-form-field>
                <mat-form-field appearance="fill" class="w-full mb-2">
                  <textarea matInput [(ngModel)]="editingTask.description" placeholder="Task Description" rows="3" class="w-full"></textarea>
                </mat-form-field>
              </div>
              <ng-template #displayTask>
                <h3 class="text-xl font-semibold mb-2">{{ task.title }}</h3>
                <p class="text-sm text-gray-500">Created by John Doe</p>
              </ng-template>
            </div>
            <div class="flex space-x-2">
              <div *ngIf="editingTaskId === task.id; else actionButtons">
                <button mat-icon-button (click)="saveTask()">
                  <mat-icon>check</mat-icon>
                </button>
                <button mat-icon-button (click)="cancelEdit()">
                  <mat-icon>cancel</mat-icon>
                </button>
              </div>
              <ng-template #actionButtons>
                <button mat-icon-button (click)="startEdit(task)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteTask(task.id)">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button (click)="toggleTaskStatus(task)">
                  <mat-icon>{{ task.status === 'completed' ? 'undo' : 'check_circle' }}</mat-icon>
                </button>
              </ng-template>
            </div>
          </div>

          <app-task-form (taskAdded)="refreshStats()"></app-task-form>

          <div *ngIf="editingTaskId !== task.id">
            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ task.description }}</p>
          </div>

          <div class="flex justify-between items-center">
            <mat-select [(ngModel)]="task.status" (change)="updateTaskStatus(task)" class="w-full">
              <mat-option value="pending">Pending</mat-option>
              <mat-option value="completed">Completed</mat-option>
            </mat-select>
            <span class="text-sm text-gray-500">{{ task.createdAt | date:'MMM d, y, h:mm a' }}</span>
          </div>
        </div>
      </div>
    </div>

  `,
  animations: [
    trigger('fadeInOut', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class TaskListComponent implements OnInit {
  tasks$ = this.taskService.getTasks();
  stats = { total: 0, completed: 0, pending: 0 };
  editingTaskId: string | null = null;
  editingTask: Partial<Task> = {};

  constructor(
      private taskService: TaskService,
      private themeService: ThemeService,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit() {
    this.refreshStats();
  }

  trackById(index: number, task: Task): string {
    return task.id;
  }

  startEdit(task: Task) {
    this.editingTaskId = task.id;
    this.editingTask = { title: task.title, description: task.description };
  }

  saveTask() {
    if (this.editingTaskId && this.editingTask.title && this.editingTask.description) {
      this.taskService.updateTask(this.editingTaskId, {
        title: this.editingTask.title,
        description: this.editingTask.description
      }).subscribe(() => {
        this.cancelEdit();
        this.refreshStats();
      });
    }
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editingTask = {};
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.refreshStats();
    });
  }

  toggleTaskStatus(task: Task) {
    const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
    this.taskService.updateTask(task.id, { status: updatedStatus }).subscribe(() => {
      this.refreshStats();
    });
  }

  updateTaskStatus(task: Task) {
    this.taskService.updateTask(task.id, { status: task.status }).subscribe(() => {
      this.refreshStats();
    });
  }

  refreshStats() {
    this.taskService.getTaskStats().subscribe((stats) => {
      console.log('Fetched Stats:', stats); // Log the stats to verify
      this.stats = stats;
    });
  }


  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
