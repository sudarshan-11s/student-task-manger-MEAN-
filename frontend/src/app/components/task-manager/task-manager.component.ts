import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent implements OnInit {
  tasks: Task[] = [];
  user: User | null = null;
  suggestedTasks = [
    'Review today\'s class notes',
    'Finish pending assignment',
    'Prepare for tomorrow\'s quiz',
    'Organize study materials'
  ];

  authMode: 'login' | 'signup' = 'login';
  name = '';
  email = '';
  password = '';

  newTaskTitle = '';
  newTaskDueDate = '';
  newTaskPriority: Task['priority'] = 'Medium';
  newTaskCategories = '';
  searchText = '';
  editingTaskId: string | null = null;
  editingTitle = '';
  editingDueDate = '';
  editingPriority: Task['priority'] = 'Medium';
  editingCategories = '';
  message = '';
  loading = false;
  isDarkMode = false;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (this.user) {
      this.loadTasks();
    }
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  get pendingTasks(): number {
    return this.totalTasks - this.completedTasks;
  }

  get completionRate(): number {
    return this.totalTasks ? Math.round((this.completedTasks / this.totalTasks) * 100) : 0;
  }

  submitAuth(): void {
    this.message = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.message = 'Email and password are required.';
      return;
    }

    this.loading = true;
    const request =
      this.authMode === 'signup'
        ? this.authService.signup(this.name, this.email, this.password)
        : this.authService.login(this.email, this.password);

    request.subscribe({
      next: (response) => {
        this.user = response.user;
        this.clearAuthForm();
        this.loadTasks();
      },
      error: (error) => {
        this.message = error.error?.message || 'Authentication failed.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
    this.tasks = [];
    this.searchText = '';
    this.message = '';
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks(this.searchText).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (error) => {
        this.message = error.error?.message || 'Could not load tasks.';
        this.loading = false;
      }
    });
  }

  addTask(): void {
    const title = this.newTaskTitle.trim();

    if (!title) {
      return;
    }

    this.taskService.addTask({
      title,
      dueDate: this.newTaskDueDate || null,
      priority: this.newTaskPriority,
      categories: this.parseCategories(this.newTaskCategories)
    }).subscribe({
      next: () => {
        this.resetTaskForm();
        this.loadTasks();
      },
      error: (error) => {
        this.message = error.error?.message || 'Could not add task.';
      }
    });
  }

  addSuggestedTask(title: string): void {
    this.newTaskTitle = title;
    this.addTask();
  }

  toggleTask(task: Task): void {
    this.taskService.updateTask(task._id, { completed: !task.completed }).subscribe({
      next: (updatedTask) => {
        task.completed = updatedTask.completed;
      },
      error: (error) => {
        this.message = error.error?.message || 'Could not update task.';
      }
    });
  }

  startEdit(task: Task): void {
    this.editingTaskId = task._id;
    this.editingTitle = task.title;
    this.editingDueDate = task.dueDate ? task.dueDate.slice(0, 10) : '';
    this.editingPriority = task.priority || 'Medium';
    this.editingCategories = (task.categories || []).join(', ');
  }

  saveEdit(task: Task): void {
    const title = this.editingTitle.trim();

    if (!title) {
      return;
    }

    this.taskService.updateTask(task._id, {
      title,
      dueDate: this.editingDueDate || null,
      priority: this.editingPriority,
      categories: this.parseCategories(this.editingCategories)
    }).subscribe({
      next: (updatedTask) => {
        Object.assign(task, updatedTask);
        this.cancelEdit();
      },
      error: (error) => {
        this.message = error.error?.message || 'Could not save task.';
      }
    });
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.editingTitle = '';
    this.editingDueDate = '';
    this.editingPriority = 'Medium';
    this.editingCategories = '';
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task._id !== id);
      },
      error: (error) => {
        this.message = error.error?.message || 'Could not delete task.';
      }
    });
  }

  onSearchChange(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => this.loadTasks(), 250);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  priorityClass(priority: Task['priority']): string {
    return `priority-${(priority || 'Medium').toLowerCase()}`;
  }

  private resetTaskForm(): void {
    this.newTaskTitle = '';
    this.newTaskDueDate = '';
    this.newTaskPriority = 'Medium';
    this.newTaskCategories = '';
  }

  private parseCategories(value: string): string[] {
    return value
      .split(',')
      .map((category) => category.trim())
      .filter(Boolean);
  }

  private clearAuthForm(): void {
    this.name = '';
    this.email = '';
    this.password = '';
    this.loading = false;
  }
}
