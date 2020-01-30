import { Injectable, OnDestroy } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';
import { AppState } from '../store/app.states';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthGuardService implements CanActivate, OnDestroy {

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
    if (this.state.auth.isAuthenticated == false) {
      this.router.navigateByUrl('/log-in');
    }
    let isLogin;
    setTimeout(() => {
      isLogin = this.state.auth.isAuthenticated;
      if (isLogin || this.auth.getToken()) {
        isLogin = true;
      } else isLogin = false;
      if (!isLogin) this.router.navigateByUrl('/log-in');

    }, 50)
    isLogin = this.state.auth.isAuthenticated;
    return isLogin;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
