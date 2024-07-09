import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  email: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  password: string;
}
