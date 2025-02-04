// 로그인에 필요한 사용자 정보 추출
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserInfo = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
