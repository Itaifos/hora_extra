import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../users/entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
