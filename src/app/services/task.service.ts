import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/task';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    console.log(task, "Task eka machan");
    return this.http.post<Task>(this.baseUrl, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/update/${id}`, task);
  }

  getTaskStats(): Observable<{ total: number; completed: number; pending: number }> {
    return this.http.get<{ total: number; completed: number; pending: number }>(`${this.baseUrl}/stats`);
  }

}
