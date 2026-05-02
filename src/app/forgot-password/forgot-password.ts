import { Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
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
 @ViewChildren('otpInput') inputs!: QueryList<ElementRef>;
 postParams: any = { email: '', newPassword: '' };
 otpArray = new Array(6).fill('');
 state = signal<'email' | 'otp' | 'reset'>('email');
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
 onInput(event: any, index: number) {
  const value = event.target.value;
  if (!/^[0-9]$/.test(value)) {
   event.target.value = '';
   return;
  }
  this.otpArray[index] = value;
  if (index < 5) {
   this.inputs.get(index + 1)?.nativeElement.focus();
  }
 }

 onKeyDown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace') {
   this.otpArray[index] = '';
   if (index > 0) {
    this.inputs.get(index - 1)?.nativeElement.focus();
   }
  }
 }
 onPaste(event: ClipboardEvent) {
  const pasteData = event.clipboardData?.getData('text') || '';
  if (!/^\d{6}$/.test(pasteData)) return;
  pasteData.split('').forEach((digit, i) => {
   this.otpArray[i] = digit;
   const input = this.inputs.get(i);
   if (input) {
    input.nativeElement.value = digit;
   }
  });
  this.inputs.get(5)?.nativeElement.focus();
 }
 sendOtp() {
  if (!this.postParams.email) {
   this.messageService.showMessage('Email is required');
   return;
  }
  this.api.doPost(Constants.SEND_OTP, { email: this.postParams.email }).subscribe({
   next: (res: any) => {
    if (res.status) {
     this.state.set('otp');
     this.messageService.showMessage(res.message || 'OTP sent successfully', false);
    }
   },
   error: (err: any) => {
    this.messageService.showMessage(err.error.message || 'Failed to send OTP');
   }
  });
 }
 verifyOtp() {
  const otp = this.otpArray.join('');
  if (otp.length < 6) {
   this.messageService.showMessage('Please enter the 6-digit OTP');
   return;
  }
  this.postParams.otp = otp;
  this.api.doPost(Constants.VERIFY_OTP, this.postParams).subscribe({
   next: (res: any) => {
    if (res.status) {
     this.messageService.showMessage(res.message || 'OTP verified successfully', false);
     this.state.set('reset');
    }
   },
   error: (err: any) => {
    this.messageService.showMessage(err.error.message || 'Failed to verify OTP');
   }
  })
 }
}
