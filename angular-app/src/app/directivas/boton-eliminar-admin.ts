import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appBotonEliminarAdmin]',
})
export class BotonEliminarAdmin {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appSoloAdmin(esAdmin: boolean) {

    if (esAdmin && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }

    if (!esAdmin && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

