import { Injectable } from '@angular/core';
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
}
