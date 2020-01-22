import { Input, OnInit, OnChanges, Component } from '@angular/core';
import { Articulo } from 'src/app/models/articulo';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
/*import { Component, OnInit, ViewContainerRef, OnChanges, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, State } from '@ngrx/store';
import { LogOut } from '../../store/actions/auth.actions';
import {
  DoCounterUp,
  DoCounterDown,
  DoCounterReset,
  DoCounterSet
} from 'src/app/store/actions/counter.actions';
import { StoreState, selectAuthState } from 'src/app/store/app.states';
import { Articulo } from 'src/app/models/articulo';



@Component({
  selector: 'landing',
  templateUrl: './landing.component.html'
})

export class LandingComponent implements OnInit, OnChanges {
  count$: Observable<number>;
  getState: Observable<any>;
  isAuthenticated = false;
  user = null;
  errorMessage = null;

  @Input('product') product: Articulo;
  @Input('default-number') defaultNumber: number;

  private counter: number = 0;
  private shopItem: Articulo = null;
  private shopcart$: Observable<IShopCart>;

  /*constructor(private store: Store<AppState2>) {
    this.count$ = this.store.select(state => state.counter.counter);
  }
  constructor(private readonly store: Store<StoreState>) {
    // 3 Connect Counter stream to Store Counter state.
    this.count$ = this.store.select(state => state.counter.count);
    this.getState = this.store.select(selectAuthState);

  }*/

/*constructor(private store: Store<AppState2>) {
  this.counter = this.store.select<AppState2>(x => x);
}*/

/*ngOnInit() {
  this.getState.subscribe((state) => {
    this.isAuthenticated = state.isAuthenticated;
    this.user = state.user;
    this.errorMessage = state.errorMessage;
  })
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

logOut(): void {
  this.store.dispatch(new LogOut);
}
}*/
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnChanges {

  @Input('product') product: Articulo;
  @Input('default-number') defaultNumber: number;

  private counter: number = 0;
  private shopItem: Articulo = null;
  private lista: Articulo;
  /*private shopcart$: Observable<IShopCart>;*/

  constructor(
    private router: Router, private http: HttpClient
  ) {
    //Create ShopItem
    this.shopItem = new Articulo();
  }
  public ngOnChanges() {
    this.shopItem.id = this.product.id;
    this.shopItem.name = this.product.name;
    this.shopItem.quantity = this.defaultNumber ? this.defaultNumber : 0;
    this.shopItem.price = this.product.price;
  }

  ngOnInit() {
    this.http.get<Articulo>('http://localhost:1337/articulos').subscribe(list => {
      this.lista = list;
      console.log(this.lista);
    });


  }
  private increment(id: number) {
    this.lista[id].quantity = 1 + parseInt(this.lista[id].quantity);
  }

  private decrement(id: number) {
    this.lista[id].quantity = 1 - parseInt(this.lista[id].quantity);
  }

  private reset(id: number) {
    this.lista[id].quantity = 0;
  }
}