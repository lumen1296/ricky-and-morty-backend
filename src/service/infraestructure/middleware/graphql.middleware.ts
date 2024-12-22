import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GraphqlMiddleware implements NestMiddleware {
private readonly logger = new Logger(GraphqlMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('GraphQL Request:', JSON.stringify(req.body));
    next();
  }
}
