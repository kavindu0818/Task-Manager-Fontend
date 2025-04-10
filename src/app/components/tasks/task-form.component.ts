import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import {MatFormField} from "@angular/material/input";

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-card p-6 rounded-lg shadow-md mb-8">
      <div class="space-y-4">
        <!-- Task Title -->
        <div>
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Task Title</mat-label>
            <input matInput formControlName="title" placeholder="Enter task title" required>
            <mat-error *ngIf="taskForm.get('title')?.hasError('required')">Task title is required</mat-error>
          </mat-form-field>
        </div>

        <!-- Task Description -->
        <div>
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" placeholder="Enter task description" rows="4"
                      required></textarea>
            <mat-error *ngIf="taskForm.get('description')?.hasError('required')">Description is required</mat-error>
          </mat-form-field>
        </div>

        <!-- Submit Button -->
        <button mat-raised-button color="primary" type="submit" class="w-full">
          Add Task
        </button>
      </div>
    </form>

  `
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<void>();
  taskForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log("Form submit triggered");

    // Check if the form is valid
    console.log("Form validity:", this.taskForm.valid);

    // Log the form values
    console.log("Form values:", this.taskForm.value);

    if (this.taskForm.valid) {
      const taskWithTimestamp = {
        ...this.taskForm.value,
        status: 'pending',
        createdAt: new Date().toISOString()  // Add current date and time
      };

      this.taskService.addTask(taskWithTimestamp).subscribe({
        next: () => {
          console.log("Task added successfully");
          this.taskForm.reset();
          this.taskAdded.emit(); // Notify parent component
        },
        error: (err) => {
          console.error('Failed to add task:', err);
        }
      });
    } else {
      console.log("Form is invalid, cannot submit.");
    }
  }
}
