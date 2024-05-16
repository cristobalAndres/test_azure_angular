import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective {
  private readonly permissionsService = inject(PermissionsService);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  constructor(
  ) {}

  @Input() set appHasPermission(permission: string) {
    this.viewContainer.clear();
    if (this.permissionsService.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
