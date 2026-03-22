
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingRequestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body, headers } = request;

    this.logger.debug(
      `===========================request begin================================================`,
    );
    this.logger.debug(`URI         : ${url}`);
    this.logger.debug(`Method      : ${method}`);
    this.logger.debug(`Headers     : ${JSON.stringify(headers)}`);
    this.logger.debug(`Request body: ${JSON.stringify(body)}`);
    this.logger.debug(
      `===========================request end===================================================`,
    );

    return next.handle().pipe(
      tap((data) => {
        this.logger.debug(
          `===========================response begin===============================================`,
        );
        this.logger.debug(`Response body: ${JSON.stringify(data)}`);
        this.logger.debug(
          `===========================response end=================================================`,
        );
      }),
    );
  }
}
