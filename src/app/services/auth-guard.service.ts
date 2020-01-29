import { Injectable, OnDestroy } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';
import { AppState, selectAuthState } from '../store/app.states';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';


@Injectable()
export class AuthGuardService implements CanActivate, OnDestroy {

  subs = new Subscription();
  state;
  getState;
  constructor(
    public auth: AuthService,
    public router: Router,
    private store: Store<AppState>
  ) {
    this.getState = this.store.select(selectAuthState);
  }
  canActivate(): boolean {

    let isLogin;
    this.subs.add(this.getState.subscribe((o) => isLogin = o.isAuthenticated));
    if (isLogin || this.auth.getToken()) {
      isLogin = true;
    } else isLogin = false;

    if (!isLogin) this.router.navigateByUrl('/log-in');

    return isLogin;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
