export interface Publicacion {
    _id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    usuarioId: string;
    nombreUsuario: string;
    imagenPerfil: string;
    fechaCreacion: string;
    likes: string[];
    comentarios: any[];
    eliminada: boolean;
}
