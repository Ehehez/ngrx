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
    (this.state);
    if (this.state.auth.isAuthenticated === true && this.auth.getToken() != null) {
      return true;
    } else this.router.navigateByUrl('/log-in');

  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
