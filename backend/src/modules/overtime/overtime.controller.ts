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
    // First, find the employee associated with this user
    // We could optimize this by adding employeeId to the JWT payload later
    return this.overtimeService.findByUser(req.user.userId);
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
