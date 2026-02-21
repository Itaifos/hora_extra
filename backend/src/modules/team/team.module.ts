import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../users/entities/employee.entity';
import { Overtime } from '../overtime/entities/overtime.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Employee, Overtime]),
  ],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
