
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LOGIN_URL = environment.AUTH_URL + '/login';
  private REFRESH_URL = environment.AUTH_URL + '/refresh';
  private inactivityTime: number = 300000; // 5 minutes
  private activityTimeout: any;
  private refreshTokenTimeout: any;

  refreshTokenInProgress = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {

  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.LOGIN_URL}`;
    return this.http.post<any>(url, { email, password });
  }

  logOut(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('expirationAccessTokenTime');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expirationRefreshTokenTime');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'ADMIN';
  }

  isUser(): boolean {
    const role = localStorage.getItem('role');
    return role === 'USER';
  }

  
  setLogoutTimer(expirationAccessTokenTime: string): void {
   
    const expirationDate = moment(
           expirationAccessTokenTime,
            'ddd MMM DD HH:mm:ss zz YYYY'
          ).toDate();
    const currentTime = new Date().getTime();
    const timeoutDuration = expirationDate.getTime() - currentTime; 
    console.log(`timeoutDuration ${timeoutDuration} ms`);
    console.log(`Setting logout timer to refresh token in ${timeoutDuration} ms`);

    setTimeout(() => {
      this.refreshToken()
    }, timeoutDuration);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token found in local storage.');
      this.logOut();
      return throwError('No refresh token found.');
    }

    console.log('Refreshing token using:', refreshToken);

    return this.http.post<any>(this.REFRESH_URL, { refreshToken }).pipe(
      tap((response) => {
        console.log('Refresh Token Response:', response);
        if (response && response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('expirationAccessTokenTime',response.expirationAccessTokenTime);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('expirationRefreshTokenTime', response.expirationRefreshTokenTime);
          console.log('New access token expiration time:', response.expirationAccessTokenTime);
        } else {
          this.logOut();
          console.error('Invalid response received from refresh token request:', response);
     
        }
      }),
      catchError((error) => {
        this.logOut();
        console.error('Refresh Token Error:', error);

        return throwError(error);
      })
    );
  }


}
