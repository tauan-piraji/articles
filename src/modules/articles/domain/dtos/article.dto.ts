export class ArticleDto {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ArticleDto>) {
    Object.assign(this, partial);
  }
}
