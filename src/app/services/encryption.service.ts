import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
 providedIn: 'root'
})
export class EncryptionService {
 private readonly SECRET_KEY = 'king';
 encrypt(data: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), this.SECRET_KEY).toString();
 }

 decrypt(cipherText: any): any {
  const bytes = CryptoJS.AES.decrypt(cipherText, this.SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
 }

 encryptedPayload(data: any): any {
  return { payload: this.encrypt(data) };
 }
}