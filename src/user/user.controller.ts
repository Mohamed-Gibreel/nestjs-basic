import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { User } from '../auth/decorator';
import { User as IUser } from '@prisma/client';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOkResponse()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getMe(@User() user: IUser) {
    return user;
  }

  @Patch('/:id')
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() editUserDto: EditUserDto,
  ) {
    return await this.userService.editUser(id, editUserDto);
  }
}
