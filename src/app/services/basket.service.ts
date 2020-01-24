import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private http: HttpClient) { }

  saveOrder(orden: Order) {
    console.log(JSON.stringify(orden));
    return this.http.post('http://localhost:1337/carritos', (orden));
  }

  getOrders(user) {
    return this.http.get('http://localhost:1337/carritos');
  }
}
