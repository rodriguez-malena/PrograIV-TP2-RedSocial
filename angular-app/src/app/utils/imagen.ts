import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';


export function manejarSubidaImagen(event: any, form: FormGroup, controlName: string): void {
  const archivo = event.target.files?.[0];
  
  if(!archivo) return;
  const tiposPermitidos = [
    'image/png', 'image/jpg', 'image/jpeg', 
  ]

  if(!tiposPermitidos.includes(archivo.type)){
     Swal.fire({
      icon: 'error',
      title: 'Archivo inválido',
      text: 'Solo se permiten imágenes JPG y PNG'
    });

    event.target.value = '';

    return;
  }
  
  if (archivo) {
    form.patchValue({
      [controlName]: archivo
    });
  }
}