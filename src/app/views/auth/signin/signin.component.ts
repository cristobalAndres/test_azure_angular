import { Component, OnInit, inject } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import {
  Router,
  RouteConfigLoadStart,
  ResolveStart,
  RouteConfigLoadEnd,
  ResolveEnd
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  animations: [SharedAnimations]
})
export class SigninComponent implements OnInit {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly auth = inject(AuthService);
  loading: boolean;
  loadingText: string;
  signinForm: UntypedFormGroup;
  forgot_password: boolean;

  constructor() { }

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.router.navigateByUrl('/dashboard');
    }

    this.forgot_password = true;
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.loadingText = 'Cargando...';
        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }});

    this.signinForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      // rol: [null, Validators.required],
    });
  }

  signin() {
    this.loading = true;
    this.loadingText = 'Estás siendo autenticado...';
    this.router.navigateByUrl('/dashboard/companies');
    this.loading = false;
    this.auth.login(this.signinForm.value).subscribe(
      (res: { access_token: string }) => {
        // localStorage.removeItem('company');
        this.toastr.success('Iniciaste sesion correctamente!.', 'Exito!', { progressBar: true });
        sessionStorage.setItem('token', res.access_token);
        this.router.navigateByUrl('/dashboard/companies');
        this.loading = false;
      },
      error => {
      // localStorage.removeItem('company');
        this.toastr.error('Usuario o contrasena invalidos!.', 'Error!', { progressBar: true });
        sessionStorage.removeItem('token');
        this.loading = false;
      });
  }
}
