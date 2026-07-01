import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEstadoPublicacion]',
})
export class EstadoPublicacion implements OnChanges {

  @Input() appEstadoPublicacion = false;

  constructor(private el: ElementRef,
              private renderer: Renderer2) {}

  ngOnChanges(): void {
     if (this.appEstadoPublicacion) {

      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#ffe5e5');
      this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid #d9534f');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.8');

    } else {

      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
      this.renderer.removeStyle(this.el.nativeElement, 'border');
      this.renderer.removeStyle(this.el.nativeElement, 'opacity');

    }
  }
}
