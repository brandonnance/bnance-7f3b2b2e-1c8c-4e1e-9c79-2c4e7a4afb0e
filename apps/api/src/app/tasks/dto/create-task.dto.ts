export class CreateTaskDto {
  title: string;
  description?: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
  dueDate?: string; // ISO date string, e.g. "2025-11-30"
  organizationId?: string;
  assigneeId?: string;
}
