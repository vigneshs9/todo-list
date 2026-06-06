import { HttpInterceptorFn } from '@angular/common/http';
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const token = Utils.getFromLocalStorage(Constants.LS_TOKEN);
 if (token) {
  req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
 }
 return next(req);
}