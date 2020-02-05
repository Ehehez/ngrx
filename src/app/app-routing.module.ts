import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LandingComponent } from './components/landing/landing.component';
import { BasketComponent } from './components/basket/basket.component';
import { AuthGuardService } from './services/auth-guard.service';
import { HistorialComponent } from './components/historial/historial.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AuthGuardRoleService } from './services/auth-guard-role.service';
import { DelProductComponent } from './components/del-product/del-product.component';
import { AddcatComponent } from './components/addcat/addcat.component';

const routes: Routes = [
  { path: 'log-in', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '', component: LandingComponent, canActivate: [AuthGuardService] },
  { path: 'basket', component: BasketComponent, canActivate: [AuthGuardService] },
  { path: 'historial', component: HistorialComponent, canActivate: [AuthGuardService] },
  { path: 'addprod', component: AddProductComponent, canActivate: [AuthGuardRoleService] },
  { path: 'delprod', component: DelProductComponent, canActivate: [AuthGuardRoleService] },
  { path: 'addcat', component: AddcatComponent, canActivate: [AuthGuardRoleService] },
  { path: '**', redirectTo: '/log-in' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
