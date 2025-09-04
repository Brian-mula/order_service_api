import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected getTracker(request: Record<string, any>): Promise<string> {
    const token = request.headers['authorization'];
    const actualToken = token.split(' ')[1];
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET!) as jwtPayloadType;

    return decoded ? Promise.resolve(decoded.sub) : Promise.resolve(request.ip);
  }

  protected throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
    throw new ThrottlerException('🚨 Too many requests! Please try again later.');
  }
}