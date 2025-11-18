import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './controllers/articles.controller';
import { ArticlesService } from './services/articles.service';
import { Article } from './domain/entities/article.entity';
import { ArticlesRepository } from '../../repository/articles.repository';
import { UsersRepository } from '../../repository/user.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    UsersModule
  ],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    ArticlesRepository
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
