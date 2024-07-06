import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  middlename: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @MinLength(8)
  password: string;
}
