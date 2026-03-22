import { Injectable, HttpStatus } from '@nestjs/common';
import { ArticlesRepository } from '../../../repository/articles.repository';
import { UsersRepository } from '../../../repository/user.repository';
import { CreateArticleDto } from '../domain/dtos/create-article.dto';
import { UpdateArticleDto } from '../domain/dtos/update-article.dto';
import { ArticleDto } from '../domain/dtos/article.dto';
import { UserRole } from '../../users/domain/enums/role.enum';
import { GlobalException } from 'src/common/exceptions/global.exception';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepo: ArticlesRepository,
    private readonly usersRepo: UsersRepository
  ) { }

  async create(dto: CreateArticleDto, userPayload: any) {

    const user = await this.usersRepo.findById(userPayload.sub);
    if (!user) throw new GlobalException('Usuario não encontrado', HttpStatus.NOT_FOUND);

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
    if (!article) throw new GlobalException('Artigo não encontrado', HttpStatus.NOT_FOUND);
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
    if (!article) throw new GlobalException('Artigo não encontrado', HttpStatus.NOT_FOUND);

    if (userPayload.role !== UserRole.ADMIN) {

      if (article.user.id !== userPayload.sub) {
        throw new GlobalException('Você não pode alterar esse artigo', HttpStatus.FORBIDDEN);
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
    if (!article) throw new GlobalException('Artigo não encontrado', HttpStatus.NOT_FOUND);


    if (userPayload.role !== UserRole.ADMIN) {

      if (article.user.id !== userPayload.sub) {
        throw new GlobalException('Você não pode deletar esse artigo', HttpStatus.FORBIDDEN);
      }
    }

    await this.articlesRepo.remove(article);
  }
}
