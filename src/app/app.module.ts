///////////////////////////MODULOS///////////////////////////
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

/////////////////////////SERVICES//////////////////////////
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { BasketService } from './services/basket.service';
import { ShopcartService } from './services/shopcart.service';
import { AccesoBDService } from './services/acceso-bd.service';
import { AuthGuardRoleService } from './services/auth-guard-role.service';


////////////////////////COMPONENTS////////////////////////
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { BasketComponent } from './components/basket/basket.component';
import { ProductBookingComponent } from './components/product-booking/product-booking.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { HistorialComponent } from './components/historial/historial.component';
import { AddcatComponent } from './components/addcat/addcat.component';

//////////////////////////STORE///////////////////////////////
import { AuthEffects } from './store/auth/auth.effects';
import { reducers } from './store/app.states';
import { TokenInterceptor, ErrorInterceptor } from './services/token.interceptor';
import { storageMetaReducer } from './store/reducers/storage.metareducer';
import { FichaArticuloComponent } from './components/ficha-articulo/ficha-articulo.component';
//import { FichaArticuloService } from './services/ficha-articulo.service';







@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    BasketComponent,
    LandingComponent,
    ProductBookingComponent,
    HistorialComponent,
    AddProductComponent,
    AddcatComponent,
    FichaArticuloComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot(reducers, { metaReducers: [storageMetaReducer] }),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
    AngularFontAwesomeModule,
    NgbModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right'
    }),
    BrowserAnimationsModule
  ],
  providers: [AuthService,
    AuthGuardService,
    BasketService,
    ShopcartService,
    AccesoBDService,
    AuthGuardRoleService,
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
