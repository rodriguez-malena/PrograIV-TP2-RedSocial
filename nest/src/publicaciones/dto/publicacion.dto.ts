import { IsNotEmpty } from "class-validator";

export class PublicacionDto {
    
    @IsNotEmpty()
    titulo: string;

    @IsNotEmpty()
    descripcion: string;

    @IsNotEmpty()
    imagen: string;

    @IsNotEmpty()
    usuarioId: string;

    @IsNotEmpty()
    nombreUsuario: string;
    }