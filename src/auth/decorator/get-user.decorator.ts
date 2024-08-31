import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express'; // Import the extended Request interface

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user?.[data]; // Use optional chaining to handle undefined user
    }
    return request.user;
  },
);
