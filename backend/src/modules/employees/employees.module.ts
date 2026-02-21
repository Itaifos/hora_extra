import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { UsersModule } from '../users/users.module';
import { Employee } from '../users/entities/employee.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
