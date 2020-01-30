import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from '../../models/user';
import { AppState, selectAuthState } from '../../store/app.states';
import { SignUp } from '../../store/auth/auth.actions';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {

  subs = new Subscription();
  user: User = new User();
  getState: Observable<any>;
  errorMessage: string | null;
  state;
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.subs.add(this.store.subscribe((o) => {
      this.state = o;
      this.errorMessage = o.auth.errorMessage;
    }));

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSubmit(): void {
    const payload = {
      username: this.user.email,
      email: this.user.email,
      password: this.user.password
    };
    this.store.dispatch(new SignUp(payload));
    setTimeout(() => {
      if (this.state.auth.user != null) {
        this.router.navigateByUrl('/log-in');
      }
    }, 400);
  }

}