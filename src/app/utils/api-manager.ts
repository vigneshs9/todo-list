import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
 providedIn: 'root',
})
export class ApiManager {
 private readonly http = inject(HttpClient);
 doPost(url: string, body: any) {
  return this.http.post(url, body);
 }
 doPut(url: string, body: any) {
  return this.http.put(url, body);
 }
 doDelete(url: string, body: any) {
  return this.http.delete(url, body);
 }
 doGet(url: string) {
  return this.http.get(url);
 }
 uploadFile(url: string, file: File) {
  return this.http.put(url, file, { headers: { 'Content-Type': file.type } });
 }
}
