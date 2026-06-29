import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { confirmarClaveValidator } from '../../validators/claveValidator';
import { fechaValidator } from '../../validators/fechaValidator';
import { manejarSubidaImagen } from '../../utils/imagen';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit {

   miRegistro!: FormGroup;  
   cargando = false;
   formEnviado = false;
   nombreArchivo: string = 'Ningún archivo seleccionado';

  constructor(private fb: FormBuilder,
              private auth: Auth,
              private router: Router) {} 
  
  ngOnInit(): void {
      this.miRegistro = this.fb.group({

        nombre: ["", [Validators.required, Validators.pattern('/^(?!\s*$)[a-zA-ZÀ-ÿ\s]+$/'), Validators.minLength(4), Validators.maxLength(15)]], 
        apellido: ["", [Validators.required, Validators.pattern('/^(?!\s*$)[a-zA-ZÀ-ÿ\s]+$/'),  Validators.minLength(4), Validators.maxLength(20)]],
        email: ["", [Validators.required, Validators.email, Validators.maxLength(30)]],
        nombreUsuario: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
        fechaNacimiento: ["",[Validators.required, fechaValidator()]],
        descripcion: ["", [Validators.required, Validators.maxLength(60), Validators.minLength(20)]],
        imagenPerfil: [null, Validators.required],
        perfil: ["usuario"],
        password: ["", [ Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/), Validators.minLength(8), Validators.maxLength(25)]],
        repiteClave: [null, Validators.required]
        
    
      },{ validators: confirmarClaveValidator() 
      });

      this.miRegistro.valueChanges.subscribe((valor) => { 
        console.log("El formulario ha cambiado", valor)
    })
    }

  manejoDeArchivo(event: any): void {
    const archivo = event.target.files?.[0];
    
    if (archivo) {
      this.nombreArchivo = archivo.name;

    manejarSubidaImagen(event, this.miRegistro, 'imagenPerfil')
    }
  }

  get nombre() {
    return this.miRegistro.get('nombre')!;
  }
  get apellido() {
    return this.miRegistro.get('apellido')!;
  }
  get email() {
    return this.miRegistro.get('email')!;
  }
  get nombreUsuario() {
    return this.miRegistro.get('nombreUsuario')!;
  }
  get fechaNacimiento() {
    return this.miRegistro.get('fechaNacimiento')!
  }
  get descripcion() {
    return this.miRegistro.get('descripcion')!
  }
  get imagenPerfil() { 
    return this.miRegistro.get('imagenPerfil')!
  }
  get password() {
    return this.miRegistro.get('password')!;
  }
  get repiteClave() {
    return this.miRegistro.get('repiteClave')!;
  }

  async enviarForm() {

    if(this.cargando) return;
    
    this.cargando = true;
    this.formEnviado = true;

    this.miRegistro.markAllAsTouched();

    console.log("Intento de envío");

    if (this.miRegistro.invalid) { 
      this.cargando = false
      console.log("Formulario inválido");
      return;
    }
    
    console.log("Envio exitoso");

    const { nombre, apellido, email, nombreUsuario, fechaNacimiento, descripcion, password, imagenPerfil} = this.miRegistro.value;

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('email', email);
    formData.append('nombreUsuario', nombreUsuario);
    formData.append('password', password);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('descripcion', descripcion);
    formData.append('perfil', 'usuario');

    if(imagenPerfil) {
      formData.append('imagenPerfil', imagenPerfil)
    }

    this.auth.registro(formData).subscribe((respuesta: any) => {

        console.log(respuesta)
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Usuario creado correctamente',
          showConfirmButton: false,
          timer: 1500,

          customClass: {
            popup: 'swal-popup',
            title: 'swal-titulo',
            htmlContainer: 'swal-texto',

          }
            
        });
  
        this.router.navigate(['/login']);
     

    }, (error) => {
      this.cargando = false
      console.log(error)
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No pudo completarse el registro, vuelva a intentar',
          showConfirmButton: false,
          timer: 1500,

          customClass: {
            popup: 'swal-popup',
            title: 'swal-titulo',
            htmlContainer: 'swal-texto',
          }
          
      });
    }
  )
}

    resetearForm() {
      this.miRegistro.reset(); 
    }

    irALogin(){
      this.router.navigate(['/login'])
    }

    volverAInicio(){
      this.router.navigate(['/bienvenida'])
    }
}
