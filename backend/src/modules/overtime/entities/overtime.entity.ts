import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../users/entities/employee.entity';

export enum OvertimeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PROCESSED = 'PROCESSED',
}

@Entity('overtime')
export class Overtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hours: number;

  @Column({
    type: 'enum',
    enum: OvertimeStatus,
    default: OvertimeStatus.PENDING,
  })
  status: OvertimeStatus;

  @CreateDateColumn()
  created_at: Date;
}
