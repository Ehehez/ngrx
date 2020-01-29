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
import { LogOut } from 'src/app/store/auth/auth.actions';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';
import { ShopcartActionTypes } from 'src/app/store/shopcart/shopcart.actions';

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
  enviado = false;
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

  }

  ngOnInit() {
    this.initBooks();
    this.subs.add(this.getState.subscribe((state) => {
      this.isAuthenticated = state.isAuthenticated;
      if (!this.isAuthenticated) {
        this.router.navigateByUrl('/log-in');
      }
      this.errorMessage = state.errorMessage;
    }));
    this.user = this.state.auth.user.email;
    console.log(this.user);
  }


  private initBooks() {
    this.subs.add(this.bd.getArticulos().subscribe(list => {
      this.lista = list;
      if (this.lista.length == 0) {
        this.enviado = true;
      }
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
    let payload = new Order();
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
            this.subs.add(this.bd.setArticulo(payload).subscribe());
            descrip += storeItem.name + " x " + storeItem.count + " -----> " + storeItem.count * storeItem.price + "€\n";
            this.itemNumbers[item.id] = storeItem.count;
            total += storeItem.price * storeItem.count;
          }
        }
      });


    }))
    descrip += "Total = " + total + "€";
    payload.Comprador = this.user;
    payload.coste = this.total;
    payload.Descripcion = descrip;
    let date = new Date();
    payload.fechaCompra = date.toDateString();
    console.log("uno");
    this.store.dispatch({ type: ShopcartActionTypes.CLEAR });
    this.subs.add(this.basket.saveOrder(payload));
    this.enviado = true;
    this.router.navigateByUrl('/historial');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  logOut() {
    let a = this.store.dispatch(new LogOut);
    console.log("wat");
    console.log(a);
  }

}


