import { Injectable } from '@angular/core';

@Injectable({
 providedIn: 'root',
})
export class Constants {
 static readonly BASE_URL = 'http://localhost:3000/';
 static readonly LOGIN_ENDPOINT = Constants.BASE_URL + 'login';
 static readonly SIGNUP_ENDPOINT = Constants.LOGIN_ENDPOINT + '/signup';
 static readonly CHANGE_PASSWORD_ENDPOINT = Constants.LOGIN_ENDPOINT + '/changePassword';
 static readonly FORGOT_PASSWORD_ENDPOINT = Constants.LOGIN_ENDPOINT + '/forgotPassword';
 static readonly TODOS_ENDPOINT = Constants.BASE_URL + 'todos';
 static readonly FETCH_TODO = Constants.TODOS_ENDPOINT + '/fetch';
 static readonly DELETE_TODO = Constants.TODOS_ENDPOINT + '/delete';
}
