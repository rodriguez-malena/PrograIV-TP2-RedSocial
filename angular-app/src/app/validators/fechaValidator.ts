import {ValidationErrors, ValidatorFn } from '@angular/forms';

export function fechaValidator(): ValidatorFn {
  return (fechaNac): ValidationErrors | null => {
    if (!fechaNac.value) {
      return null; 
    }

    const fechaSeleccionada = new Date(fechaNac.value);
    
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