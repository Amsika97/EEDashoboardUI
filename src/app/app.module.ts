import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './imports/app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RequestInterceptor } from './Interceptor/request-interceptor';
import { ResponseInterceptor } from './Interceptor/response-interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CustomPaginatorIntlService } from './common/table/custom-paginator-intl.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SharedModule } from './imports/shared-module.module';
import { BreadcrumbService } from 'xng-breadcrumb';

import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from '@azure/msal-browser';
import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
  MsalRedirectComponent,
} from '@azure/msal-angular';
import { FaqComponent } from './faq/faq.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FilterPopupComponent } from './common/filter-popup/filter-popup.component';
import { ProfileComponent } from './profile/profile.component';
import { MyActivityComponent } from './profile/my-activity/my-activity.component';
import { AssessmentHistoryComponent } from './profile/assessment-history/assessment-history.component';
import { MetricsHistoryComponent } from './profile/metrics-history/metrics-history.component';

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.SSOClientId!,
      authority: environment.SSOAuthority,
      redirectUri: environment.SSORedirectUri,
      postLogoutRedirectUri: environment.SSOPostLogoutRedirectUri,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/beta/me', [
    'user.read',
  ]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read'],
    },

    loginFailedRoute: '/login-failed',
  };
}

@NgModule({
  declarations: [
    AppComponent,
    FaqComponent,
    ProfileComponent,
    MyActivityComponent,
    AssessmentHistoryComponent,
    MetricsHistoryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot(),
    MsalModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntlService },
    BreadcrumbService,
  ],

  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
