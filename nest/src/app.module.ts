import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';


@Module({
  imports: [ConfigModule.forRoot(),
            AuthModule,
            UsuariosModule,
            MongooseModule.forRoot(process.env.MONGO_URI!),
            PublicacionesModule,
            ComentariosModule,
            EstadisticasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

