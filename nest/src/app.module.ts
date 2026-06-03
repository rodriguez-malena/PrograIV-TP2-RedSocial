import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://maleeroodriguez_db_user:KLwbPMQewvBtT9jf@ac-rvedcsy-shard-00-00.jbjtqdb.mongodb.net:27017,ac-rvedcsy-shard-00-01.jbjtqdb.mongodb.net:27017,ac-rvedcsy-shard-00-02.jbjtqdb.mongodb.net:27017/redsocial?ssl=true&replicaSet=atlas-6k8muw-shard-0&authSource=admin&appName=app-redSocial'), AuthModule, UsuariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

