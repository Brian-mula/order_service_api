import { ExecutionContext, createParamDecorator } from "@nestjs/common";



export const CurrentUser = createParamDecorator(
    (data:string | undefined, context:ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if(!data) {
            return request.user as jwtPayloadType;
        }
        return request.user[data];
    }
)