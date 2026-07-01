import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primeraMayuscula',
})
export class PrimeraMayusculaPipe implements PipeTransform {
  
  transform(texto: string): string {
    if(!texto){
      return ''
    }

    return texto
      .toLowerCase()
      .split(' ')
      .map(palabra =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1)
      )
      .join(' ');
  }

  
}
