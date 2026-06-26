import { IsNotEmpty, IsOptional } from "class-validator";

export class PublicacionDto {
    
    @IsNotEmpty()
    titulo: string;

    @IsNotEmpty()
    descripcion: string;

    @IsOptional()
    imagen: string;

    usuarioId?: string;
    imagenPerfil?: string;
    nombreUsuario?: string;
    
}