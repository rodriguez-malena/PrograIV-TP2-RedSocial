import { Component, OnInit, signal } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { UsuarioService } from '../../services/usuario-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fechaValidator } from '../../validators/fechaValidator';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-dashboard-usuarios',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.css',
})
export class DashboardUsuarios implements OnInit{
  
  usuarios = signal<Usuario[]>([]);
  formularioUsuario!: FormGroup
     nombreArchivo: string = 'Ningún archivo seleccionado';


  constructor(private usuarioService: UsuarioService, 
              private fb: FormBuilder){}

  ngOnInit(): void {
    this.formularioUsuario = this.fb.group({
       nombre: ["", [Validators.required, Validators.pattern('/^(?!\s*$)[a-zA-ZÀ-ÿ\s]+$/'), Validators.minLength(4), Validators.maxLength(15)]], 
        apellido: ["", [Validators.required, Validators.pattern('/^(?!\s*$)[a-zA-ZÀ-ÿ\s]+$/'),  Validators.minLength(4), Validators.maxLength(20)]],
        email: ["", [Validators.required, Validators.email, Validators.maxLength(30)]],
        nombreUsuario: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
        fechaNacimiento: ["",[Validators.required, fechaValidator()]],
        descripcion: ["", [Validators.required, Validators.maxLength(60), Validators.minLength(20)]],
        imagenPerfil: [null, Validators.required],
        perfil: ["usuario", Validators.required],
        password: ["", [ Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/), Validators.minLength(8), Validators.maxLength(25)]],

    })

    this.cargarUsuarios();
  }
  
  cargarUsuarios(){
    this.usuarioService.obtenerUsuarios().subscribe(usuario => {
      this.usuarios.set(usuario)
    })
    
  }
 

  crearUsuario(){
    
     if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      return;
  }

  const { nombre, apellido, email, nombreUsuario, fechaNacimiento, descripcion, password, imagenPerfil} = this.formularioUsuario.value;

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('email', email);
    formData.append('nombreUsuario', nombreUsuario);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('descripcion', descripcion);
    formData.append('password', password);
    formData.append('perfil', 'usuario');

    if(imagenPerfil) {
      formData.append('imagenPerfil', imagenPerfil)
    }

  this.usuarioService.crearUsuario(formData).subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'El usuario se creó correctamente.',
            showConfirmButton: false,
            timer: 1500,

            customClass: {
              popup: 'swal-popup',
              title: 'swal-titulo',
              htmlContainer: 'swal-texto',
            }

          });

          this.formularioUsuario.reset({
            perfil: 'usuario',
            imagenPerfil: null,
          });
          this.nombreArchivo = 'Ningún archivo seleccionado';

          this.cargarUsuarios();

        },

        error: (err) => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No pudo crearse el usuario, volvé a intentarlo',
            showConfirmButton: false,
            timer: 1500,

            customClass: {
              popup: 'swal-popup',
              title: 'swal-titulo',
              htmlContainer: 'swal-texto',
            }
          });
        }
      })
  }


  deshabilitar(usuario: Usuario){

    this.usuarioService.deshabilitarUsuario(usuario._id).subscribe(()=>{

        usuario.habilitado = false;

      });
  }

  habilitar(usuario: Usuario){

    this.usuarioService.habilitarUsuario(usuario._id).subscribe(()=>{

        usuario.habilitado = true;

      });
  }

  seleccionarImagen(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const archivo = input.files[0];

    this.formularioUsuario.patchValue({
      imagenPerfil: archivo
    });

    this.nombreArchivo = archivo.name;

  }

  get nombre() {
    return this.formularioUsuario.get('nombre')!;
  }
  get apellido() {
    return this.formularioUsuario.get('apellido')!;
  }
  get email() {
    return this.formularioUsuario.get('email')!;
  }
  get nombreUsuario() {
    return this.formularioUsuario.get('nombreUsuario')!;
  }
  get fechaNacimiento() {
    return this.formularioUsuario.get('fechaNacimiento')!
  }
  get descripcion() {
    return this.formularioUsuario.get('descripcion')!
  }
  get imagenPerfil() { 
    return this.formularioUsuario.get('imagenPerfil')!
  }
  get password() {
    return this.formularioUsuario.get('password')!;
  }

}
