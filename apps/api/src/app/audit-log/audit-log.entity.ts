import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  action: string; // e.g. TASK_CREATED, TASK_UPDATED, TASK_DELETED

  @Column({ type: 'text', nullable: true })
  taskId: string | null;

  @Column({ type: 'text', nullable: true })
  organizationId: string | null;

  @Column({ length: 50 })
  role: string; // OWNER, ADMIN, VIEWER

  @Column({ type: 'text', nullable: true })
  details: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  // add userId column to track which user performed the action
  @Column({ type: 'text', nullable: true })
  userId: string | null;
}
