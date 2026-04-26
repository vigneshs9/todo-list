import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, Inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
@Component({
 selector: 'app-header',
 standalone: true,
 templateUrl: './header.html',
})
export class HeaderComponent {
 @ViewChild('fileInput') fileInput!: ElementRef;

 username: string = '';
 isProfileClicked: boolean = false;
 
 isChangePassword: boolean = false;

 private readonly router = inject(Router);
 constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) { }
 ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
   const loginData = JSON.parse(localStorage.getItem('loginData') || 'null');
   this.username = loginData?.name || '';
  }
 }
 toggleMenu() {
  this.isProfileClicked = !this.isProfileClicked;
 }
 onFileUpload() {
  this.fileInput.nativeElement.click();
  this.isProfileClicked = false;
  console.log('File upload clicked', this.fileInput.nativeElement.files[0]);
 }
 changePassword() {
  console.log('Change password clicked');
  this.isProfileClicked = false;
  this.router.navigate(['/cpwd']);
 }
 onFileSelected(event: any) {
  const file: File = event.target.files[0];
  console.log('Selected file:', file);
 }
 
}
