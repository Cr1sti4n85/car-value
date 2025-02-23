import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let testUsersService: Partial<UsersService>;
  let testAuthService: Partial<AuthService>;

  beforeEach(async () => {
    testAuthService = {
      // signup: (email: string, password: string) => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    testUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@email.com',
          password: 'securepass',
        });
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'securepass' }]);
      },
      // remove: (id: number) => {},
      // update: (id: number, attrs: Partial<User>) => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: testUsersService },
        { provide: AuthService, useValue: testAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('test@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@email.com');
  });

  it('FindUser returns a user with given id', async () => {
    const user = await controller.findUser(1);
    expect(user).toBeDefined();
  });
  it('FindUser throws error when user not found', async () => {
    testUsersService.findOne = () => null;
    await expect(controller.findUser(2)).rejects.toThrow();
  });
  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'test@email.com',
        password: 'securepass',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
