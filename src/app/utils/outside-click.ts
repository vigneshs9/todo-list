import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, Inject, Injectable, NgZone, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
 providedIn: 'root',
})
export class OutsideClick {
 clickOutsideEmitter: EventEmitter<any> = new EventEmitter<any>();
 private isBrowser = signal(false);

 constructor(@Inject(PLATFORM_ID) private platformId: object, private ngZone: NgZone) {
  this.isBrowser.set(this.checkIfBrowser());
  this.listenToDocumentClick();
 }
 private listenToDocumentClick() {
  if (!this.isBrowser()) return;
  this.ngZone.runOutsideAngular(() => {
   document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const customCloseElements = document.querySelectorAll(".custom-close");
    const clickedInsideCustomClose = Array.from(customCloseElements).some((element) => element.contains(target));
    if (!clickedInsideCustomClose) {
     this.emitClickOutsideEvent();
    }
   });
  })
 }
 emitClickOutsideEvent() {
  this.clickOutsideEmitter.emit();
 }
 checkIfBrowser(): boolean {
  return isPlatformBrowser(this.platformId);
 }
}
