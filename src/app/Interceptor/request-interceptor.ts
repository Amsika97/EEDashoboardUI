import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('HTTP Request Started ');

    const authReq = req.clone({
      setHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return next.handle(req);
  }
}
