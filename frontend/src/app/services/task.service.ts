import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(search = ''): Observable<Task[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  addTask(data: Pick<Task, 'title' | 'priority' | 'categories'> & { dueDate?: string | null }): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, data);
  }

  updateTask(
    id: string,
    data: Partial<Pick<Task, 'title' | 'completed' | 'dueDate' | 'priority' | 'categories'>>
  ): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
