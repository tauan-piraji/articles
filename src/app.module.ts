import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingRequestInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AuthModule,
    ArticlesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingRequestInterceptor,
    },
  ],
})
export class AppModule { }
