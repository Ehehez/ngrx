import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from 'src/app/store/app.states';
import { HttpClient } from '@angular/common/http';
import { Articulo } from 'src/app/models/articulo';
import { Observable } from 'rxjs';
import { IShopCart } from 'src/app/interfaces/IShopCart';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/services/basket.service';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { LogOut } from 'src/app/store/actions/auth.actions';
import { CLEAR } from 'src/app/store/reducers/shopcart.reducer';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  public lista;
  private shopcart$: Observable<IShopCart>;
  private itemNumbers: any;
  getState: Observable<any>;
  isAuthenticated = false;
  user = null;
  errorMessage = null;
  public total = 0;

  constructor(private store: Store<AppState>, private http: HttpClient,
    private router: Router, private basket: BasketService
  ) {
    this.getState = this.store.select(selectAuthState);
    this.shopcart$ = this.store.select<IShopCart>(x => x.shopcart);
    this.itemNumbers = {};

    this.user = sessionStorage.getItem('user');

  }

  ngOnInit() {
    this.initBooks();
    this.getState.subscribe((state) => {
      this.isAuthenticated = state.isAuthenticated;
      console.log(state.isAuthenticated);
      /*this.user = state.user;*/
      this.errorMessage = state.errorMessage;
    })
  }


  private initBooks() {
    this.http.get<Articulo>('http://localhost:1337/articulos').subscribe(list => {
      this.lista = list;
      this.shopcart$.subscribe(cart => {
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
    })
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
    this.shopcart$.subscribe(cart => {
      this.lista.forEach(item => {
        if (cart.items) {
          let storeItem = cart.items.find(x => x.id === item.id);
          if (!storeItem) {
            this.itemNumbers[item.id] = 0;
          }
          else {
            let payload = new Articulo();
            payload.id = parseInt(storeItem.id);
            console.log(payload.id + " ---------- id");
            payload.name = storeItem.name;
            payload.price = storeItem.price;
            console.log(storeItem.quantity + "   --- cantidad");
            console.log(storeItem.count + "     ---- count");
            payload.quantity = storeItem.quantity - storeItem.count;
            console.log(payload.quantity);
            this.http.put('http://localhost:1337/articulos/' + payload.id, (payload)).subscribe((ret) => console.log(ret));
            descrip += storeItem.name + " x " + storeItem.count + " -----> " + storeItem.count * storeItem.price + "€\n";
            this.itemNumbers[item.id] = storeItem.count;
            total += storeItem.price * storeItem.count;
          }
        }
      });
      descrip += "Total = " + total + "€";
      let payload = new Order();
      payload.Comprador = sessionStorage.getItem('user');
      payload.coste = this.total;
      payload.Descripcion = descrip;
      let date = new Date();
      payload.fechaCompra = date.toDateString();
      let ret;
      this.basket.saveOrder(payload).subscribe((data) => {
      });
      this.store.dispatch({ type: CLEAR });
      this.router.navigateByUrl('/historial');
      return ret;
    })
  }

  logOut() {
    this.store.dispatch(new LogOut);
  }
}

