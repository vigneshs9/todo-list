import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, Inject, PLATFORM_ID, signal, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { OutsideClick } from '../utils/outside-click';
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';
import { ApiManager } from '../utils/api-manager';
@Component({
 selector: 'app-header',
 standalone: true,
 changeDetection: ChangeDetectionStrategy.Eager,
 templateUrl: './header.html',
})
export class HeaderComponent {
 @ViewChild('fileInput') fileInput!: ElementRef;
 username = signal<string>('');
 isProfileClicked = signal<boolean>(false);
 isChangePassword = signal<boolean>(false);
 userId = signal<string>('');
 profileUrl = signal<string>('');
 private readonly router = inject(Router);
 private readonly outsideClickService = inject(OutsideClick);
 private readonly api = inject(ApiManager)
 constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) { }
 ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
   const loginData = Utils.getFromLocalStorage(Constants.LS_LOGIN_DATA);
   this.username.set(loginData?.name || '');
   this.userId.set(loginData?.userId || '');
   this.outsideClick()
   if (loginData?.profilePath)
    this.getSignedUrl(loginData?.profilePath);
  }
 }
 toggleMenu() {
  this.isProfileClicked.set(!this.isProfileClicked());
 }
 onFileUpload() {
  this.fileInput.nativeElement.click();
  this.isProfileClicked.set(false);
  console.log('File upload clicked', this.fileInput.nativeElement);
 }
 changePassword() {
  this.isProfileClicked.set(false);
  this.router.navigate(['/cpwd']);
 }
 onFileSelected(event: any) {
  const file: File = event.target.files[0];
  const uploadParams = { fileName: file.name, fileType: file.type, filePath: `demo/${this.userId()}_${file.name}` }
  this.api.doPost(Constants.UPLOAD_SIGNED_URL, uploadParams).subscribe({
   next: (res: any) => {
    const signedUrl = res.signedUrl;
    this.uploadToS3(file, signedUrl);
    this.api.doPost(Constants.UPLOAD_PROFILE_ENDPOINT, { userId: this.userId(), filePath: uploadParams.filePath }).subscribe({
     next: (res1: any) => {
      this.getSignedUrl(uploadParams.filePath);
     },
     error: (err) => {
      console.error('Error updating profile:', err);
     }
    })
   }, error: (err) => {
    console.error('Error fetching signed URL:', err);
   }
  })
 }
 outsideClick() {
  this.outsideClickService.clickOutsideEmitter.subscribe(() => {
   this.isProfileClicked.set(false)
  })
 }
 logout() {
  Utils.doLogout();
  this.router.navigate(['/login']);
 }
 uploadToS3(file: File, signedUrl: string) {
  this.api.uploadFile(signedUrl, file).subscribe({
   next: (res) => {
    console.log('File uploaded successfully:', res);
   },
   error: (err) => {
    console.error('Error uploading file:', err);
   }
  })
 }
 getSignedUrl(filePath: string) {
  this.api.doPost(Constants.GET_SIGNED_URL, { filePath }).subscribe({
   next: (res: any) => {
    const signedUrl = res.signedUrl;
    console.log('Fetched signed URL for profile picture:', signedUrl);
    this.profileUrl.set(signedUrl);
   }, error: (err) => {
    console.error('Error fetching signed URL for profile picture:', err);
   }
  })
 }
 viewProfile() {
  if (this.profileUrl()) {
   window.open(this.profileUrl(), '_blank');
  }
 }
}
