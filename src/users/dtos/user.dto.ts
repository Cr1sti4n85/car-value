//this describes how the user obj gonna show to the outside world

import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
