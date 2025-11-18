import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UsersRepository } from '../../repository/user.repository';
import { UserController } from './controller/users.controller';
import { UserService } from './service/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UsersRepository, UserService],
  exports: [UsersRepository, UserService],
})
export class UsersModule {}
