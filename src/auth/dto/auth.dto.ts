import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsAlpha()
  @ApiProperty({
    required: true,
  })
  firstName: string;

  @IsAlpha()
  @IsOptional()
  @ApiProperty()
  lastName?: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  password: string;
}
