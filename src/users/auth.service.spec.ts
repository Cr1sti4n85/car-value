import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    //Create testing copy of users service
    const testUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of Auth Service', async () => {
    expect(service).toBeDefined();
  });
});
