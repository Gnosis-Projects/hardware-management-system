import { inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthStateService } from '../services/state-management/auth-state.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export const ApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authStateService = inject(AuthStateService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const translate = inject(TranslateService);

  const token = authStateService.token();
  const clonedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {

      let message = translate.instant('Unexpected error occurred');

      if (error.status >= 500) {
        message = translate.instant('errorMessages.ServerError');
      } else if (error.status === 401 ) {
        message = translate.instant(error.error.message);
      } else if (error.status === 403) {
        message = translate.instant('errorMessages.forbidden');
      } else if (error.status === 404) {
        message = translate.instant('errorMessages.notFound');
      } else if (error.status === 400) {
        message = translate.instant('errorMessages.Badrequest');
      } else if (error.status === 0) {
        message = translate.instant('errorMessages.noInternetConnection');
      } else if (error.error instanceof ErrorEvent) {
        // Client-side error
        message = error.error.message;
      } else {
        // Server-side error
        message = error.message;
      }

      toastr.error(message);
      return throwError(() => new Error(message));
    })
  );
};
