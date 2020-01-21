/*import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState, selectAuthState } from '../../store/app.states';
import { LogOut } from '../../store/actions/auth.actions';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {


  getState: Observable<any>;
  isAuthenticated = false;
  user = null;
  errorMessage = null;


  constructor(
    private store: Store<AppState>
  ) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {
    this.getState.subscribe((state) => {
      this.isAuthenticated = state.isAuthenticated;
      this.user = state.user;
      this.errorMessage = state.errorMessage;
    })
  }

  logOut(): void {
    this.store.dispatch(new LogOut);
  }

}
*/
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, State } from '@ngrx/store';
import { INCREMENT, DECREMENT, RESET } from '../../store/reducers/counter.reducer';
import { AppState2 } from 'src/app/store/app.states';
import { initialState } from 'src/app/store/reducers/counter.reducer';


@Component({
  selector: 'landing',
  templateUrl: './landing.component.html'
})

export class LandingComponent implements OnInit {
  private counter: Observable<number>;

  constructor(private store: Store<AppState2>) {
    this.counter = this.store.select<AppState2>(x => x) as Observable<any>;
  }

  ngOnInit() {

  }

  private increment() {
    this.store.dispatch({ type: INCREMENT });
  }

  private decrement() {
    this.store.dispatch({ type: DECREMENT });
  }

}