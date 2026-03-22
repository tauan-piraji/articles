import { HttpException, HttpStatus } from '@nestjs/common';

export class GlobalException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    cause?: Error,
    responseBody?: Record<string, any>,
  ) {
    super(
      {
        message,
        statusCode: status,
        cause: cause?.message,
        responseBody,
      },
      status,
      { cause },
    );
  }
}
