import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../users/entities/employee.entity';

export enum MovementType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('balance_movements')
export class BalanceMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date' })
  reference_date: Date;

  @CreateDateColumn()
  created_at: Date;
}
