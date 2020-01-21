import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router
  ) { }
  canActivate(): boolean {
    let isLogin;
    if (this.auth.getToken()) {
      isLogin = true;
    } else isLogin = false;

    if (!isLogin) this.router.navigateByUrl('/log-in');

    return isLogin;
  }
}
