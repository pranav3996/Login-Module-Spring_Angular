
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import * as moment from 'moment';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    console.log('Intercepting request to:', req.url);

    if (accessToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });

      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
          if (error.status === 403) {
            // Token might be expired, try refreshing
            return this.handle403Error(req, next);
          }
          return throwError(error);
        })
      );
    } else {
      return next.handle(req);
    }
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Handling 403 error, calling refresh token...');
    if (!this.authService.refreshTokenInProgress) {
      this.authService.refreshTokenInProgress = true;
      this.authService.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          console.log('Refresh token process complete:', response);
          this.authService.refreshTokenInProgress = false;
          this.authService.refreshTokenSubject.next(response.accessToken);

          if (response && response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
           
            const expirationAccessTokenTime = response.expirationAccessTokenTime;
            this.authService.setLogoutTimer(expirationAccessTokenTime);
          }

          return next.handle(this.addTokenHeader(request, response.accessToken));
        }),
        catchError((err) => {
          console.error('Error during refresh token process:', err);
          this.authService.refreshTokenInProgress = false;
          this.authService.logOut();
          return throwError(err);
        })
      );
    } else {
      return this.authService.refreshTokenSubject.pipe(
        switchMap((accessToken: any) => {
          if (accessToken) {
            return next.handle(this.addTokenHeader(request, accessToken));
          }
          return throwError('Refresh token failed');
        })
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }
}
