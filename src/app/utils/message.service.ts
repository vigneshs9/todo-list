import { Injectable, signal } from '@angular/core';

@Injectable({
 providedIn: 'root'
})
export class MessageService {
 message = signal({ status: false, text: '', isError: true });
 showMessage(text: string, isError: boolean = true) {
  this.message.set({ status: true, text, isError });

  setTimeout(() => {
   this.message.set({ status: false, text: '', isError: true });
  }, 2000);
 }
}