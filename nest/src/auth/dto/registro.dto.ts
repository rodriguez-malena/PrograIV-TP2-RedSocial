import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegistroDto {

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  nombreUsuario: string;

  @MinLength(8)
  password: string;

  @IsDateString()
  fechaNacimiento: Date;

  @MinLength(25)
  @MaxLength(60)
  descripcion: string;

  @IsOptional()
  imagenPerfil: string;

  
}