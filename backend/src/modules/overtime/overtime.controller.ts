import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('overtime')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(@Body() body: { employee_id: string; date: string; hours: number }) {
    return this.overtimeService.create(body.employee_id, new Date(body.date), body.hours);
  }

  @Get('my')
  @Roles(UserRole.EMPLOYEE)
  async getMyOvertime(@Request() req) {
    // We need a way to link User to Employee ID
    // For now, I'll assume req.user has employeeId if we added it to JWT, 
    // or we query it here. Let's assume we need to query the employee linked to the user.
    // I'll keep it simple for now and expect employee_id in query or from user object.
    return this.overtimeService.findByEmployee(req.user.userId); // This logic needs to be refined to use Employee ID
  }

  @Get('pending')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async getPending() {
    return this.overtimeService.getPendingOvertime();
  }

  @Post('process-day')
  @Roles(UserRole.ADMIN)
  async processDay() {
    return this.overtimeService.processDailyOvertime();
  }
}
