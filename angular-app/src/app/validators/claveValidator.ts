import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function confirmarClaveValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        

      const password = formGroup.get('password'); 
      const repiteClave = formGroup.get('repiteClave'); // clave y repite clave son los inputs no sus valores
      const respuestaError = { noCoincide: 'La clave no coincide' }; 

      if (password?.value !== repiteClave?.value) { // si el valor de clave no coincide con el valor de repite
        repiteClave?.setErrors({noCoincide: true});  // sertErrors inserta manualmente el error
        // Si los campos de contraseña no coinciden, devolvemos un error de validación
        return {noCoincide: true};
      }

        return null;
       
    };
  }