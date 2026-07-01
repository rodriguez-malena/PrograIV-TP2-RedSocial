import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from '../publicaciones/schema/publicacion.schema';
import { Comentario } from '../comentarios/schema/comentario.schema';
import { Usuario } from '../usuarios/schema/usuario.schema';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class EstadisticasService {

    constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<Publicacion>,

    @InjectModel(Comentario.name)
    private comentarioModel: Model<Comentario>,

    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,

    private authService: AuthService
    ){}

    async publicacionesPorUsuario(token: string, desde: string, hasta:string){

        await this.authService.verificarAdmin(token);

        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);

        fechaHasta.setHours(23, 59, 59, 999);

        return this.publicacionModel.aggregate([

            { // filtra publicaciones entre las fechas.
                $match: {
                fechaCreacion: {
                    $gte: fechaDesde,
                    $lte: fechaHasta
                },
                eliminada: false
                }
            },

            { // agrupa x usuario creador y cuenta las que hizo
                $group: {
                    _id: '$nombreUsuario',
                    publicaciones: {
                        $sum: 1
                }
                }
            },

            { // devuelve solo lo que necesita el grafico
                $project: {
                    _id: 0,
                    usuario: '$_id',
                    publicaciones: 1
                }
            },

            { // ordena d mayor a menor
                $sort: {
                publicaciones: -1
                }
            }

            ]);

        }

    async comentariosPorTiempo(token: string, desde: string, hasta:string){

        await this.authService.verificarAdmin(token);

        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);

        fechaHasta.setHours(23, 59, 59, 999);

        const total = await this.comentarioModel.countDocuments({
            createdAt: {
                $gte: fechaDesde,
                $lte: fechaHasta
            }
        });

        return {
            total
        }
    }

    async comentariosPorPublicacion(token: string, desde: string, hasta: string){

        await this.authService.verificarAdmin(token);

        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);

        fechaHasta.setHours(23, 59, 59, 999);

        return this.comentarioModel.aggregate([

            {
                $match: {
                createdAt: {
                    $gte: fechaDesde,
                    $lte: fechaHasta
                }
                }
            },


            { // busca info del usuario en la coleccion
                $lookup: {
                    from: 'publicacions',
                    localField: 'publicacion',
                    foreignField: '_id',
                    as: 'publicacion'
                }
            },

            { // convierte arreglo en objeto
                $unwind: '$publicacion'
            },

            {
                $match: {
                    'publicacion.eliminada': false
                }
            },
            {
                $group: {
                _id: '$publicacion._id',
                titulo: {
                    $first: '$publicacion.titulo'
                },
                comentarios: {
                    $sum: 1
                }
                }
            },
            { // devuelve solo lo que necesita el grafico
                $project: {
                    _id: 0,
                    titulo: 1,
                    comentarios: 1
                }
            },

            { // ordena d mayor a menor
                $sort: {
                    comentarios: -1
                }
            }

            ]);
    }


    

}


            

