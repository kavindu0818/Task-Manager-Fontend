import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from './task-form.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, FormsModule],
  template: `
    <div class="min-h-screen">
      <nav class="bg-task-orange p-4 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">TaskMaster</h1>
          <div class="flex items-center space-x-4">
            <button (click)="toggleTheme()"
                    class="px-4 py-2 rounded-lg bg-white text-task-orange hover:bg-opacity-90 transition">
              🌓 Theme
            </button>
            <button (click)="logout()"
                    class="px-4 py-2 rounded-lg bg-white text-task-orange hover:bg-opacity-90 transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="task-card p-6 rounded-xl shadow-lg">
            <h3 class="text-xl font-semibold mb-2">Total Tasks</h3>
            <p class="text-4xl font-bold text-task-orange">{{ stats.total }}</p>
          </div>
          <div class="task-card p-6 rounded-xl shadow-lg">
            <h3 class="text-xl font-semibold mb-2">Completed</h3>
            <p class="text-4xl font-bold text-green-500">{{ stats.completed }}</p>
          </div>
          <div class="task-card p-6 rounded-xl shadow-lg">
            <h3 class="text-xl font-semibold mb-2">Pending</h3>
            <p class="text-4xl font-bold text-yellow-500">{{ stats.pending }}</p>
          </div>
        </div>

        <app-task-form (taskAdded)="refreshStats()"></app-task-form>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div *ngFor="let task of tasks$ | async; trackBy: trackById" class="task-card p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-grow">
                <div *ngIf="editingTaskId === task.id; else displayTask">
                  <input type="text" [(ngModel)]="editingTask.title" class="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-task-orange">
                  <textarea [(ngModel)]="editingTask.description" rows="3" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-task-orange"></textarea>
                </div>
                <ng-template #displayTask>
                  <h3 class="text-xl font-semibold mb-2">{{ task.title }}</h3>
                  <p class="text-sm text-gray-500">Created by John Doe</p>
                </ng-template>
              </div>
              <div class="flex space-x-2">
                <div *ngIf="editingTaskId === task.id; else actionButtons">
                  <button (click)="saveTask()" class="p-2 rounded-full hover:bg-green-100 text-green-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                  <button (click)="cancelEdit()" class="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
                <ng-template #actionButtons>
                  <button (click)="startEdit(task)" class="p-2 rounded-full hover:bg-blue-100 text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button (click)="deleteTask(task.id)" class="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                  <button (click)="toggleTaskStatus(task)" class="p-2 rounded-full transition-colors" [ngClass]="task.status === 'completed' ? 'text-green-500 hover:bg-green-100' : 'text-yellow-500 hover:bg-yellow-100'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </ng-template>
              </div>
            </div>

            <div *ngIf="editingTaskId !== task.id">
              <p class="text-gray-600 dark:text-gray-300 mb-4">{{ task.description }}</p>
            </div>

            <div class="flex justify-between items-center">
              <select [(ngModel)]="task.status" (change)="updateTaskStatus(task)" class="px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-task-orange">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <span class="text-sm text-gray-500">{{ task.createdAt | date:'MMM d, y, h:mm a' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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
