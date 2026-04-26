import { Component, inject } from '@angular/core';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { ButtonComponent } from '../shared/button/button';
import { Router } from '@angular/router';
import { ApiManager } from '../utils/api-manager';
import { Constants } from '../utils/constants';
import { MessageService } from '../utils/message.service';
@Component({
 selector: 'app-forgot-password',
 imports: [TextFieldComponent, ButtonComponent],
 templateUrl: './forgot-password.html',
 styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
 postParams: any = { email: '', newPassword: '' };
 private readonly router = inject(Router);
 private readonly api = inject(ApiManager);
 public readonly messageService = inject(MessageService);
 closeForgotPassword() {
  this.postParams = { email: '', newPassword: '' };
  this.router.navigate(['/login']);
 }
 forgotPassword() {
  if (!this.isValidForm()) return;
  
  this.api.doPost(Constants.FORGOT_PASSWORD_ENDPOINT, this.postParams).subscribe({
   next: (res: any) => {
    if (res.status) {
     this.messageService.showMessage(res.message || 'Password changed successfully. Please login again.', false);
     setTimeout(() => {
      this.closeForgotPassword();
     }, 2000);
    }
   },
   error: (err: any) => {
    this.messageService.showMessage(err.error.message || 'Failed to change password');
   }
  });
 }
 isValidForm(): boolean {
  if (!this.postParams.email) {
   this.messageService.showMessage('Email is required');
   return false;
  }
  if (!this.postParams.newPassword) {
   this.messageService.showMessage('Password is required');
   return false;
  }
  return true;
 }
}
