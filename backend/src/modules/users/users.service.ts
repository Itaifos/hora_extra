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

  async seed() {
    const users = [
      {
        email: 'admin@sistema.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        employee: { name: 'Administrador', matricula: '001', sector: 'TI', hourly_rate: 50 },
      },
      {
        email: 'gestor@sistema.com',
        password: 'gestor123',
        role: UserRole.MANAGER,
        employee: { name: 'Gestor de Operações', matricula: '002', sector: 'Operações', hourly_rate: 40 },
      },
      {
        email: 'func@sistema.com',
        password: 'func123',
        role: UserRole.EMPLOYEE,
        employee: { name: 'João Silva', matricula: '101', sector: 'Produção', hourly_rate: 20 },
      },
      {
        email: 'restaurante@sistema.com',
        password: 'restaurante123',
        role: UserRole.RESTAURANT,
        employee: { name: 'Cozinha Central', matricula: '901', sector: 'Alimentação', hourly_rate: 0 },
      },
    ];

    const results = [];

    for (const u of users) {
      const existing = await this.findByEmail(u.email);
      if (!existing) {
        const savedUser = await this.create(
          { email: u.email, password_hash: u.password, role: u.role },
          u.employee,
        );
        results.push({ email: u.email, status: 'created' });
      } else {
        results.push({ email: u.email, status: 'already exists' });
      }
    }

    return results;
  }
}
