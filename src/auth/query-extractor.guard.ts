import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class QueryExtractorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('query guard called');
    const req = context.switchToHttp().getRequest();
    const { info } = req.query;
    req.session.info = info;
    return true;
  }
}
