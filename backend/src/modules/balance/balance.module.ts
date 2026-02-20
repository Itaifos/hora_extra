import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { Balance } from './entities/balance.entity';
import { BalanceMovement } from './entities/balance-movement.entity';
import { Employee } from '../users/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balance, BalanceMovement, Employee])],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
