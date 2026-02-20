import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { Overtime } from './entities/overtime.entity';
import { Employee } from '../users/entities/employee.entity';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Overtime, Employee]),
    BalanceModule,
  ],
  controllers: [OvertimeController],
  providers: [OvertimeService],
  exports: [OvertimeService],
})
export class OvertimeModule {}
