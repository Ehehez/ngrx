import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.states';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/services/basket.service';
import { Order } from 'src/app/models/order';
import { IShopCart } from 'src/app/interfaces/IShopCart';
import { LogOut } from 'src/app/store/actions/auth.actions';
import { LandingComponent } from '../landing/landing.component';

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
  cnt;
  sum;

  constructor(private store: Store<AppState>, private http: HttpClient,
    private router: Router, private basket: BasketService, ) {
    this.getState = this.store.select('authState');
    this.shopcart$ = this.store.select<IShopCart>(x => x.shopcart);
    this.user = sessionStorage.getItem("user");
  }

  ngOnInit() {
    let recup = JSON.parse(sessionStorage.getItem('authState'));
    this.cnt = recup.shopcart.cnt;
    this.sum = recup.shopcart.sum;
    this.http.get<Order[]>('http://localhost:1337/carritos').subscribe((data) => {
      data.forEach(orden => {
        if (orden.Comprador == this.user) {
          this.compras.push(orden);
        }
      })
    })
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

  /*vertd(id) {
    if (document.getElementById(id).getAttribute('class') == "invisible") {
      document.getElementById(id).setAttribute('class', 'visible');
    } else document.getElementById(id).setAttribute('class', 'invisible');
  }*/
}




