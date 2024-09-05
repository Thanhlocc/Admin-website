import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private toast: NgToastService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const myToken = this.authService.getToken();

    if (myToken) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }
      });
    }

    return next.handle(req).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.toast.warning("Token is expired! Please Login again", "Warning", 7000);
            this.router.navigate(['/Login'])
          }
        }
        return throwError(() => new Error("Some other error occured"))
      })
    );

  }
}
