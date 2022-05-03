import { Injectable, Logger, NestMiddleware } from "@nestjs/common";

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}

  use(req: any, res: any, next: () => void) {
    this.logger.debug(`[${req.method}] ${req.originalUrl}`);
    next();
  }
}
