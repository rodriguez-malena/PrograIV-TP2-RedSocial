import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { manejarSubidaImagen } from '../../utils/imagen';
import { PublicacionService } from '../../services/publicacion-service';
import Swal from 'sweetalert2';
import { CommonModule, DatePipe } from '@angular/common';
import { Publicacion } from '../../interfaces/publicacion';

@Component({
  selector: 'app-publicaciones',
  imports: [ReactiveFormsModule, DatePipe, CommonModule],
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

    publicaciones = signal<Publicacion[]>([])
    orden = signal<'fecha' | 'likes'>('fecha')

    constructor(private fb: FormBuilder,
                private publicacionService: PublicacionService,
    ){}   


    ngOnInit(): void {
      this.miPublicacion = this.fb.group({

        titulo: ["",[Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
        descripcion: ["",[Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        imagen: ["", Validators.required]
      
      })

      this.cargarPublicaciones();
      
    }
  
    /*----------------------
    Seleccion de imagenes
    ------------------------*/
    seleccionarImagen(event: any): void {
      const archivo = event.target.files?.[0];
          
        if (archivo) {
            this.nombreArchivo = archivo.name;
            manejarSubidaImagen(event, this.miPublicacion, 'imagen')
          }
    }

    /*----------------------
    GETTERS
    ------------------------*/
    get titulo() {
      return this.miPublicacion.get('titulo')!;
    }

    get descripcion(){
      return this.miPublicacion.get('descripcion')!;
    }

    get imagen(){
      return this.miPublicacion.get('imagen')!;
    }

    /*----------------------
    Subida de publicación
    ------------------------*/

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

    /*Creación del formData*/
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);
      formData.append('nombreUsuario', this.usuario.nombreUsuario);
      formData.append('imagenPerfil', this.usuario.imagenPerfil);
      formData.append('usuarioId', this.usuario._id);
      
      if(imagen) {
        formData.append('imagen', imagen)
      }

  // Llamada al service
      this.publicacionService.crear(formData).subscribe((publicacion: Publicacion) => {
        console.log(publicacion)
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: 'Carga exitosa',
        });
        
  // Actualización de la lista de publicaciones
      this.publicaciones.update(lista => [
        {
          ...publicacion,
          likes: [...(publicacion.likes || [])]
        },
        ...lista
        ]);

      //LIMPIEZA
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
  
    /*----------------------------
    Muestra de feed de publicaciones
    ------------------------*/
    cargarPublicaciones(){
      this.publicacionService.obtener(this.orden()).subscribe((respuesta: any) => {
        
        console.log('RESPUESTA:', respuesta);
        this.publicaciones.set(respuesta)
  
        console.log(this.publicaciones());
        
      },
     (err) => {
      console.log('ERROR DEL GET:', err);
    })
    }

  /*---------------------
  Orden de publicaciones
  -------------------*/
  
  cambiarOrden(event: Event){
    const select = event.target as HTMLSelectElement // TS no sabe que event.target es un <select> entonces necesito aclararle para obtener su valor
    const valor = select.value // obtengo valor 

    const orden =  valor as 'fecha' | 'likes'; // y que solo puede ser 'fecha' o 'likes'
    this.orden.set(orden)
    this.cargarPublicaciones();
  }

  /*---------------
  Acciones del like
  -----------------*/
  yaDioLike(publicacion: Publicacion){
    return publicacion.likes.includes(this.usuario._id)
    //return (publicacion.likes || []).filter(Boolean).includes(this.usuario._id);

  }

  cambiarLike(publicacion: Publicacion){
      console.log('POST:', publicacion._id);
      const id = this.usuario._id;
    
      if(this.yaDioLike(publicacion)){
      this.publicacionService.borrarLike(publicacion._id, id).subscribe((actualizacion: Publicacion)=> {
        console.log(actualizacion.likes);
      console.log(actualizacion.cantidadLikes);
        this.actualizarLikes(publicacion._id, actualizacion.likes)
      })
    
    } else {
      this.publicacionService.darLike(publicacion._id, this.usuario._id).subscribe((actualizacion: Publicacion)=> 
        
        this.actualizarLikes(publicacion._id, actualizacion.likes)

      )
    }

  }

   actualizarLikes(postId: string, likes: string[]) {

      this.publicaciones.update(lista =>
        lista.map(publicacion => publicacion._id === postId // si le dieron like a esa publicacion
            ? { ...publicacion,
               likes: [...likes], // la actualiza 
              cantidadLikes: likes.length }

            : publicacion //la deja como estaba
        )
      );
  }

}
