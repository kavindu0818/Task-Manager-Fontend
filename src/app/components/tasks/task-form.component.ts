import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()"
          class="task-card p-6 rounded-lg shadow-md mb-8">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Task Title</label>
          <input type="text" formControlName="title"
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-task-orange">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea formControlName="description" rows="3"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-task-orange"></textarea>
        </div>
        <button type="submit"
                class="w-full bg-task-orange text-white py-2 rounded-lg hover:opacity-90 transition">
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
