import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Overtime, OvertimeStatus } from './entities/overtime.entity';
import { Employee } from '../users/entities/employee.entity';
import { BalanceService } from '../balance/balance.service';

@Injectable()
export class OvertimeService {
  constructor(
    @InjectRepository(Overtime)
    private overtimeRepository: Repository<Overtime>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private balanceService: BalanceService,
  ) {}

  async create(employeeId: string, date: Date, hours: number) {
    // ... same as before
    if (hours <= 0) {
      throw new BadRequestException('Horas devem ser maiores que zero');
    }

    const existing = await this.overtimeRepository.findOne({
      where: { employee_id: employeeId, date },
    });

    if (existing) {
      throw new BadRequestException('Já existe um registro de horas para este dia');
    }

    const overtime = this.overtimeRepository.create({
      employee_id: employeeId,
      date,
      hours,
      status: OvertimeStatus.PENDING,
    });

    return this.overtimeRepository.save(overtime);
  }

  async findByEmployee(employeeId: string) {
    return this.overtimeRepository.find({
      where: { employee_id: employeeId },
      order: { date: 'DESC' },
    });
  }

  async findByUser(userId: string) {
    const employee = await this.employeeRepository.findOne({ where: { user_id: userId } });
    if (!employee) return [];
    return this.findByEmployee(employee.id);
  }

  calculateBenefitValue(hours: number, hourlyRate: number): number {
    const rate = hours > 2 ? 1.0 : 0.5;
    return Number((hours * hourlyRate * rate).toFixed(2));
  }

  async getPendingOvertime() {
    return this.overtimeRepository.find({
      where: { status: OvertimeStatus.PENDING },
      relations: ['employee'],
    });
  }

  async processDailyOvertime() {
    const pending = await this.getPendingOvertime();
    const results: { id: string; value: number }[] = [];

    for (const record of pending) {
      const value = this.calculateBenefitValue(record.hours, Number(record.employee.hourly_rate));
      
      await this.balanceService.addCredit(
        record.employee_id,
        value,
        `Conversão de ${record.hours}h extras em benefício`,
        record.date,
      );

      record.status = OvertimeStatus.PROCESSED;
      await this.overtimeRepository.save(record);
      
      results.push({ id: record.id, value });
    }

    return {
      processed_count: pending.length,
      details: results,
    };
  }
}
