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
  carts;

  constructor(private store: Store<AppState>, private http: HttpClient,
    private router: Router, private basket: BasketService, private bd: AccesoBDService
  ) {
    this.getState = this.store.select(selectAuthState);
    this.shopcart$ = this.store.select<IShopCart>(x => x.shopcart);
    this.itemNumbers = {};

  }

  ngOnInit() {

    this.subs.add(this.store.subscribe(o => this.state = o));
    this.initBooks();
    this.isAuthenticated = this.state.isAuthenticated;

    /*if (this.state.auth.user.role == "Admin") {
      let a = document.getElementById('btn-añadir');
      a.style.display = "inline-block";
    }*/
    this.user = this.state.auth.user.email;

  }


  private initBooks() {
    this.subs.add(this.bd.getArticulos().subscribe(list => {
      this.lista = list;
      if (this.lista.length == 0) {
        this.enviado = true;
      }

      this.lista.forEach(item => {
        if (this.state.shopcart.items) {
          let storeItem = this.state.shopcart.items.find(x => x.id === item.id);
          if (!storeItem) {
            this.itemNumbers[item.id] = 0;
          }
          else {
            this.itemNumbers[item.id] = storeItem.count;
            this.total += storeItem.price * storeItem.count;
          }
        }
      });


    }))
  }

  goToProducts() {
    this.router.navigateByUrl('');
  }

  goToHistorial() {
    this.router.navigateByUrl('/historial');
  }

  async saveOrder() {
    let descrip = "";
    let total = 0;
    let payloadOrd = new Order();

    this.carts = this.state.shopcart.items;
    this.lista.forEach(item => {
      if (this.carts) {
        let storeItem = this.carts.find(x => x.id === item.id);
        if (!storeItem) {
          this.itemNumbers[item.id] = 0;
        }
        else {
          let payload = new Articulo();
          payload.id = parseInt(storeItem.id);
          payload.name = storeItem.name;
          payload.price = storeItem.price;
          payload.quantity = storeItem.quantity - storeItem.count;
          this.subs.add(this.bd.setArticulo(payload).subscribe((o) => {
          }));
          setTimeout(() => { }, 100);
          descrip += storeItem.name + " x " + storeItem.count + " -----> " + storeItem.count * storeItem.price + "€\n";
          this.itemNumbers[item.id] = storeItem.count;
          total += storeItem.price * storeItem.count;
        }

      }
      ;
    });
    descrip += "Total = " + total + "€";
    payloadOrd.Comprador = this.state.auth.user.email;
    payloadOrd.Descripcion = descrip;
    payloadOrd.coste = total;
    let date = new Date();
    payloadOrd.fechaCompra = date.toDateString();
    this.subs.add(this.basket.saveOrder(payloadOrd));
    this.store.dispatch({ type: ShopcartActionTypes.CLEAR });

    let payload = {
      carrito: JSON.stringify(this.state.shopcart),
    }
    this.subs.add(this.bd.setUser(JSON.stringify(payload), this.state.auth.user.id).subscribe((data) => { }));

    this.router.navigateByUrl('/historial');
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  logOut() {
    this.store.dispatch(new LogOut);
    if (this.state.auth.isAuthenticated == false) {
      localStorage.clear();
      this.router.navigateByUrl('/log-in');
    }
  }
  goToAdd() {
    this.router.navigateByUrl('/addprod');
  }
  goToRemove() {
    this.router.navigateByUrl('/delprod');
  }

  goToAddCat() {
    this.router.navigateByUrl('/addcat');
  }
}


