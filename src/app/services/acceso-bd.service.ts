import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Articulo } from '../models/articulo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesoBDService {

  constructor(private http: HttpClient) { }


  getArticulos(): Observable<Articulo> {
    return this.http.get<Articulo>('http://localhost:1337/articulos');
  }

  setArticulo(payload: Articulo) {
    console.log(payload);
    this.http.put('http://localhost:1337/articulos/' + payload.id, (payload)).subscribe(data => console.log(data)).unsubscribe();
  }
}
