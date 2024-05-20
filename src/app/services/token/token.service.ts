import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

type TokenKey =
'id' |
'email' |
'roleId'|
'name' |
'lastName' |
'secondLastName' |
'associationId' |
'permissions';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getDataToken(data: TokenKey ): string {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded[data];
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  }
}
