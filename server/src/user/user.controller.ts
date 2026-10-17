import { Body, Controller, Get, Put } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}
  @Get()
  get() {
    return this.user.get();
  }
  @Put()
  update(@Body() dto: UpdateUserDto) {
    return this.user.update(dto);
  }
}
