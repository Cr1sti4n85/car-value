import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

it('can create an instance of Auth Service', async () => {
  //Create testing copy of users service
  const testUsersService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password }),
  };

  //creating test module
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      /*when user Service is needed, it's going to use testUsersService */
      {
        provide: UsersService,
        useValue: testUsersService,
      },
    ],
  }).compile();

  const service = module.get<AuthService>(AuthService);
  expect(service).toBeDefined();
});
