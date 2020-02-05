import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from '../../models/user';
import { AppState, selectAuthState } from '../../store/app.states';
import { LogIn, AuthActionTypes } from '../../store/auth/auth.actions';
import { Observable, Subscription } from 'rxjs';
import { ShopcartActionTypes } from 'src/app/store/shopcart/shopcart.actions';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShopcartAction } from 'src/app/models/shopcartAction';



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, OnDestroy {

  user: User = new User();
  state;
  errorMessage: string | null;
  subs = new Subscription();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private http: HttpClient
  ) {
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

    this.store.dispatch(new LogIn(payload));

    setTimeout(() => {
      let a = this.state.auth.isAuthenticated;
      if (a) {
        this.http.get<User>('http://localhost:1337/users?email=' + this.user.email).subscribe((data) => {
          console.log(data);
          this.state.auth.user.id = data[0].id;
          this.store.dispatch({
            type: AuthActionTypes.SETID, payload: {
              id: data[0].id,
            }
          })
          if (data[0].carrito != null) {
            let payload = JSON.parse(data[0].carrito);
            this.state.shopcart = JSON.parse(data[0].carrito);
            let action = new ShopcartAction(ShopcartActionTypes.PUSH, this.state.shopcart);
            this.store.dispatch(action);
          } else {
            let action = new ShopcartAction(ShopcartActionTypes.CLEAR);
            this.store.dispatch(action);
          }
          this.router.navigateByUrl('');
        });
      }
    }, 400);


  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}