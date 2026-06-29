import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UsuarioDto {

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @IsString()
  nombreUsuario: string;

  @MinLength(8)
  password: string;

  @IsString()
  fechaNacimiento: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  imagenPerfil?: string;

  @IsOptional()
  @IsString()
  perfil?: string; 
}