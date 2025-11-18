import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ArticlesRepository } from '../../../repository/articles.repository';
import { UsersRepository } from 'src/repository/user.repository';
import { Article } from '../domain/entities/article.entity';
import { CreateArticleDto } from '../domain/dtos/create-article.dto';
import { UpdateArticleDto } from '../domain/dtos/update-article.dto';
import { ArticleDto } from '../domain/dtos/article.dto';
import { User } from '../../users/domain/entities/user.entity';
import { UserRole } from '../../users/domain/enums/role.enum';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepo: ArticlesRepository,
              private readonly usersRepo: UsersRepository) { }

  async create(dto: CreateArticleDto, userPayload: any) {

    const user = await this.usersRepo.findById(userPayload.sub);
    if (!user) throw new NotFoundException('User not found');

    const article = this.articlesRepo.create({
      ...dto,
      user,
    });

    return this.articlesRepo.save(article);
  }

  async findAll(): Promise<ArticleDto[]> {
    const articles = await this.articlesRepo.find({ relations: ['user'] });
    return articles.map(a => new ArticleDto({
      id: a.id,
      userId: a.user.id,
      title: a.title,
      content: a.content,
      tags: a.tags,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  async findOne(id: string): Promise<ArticleDto> {
    const article = await this.articlesRepo.findById(id);
    if (!article) throw new NotFoundException('Article not found');
    return new ArticleDto({
      id: article.id,
      userId: article.user.id,
      title: article.title,
      content: article.content,
      tags: article.tags,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    });
  }

  async update(id: string, dto: UpdateArticleDto, userPayload: any): Promise<ArticleDto> {
    const article = await this.articlesRepo.findById(id);
    if (!article) throw new NotFoundException('Article not found');
    

    if (userPayload.role !== UserRole.ADMIN) {
      
      if (article.user.id !== userPayload.sub) {
        throw new ForbiddenException('You cannot edit this article');
      }
    }

    Object.assign(article, dto);
    const updated = await this.articlesRepo.save(article);

    return new ArticleDto({
      id: updated.id,
      userId: updated.user.id,
      title: updated.title,
      content: updated.content,
      tags: updated.tags,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async remove(id: string, userPayload: any): Promise<void> {

    const article = await this.articlesRepo.findById(id);
    if (!article) throw new NotFoundException('Article not found');


    if (userPayload.role !== UserRole.ADMIN) {
      
      if (article.user.id !== userPayload.sub) {
        throw new ForbiddenException('You cannot delete this article');
      }
    }

    await this.articlesRepo.remove(article);
  }
}
