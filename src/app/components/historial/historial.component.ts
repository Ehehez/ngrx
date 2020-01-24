import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.states';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/services/basket.service';
import { Order } from 'src/app/models/order';
import { IShopCart } from 'src/app/interfaces/IShopCart';
import { LogOut } from 'src/app/store/actions/auth.actions';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  public compras$;
  public compras = [];
  getState;
  shopcart$;
  user;

  constructor(private store: Store<AppState>, private http: HttpClient,
    private router: Router, private basket: BasketService) {
    this.getState = this.store.select('authState');
    this.shopcart$ = this.store.select<IShopCart>(x => x.shopcart);
    this.user = sessionStorage.getItem("user");
  }

  ngOnInit() {
    this.http.get<Order[]>('http://localhost:1337/carritos').subscribe((data) => {
      data.forEach(orden => {
        this.compras.push(orden);
      })
    })
    console.log(this.getState);
  }

  goToProducts() {
    this.router.navigateByUrl('');
  }

  goToBasket() {
    this.router.navigateByUrl('/basket');
  }

  logOut() {
    this.store.dispatch(new LogOut);
  }

}




