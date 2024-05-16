import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RolesDto } from 'src/app/shared/models/roles/roles.dto';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly http = inject(HttpClient);

  getRoles(): Observable<RolesDto[]> {
    return this.http.get<RolesDto[]>(
      environment.API_URL + '/roles'
    );
  }
}
