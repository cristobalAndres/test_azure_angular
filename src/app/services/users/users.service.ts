import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserDto } from 'src/app/shared/models/users/user.dto';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/shared/models/pagination/pagination.dto';
import { EditUserDto } from 'src/app/shared/models/users/editUser.dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);

  getUsers(page: number, itemsPerPage: number): Observable<PaginatedResponse<UserDto>> {
    return this.http.get<PaginatedResponse<UserDto>>(
      environment.API_URL + `/users?page=${page}&itemsPerPage=${itemsPerPage}`
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(environment.API_URL + `/users/${id}`);
  }

  createUser(user: UserDto): Observable<void> {
    return this.http.post<void>(environment.API_URL + '/users', user);
  }

  editUser(id: number, user: EditUserDto): Observable<void> {
    return this.http.patch<void>(environment.API_URL + `/users/${id}`, user);
  }
}
