import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  @Get('me')
  @ApiOkResponse()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getMe() {
    return 'User Info';
  }
}
