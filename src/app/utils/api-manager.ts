import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EncryptionService } from '../services/encryption.service';
import { map } from 'rxjs';

@Injectable({
 providedIn: 'root',
})
export class ApiManager {
 private readonly http = inject(HttpClient);
 private readonly crypto = inject(EncryptionService);
 doPost(url: string, body: any) {
  return this.http.post(url, this.crypto.encryptedPayload(body)).pipe(map((res: any) => this.crypto.decrypt(res?.['payload'])));
 }
 doPut(url: string, body: any) {
  return this.http.put(url, this.crypto.encryptedPayload(body)).pipe(map((res: any) => this.crypto.decrypt(res?.['payload'])));
 }
 doDelete(url: string, body: any) {
  return this.http.delete(url, this.crypto.encryptedPayload(body)).pipe(map((res: any) => this.crypto.decrypt(res?.['payload'])));
 }
 doGet(url: string) {
  return this.http.get(url).pipe(map((res: any) => this.crypto.decrypt(res?.['payload'])));
 }
 uploadFile(url: string, file: File) {
  return this.http.put(url, this.crypto.encryptedPayload(file), { headers: { 'Content-Type': file.type } }).pipe(map((res: any) => this.crypto.decrypt(res?.['payload'])));
 }
}
