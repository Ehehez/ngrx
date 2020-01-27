import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { AuthService } from './services/auth.service';
import { AuthEffects } from './store/effects/auth.effects';
import { reducers } from './store/app.states';
import { TokenInterceptor, ErrorInterceptor } from './services/token.interceptor';
import { BasketComponent } from './components/basket/basket.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ProductBookingComponent } from './components/product-booking/product-booking.component';
import { BasketService } from './services/basket.service';
import { HistorialComponent } from './components/historial/historial.component';
import { storageMetaReducer } from './store/reducers/storage.metareducer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShopcartService } from './services/shopcart.service';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    BasketComponent,
    LandingComponent,
    ProductBookingComponent,
    HistorialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot(reducers, { metaReducers: [storageMetaReducer] }),
    AngularFontAwesomeModule,
    NgbModule
  ],
  providers: [AuthService,
    AuthGuardService,
    BasketService,
    ShopcartService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
