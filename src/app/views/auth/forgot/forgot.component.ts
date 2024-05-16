import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
  animations: [SharedAnimations]
})
export class ForgotComponent implements OnInit {
  loading: boolean;
  loadingText: string;
  forgotPasswordForm: UntypedFormGroup;
  token: string;
  
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.loadingText = 'Cargando...';
        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }});
      
      this.forgotPasswordForm = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        rol: [null, [Validators.required]]
      });
  }

  sendEmail() {
    this.loading = true;
    // this.auth.forgotPassword(this.forgotPasswordForm.value).subscribe(
    //   (data: any) => {
    //   this.loading = false;
    //   this.toastr.success('Hemos enviado un email para que cambies tu contraseña!.', 'Exito!', { progressBar: true })
    // }, error => {
    //   this.loading = false;
    //   this.toastr.error('Tuvimos problemas al enviar el email, revisa los datos que nos suministras!.', 'Error!', { progressBar: true })
    // })
  }
}
