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
import {
  DoCounterUp,
  DoCounterDown,
  DoCounterReset,
  DoCounterSet
} from 'src/app/store/actions/counter.actions';
import { StoreState } from 'src/app/store/app.states';



@Component({
  selector: 'landing',
  templateUrl: './landing.component.html'
})

export class LandingComponent implements OnInit {
  count$: Observable<number>;


  /*constructor(private store: Store<AppState2>) {
    this.count$ = this.store.select(state => state.counter.counter);
  }*/
  constructor(private readonly store: Store<StoreState>) {
    // 3 Connect Counter stream to Store Counter state.
    this.count$ = this.store.select(state => state.counter.count);
  }

  /*constructor(private store: Store<AppState2>) {
    this.counter = this.store.select<AppState2>(x => x);
  }*/

  ngOnInit() {

  }

  onUp() {
    // 4 Dispatch action to all reducers.
    this.store.dispatch(new DoCounterUp());
  }

  onDown() {
    // 5 Dispatch action to all reducers.
    this.store.dispatch(new DoCounterDown());
  }

  onSet(count: string) {
    // 6 Dispatch action to all reducers.
    this.store.dispatch(new DoCounterSet(parseInt(count, 10)));
  }

  onReset() {
    // 7 Dispatch action to all reducers.
    this.store.dispatch(new DoCounterReset());
  }

}