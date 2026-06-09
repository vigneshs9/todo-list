import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
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
 changeDetection: ChangeDetectionStrategy.Eager,
 imports: [TextFieldComponent, ButtonComponent]
})
export class LoginComponent {
 postParams = { name: '', email: '', password: '' };
 isLogin = signal<boolean>(true);
 signupError = signal<string>('');
 passwordError = signal<string>('');
 private readonly api = inject(ApiManager);
 private readonly router = inject(Router)
 public readonly messageService = inject(MessageService);
 passwordValidations = signal({ hasMinLength: false, hasUpperCase: false, hasLowerCase: false, hasNumber: false, hasSpecialChar: false });
 private readonly passwordPatterns = {
  minLength: /.{8,}/, uppercase: /[A-Z]/, lowercase: /[a-z]/, number: /[0-9]/, specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
 };
 isPasswordValid(): boolean {
  const validations = this.passwordValidations();
  return validations.hasMinLength && validations.hasUpperCase && validations.hasLowerCase && validations.hasNumber && validations.hasSpecialChar;
 }
 validatePassword(password: string): void {
  this.passwordValidations.set({
   hasMinLength: this.passwordPatterns.minLength.test(password),
   hasUpperCase: this.passwordPatterns.uppercase.test(password),
   hasLowerCase: this.passwordPatterns.lowercase.test(password),
   hasNumber: this.passwordPatterns.number.test(password),
   hasSpecialChar: this.passwordPatterns.specialChar.test(password)
  });
 }
 onPasswordChange(event: string): void {
  const value = event;
  this.validatePassword(value);
 }

 onTextChange(event: string, field: string): void {
  if (field === 'password') {
   if (!this.isPasswordValid()) {
    this.passwordError.set('Password does not meet the required criteria');
   } else {
    this.passwordError.set('');
   }
  } else if (field === 'name') {
   this.api.doPost(Constants.FETCH_USER_ENDPOINT, { name: event }).subscribe({
    next: (res: any) => {
     if (res.status && res.data) {
      this.signupError.set('User with this name already exists');
     }
    },
    error: (err: any) => {
     this.signupError.set('');
    }
   });
  }
 }
 login() {
  if (!this.isValidForm()) return;
  const url = this.isLogin() ? Constants.LOGIN_ENDPOINT : Constants.SIGNUP_ENDPOINT
  this.api.doPost(url, this.postParams).subscribe({
   next: (res: any) => {
    if (res.status) {
     this.messageService.showMessage(res.message || (this.isLogin() ? 'Login successful' : 'Sign Up successful'), false);
     if (!this.isLogin()) {
      this.navigateToLogin();
     } else {
      Utils.saveToLocalStorage(res.token, Constants.LS_TOKEN);
      Utils.saveToLocalStorage({ userId: res.userId, name: res.userName, profilePath: res.profilePath }, Constants.LS_LOGIN_DATA);
      setTimeout(() => {
       this.navigateToDashboard();
      }, 1000);
     }
    }
   },
   error: (err: any) => {
    if (err?.error?.message.includes('name_1')) {
     this.messageService.showMessage('User with this name already exists');
     return;
    } else if (err?.error?.message.includes('email_1')) {
     this.messageService.showMessage('User with this email already exists');
     return;
    }
    else this.messageService.showMessage(err.error.message || 'Request failed');
   }
  });
 }
 navigateToSignUp() {
  this.clearForm();
  this.isLogin.set(false);
 }
 navigateToLogin() {
  this.clearForm();
  this.isLogin.set(true);
  this.passwordValidations.set({ hasMinLength: false, hasUpperCase: false, hasLowerCase: false, hasNumber: false, hasSpecialChar: false });
 }
 navigateToDashboard() {
  this.router.navigateByUrl('/dashboard', { replaceUrl: true });
 }
 isValidForm(): boolean {
  if (!this.postParams.name) {
   this.messageService.showMessage('Name is required');
   return false;
  }
  if (!this.isLogin() && !this.postParams.email) {
   this.messageService.showMessage('Email is required');
   return false;
  }
  if (!this.postParams.password) {
   this.messageService.showMessage('Password is required');
   return false;
  }
  if (!this.isLogin() && !this.signupError()) {
   this.messageService.showMessage('User with this name already exists. Please choose a different name or login.');
   return false;
  }
  if (!this.isLogin() && !this.isPasswordValid()) {
   this.messageService.showMessage('Password does not meet the required criteria');
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
