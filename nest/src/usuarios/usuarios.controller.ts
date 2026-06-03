import { Controller, Get } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';


@Controller('usuarios')
export class UsuariosController {
    constructor(private usuarioService: UsuariosService){}

    @Get()
    obtenerUsuarios() {
        return this.usuarioService.obtenerUsuarios();
    }
}
