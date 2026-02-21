import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
