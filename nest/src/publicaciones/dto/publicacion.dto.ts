import { IsNotEmpty, IsOptional } from "class-validator";

export class PublicacionDto {
    
    @IsNotEmpty()
    titulo: string;

    @IsNotEmpty()
    descripcion: string;

    @IsOptional()
    imagen: string;

    @IsNotEmpty()
    usuarioId: string;

    @IsNotEmpty()
    nombreUsuario: string;
    }