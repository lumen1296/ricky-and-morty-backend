import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { RedisService } from '../persistence/gateways/redis.gateway';
  
  @Injectable()
  export class RedisInterceptor implements NestInterceptor {
    private readonly logger = new Logger(RedisInterceptor.name);
  
    constructor(private readonly redisService: RedisService) {}
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const cacheKey = `${new Date().toISOString()}`;
      return next.handle().pipe(
        tap(async (response) => {
          await this.redisService.setValue(cacheKey, response);
          this.logger.log(`Datos almacenados en Redis para ${cacheKey}:`, JSON.stringify(response));
        }),
      );
    }
  }
  