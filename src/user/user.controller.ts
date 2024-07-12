import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { User } from '../auth/decorator';
import { User as IUser } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UserController {
  @Get('me')
  @ApiOkResponse()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getMe(@User() user: IUser) {
    return user;
  }
}
