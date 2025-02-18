import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUser);
  }
  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
