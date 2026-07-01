import { ValidatorFn } from "@angular/forms";


export const rangoFechasValidator: ValidatorFn = (form) => {

  const desde = form.get('desde')?.value;
  const hasta = form.get('hasta')?.value;

  if (!desde || !hasta) {
    return null;
  }

  if (new Date(desde) > new Date(hasta)) {
    return { rangoInvalido: true };
  }

  return null;
};