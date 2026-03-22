import {
  Injectable, HttpStatus
} from '@nestjs/common';
import { UsersRepository } from '../../../repository/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../domain/entities/user.entity';
import { CreateUserDto } from '../domain/dtos/create-user.dto';
import { UpdateUserDto } from '../domain/dtos/update-user.dto';
import { UserDto } from '../domain/dtos/User.dto';
import { GlobalException } from 'src/common/exceptions/global.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepo: UsersRepository
  ) { }

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.usersRepo.findByEmail(dto.email);
    if (exists) throw new GlobalException("Email já cadastrado", HttpStatus.CONFLICT);

    const password_hash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      ...dto,
      password_hash,
    });

    return this.usersRepo.save(user);
  }

  findAll(): Promise<UserDto[]> {
    return this.usersRepo.find().then(users =>
      users.map(user => new UserDto({
        name: user.name,
        email: user.email
      }))
    );
  }

  async findOneById(id: string): Promise<UserDto> {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new GlobalException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    return new UserDto({
      name: user.name,
      email: user.email
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new GlobalException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDto> {


    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const allowed: Partial<User> = {
      ...(dto.name && { name: dto.name }),
      ...(dto.email && { email: dto.email }),
      ...(passwordHash && { passwordHash }),
    };

    await this.usersRepo.update(id, allowed);

    const updated = await this.usersRepo.findById(id);
    if (!updated) throw new GlobalException('Usuario não encontrado', HttpStatus.NOT_FOUND);

    return new UserDto({
      name: updated.name,
      email: updated.email,
    });
  }
  
  async delete(id: string): Promise<String> {
    await this.usersRepo.delete(id);
    return "Usuario excluido";
  }
}
