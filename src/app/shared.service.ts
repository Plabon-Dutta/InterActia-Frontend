import { Injectable } from '@angular/core';
import { quick_contact } from './model/quick-contact.type';
import { sign_in } from './model/sign-in.type';
import { sign_up } from './model/sign-up.type';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

const BASE_URL = ["http://localhost:8080/"]

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private http : HttpClient) { }

  register (signupRequest : sign_up) : Observable <{ message : string }> {
    return this.http.post<{ message : string }> (BASE_URL + 'signup', signupRequest);
  }

  signin (signinRequest : sign_in) : Observable <any> {
    return this.http.post(BASE_URL + 'login', signinRequest);
  }

  quick_contact (quickContactRequest : quick_contact) : Observable <{ message : string }> {
    return this.http.post<{ message : string }> (BASE_URL + 'quick_contact', quickContactRequest);
  }

  authenticate(): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (token) {
      console.log("Token Found in authenticate");
      
      return this.http.get(BASE_URL + 'api/authenticate', {
        headers: this.createAuthorizationHeader(token)
      });
    } else {
      // Handle case where token is not found
      const JwtToken = sessionStorage.getItem('jwt');
      if (JwtToken) {
        console.log("Token Found in authenticate");
        return this.http.get(BASE_URL + 'api/authenticate', {
          headers : this.createAuthorizationHeader(JwtToken)
        });
      }
      else {
        console.log("Token Not Found in authenticate");
        return throwError(() => new Error('No token found'));
      }
    }
  }
  
  private createAuthorizationHeader(token: string) {
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  verifyMail(email: string): Observable<{ message?: string; error?: string }> {
    return this.http.post<{ message?: string; error?: string }>(`${BASE_URL}forgetPassword/verifyMail/${email}`, {}).pipe(
      // Handle the successful response
      map((response: { message?: string; error?: string }) => {
        return response;
      }),
      // Handle errors
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.status === 403) {
          errorMessage = 'User not found! Please check your email.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        // Return a new observable with the error message
        return throwError(() => new Error(errorMessage));
      })
    );
  }
    

  verifyOtp(otp: string, email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${BASE_URL}forgetPassword/verifyOtp/${otp}/${email}`, {}).pipe(
      // Handle successful response
      map((response) => {
        return response;  // The response contains the success message
      }),
      // Handle errors
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.status === 403) {
          errorMessage = 'Invalid OTP. Please try again.';
        } else if (error.status === 417) { // Expectation Failed (OTP Expired)
          errorMessage = 'OTP expired. Please request a new one.';
        } else if (error.status === 400) { // Bad Request (Invalid OTP)
          errorMessage = 'Invalid OTP. Please try again.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        // Return a new observable with the error message
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  

  resetPassword (password : string, confirmPassword : string, email : string) : Observable <{ message : string }> {
    console.log("Reset Password Service");

    const requestBody = { Password: password, ConfirmPassword: confirmPassword };
    return this.http.post<{ message : string }> (BASE_URL + 'forgetPassword/changePassword/' + email, requestBody);
  }
}
