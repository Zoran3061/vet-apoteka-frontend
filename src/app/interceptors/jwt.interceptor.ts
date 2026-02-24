import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Ako nema tokena, npr. login/register, samo pusti request dalje
    if (!token) {
      return next.handle(req);
    }

    // Dodavanje Authorization header samo ka backend-u (8080)
    const isApiCall = req.url.startsWith('http://localhost:8080/');
    if (!isApiCall) {
      return next.handle(req);
    }

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(authReq);
  }
}
