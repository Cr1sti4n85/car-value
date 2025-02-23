import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let testUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create testing copy of users service
    testUsersService = {
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
  it('creates new user with hashed pass', async () => {
    const user = await service.signup('test@email.com', 'Test_pass');
    expect(user.password).not.toEqual('Test_pass');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws error when email exists', async () => {
    testUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'a@email.com', password: 'pass' } as User,
      ]);
    await expect(service.signup('a@email.com', 'Test_pass')).rejects.toThrow();
  });
});
