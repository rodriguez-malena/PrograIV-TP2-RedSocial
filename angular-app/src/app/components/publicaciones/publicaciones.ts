import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
                private publicacionService: PublicacionService,
                private cdr: ChangeDetectorRef){}
    
    ngOnInit(): void {
      this.miPublicacion = this.fb.group({

        titulo: ["",[Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
        descripcion: ["",[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        imagen: ["", Validators.required]
      
      })

      this.cargarPublicaciones();
      console.log(
      this.publicaciones.map(p => ({
        id: p._id,
        likes: p.likes.length
      }))
    );
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
      this.formEnviado = true;

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
      formData.append('imagenPerfil', this.usuario.imagenPerfil);
      formData.append('usuarioId', this.usuario._id);
      
      if(imagen) {
        formData.append('imagen', imagen)
      }

      this.publicacionService.crear(formData).subscribe((publicacion: any) => {
        console.log(publicacion)
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: 'Carga exitosa',
        });
        
        this.publicaciones.unshift(publicacion);

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

        this.publicaciones = [...respuesta];
        this.cdr.detectChanges();

        console.log(this.publicaciones);
        
      },
     (err) => {
      console.log('ERROR DEL GET:', err);
    })
    }

  yaDioLike(publicacion: any){
    return publicacion.likes.includes(this.usuario._id);
  }

  cambiarLike(publicacion: any){
      console.log('POST:', publicacion._id);
        console.log('LIKES ANTES:', publicacion.likes);
    if(this.yaDioLike(publicacion)){
      this.publicacionService.borrarLike(publicacion._id, this.usuario._id).subscribe(()=> {
        publicacion.likes = publicacion.likes.filter((id:string)=> id !== this.usuario._id)
      })
    
    } else {
      this.publicacionService.darLike(publicacion._id, this.usuario._id).subscribe(()=> 
        publicacion.likes.push(this.usuario._id)
      )
    }

  }
}
