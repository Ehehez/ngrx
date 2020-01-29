import { Component, OnInit } from '@angular/core';
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
export class LogInComponent implements OnInit {

  user: User = new User();
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
    this.subs.add(this.getState.subscribe((state) => {
      this.errorMessage = state.errorMessage;
    }));
  };

  onSubmit(): void {
    const payload = {
      identifier: this.user.email,
      password: this.user.password
    };

    this.store.dispatch({ type: ShopcartActionTypes.CLEAR });
    this.store.dispatch(new LogIn(payload));
    let a = this.getState.subscribe((state) => {
      return state.isAuthenticated;
    });
    if (a) {
      this.router.navigateByUrl('/');
    }
  }

}