import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Articulo } from '../models/articulo';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AccesoBDService {

  constructor(private http: HttpClient) { }


  getArticulos(): Observable<Articulo> {
    return this.http.get<Articulo>('http://localhost:1337/articulos');
  }

  getArticulo(id) {
    return this.http.get<Articulo>('http://localhost:1337/articulos/' + id);
  }
  getArticulosNameCat(payload) {
    let a = parseInt(payload.IdCategoria);
    return this.http.get<Articulo>('http://localhost:1337/articulos?name=' + payload.name + '&IdCategoria=' + a);
  }

  createArticulo(payload) {
    return this.http.post<Articulo>('http://localhost:1337/articulos', payload);
  }

  setArticulo(payload: Articulo) {
    return this.http.put('http://localhost:1337/articulos/' + payload.id, (payload));
  }

  deleteProd(id) {
    return this.http.delete('http://localhost:1337/articulos/' + id);
  }
  getOrders() {
    return this.http.get<Order[]>('http://localhost:1337/carritos');
  }

  setUser(payload, id) {
    return this.http.put('http://localhost:1337/users/' + id, (payload));
  }

  getCategorias() {
    return this.http.get('http://localhost:1337/categorias');
  }
  getCategoria(id) {
    return this.http.get('http://localhost:1337/categorias/' + id);
  }
  setCategoria(payload, id) {
    return this.http.put('http://localhost:1337/categorias/' + id, payload);
  }
  getCatName(payload) {
    return this.http.get('http://localhost:1337/categorias?Name=' + payload.Name + '&CategoriaPadre=' + payload.CategoriaPadre);
  }
  createCategoria(payload) {
    if (payload.CategoriaPadre == 0 || payload.CategoriaPadre == "") {
      payload.CategoriaPadre = null;
    }
    return this.http.post('http://localhost:1337/categorias', payload);
  }

  deleteCat(id) {
    return this.http.delete('http://localhost:1337/categorias/' + id);
  }
}
