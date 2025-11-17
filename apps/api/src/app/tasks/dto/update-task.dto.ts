export class UpdateTaskDto {
  title?: string;
  description?: string | null;
  status?: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
  dueDate?: string | null;
  organizationId?: string | null;
  assigneeId?: string | null;
}
