import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImagenBrillante]',
})
export class ImagenBrillante {
  @Input() appImagenBrillante: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(): void {

    if (this.appImagenBrillante >= 5) {

      this.renderer.setStyle(this.el.nativeElement, 'filter', 'brightness(1.2)');
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.03)');
      this.renderer.setStyle(this.el.nativeElement, 'transition', '0.3s ease');
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 15px rgba(255, 215, 0, 0.6)');
      this.renderer.setStyle(this.el.nativeElement, 'border-radius', '10px');

    } else {

      this.renderer.removeStyle(this.el.nativeElement, 'filter');
      this.renderer.removeStyle(this.el.nativeElement, 'transform');
      this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');

    }
  }
}
