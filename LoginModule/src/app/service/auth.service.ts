import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {  tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LOGIN_URL = environment.AUTH_URL + '/login';
  private REFRESH_URL = environment.AUTH_URL + '/refresh';
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    const url = `${this.LOGIN_URL}`;
    return this.http.post<any>(url, { email, password });
  }
  /***AUTHENTICATION METHODS */
  logOut(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      localStorage.removeItem('expirationTime');
    }
    this.router.navigate(['/login']);
  }
  isAuthenticated(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }
  isAdmin(): boolean {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      return role === 'ADMIN';
    }
    return false;
  }
  isUser(): boolean {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      return role === 'USER';
    }
    return false;
  }
  setLogoutTimer(expirationTime: string): void {
    const expirationDate = moment(
      expirationTime,
      'ddd MMM DD HH:mm:ss zz YYYY'
    ).toDate();
    const currentTime = new Date().getTime();
    const timeoutDuration = expirationDate.getTime() - currentTime;
    console.log('Expiration Date: ' + expirationDate);
    console.log('Current Time: ' + new Date(currentTime));
    console.log('Timeout Duration: ' + timeoutDuration);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('expirationTime', expirationDate.toISOString());
    }
    setTimeout(() => {
      this.logOut();
    }, timeoutDuration);
  }
  checkAutoLogout(): void {
    if (this.isAuthenticated()) {
      const expirationTime = localStorage.getItem('expirationTime');
  
      if (expirationTime) {
        const expirationDate = new Date(expirationTime);
        const currentTime = new Date().getTime();
        if (expirationDate.getTime() <= currentTime) {
          this.logOut();
        } else {
          const remainingTime = expirationDate.getTime() - currentTime;
          setTimeout(() => {
            this.logOut();
          }, remainingTime);
        }
      } else {
        console.log('No expiration time found, cannot set auto logout.');
      }
    } else {
      console.log('User is not authenticated, no need to set auto logout.');
    }
  }

  
}