import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Articulo } from '../models/articulo';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class AccesoBDService {

  constructor(private http: HttpClient) { }


  getArticulos(): Observable<Articulo> {
    return this.http.get<Articulo>('http://localhost:1337/articulos');
  }

  setArticulo(payload: Articulo) {
    return this.http.put('http://localhost:1337/articulos/' + payload.id, (payload));
  }

  getOrders() {
    return this.http.get<Order[]>('http://localhost:1337/carritos');
  }

  setUser(payload, id) {
    return this.http.put('http://localhost:1337/users/' + id, (payload));
  }
}
