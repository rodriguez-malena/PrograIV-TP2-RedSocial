import {
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';

export class LoginDto {

  @IsNotEmpty()
  @IsString()
  nombreUsuario: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}