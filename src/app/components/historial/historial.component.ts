import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.states';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/services/basket.service';
import { Order } from 'src/app/models/order';
import { IShopCart } from 'src/app/interfaces/IShopCart';
import { LogOut } from 'src/app/store/auth/auth.actions';
import { Subscription } from 'rxjs';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit, OnDestroy {

  private subs = new Subscription();
  public compras$;
  public compras = [];
  getState;
  shopcart$;
  user;
  state;

  constructor(private store: Store<AppState>, private http: HttpClient,
    private router: Router, private basket: BasketService,
    private bd: AccesoBDService) {
    this.getState = this.store.select('auth');
    this.shopcart$ = this.store.select<IShopCart>(x => x.shopcart);
    store.take(1).subscribe(o => this.state = o);
  }

  ngOnInit() {
    this.user = this.state.auth.user.email;
    console.log(this.user);
    this.subs.add(this.bd.getOrders().subscribe((data) => {
      data.forEach(orden => {
        if (orden.Comprador == this.user) {
          this.compras.push(orden);
        }
      })
    }));
    console.log(this.compras);
  }

  goToProducts() {
    this.router.navigateByUrl('');
  }

  goToBasket() {
    this.router.navigateByUrl('/basket');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
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




