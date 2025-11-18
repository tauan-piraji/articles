import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Article } from '../modules/articles/domain/entities/article.entity';

@Injectable()
export class ArticlesRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }

  findByUser(userId: string) {
    return this.find({ where: { user: { id: userId } } });
  }

  findById(id: string) {
    return this.findOne({ where: { id }, relations: ['user'] });
  }
}
