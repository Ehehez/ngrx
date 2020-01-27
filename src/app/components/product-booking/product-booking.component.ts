import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ShopItem } from '../../models/shopItem';
import { Articulo } from '../../models/articulo';
import { Observable } from 'rxjs';
import { IShopCart } from 'src/app/interfaces/IShopCart';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ShopcartAction } from 'src/app/models/shopcartAction';
import { CLEAR, PULL, PUSH } from 'src/app/store/reducers/shopcart.reducer';
import { ShopCart } from 'src/app/models/ShopCart';
import { AppState, selectShopcartState } from 'src/app/store/app.states';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { LandingComponent } from '../landing/landing.component';
@Component({
  selector: 'product-booking',
  template: `
               <table style="margin: 0 auto; width:100%">
                 <tr>
                   <td (click)="decrement()"><label style="min-width:25px"><i class="fa fa-minus"></i></label></td>
                   <td class="text-center"><input style="max-width:50px" readonly="readonly" type="text" class="text-center" value="{{shopItem.count}}"/></td>
                   <td (click)="increment()" id="{{shopItem.id}}"><label style="min-width:25px"><i class="fa fa-plus"></i></label></td>
                   <td colspan="3"><button (click)="sendToCart()" class="btn btn-outline-primary">Enviar al carro</button></td>
                 </tr>
                 
               </table>
              `
})
export class ProductBookingComponent implements OnInit, OnChanges {

  @Input('product') articulo: Articulo;
  @Input('default-number') defaultNumber: number;
  @Output('emit-events') emitEvents = new EventEmitter<ShopCart>(true); //Must set the EventEmitter to async

  private shopItem: ShopItem = null;
  private shopcart$: Observable<IShopCart>;
  private quantityError = "";
  private lastQuantity = 0;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private shop: ShopcartService,
    private landing: LandingComponent
  ) {
    //Create ShopItem
    this.shopItem = new ShopItem();
    this.shopcart$ = store.select<IShopCart>(x => x.shopcart);

  }
  public ngOnChanges() {
    this.shopItem.id = this.articulo.id;
    this.shopItem.name = this.articulo.name;
    this.shopItem.price = this.articulo.price;
    this.shopItem.quantity = this.articulo.quantity;
  }

  ngOnInit() {
    this.numero(this.articulo.id);
    this.shopItem.lastQuantity = this.shopItem.count;
  }
  private increment() {

    if (this.shopItem.count + 1 > this.articulo.quantity) {
      document.getElementById(this.shopItem.id).setAttribute("disabled", "disabled");
    }
    else {
      document.getElementById(this.shopItem.id).removeAttribute("disabled");
      this.shopItem.count += 1;


    }


  }

  private decrement() {
    if (this.shopItem.count > 0) {
      this.shopItem.count -= 1;
      /* this.store.dispatch({ type: PULL, payload: this.shopItem });*/
    }
  }

  private reset() {
    this.shopItem.count = 0;
    this.store.dispatch({ type: CLEAR });
  }

  private sendToCart() {
    let action;
    if (this.shopItem.count < this.shopItem.lastQuantity) {
      /*action = new ShopcartAction(PULL, this.shopItem);*/
      this.landing.shopCart = this.shop.pullFromCart(this.landing.shopCart, this.shopItem);
    } else if (this.shopItem.count == this.shopItem.lastQuantity) {
    }
    else {
      /*action = new ShopcartAction(PUSH, this.shopItem);*/
      this.landing.shopCart = this.shop.pushToCart(this.landing.shopCart, this.shopItem);
    }


    action = new ShopcartAction(PUSH, this.landing.shopCart);
    this.store.dispatch(action);

    this.landing.cnt = this.landing.shopCart.cnt;
    this.landing.sum = this.landing.shopCart.sum;
    this.shopItem.lastQuantity = this.shopItem.count;
  }


  numero(id) {
    this.shopcart$.forEach(x => {
      x.items.forEach(x => {

        if (x.id == id) {
          this.shopItem.count = x.count;
          return 0;
        }
      })
    })
    return 0;
  }
}