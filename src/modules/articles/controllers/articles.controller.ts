import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { CreateArticleDto } from '../domain/dtos/create-article.dto';
import { UpdateArticleDto } from '../domain/dtos/update-article.dto';
import { User } from 'src/modules/users/domain/entities/user.entity';

import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../users/domain/enums/role.enum';

import type { Request } from 'express';

@Controller('v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  @Post()
  create(@Body() dto: CreateArticleDto, @Req() req: any) {

    const user = req.user as User;
    return this.articlesService.create(dto, user);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto, @Req() req: any) {

    console.log("REQ: ", req.user)

    const user = req.user as User;
    return this.articlesService.update(id, dto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user as User;
    return this.articlesService.remove(id, user);
  }
}
