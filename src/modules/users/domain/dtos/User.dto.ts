export class UserDto {

  name: string;
  email: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}