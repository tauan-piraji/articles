import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';


//temporario
import { CreateUserDto } from '../../users/domain/dtos/create-user.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    
    console.log('Login attempt:', body.email, body.password);
    return this.authService.login(body.email, body.password);
  }

  //temporario
  @Post('createUser') 
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Get() 
  async getUsers() {
    return this.authService.getUsers();
  }
}
