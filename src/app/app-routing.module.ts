import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LandingComponent } from './components/landing/landing.component';
import { BasketComponent } from './components/basket/basket.component';
import { AuthGuardService } from './services/auth-guard.service';
import { HistorialComponent } from './components/historial/historial.component';

const routes: Routes = [
  { path: 'log-in', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '', component: LandingComponent, canActivate: [AuthGuardService] },
  { path: 'basket', component: BasketComponent, canActivate: [AuthGuardService] },
  { path: 'historial', component: HistorialComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
