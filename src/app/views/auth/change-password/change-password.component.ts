import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { UntypedFormGroup, UntypedFormBuilder, Validators, MinValidator } from '@angular/forms';
import { Router,RouteConfigLoadStart,ResolveStart,RouteConfigLoadEnd,ResolveEnd, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: [SharedAnimations]

})
export class ChangePasswordComponent implements OnInit {
  loading: boolean;
  loadingText: string;
  changePasswordForm: UntypedFormGroup;
  token: string;
 
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
    });

    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.loadingText = 'Cargando...';
        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }});
      
      this.changePasswordForm = this.fb.group({
        newPassword: [null, [Validators.required, Validators.minLength(1)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(1)] ]
      });
   }
  
  changePassword() {
    this.loading = true;
    // this.auth.changePassword(this.changePasswordForm.value, this.token).subscribe((data: any) => {
    //   this.loading = false;
    //   this.toastr.success('Se ha modificado la contraseña!.', 'Exito!', { progressBar: true })
    //   this.router.navigate(['/']);
    // }, error => {
    //   this.loading = false;
    //   this.toastr.error('Tuvimos un problema al modificar tu contraseña!.', 'Error!', { progressBar: true })
    // })
  }
  
  verifyPassword() {
    if (this.changePasswordForm.value.confirmPassword === this.changePasswordForm.value.newPassword) {
      return false;
    } else{
      return true;
    }
  }
}
