import { HttpInterceptorFn } from '@angular/common/http';
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 if (req.url.includes('.s3.')) {
  return next(req);
 }
 const token = Utils.getFromLocalStorage(Constants.LS_TOKEN);
 if (token) {
  req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
 }
 return next(req);
}