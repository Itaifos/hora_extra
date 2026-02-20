import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../users/entities/employee.entity';

@Entity('balance')
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @OneToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  current_balance: number;

  @UpdateDateColumn()
  updated_at: Date;
}
