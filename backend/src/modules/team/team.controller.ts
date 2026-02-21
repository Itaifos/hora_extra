import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { TeamService } from './team.service';

@Controller('team')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MANAGER, UserRole.ADMIN)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('overtime')
  async getTeamOvertime(@Request() req) {
    return this.teamService.getTeamOvertime(req.user.userId);
  }
}
