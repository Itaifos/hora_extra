import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Employee } from '../users/entities/employee.entity';
import { Overtime } from '../overtime/entities/overtime.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Overtime)
    private overtimeRepository: Repository<Overtime>,
    private usersService: UsersService,
  ) {}

  async getTeamOvertime(managerUserId: string) {
    // 1. Find the manager's employee profile to get their sector
    const manager = await this.usersService.findEmployeeByUserId(managerUserId);
    if (!manager) {
      throw new NotFoundException('Perfil de gestor não encontrado.');
    }

    // 2. Find all employees in that sector
    const teamMembers = await this.employeeRepository.find({
      where: { sector: manager.sector },
    });

    if (teamMembers.length === 0) {
      return [];
    }

    // 3. Find all overtime records for those employees
    const teamMemberIds = teamMembers.map(member => member.id);
    const teamOvertime = await this.overtimeRepository.find({
      where: {
        employee_id: In(teamMemberIds),
      },
      relations: ['employee'],
      order: {
        date: 'DESC',
      },
    });

    return teamOvertime;
  }
}
