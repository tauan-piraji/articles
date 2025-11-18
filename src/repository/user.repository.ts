import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../modules/users/domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) { }

  async getAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async createAndSave(user: Partial<User>): Promise<User> {
    const entity = this.repo.create(user);
    return this.repo.save(entity);
  }

  async findOne(criteria: FindOptionsWhere<User>): Promise<User | null> {
    return this.repo.findOne({ where: criteria });
  }

  async find(criteria?: FindOptionsWhere<User>): Promise<User[]> {
    return this.repo.find({ where: criteria });
  }

  create(userData: Partial<User>): User {
    return this.repo.create(userData);
  }

  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async remove(user: User): Promise<void> {
    await this.repo.remove(user);
  }

  async exists(criteria: FindOptionsWhere<User>): Promise<boolean> {
    const count = await this.repo.count({ where: criteria });
    return count > 0;
  }

  async update(id: string, partialEntity: Partial<User>): Promise<User> {
    await this.repo.update(id, partialEntity);
    return this.findById(id) as Promise<User>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async count(criteria?: FindOptionsWhere<User>): Promise<number> {
    return this.repo.count({ where: criteria });
  }
}