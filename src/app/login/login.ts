import { Component, inject, signal } from '@angular/core';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { ButtonComponent } from '../shared/button/button';
import { ApiManager } from '../utils/api-manager';
import { Constants } from '../utils/constants';
import { Router } from '@angular/router';
import { MessageService } from '../utils/message.service';
import { Utils } from '../utils/utils';

@Component({
 selector: 'app-login',
 standalone: true,
 templateUrl: './login.html',
 imports: [TextFieldComponent, ButtonComponent]
})
export class LoginComponent {
 postParams = { name: '', email: '', password: '' };
 isLogin: boolean = true;
 private readonly api = inject(ApiManager);
 private readonly router = inject(Router)
 public readonly messageService = inject(MessageService);
 login() {
  if (!this.isValidForm()) return;
  const url = this.isLogin ? Constants.LOGIN_ENDPOINT : Constants.SIGNUP_ENDPOINT
  this.api.doPost(url, this.postParams).subscribe({
   next: (res: any) => {
    if (res.status) {
     this.messageService.showMessage(res.message || (this.isLogin ? 'Login successful' : 'Sign Up successful'), false);
     if (!this.isLogin) {
      this.navigateToLogin();
     } else {
      Utils.saveToLocalStorage({ userId: res.userId, name: res.userName }, Constants.LS_LOGIN_DATA);
      setTimeout(() => {
       this.navigateToDashboard();
      }, 1000);  
     }
    }
   },
   error: (err: any) => {
    this.messageService.showMessage(err.error.message || 'Request failed');
   }
  });
 }
 navigateToSignUp() {
  this.clearForm();
  this.isLogin = false;
 }
 navigateToLogin() {
  this.clearForm();
  this.isLogin = true;
 }
 navigateToDashboard() {
  this.router.navigateByUrl('/dashboard', { replaceUrl: true });
 }
 isValidForm(): boolean {
  if (!this.postParams.name) {
   this.messageService.showMessage('Name is required');
   return false;
  }
  if (!this.isLogin && !this.postParams.email) {
   this.messageService.showMessage('Email is required');
   return false;
  }
  if (!this.postParams.password) {
   this.messageService.showMessage('Password is required');
   return false;
  }
  return true;
 }
 clearForm() {
  this.postParams = { name: '', email: '', password: '' };
 }
 navigateToForgotPassword() {
  this.clearForm();
  this.router.navigate(['/fpwd']);
 }
}
