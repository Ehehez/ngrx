import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { Router, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.states';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardRoleService implements OnDestroy, CanActivate {

  subs = new Subscription();
  state;

  constructor(
    public auth: AuthService,
    public router: Router,
    private store: Store<AppState>
  ) {

  }
  canActivate(): boolean {
    this.store.subscribe((o) => this.state = o);
    if (this.state.auth.isAuthenticated === true && this.auth.getToken() != null && this.state.auth.user.role == "Admin") {
      return true;
    } else {
      this.router.navigateByUrl('/');
    }

  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
