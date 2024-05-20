import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CompaniesService } from './companies.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {
  private readonly companiesService = inject(CompaniesService);
  private readonly router = inject(Router);
  constructor() {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const companyId = next.paramMap.get('id');
    return this.companiesService.checkCompaniesByUserId(+companyId!).pipe(
      map((data) => {
        if (data) {
          return true;
        }
        this.router.navigate(['/dashboard']);
      }), // Si la validación es exitosa, permite el acceso
      catchError((error) => {
        this.router.navigate(['/dashboard']); // Redirige a una página de error si no tiene permiso
        return of(false);
      })
    );
  }
}
