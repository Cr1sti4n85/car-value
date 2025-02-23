import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let testUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    //Create testing copy of users service
    testUsersService = {
      find: (email: string) => {
        const filteredusers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredusers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
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
    await service.signup('a@email.com', 'Test_pass');
    await expect(service.signup('a@email.com', 'Test_pass')).rejects.toThrow();
  });
  it('throws error while login in with unused email', async () => {
    await expect(service.signin('a@email.com', 'Test_pass')).rejects.toThrow();
  });

  it('throws error while login in with invaid pass', async () => {
    await service.signup('a@email.com', 'Test_pass');
    await expect(service.signin('a@email.com', 'wrong_pass')).rejects.toThrow();
  });
  it('returns user if valid credentials are provided', async () => {
    await service.signup('asdf@email.com', 'passSecure');
    const user = await service.signin('asdf@email.com', 'passSecure');
    expect(user).toBeDefined();
  });
});
