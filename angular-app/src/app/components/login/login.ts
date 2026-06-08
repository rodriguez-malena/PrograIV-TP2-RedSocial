import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Auth } from '../../services/auth';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login  implements OnInit{

   miLogin!: FormGroup

  constructor(private fb: FormBuilder,
              private authService: Auth,
              private router: Router) {} 

  ngOnInit(): void {
    this.miLogin = this.fb.group({
      nombreUsuario: ["", [Validators.required,Validators.minLength(4), Validators.maxLength(15)]],
      password: ["",[Validators.required, Validators.minLength(6), Validators.maxLength(25)]]
    })
  };

    get password() {
    return this.miLogin.get('password');
    }

    get nombreUsuario() {
      return this.miLogin.get('nombreUsuario');
    }

  enviarForm() {

    this.miLogin.markAllAsTouched();
    console.log("Intento de envío");

    if (this.miLogin.invalid) { 
      console.log("Formulario inválido");
      return;
    }
    console.log("Envio exitoso");

    const { nombreUsuario, password } = this.miLogin.value;

    
    this.authService.login({ nombreUsuario, password }).subscribe((respuesta: any) => {

      console.log("Usuario validado:", respuesta);
      Swal.fire({
        icon: 'success',
        title: 'Login exitoso',
        timer: 1500,
        showConfirmButton: false
      });
      
      sessionStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

      this.router.navigate(['/mi-perfil']);
   
    },
      
    (error) => {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Usuario inexistente',
        text: 'Usuario o contraseña incorrectos',
        customClass: {
            confirmButton: 'btn-propio',
            popup: 'mi-modal',
            title: 'mi-titulo',                    
        }
      })
  })   
  }  

    volverARegistro(){
        this.router.navigate(['/registro'])
    }

    autocompletarYEnviar(nombreUsuario: string, password: string) {
      this.miLogin.patchValue({
        nombreUsuario,
        password
      });

      this.enviarForm();
    }

    
  }


