import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from 'src/app/store/app.states';
import { HttpClient } from '@angular/common/http';
import { Articulo } from 'src/app/models/articulo';
import { Observable, Subscription } from 'rxjs';
import { IShopCart } from 'src/app/interfaces/IShopCart';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/services/basket.service';
import { Order } from 'src/app/models/order';
import { LogOut } from 'src/app/store/actions/auth.actions';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';
import { ShopcartActionTypes } from 'src/app/store/actions/shopcart.actions';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit, OnDestroy {

  private subs = new Subscription();
  public lista;
  private shopcart$: Observable<IShopCart>;
  private itemNumbers: any;
  getState: Observable<any>;
  isAuthenticated = false;
  user = null;
  errorMessage = null;
  public total = 0;
  cnt;
  sum;
  state;


  constructor(private store: Store<AppState>, private http: HttpClient,
    private router: Router, private basket: BasketService, private bd: AccesoBDService
  ) {
    this.getState = this.store.select(selectAuthState);
    this.shopcart$ = this.store.select<IShopCart>(x => x.shopcart);
    this.itemNumbers = {};
    store.take(1).subscribe(o => this.state = o);
    /*this.user = localStorage.getItem('user');*/

  }

  ngOnInit() {
    this.initBooks();
    this.subs.add(this.getState.subscribe((state) => {
      this.isAuthenticated = state.isAuthenticated;
      this.errorMessage = state.errorMessage;
    }));
    this.user = this.state.auth.user.email;
  }


  private initBooks() {
    this.subs.add(this.bd.getArticulos().subscribe(list => {
      this.lista = list;
      this.subs.add(this.shopcart$.subscribe(cart => {
        this.lista.forEach(item => {
          if (cart.items) {
            let storeItem = cart.items.find(x => x.id === item.id);
            if (!storeItem) {
              this.itemNumbers[item.id] = 0;
            }
            else {
              this.itemNumbers[item.id] = storeItem.count;
              this.total += storeItem.price * storeItem.count;
            }
          }
        });
      })
      )
    }))
  }

  goToProducts() {
    this.router.navigateByUrl('');
  }

  goToHistorial() {
    this.router.navigateByUrl('/historial');
  }

  saveOrder() {
    let descrip = "";
    let total = 0;
    this.subs.add(this.shopcart$.subscribe(cart => {
      this.lista.forEach(item => {
        if (cart.items) {
          let storeItem = cart.items.find(x => x.id === item.id);
          if (!storeItem) {
            this.itemNumbers[item.id] = 0;
          }
          else {
            let payload = new Articulo();
            payload.id = parseInt(storeItem.id);
            payload.name = storeItem.name;
            payload.price = storeItem.price;
            payload.quantity = storeItem.quantity - storeItem.count;
            this.bd.setArticulo(payload);
            descrip += storeItem.name + " x " + storeItem.count + " -----> " + storeItem.count * storeItem.price + "€\n";
            this.itemNumbers[item.id] = storeItem.count;
            total += storeItem.price * storeItem.count;
          }
        }
      });
      descrip += "Total = " + total + "€";
      let payload = new Order();
      payload.Comprador = localStorage.getItem('user');
      payload.coste = this.total;
      payload.Descripcion = descrip;
      let date = new Date();
      payload.fechaCompra = date.toDateString();
      let ret;
      this.subs.add(this.basket.saveOrder(payload).subscribe((data) => {
      }));
      this.store.dispatch({ type: ShopcartActionTypes.CLEAR });
      this.router.navigateByUrl('/historial');
      return ret;
    }))
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  logOut() {
    this.store.dispatch(new LogOut);
  }

}


