import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../../repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

//temporario
import { User } from '../../users/domain/entities/user.entity';
import { CreateUserDto } from '../../users/domain/dtos/create-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }
  //temporario
  async getUsers() {

    const listUsers = await this.usersRepo.getAll();

    return listUsers;
  }
  //temporario
async createUser(userData: CreateUserDto): Promise<User> {
    const user = new User();

    user.name = userData.name!;
    user.email = userData.email!;
    user.role = userData.role || 1; 

    console.log(userData)
    // Hash da senha
    if (userData.password) {
      const saltRounds = 12;
      user.password_hash = await bcrypt.hash(userData.password, saltRounds);
    } else {
      throw new Error('Senha é obrigatória');
    }

    // Salvar no banco
    return await this.usersRepo.createAndSave(user);
  }

  async validateUser(email: string, password: string) {

    console.log('email:', email);
    const user = await this.usersRepo.findByEmail(email);


    console.log('Find user by email:', user);
    if (!user) return null;


    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return null;

    console.log('password match:', match);

    return user;
  }

  async login(email: string, password: string) {

    const user = await this.validateUser(email, password);


    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}