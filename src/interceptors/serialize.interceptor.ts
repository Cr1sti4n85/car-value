import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../users/dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run something before request is handled by request handler
    // console.log("I'm running before handler", context);

    return next.handle().pipe(
      map((data: any) => {
        //Run sth before the response is sent out
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true,
        }); //converting data as user dto
      }),
    );
  }
}
