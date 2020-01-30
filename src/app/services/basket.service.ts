import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.states';
import { ShopcartActionTypes } from '../store/shopcart/shopcart.actions';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private http: HttpClient,
    private store: Store<AppState>) { }

  saveOrder(orden: Order) {
    return this.http.post('http://localhost:1337/carritos', (orden)).subscribe();
  }

  getOrders(user) {
    return this.http.get('http://localhost:1337/carritos');
  }
}
