import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoTranscurrido',
})
export class TiempoTranscurridoPipe implements PipeTransform {
  transform(fecha: Date | string): string {
    
     if (!fecha) {
      return '';
    }

    const fechaPublicacion = new Date(fecha);
    const ahora = new Date();

    const diferencia = ahora.getTime() - fechaPublicacion.getTime();

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (segundos < 60) {
      return 'Hace unos segundos';
    }

    if (minutos < 60) {
      return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    }

    if (horas < 24) {
      return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    }

    if (dias < 30) {
      return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    }

    const meses = Math.floor(dias / 30);

    if (meses < 12) {
      return `Hace ${meses} mes${meses > 1 ? 'es' : ''}`;
    }

    const anios = Math.floor(meses / 12);

    return `Hace ${anios} año${anios > 1 ? 's' : ''}`;


  }
}
