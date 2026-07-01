import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadisticasService } from '../../services/estadisticas-service';
import { rangoFechasValidator } from '../../validators/rangoFechasValidator';


@Component({
  selector: 'app-dashboard-estadisticas',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.css',
})
export class DashboardEstadisticas implements OnInit {

  formularioEstadisticas! : FormGroup

  constructor(private estadisticasService: EstadisticasService,
              private fb: FormBuilder){}

  ngOnInit(): void {
    this.formularioEstadisticas = this.fb.group({
      desde: ['', Validators.required],
      hasta: ['', Validators.required]
    }, {
      validators: rangoFechasValidator
    })
  }

  buscar(){
    const { desde, hasta } = this.formularioEstadisticas.value;

    if(!desde || !hasta) return;

    this.estadisticasService.postPorUsuario(desde, hasta).subscribe(res => console.log(res));

    this.estadisticasService.comentariosPorTiempo(desde, hasta).subscribe(res => console.log(res));

    this.estadisticasService.comentariosPorPost(desde, hasta).subscribe(res => console.log(res));
  }
}
