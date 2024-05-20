import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModulePermissionDto } from 'src/app/shared/models/permissions/modulePermission.dto';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private readonly http = inject(HttpClient);
  private permissions: Set<string> = new Set();
  private permissionsSource = new BehaviorSubject<Set<string>>(new Set());
  private permissions$ = this.permissionsSource.asObservable();
  private permissionsLoaded = new BehaviorSubject<boolean>(false);

  getPermissionsLoaded(): Observable<boolean> {
    return this.permissionsLoaded.asObservable();
  }

  getModulesPermissions(roleId: number): Observable<ModulePermissionDto[]> {
    return this.http.get<ModulePermissionDto[]>(
      environment.API_URL + `/permissions/${roleId}`
    );
  }

  updateModulesPermissionsByRoleId(
    roleId: number,
    permissions: number[]
  ): Observable<ModulePermissionDto[]> {
    return this.http.post<ModulePermissionDto[]>(
      environment.API_URL + `/permissions/${roleId}`, {
        permissions
      }
    );
  }

  getPermissionUserByRoleId(roleId?: number): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.permissions = new Set(decoded['permissions']);
        this.permissionsSource.next(new Set(decoded['permissions']));
        this.permissionsLoaded.next(true);
        return decoded['permissions'];
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // this.http.get<string[]>(
    //   environment.API_URL + `/permissions/role/${roleId}`
    // ).subscribe(permissions => {
    //   console.log('PERMISSIONS: ', permissions);
    //   this.permissions = new Set(permissions);
    //   this.permissionsSource.next(new Set(permissions));
    //   this.permissionsLoaded.next(true);
    // });
  }

  // Actualiza los permisos
  updatePermissions(permissions: string[]): void {
    this.permissionsSource.next(new Set(permissions));
  }

  // Verificar si el usuario tiene un permiso específico
  hasPermission(permission: string): boolean {
    return this.permissions.has(permission);
  }

  // Verifica si el usuario tiene el permiso necesario
  hasPermissionRoute(permission: string): Observable<boolean> {
    this.getPermissionUserByRoleId();
    return this.permissions$.pipe(
      map(permissions => permissions.has(permission))
    );
  }
}
