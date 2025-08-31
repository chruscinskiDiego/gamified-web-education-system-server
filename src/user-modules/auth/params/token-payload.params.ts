import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants";

export const JwtUserReqParam = createParamDecorator(
    (data:unknown, ctx: ExecutionContext) =>{

        const context = ctx.switchToHttp();
        const request = context.getRequest();

        return request[REQUEST_TOKEN_PAYLOAD_KEY];
    }
)