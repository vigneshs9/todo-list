import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, Inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OutsideClick } from '../utils/outside-click';
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';
@Component({
 selector: 'app-header',
 standalone: true,
 templateUrl: './header.html',
})
export class HeaderComponent {
 @ViewChild('fileInput') fileInput!: ElementRef;
 username: string = '';
 isProfileClicked = signal(false);
 isChangePassword = signal(false);
 private readonly router = inject(Router);
 private readonly outsideClickService = inject(OutsideClick);
 constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) { }
 ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
   const loginData = Utils.getFromLocalStorage(Constants.LS_LOGIN_DATA);
   this.username = loginData?.name || '';
   this.outsideClick()
  }
 }
 toggleMenu() {
  this.isProfileClicked.set(!this.isProfileClicked());
 }
 onFileUpload() {
  this.fileInput.nativeElement.click();
  this.isProfileClicked.set(false);
  console.log('File upload clicked', this.fileInput.nativeElement.files[0]);
 }
 changePassword() {
  this.isProfileClicked.set(false);
  this.router.navigate(['/cpwd']);
 }
 onFileSelected(event: any) {
  const file: File = event.target.files[0];
  console.log('Selected file:', file);
 }
 outsideClick() {
  this.outsideClickService.clickOutsideEmitter.subscribe(() => {
   this.isProfileClicked.set(false)
  })
 }
}
