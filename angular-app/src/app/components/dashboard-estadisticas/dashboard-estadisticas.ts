import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadisticasService } from '../../services/estadisticas-service';
import { rangoFechasValidator } from '../../validators/rangoFechasValidator';
import { Chart } from 'chart.js';



@Component({
  selector: 'app-dashboard-estadisticas',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.css',
})
export class DashboardEstadisticas implements OnInit {

  formularioEstadisticas! : FormGroup
  chartPosts: any;
  chartComentarios: any;
  chartComentariosPost: any;

  @ViewChild('chartPosts') chartPostsRef!: ElementRef;
  @ViewChild('chartComentarios') chartComentariosRef!: ElementRef;
  @ViewChild('chartComentariosPost') chartComentariosPostRef!: ElementRef;

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
    this.formularioEstadisticas.markAllAsTouched();
    const { desde, hasta } = this.formularioEstadisticas.value;

    if(!desde || !hasta) return;

    this.obtenerPostPorUsuario(desde, hasta);
    this.obtenerComentarios(desde, hasta);
    this.obtenerComentariosPorPost(desde, hasta);

  }

  // Publicaciones
    obtenerPostPorUsuario(desde: string, hasta: string){
      this.estadisticasService.postPorUsuario(desde, hasta).subscribe(res => {

        console.log(res)

        this.chartPosts?.destroy();

        this.chartPosts = new Chart(this.chartPostsRef.nativeElement,
          {
            type: 'bar',
            data: {
              labels: res.map((r: any) => r.usuario),
              datasets: [{
                label: 'Publicaciones',
                data: res.map((r: any) => r.publicaciones)
              }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false   
          }
        });
        
      });

    }

  // Comentarios totales
    obtenerComentarios(desde: string, hasta: string){

      this.estadisticasService.comentariosPorTiempo(desde, hasta).subscribe((res: any) => {
        
        console.log(res)
        this.chartComentarios?.destroy();
        
        this.chartComentarios = new Chart(this.chartComentariosRef.nativeElement,
          {
            type: 'line',
            data: {
              labels: res.map((r: any) => r.fecha),
              datasets: [{
                label: 'Comentarios',
                data: res.map((r: any) => r.comentarios),
                fill: false,
                tension: 0.2
              }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1}
              }
            }
          }
        })
    });
    }

  // Cometarios por publicacion
    obtenerComentariosPorPost(desde: string, hasta: string){

      this.estadisticasService.comentariosPorPost(desde, hasta).subscribe(res => {
        
        console.log(res);
        this.chartComentariosPost?.destroy();

        this.chartComentariosPost = new Chart(this.chartComentariosPostRef.nativeElement,
          {
            type: 'pie',
            data: {
              labels: res.map((r: any) => r.titulo),
              datasets: [{
                data: res.map((r: any) => r.comentarios)
              }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false  
          }
        });
      
      });
    }

  
}
