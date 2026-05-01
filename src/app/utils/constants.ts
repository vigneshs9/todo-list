import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'

@Injectable({
 providedIn: 'root',
})
export class Constants {
 static readonly BASE_URL = environment.apiUrl;
 static readonly LOGIN_ENDPOINT = Constants.BASE_URL + 'login';
 static readonly SIGNUP_ENDPOINT = Constants.LOGIN_ENDPOINT + '/signup';
 static readonly CHANGE_PASSWORD_ENDPOINT = Constants.LOGIN_ENDPOINT + '/changePassword';
 static readonly FORGOT_PASSWORD_ENDPOINT = Constants.LOGIN_ENDPOINT + '/forgotPassword';
 static readonly TODOS_ENDPOINT = Constants.BASE_URL + 'todos';
 static readonly FETCH_TODO = Constants.TODOS_ENDPOINT + '/fetch';
 static readonly DELETE_TODO = Constants.TODOS_ENDPOINT + '/delete';


 // local storage key
 static readonly LS_LOGIN_DATA = 'loginData';
}
