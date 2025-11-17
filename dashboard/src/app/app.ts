import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { TasksService } from './tasks/tasks.service';
import { Task } from './tasks/task.model';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [NgIf, NgFor, FormsModule, DatePipe, CdkDropList, CdkDrag],
})
export class AppComponent {
  email = 'owner@example.com';
  password = 'password123';
  loading = false;
  error: string | null = null;
  isAuthenticated = false;

  tasks: Task[] = [];
  tasksLoading = false;
  tasksError: string | null = null;

  openTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  // 👇 New task
  newTask = {
    title: '',
    description: '',
    status: 'OPEN' as 'OPEN' | 'IN_PROGRESS' | 'DONE',
  };

  // 👇 Edit state
  editingTaskId: string | null = null;
  editTask = {
    title: '',
    description: '',
    status: 'OPEN' as 'OPEN' | 'IN_PROGRESS' | 'DONE',
  };

  private splitTasksByStatus() {
    this.openTasks = this.tasks.filter((t) => (t.status ?? 'OPEN') === 'OPEN');
    this.inProgressTasks = this.tasks.filter(
      (t) => (t.status ?? 'OPEN') === 'IN_PROGRESS'
    );
    this.doneTasks = this.tasks.filter((t) => (t.status ?? 'OPEN') === 'DONE');
  }

  changeTaskStatus(task: Task, newStatus: 'OPEN' | 'IN_PROGRESS' | 'DONE') {
    const prevStatus = task.status;

    // Optimistically update in memory
    task.status = newStatus;
    this.tasks = this.tasks.map((t) =>
      t.id === task.id ? { ...t, status: newStatus } : t
    );
    this.splitTasksByStatus();

    this.tasksService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        // success, nothing else needed
      },
      error: (err: any) => {
        console.error('Status change failed', err);
        // revert
        task.status = prevStatus;
        this.tasks = this.tasks.map((t) =>
          t.id === task.id ? { ...t, status: prevStatus } : t
        );
        this.splitTasksByStatus();
      },
    });
  }

  isDarkMode = true;

  ngOnInit(): void {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      this.setTheme(false);
    } else {
      this.setTheme(true);
    }
  }

  setTheme(dark: boolean) {
    this.isDarkMode = dark;
    const body = document.body;
    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(dark ? 'dark-theme' : 'light-theme');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  toggleTheme() {
    this.setTheme(!this.isDarkMode);
  }

  constructor(private auth: AuthService, private tasksService: TasksService) {
    this.auth.isAuthenticated$.subscribe((val) => {
      this.isAuthenticated = val;
      if (val) {
        this.loadTasks();
      } else {
        this.tasks = [];
      }
    });
  }

  login() {
    this.loading = true;
    this.error = null;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed';
      },
    });
  }

  logout() {
    this.auth.logout();
  }

  loadTasks() {
    this.tasksLoading = true;
    this.tasksError = null;
    this.tasksService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasksLoading = false;
        this.tasks = tasks;
        this.splitTasksByStatus();
      },
      error: (err: any) => {
        this.tasksLoading = false;
        this.tasksError =
          err?.error?.message || 'Failed to load tasks from API';
      },
    });
  }

  createTask() {
    if (!this.newTask.title.trim()) return;

    this.tasksService
      .createTask({
        title: this.newTask.title,
        description: this.newTask.description,
        status: this.newTask.status,
        organizationId: 'ORG-A',
      })
      .subscribe({
        next: () => {
          // Reset form
          this.newTask = {
            title: '',
            description: '',
            status: 'OPEN',
          };
          // Reload tasks
          this.loadTasks();
        },
        error: (err: any) => {
          console.error('Create task failed', err);
        },
      });
  }

  deleteTask(id: string) {
    if (!confirm('Delete this task?')) return;

    this.tasksService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.splitTasksByStatus();
      },
      error: (err: any) => {
        console.error('Delete failed', err);
      },
    });
  }

  startEdit(task: Task) {
    this.editingTaskId = task.id;
    this.editTask = {
      title: task.title,
      description: task.description ?? '',
      status: task.status ?? 'OPEN',
    };
  }

  cancelEdit() {
    this.editingTaskId = null;
  }

  saveEdit(taskId: string) {
    if (!this.editTask.title.trim()) return;

    this.tasksService
      .updateTask(taskId, {
        title: this.editTask.title,
        description: this.editTask.description,
        status: this.editTask.status,
      })
      .subscribe({
        next: (updated: Task) => {
          // Update in local array
          this.tasks = this.tasks.map((t) =>
            t.id === updated.id ? updated : t
          );
          this.editingTaskId = null;
          this.splitTasksByStatus();
        },
        error: (err: any) => {
          console.error('Update failed', err);
        },
      });
  }

  // Helpers for Task Completion Data Visualization
  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter((t) => (t.status ?? 'OPEN') === 'DONE').length;
  }

  get completionPercent(): number {
    if (!this.totalTasks) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  get openCount(): number {
    return this.openTasks.length;
  }

  get inProgressCount(): number {
    return this.inProgressTasks.length;
  }

  get doneCount(): number {
    return this.doneTasks.length;
  }

  get maxStatusCount(): number {
    return Math.max(
      this.openCount,
      this.inProgressCount,
      this.doneCount,
      1 // avoid divide-by-zero
    );
  }

  get openPercentOfMax(): number {
    return Math.round((this.openCount / this.maxStatusCount) * 100);
  }

  get inProgressPercentOfMax(): number {
    return Math.round((this.inProgressCount / this.maxStatusCount) * 100);
  }

  get donePercentOfMax(): number {
    return Math.round((this.doneCount / this.maxStatusCount) * 100);
  }

  get openPercentOfTotal(): number {
    if (!this.totalTasks) return 0;
    return Math.round((this.openCount / this.totalTasks) * 100);
  }

  get inProgressPercentOfTotal(): number {
    if (!this.totalTasks) return 0;
    return Math.round((this.inProgressCount / this.totalTasks) * 100);
  }

  get donePercentOfTotal(): number {
    if (!this.totalTasks) return 0;
    return Math.round((this.doneCount / this.totalTasks) * 100);
  }
}
