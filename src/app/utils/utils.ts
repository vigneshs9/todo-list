import { inject, Injectable } from '@angular/core';
import { Constants } from './constants';

@Injectable({
 providedIn: 'root',
})
export class Utils {
 static getYMD(dateStr = null): string {
  let date = dateStr ? new Date(dateStr) : new Date();
  return date.toISOString().split('T')[0]
 }
 static saveToLocalStorage(data: any, lsKey: string) {
  localStorage.setItem(lsKey, JSON.stringify(data));
 }
 static getFromLocalStorage(lsKey: string): any {
  return JSON.parse(localStorage.getItem(lsKey) || 'null');
 }
 static removeFromLocalStorage(lsKey: string) {
  localStorage.removeItem(lsKey);
 }
 static doLogout() {
  Utils.removeFromLocalStorage(Constants.LS_TOKEN);
 }
 static convertDMYToYMD(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
 }
 static convertYMDToDMY(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
 }
 static getTokenData(): any {
  const token = Utils.getFromLocalStorage(Constants.LS_TOKEN);
  if (!token) return null;
  const payload = token.split('.')[1];
  const tokenData = JSON.parse(atob(payload));
  if (tokenData) {
   tokenData['userId'] = tokenData['_id'];
  }
  return tokenData;
 }
}
