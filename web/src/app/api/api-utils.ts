import {HttpErrorResponse, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {from, lastValueFrom, Observable, throwError} from "rxjs";

import {environment} from '../../environments/environment';
import {AuthService} from '../auth.serivce';
import {inject} from '@angular/core';

const domainServiceRoot = () => {
  return `${environment.apiUrl}`
}

const handleError = (error: HttpErrorResponse): Observable<any> => {
  console.error(error)
  return throwError(() => new Error(`${error.status}`))
}

const addToken = async (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenProvider = inject(AuthService).token;
  const token = await tokenProvider
  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    })
  }
  return lastValueFrom(next(req))
}

const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (req.url.startsWith(domainServiceRoot())) {
    return from(addToken(req, next))
  }
  return next(req)
}


export {domainServiceRoot, handleError, authInterceptor}
