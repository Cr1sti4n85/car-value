import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    //check if email is in user
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email is already in use');
    }
    //hash pass
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //join hashed result and salt together
    const result = `${salt}.${hash.toString('hex')}`;
    //create new user
    const user = await this.usersService.create(email, result);

    return user;
  }

  signin() {}
}
