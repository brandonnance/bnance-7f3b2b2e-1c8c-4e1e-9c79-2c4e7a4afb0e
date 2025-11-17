import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'OPEN',
  })
  status: TaskStatus;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date | null;

  // --- Org relationship ---

  @Column({ type: 'text', nullable: true })
  organizationId: string | null;

  // --- Assignee relationship (optional user) ---

  @Column({ type: 'uuid', nullable: true })
  assigneeId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigneeId' })
  assignee: User | null;

  // --- Timestamps ---

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
