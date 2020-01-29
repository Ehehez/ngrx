import { Input, OnInit, OnChanges, Component, OnDestroy } from '@angular/core';
import { Articulo } from 'src/app/models/articulo';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppState } from 'src/app/store/app.states';
import { Store } from '@ngrx/store';
import { IShopCart } from 'src/app/interfaces/IShopCart';
import { LogOut } from 'src/app/store/auth/auth.actions';
import { AccesoBDService } from '../../services/acceso-bd.service';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnChanges, OnDestroy {

  @Input('product') product: Articulo;
  @Input('default-number') defaultNumber: number;

  private shopItem: Articulo = null;
  private lista: Articulo;
  getState: Observable<any>;
  isAuthenticated = false;
  user = null;
  errorMessage = null;
  private shopcart$: Observable<IShopCart>;
  subs = new Subscription();
  state;
  constructor(
    private router: Router, private http: HttpClient,
    private store: Store<AppState>, private bd: AccesoBDService
  ) {

    this.shopItem = new Articulo();
    this.getState = this.store.select((state) => { return state.auth; })
    /*this.shopcart$ = this.store.select((state) => { return state.shopcart; })*/
    this.subs.add(store.subscribe(o => this.state = o));
  }




  public ngOnChanges() {
    this.shopItem.id = this.product.id;
    this.shopItem.name = this.product.name;
    this.shopItem.quantity = this.product.quantity;
    this.shopItem.price = this.product.price;
    this.subs.add(this.store.subscribe(o => this.state = o));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.user = this.state.auth.user.email;
    this.subs.add(this.bd.getArticulos().subscribe(list => {
      this.lista = list;
    }));

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


