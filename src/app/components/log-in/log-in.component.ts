import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from '../../models/user';
import { AppState, selectAuthState } from '../../store/app.states';
import { LogIn } from '../../store/auth/auth.actions';
import { Observable, Subscription } from 'rxjs';
import { ShopcartActionTypes } from 'src/app/store/shopcart/shopcart.actions';
import { Router } from '@angular/router';



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, OnDestroy {

  user: User = new User();
  state;
  getState: Observable<any>;
  errorMessage: string | null;
  subs = new Subscription();


  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {
    this.store.subscribe((o) => this.state = o);
    this.errorMessage = this.state.auth.errorMessage;
  };

  onSubmit(): void {
    const payload = {
      identifier: this.user.email,
      password: this.user.password
    };

    this.store.dispatch({ type: ShopcartActionTypes.CLEAR });
    this.store.dispatch(new LogIn(payload));

    setTimeout(() => {
      let a = this.state.auth.isAuthenticated;
      if (a) {
        this.router.navigateByUrl('/productos');
      }
    }, 400);


  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}