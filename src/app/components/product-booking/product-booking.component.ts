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
import { AppState } from 'src/app/store/app.states';

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
    if (this.shopItem.count < this.lastQuantity) {
      action = new ShopcartAction(PULL, this.shopItem);
    } else {
      action = new ShopcartAction(PUSH, this.shopItem);
    }
    this.store.dispatch(action);

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