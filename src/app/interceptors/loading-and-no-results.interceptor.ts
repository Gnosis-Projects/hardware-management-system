import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../services/loading.service';

export const HttpLoadingAndNoResultsInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const loadingService = inject(LoadingService);
    const toastr = inject(ToastrService);
    const translate = inject(TranslateService);

    loadingService.show();

    return next(req).pipe(
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                if (event.body && (event.body.data === null || (Array.isArray(event.body.data) && event.body.data.length === 0))) {
                    toastr.error(translate.instant('results.not.found'));
                }
            }
            return event;
        }),
        finalize(() => {
            loadingService.hide();
        })
    );
};
