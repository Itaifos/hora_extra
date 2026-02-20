import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { Employee } from './entities/employee.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(userData: Partial<User>, employeeData: Partial<Employee>) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password_hash, salt);

    const user = this.usersRepository.create({
      ...userData,
      password_hash: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);

    const employee = this.employeesRepository.create({
      ...employeeData,
      user_id: savedUser.id,
    });
    await this.employeesRepository.save(employee);

    return savedUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password_hash', 'role'],
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
