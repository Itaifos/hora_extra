import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Balance } from './entities/balance.entity';
import { BalanceMovement, MovementType } from './entities/balance-movement.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    @InjectRepository(BalanceMovement)
    private movementRepository: Repository<BalanceMovement>,
    private dataSource: DataSource,
  ) {}

  async getBalance(employeeId: string): Promise<number> {
    const balance = await this.balanceRepository.findOne({ where: { employee_id: employeeId } });
    return balance ? Number(balance.current_balance) : 0;
  }

  async getHistory(employeeId: string) {
    return this.movementRepository.find({
      where: { employee_id: employeeId },
      order: { created_at: 'DESC' },
    });
  }

  async addCredit(employeeId: string, amount: number, description: string, referenceDate: Date) {
    return this.dataSource.transaction(async (manager) => {
      let balance = await manager.findOne(Balance, { where: { employee_id: employeeId } });
      
      if (!balance) {
        balance = manager.create(Balance, { employee_id: employeeId, current_balance: 0 });
      }

      balance.current_balance = Number(balance.current_balance) + amount;
      await manager.save(balance);

      const movement = manager.create(BalanceMovement, {
        employee_id: employeeId,
        type: MovementType.CREDIT,
        amount,
        description,
        reference_date: referenceDate,
      });
      await manager.save(movement);
    });
  }

  async debit(employeeId: string, amount: number, description: string) {
    return this.dataSource.transaction(async (manager) => {
      const balance = await manager.findOne(Balance, { where: { employee_id: employeeId } });
      
      if (!balance || Number(balance.current_balance) < amount) {
        throw new BadRequestException('Saldo insuficiente');
      }

      balance.current_balance = Number(balance.current_balance) - amount;
      await manager.save(balance);

      const movement = manager.create(BalanceMovement, {
        employee_id: employeeId,
        type: MovementType.DEBIT,
        amount,
        description,
        reference_date: new Date(), // Current date for consumption
      });
      await manager.save(movement);
    });
  }
}
