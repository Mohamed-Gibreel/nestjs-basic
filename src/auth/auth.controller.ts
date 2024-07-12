import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto, SignInDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  @Post('register')
  @ApiBadRequestResponse()
  @ApiCreatedResponse()
  signUp(@Body() signUpDto: AuthDto) {
    return this.authSerivce.signUp(signUpDto);
  }

  @Post('login')
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: AuthDto,
  })
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authSerivce.signIn(signInDto);
  }
}
