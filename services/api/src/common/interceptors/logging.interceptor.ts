import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const method = request?.method || 'UNKNOWN';
    const url = request?.url || 'unknown';
    const now = Date.now();

    this.log(`${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - now;
        this.log(`${method} ${url} ${response?.statusCode || 0} - ${duration}ms`);
      }),
    );
  }

  private log(message: string) {
    this.logger.log(message);
  }
}
