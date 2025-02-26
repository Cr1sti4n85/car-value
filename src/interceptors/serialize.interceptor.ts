import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
// import { UserDto } from '../users/dtos/user.dto';

//Esta interfaz se usa cuando queremos definir
// un tipo que representa una clase en sí misma
interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

//an interceptor is a class that is going to modify in some way the response
//before it gets back to the person making the request
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run something before request is handled by request handler
    // console.log("I'm running before handler", context);

    return next.handle().pipe(
      map((data: any) => {
        //Run sth before the response is sent out
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        }); //converting data as user dto
      }),
    );
  }
}
