import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  //el decorador nunca debería recibir un argumento, por eso data es de tipo never
  //si quiero recibir algun parametro se puede poner data: string | undefined
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.currentUser;
  },
);
