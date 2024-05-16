import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PermissionsService } from './permissions.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  private readonly router = inject(Router);
  private readonly permissionsService = inject(PermissionsService);
  constructor() {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredPermission = route.data['permission'];
    return this.permissionsService.hasPermissionRoute(requiredPermission).pipe(
      map(hasPermission => {
        if (!hasPermission) {
          this.router.navigate(['/dashboard']); // Redirige si no tiene permiso
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/error']); // Maneja errores potenciales
        return of(false);
      })
    );
  }
}
