import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('balance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('my')
  @Roles(UserRole.EMPLOYEE)
  async getMyBalance(@Request() req) {
    return this.balanceService.getBalanceByUser(req.user.userId);
  }

  @Get('history/my')
  @Roles(UserRole.EMPLOYEE)
  async getMyHistory(@Request() req) {
    return this.balanceService.getHistoryByUser(req.user.userId);
  }

  @Post('debit')
  @Roles(UserRole.RESTAURANT)
  async debit(@Body() body: { employee_id: string; amount: number; description: string }) {
    return this.balanceService.debit(body.employee_id, body.amount, body.description);
  }

  @Get(':employee_id')
  @Roles(UserRole.RESTAURANT, UserRole.ADMIN, UserRole.MANAGER)
  async getEmployeeBalance(@Param('employee_id') employeeId: string) {
    return this.balanceService.getBalance(employeeId);
  }
}
