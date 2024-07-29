
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
 

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     // Replace with your actual token retrieval logic
    const token = localStorage.getItem('token');  

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } 
    else {
      return next.handle(req);
    }
  }

  // private handleAuthError(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //     this.refreshTokenSubject.next(null);

  //     return this.authService.refreshToken().pipe(
  //       switchMap((response: any) => {
  //         this.isRefreshing = false;
  //         this.refreshTokenSubject.next(response.token);
  //         localStorage.setItem('token', response.token);
  //         localStorage.setItem('refreshToken', response.refreshToken);
  //         localStorage.setItem('expirationTime', response.expirationTime);

  //         return next.handle(this.addTokenHeader(req, response.token));
  //       }),
  //       catchError((err) => {
  //         this.isRefreshing = false;
  //         this.authService.logOut();
  //         return throwError(err);
  //       })
  //     );
  //   } else {
  //     return this.refreshTokenSubject.pipe(
  //       filter(token => token != null),
  //       take(1),
  //       switchMap(token => next.handle(this.addTokenHeader(req, token)))
  //     );
  //   }
  // }

  // private addTokenHeader(request: HttpRequest<any>, token: string) {
  //   return request.clone({
  //     headers: request.headers.set('Authorization', `Bearer ${token}`)
  //   });
  // }
}

