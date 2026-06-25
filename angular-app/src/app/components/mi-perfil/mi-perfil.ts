import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion';
import { PublicacionService } from '../../services/publicacion-service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario-service';
import { fechaValidator } from '../../validators/fechaValidator';
import { manejarSubidaImagen } from '../../utils/imagen';


@Component({
  selector: 'app-mi-perfil',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit {

  formEditarPerfil!: FormGroup;
  misPublicaciones = signal<Publicacion[]>([]);
  postSeleccionado : Publicacion | null = null;
  
  imagenSeleccionada: File | null = null;
  cargando = false;
  nombreArchivo: string = 'Ningún archivo seleccionado';


  postAbierto = false;
  editarPerfil = false;

  usuario = JSON.parse(sessionStorage.getItem('usuario')!);

  constructor(private publicacionService: PublicacionService,
              private usuarioService: UsuarioService,
              private fb: FormBuilder){}  

  ngOnInit(): void {
    this.formEditarPerfil = this.fb.group({

      nombre: [this.usuario.nombre, [ Validators.pattern('^[a-zA-ZÀ-ÿ\s]+$'), Validators.minLength(4), Validators.maxLength(15)]],
      apellido: [this.usuario.apellido, [Validators.pattern('^[a-zA-ZÀ-ÿ\s]+$'),  Validators.minLength(4), Validators.maxLength(20)]],
      nombreUsuario: [this.usuario.nombreUsuario,[Validators.minLength(4), Validators.maxLength(15)]],
      fechaNacimiento: [this.usuario.fechaNacimiento, fechaValidator()],
      descripcion: [this.usuario.descripcion,[Validators.maxLength(60), Validators.minLength(20)]],
      imagenPerfil: [null]
    })

    this.cargarMisPublicaciones()
  }


  /*-------------------------
  Visualización de mis posts
  ---------------------------*/
  
  cargarMisPublicaciones(){
      this.publicacionService.obtener('fecha', 0, 3, this.usuario._id).subscribe((respuesta: any) => {
        
        this.misPublicaciones.set(respuesta.publicaciones)
    
        console.log(this.misPublicaciones());
        
      },
     (err) => {
      console.log('ERROR DEL GET:', err);
    })
    }

  /*--------------
   Modal de posts 
   ---------------*/

  abrirPost(publicacion: Publicacion) {
  this.postSeleccionado = publicacion;
  this.postAbierto = true;
  }

  cerrarPost() {
    this.postAbierto = false;
    this.postSeleccionado = null;
  }

  /*---------------
  ELiminación de posts
  -----------------*/

  eliminarPublicacion(publicacion: Publicacion){
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estas por borrar esta publicación',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal-popup',
            title: 'swal-titulo',
            htmlContainer: 'swal-texto',
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-cancel-btn'
          }

      }).then((result) => {
  
        if (result.isConfirmed) {
  
          this.publicacionService.eliminar(publicacion._id, this.usuario._id).subscribe(() => {
             
            this.misPublicaciones.update(lista => lista.filter(publi => publi._id !== publicacion._id)); // Actualizo y creo nuevo array filtrando las que no tienen el id de la eliminada 
  
              Swal.fire({
                icon: 'success',
                title: 'Eliminada',
                text: 'La publicación se eliminó correctamente',
                showConfirmButton: false,
              
                customClass: {
                              popup: 'swal-popup',
                              title: 'swal-titulo',
                              htmlContainer: 'swal-texto',
                            }
            });
            });
          this.cerrarPost()
        }
    })
    }

  /*----------------
  Edición del perfil
  ----------------*/

  abrirEditarPerfil(){

    this.formEditarPerfil.patchValue({
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      nombreUsuario: this.usuario.nombreUsuario,
      fechaNacimiento: this.usuario.fechaNacimiento,
      descripcion: this.usuario.descripcion
    });

    this.formEditarPerfil.get('imagenPerfil')?.reset();

    this.editarPerfil = true;
  }


  guardarCambios(){

    if (this.cargando) return;

    this.cargando = true;

    console.log("Intento de envío");

    if (this.formEditarPerfil.invalid) { 
      this.cargando = false
      console.log("Formulario inválido");
      return;
    }
    
    console.log("Envio exitoso");

    const { nombre, apellido, nombreUsuario, fechaNacimiento, descripcion, imagenPerfil } = this.formEditarPerfil.value;

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('nombreUsuario', nombreUsuario);
    formData.append('descripcion', descripcion);
    formData.append('fechaNacimiento', fechaNacimiento);

    if(imagenPerfil){
     formData.append('imagenPerfil', imagenPerfil);
    }


    this.usuarioService.actualizarUsuario(this.usuario._id, formData).subscribe((usuarioActualizado: any)=>{

      this.cargando = false;
      this.usuario = usuarioActualizado;

      sessionStorage.setItem('usuario', JSON.stringify(usuarioActualizado));


      
      Swal.fire({
        icon:'success',
        title:'Perfil actualizado',
        text: 'Los cambios se guardaron',
        showConfirmButton: false,
        
        customClass: {
          popup: 'swal-popup',
          title: 'swal-titulo',
          htmlContainer: 'swal-texto',
          
        }
      });
      
      this.cerrarEditarPerfil()

    }, (error) => {

        this.cargando = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: Array.isArray(error.error.message)
            ? error.error.message[0]
            : error.error.message,
          showConfirmButton: false,

          customClass: {
            popup: 'swal-popup',
            title: 'swal-titulo',
            htmlContainer: 'swal-texto',
          }
        });
      }
    );
  }

  cerrarEditarPerfil(){
    this.editarPerfil = false;
    this.formEditarPerfil.reset();
    this.imagenSeleccionada = null;
    this.nombreArchivo = 'Ningún archivo seleccionado';
  }


  seleccionarImagen(event: Event){
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    
    if (archivo) {
      this.nombreArchivo = archivo.name;

    manejarSubidaImagen(event, this.formEditarPerfil, 'imagenPerfil')
    }
  }

  
  get nombre() {
    return this.formEditarPerfil.get('nombre')!;
  }
  get apellido() {
    return this.formEditarPerfil.get('apellido')!;
  }
  get email() {
    return this.formEditarPerfil.get('email')!;
  }
  get nombreUsuario() {
    return this.formEditarPerfil.get('nombreUsuario')!;
  }
  get fechaNacimiento() {
    return this.formEditarPerfil.get('fechaNacimiento')!
  }
  get descripcion() {
    return this.formEditarPerfil.get('descripcion')!
  }
  get imagenPerfil() { 
    return this.formEditarPerfil.get('imagenPerfil')!
  }
}
