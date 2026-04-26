import { Component, inject, OnInit, signal } from '@angular/core';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { ButtonComponent } from '../shared/button/button';
import { Router } from '@angular/router';
import { ApiManager } from '../utils/api-manager';
import { Constants } from '../utils/constants';
import { MessageService } from '../utils/message.service';
@Component({
 selector: 'app-change-password',
 imports: [TextFieldComponent, ButtonComponent],
 templateUrl: './change-password.html',
 styleUrl: './change-password.css',
})
export class ChangePasswordComponent implements OnInit {
 postParams: any = { oldPassword: '', newPassword: '' };
 private readonly router = inject(Router);
 private readonly api = inject(ApiManager);
 public readonly messageService = inject(MessageService);
 ngOnInit() {
  const userData = JSON.parse(localStorage.getItem('loginData') || '{}');
  this.postParams.name = userData.name;
 }
 closeChangePassword(isDashboard = false) {
  this.postParams = { oldPassword: '', newPassword: '' };
  if (isDashboard) {
   this.router.navigate(['/dashboard']);
   return;
  }
  this.router.navigate(['/login']);
 }
 changePassword() {
  if (!this.isValidForm()) return;
  
  this.api.doPost(Constants.CHANGE_PASSWORD_ENDPOINT, this.postParams).subscribe({
   next: (res: any) => {
    if (res.status) {
     this.messageService.showMessage(res.message || 'Password changed successfully. Please login again.', false);
     setTimeout(() => {
      this.closeChangePassword();
     }, 2000);
    }
   },
   error: (err: any) => {
    this.messageService.showMessage(err.error.message || 'Failed to change password');
   }
  });
 }
 isValidForm(): boolean {
  if (!this.postParams.oldPassword) {
   this.messageService.showMessage('Old password is required');
   return false;
  }
  if (!this.postParams.newPassword) {
   this.messageService.showMessage('New password is required');
   return false;
  }
  return true;
 }
}
