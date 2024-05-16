import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { HttpClientModule } from '@angular/common/http';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotComponent } from './forgot/forgot.component';
import { BtnLoadingComponent } from 'src/app/shared/components/btn-loading/btn-loading.component';


@NgModule({
  declarations: [
    SigninComponent,
    ChangePasswordComponent,
    ForgotComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    HttpClientModule,
    BtnLoadingComponent
  ],
  providers: []
})
export class AuthModule { }
