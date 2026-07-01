import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contadorCaracteres',
})
export class ContadorCaracteresPipe implements PipeTransform {
    transform(valor: string | null, max: number): string {
    
      const largoActual = valor?.length ?? 0;
      return `${largoActual}/${max}`;
  }
}
