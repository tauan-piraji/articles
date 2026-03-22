import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { GlobalException } from '../../../common/exceptions/global.exception';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService
  ) { }

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

    if (!user) throw new GlobalException('Invalid credentials', HttpStatus.UNAUTHORIZED);

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