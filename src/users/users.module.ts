import { Module, MiddlewareConsumer } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //creates repository
  providers: [
    UsersService,
    AuthService,
    //globally scoped interceptor
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor,
    // },
  ],
  controllers: [UsersController],
})
export class UsersModule {
  //aplicando middleware de autorizacion
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
