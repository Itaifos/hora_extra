import { Controller, Get, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findAll() {
    return this.employeesService.findAll();
  }

  @Get('search/:matricula')
  @Roles(UserRole.RESTAURANT, UserRole.ADMIN)
  async search(@Param('matricula') matricula: string) {
    const employee = await this.usersService.findEmployeeByMatricula(matricula);
    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    return employee;
  }
}
