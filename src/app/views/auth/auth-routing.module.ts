import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotComponent } from './forgot/forgot.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {
    path: '',
    component: SigninComponent
  },
  {
    path: 'change_password/:token',
    component: ChangePasswordComponent
  },
  {
    path: 'forgot_password',
    component: ForgotComponent
  },

];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AuthRoutingModule { }
