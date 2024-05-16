import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(data: { email: string, password: string }) {
    return this.http.post(environment.API_URL + '/auth/login', {
      email: data.email,
      password: data.password,
    });
  }

  getUser() {
    return this.http.get(environment.API_URL + '/auth');
  }

  forgotPassword(data: {email: string}) {
    return this.http.post( environment.API_URL + '/auth/forgot_password', data);
  }

  changePassword(data: {newPassword: string, confirmPassword: string}, token: string ) {
    return this.http.patch(environment.API_URL + '/auth/change_password/' + token, data);
  }

  signout() {
    sessionStorage.removeItem('token');
  }
}
