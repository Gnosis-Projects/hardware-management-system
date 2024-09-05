import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CarrierStateService } from './app/services/state-management/carrier-state.service';
import { ApiInterceptor } from './app/interceptors/api.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { HttpLoadingAndNoResultsInterceptor } from './app/interceptors/loading-and-no-results.interceptor';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEl from '@angular/common/locales/el'; // Import Greek locale data
import { LOCALE_ID } from '@angular/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Register Greek locale data
registerLocaleData(localeEl, 'el');

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([
      HttpLoadingAndNoResultsInterceptor,
      ApiInterceptor,
    ])),
    CarrierStateService,
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(
      BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-center',
        preventDuplicates: true,
      }),
      BreadcrumbModule,
      MatNativeDateModule
    ),
    { provide: MAT_DATE_LOCALE, useValue: 'el-GR' },
    { provide: LOCALE_ID, useValue: 'el' },
  ]
})
.catch(err => console.error(err));
