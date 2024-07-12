import { IsAlpha, IsEmail, IsOptional } from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsAlpha()
  @IsOptional()
  lastName?: string;

  @IsAlpha()
  @IsOptional()
  firstName?: string;
}
