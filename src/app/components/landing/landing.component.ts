import { Input, OnInit, OnChanges, Component } from '@angular/core';
import { Articulo } from 'src/app/models/articulo';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShopItem } from 'src/app/models/shopItem';
import { AppState } from 'src/app/store/app.states';
import { Store } from '@ngrx/store';
import { IShopCart } from 'src/app/interfaces/IShopCart';
import { count, subscribeOn } from 'rxjs/operators';
import { LogOut } from 'src/app/store/actions/auth.actions';
import { ShopCart } from 'src/app/models/ShopCart';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnChanges {

  @Input('product') product: Articulo;
  @Input('default-number') defaultNumber: number;

  private counter: String = "";
  private shopItem: Articulo = null;
  private lista: Articulo;
  getState: Observable<any>;
  isAuthenticated = false;
  user = null;
  errorMessage = null;
  private shopcart$: Observable<IShopCart>;
  subs = new Subscription();
  public shopCart = JSON.parse(sessionStorage.getItem('authState.shopcart')) || new ShopCart();

  constructor(
    private router: Router, private http: HttpClient,
    private store: Store<AppState>,
  ) {
    //Create ShopItem

    this.shopItem = new Articulo();
    this.getState = this.store.select((state) => { return state.authState; })
    this.shopcart$ = this.store.select((state) => { return state.shopcart; })
    this.user = sessionStorage.getItem('user');
  }




  public ngOnChanges() {
    this.shopItem.id = this.product.id;
    this.shopItem.name = this.product.name;
    this.shopItem.quantity = this.product.quantity;
    this.shopItem.price = this.product.price;
  }

  ngOnDestroy() {
    this.subs.unsubscribe;
  }

  ngOnInit() {
    let a = (JSON.parse(sessionStorage.getItem('authState')));
    if (a) {
      this.shopCart = a.shopcart;
    } else this.shopCart = new ShopCart();

    this.subs.add(this.http.get<Articulo>('http://localhost:1337/articulos').subscribe(list => {
      this.lista = list;
    }));

  }

  ngOnLoad() {
    if (JSON.parse(sessionStorage.getItem('authState.shopcart'))) {
      this.shopCart = JSON.parse(sessionStorage.getItem('authState.shopcart'));
    } else this.shopCart = new ShopCart();
  }
  logOut() {
    this.store.dispatch(new LogOut);
  }



  private goToBasket() {
    this.router.navigate(['/basket']);
  }
  private goToHistorial() {
    this.router.navigate(['/historial']);
  }

}


