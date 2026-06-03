import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fechaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; 
    }

    const fechaSeleccionada = new Date(control.value);
    const fechaHoy = new Date();

    fechaHoy.setHours(0, 0, 0, 0);

    return fechaSeleccionada > fechaHoy ? { fechaFutura: true } : null;
  };
}