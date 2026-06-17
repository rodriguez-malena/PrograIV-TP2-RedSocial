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
    cantidadLikes: number
    comentarios: any[];
    eliminada: boolean;
}
