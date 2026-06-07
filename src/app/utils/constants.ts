import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'

@Injectable({
 providedIn: 'root',
})
export class Constants {
 static readonly BASE_URL = environment.apiUrl;
 static readonly LOGIN_ENDPOINT = Constants.BASE_URL + 'login';
 static readonly TODOS_ENDPOINT = Constants.BASE_URL + 'todos';
 static readonly OTP_ENDPOINT = Constants.BASE_URL + 'otp';
 static readonly UPLOAD_ENDPOINT = Constants.BASE_URL + 'upload';
 static readonly SIGNUP_ENDPOINT = Constants.LOGIN_ENDPOINT + '/signup';
 static readonly CHANGE_PASSWORD_ENDPOINT = Constants.LOGIN_ENDPOINT + '/changePassword';
 static readonly FORGOT_PASSWORD_ENDPOINT = Constants.LOGIN_ENDPOINT + '/forgotPassword';
 static readonly UPLOAD_PROFILE_ENDPOINT = Constants.LOGIN_ENDPOINT + '/uploadProfile';
 static readonly FETCH_USER_ENDPOINT = Constants.LOGIN_ENDPOINT + '/fetch';
 static readonly FETCH_TODO = Constants.TODOS_ENDPOINT + '/fetch';
 static readonly DELETE_TODO = Constants.TODOS_ENDPOINT + '/delete';
 static readonly SEND_OTP = Constants.OTP_ENDPOINT + '/sendOTP';
 static readonly VERIFY_OTP = Constants.OTP_ENDPOINT + '/verifyOTP';
 static readonly UPLOAD_SIGNED_URL = Constants.UPLOAD_ENDPOINT + '/uploadSignedUrl';
 static readonly GET_SIGNED_URL = Constants.UPLOAD_ENDPOINT + '/getSignedUrl';

 // local storage key
 static readonly LS_LOGIN_DATA = 'loginData';
 static readonly LS_TOKEN = 'lsToken';
}
