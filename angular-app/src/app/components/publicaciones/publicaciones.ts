import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { manejarSubidaImagen } from '../../utils/imagen';
import { PublicacionService } from '../../services/publicacion-service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-publicaciones',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones implements OnInit {
    usuario = JSON.parse(sessionStorage.getItem('usuario')!)
    cargando = false;
    formEnviado = false;
    mostrarModal= false;
    nombreArchivo: string = 'Ningún archivo seleccionado';
    miPublicacion!: FormGroup;

    publicaciones: any[] = [];

    constructor(private fb: FormBuilder,
                private publicacionService: PublicacionService){}
    
    ngOnInit(): void {
      this.miPublicacion = this.fb.group({

        titulo: ["",[Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
        descripcion: ["",[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        imagen: ["", Validators.required]
      
      })

      this.cargarPublicaciones();
    }
    
    seleccionarImagen(event: any): void {
      const archivo = event.target.files?.[0];
          
        if (archivo) {
            this.nombreArchivo = archivo.name;
            manejarSubidaImagen(event, this.miPublicacion, 'imagen')
          }
    }

    get titulo() {
      return this.miPublicacion.get('titulo')!;
    }

    get descripcion(){
      return this.miPublicacion.get('descripcion')!;
    }

    get imagen(){
      return this.miPublicacion.get('imagen')!;
    }

    async subir(){
      if(this.cargando) return;
    
      this.cargando = true;
      this.formEnviado = true

      this.miPublicacion.markAllAsTouched();
      console.log("Intento de envío");

      if (this.miPublicacion.invalid) { 
        this.cargando = false
        console.log("Carga inválida");
        return;
      }

      console.log("Imagen cargada con exito")

      const { titulo, descripcion, imagen } = this.miPublicacion.value

      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);
      formData.append('nombreUsuario', this.usuario.nombreUsuario);
      formData.append('usuarioId', this.usuario._id);
      
      if(imagen) {
        formData.append('imagen', imagen)
      }

      this.publicacionService.crear(formData).subscribe((respuesta: any) => {
        console.log(respuesta)
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: 'Carga exitosa',
        });

        this.miPublicacion.reset();
        this.nombreArchivo = 'Ningún archivo seleccionado';
        this.mostrarModal = false;

      }, (error) => {
          this.cargando = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message
          });
      })
    }
  
    cargarPublicaciones(){
      this.publicacionService.obtener().subscribe((respuesta: any) => {
        this.publicaciones = respuesta;

        console.log(this.publicaciones);
        
      })
    }
}
