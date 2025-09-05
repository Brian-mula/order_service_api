import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body()userDto:RegisterUserDto) {
    return this.userService.registerUser(userDto);
  }

  @Post('login')
  async login(@Body()userDto:RegisterUserDto) {
    return this.userService.loginUser(userDto);
  }
}
