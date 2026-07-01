import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadisticasService } from '../../../services/estadisticas-service';
import { rangoFechasValidator } from '../../../validators/rangoFechasValidator';



@Component({
  selector: 'app-estadisticas',
  imports: [ReactiveFormsModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas implements OnInit {
  
  formularioEstadistica!: FormGroup

  constructor(private fb: FormBuilder, private estadisticasService: EstadisticasService){}

  ngOnInit(): void {
    this.formularioEstadistica = this.fb.group({

      desde: ['', Validators.required],
      hasta: ['', Validators.required]
    },
    {
      validators: rangoFechasValidator
    })
  }
  

  buscar(){
    const { desde, hasta } = this.formularioEstadistica.value

    if(!desde || !hasta) return;

    this.estadisticasService.postPorUsuario(desde, hasta).subscribe(res => console.log(res))

    this.estadisticasService.comentariosPorTiempo(desde, hasta).subscribe(res => console.log(res))

    this.estadisticasService.comentariosPorPost(desde, hasta).subscribe(res => console.log(res))

  
  
  
  }
  

}
