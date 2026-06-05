import {ValidationErrors, ValidatorFn } from '@angular/forms';

export function fechaValidator(): ValidatorFn {
  return (input): ValidationErrors | null => {
    if (!input.value) {
      return null; 
    }

    const fechaSeleccionada = new Date(input.value);
    
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);


    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaHoy.getFullYear() - 100);


    if (fechaSeleccionada > fechaHoy) {
      return { fechaFutura: true }
    };

    if (fechaSeleccionada < fechaMinima) {
      return { edadMaxima: true }
    }

    return null;
}
}