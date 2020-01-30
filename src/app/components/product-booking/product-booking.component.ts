import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ShopItem } from '../../models/shopItem';
import { Articulo } from '../../models/articulo';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ShopcartAction } from 'src/app/models/shopcartAction';
import { ShopcartActionTypes } from 'src/app/store/shopcart/shopcart.actions';
import { ShopCart } from 'src/app/models/ShopCart';
import { AppState } from 'src/app/store/app.states';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'product-booking',
  template: `
               <table style="margin: 0 auto; width:100%">
                 <tr>
                   <td (click)="decrement()"><label style="min-width:25px"><i class="fa fa-minus"></i></label></td>
                   <td class="text-center"><input style="max-width:50px" min="0" type="number" id="{{shopItem.id}}" (change)="changes(shopItem.id)" class="text-center" value="{{shopItem.count}}"/></td>
                   <td (click)="increment()" id="{{shopItem.id}}"><label style="min-width:25px"><i class="fa fa-plus"></i></label></td>
                   <td colspan="3"><button (click)="sendToCart()" class="btn btn-outline-primary">Enviar al carro</button></td>
                 </tr>
                 
               </table>
              `
})
export class ProductBookingComponent implements OnInit, OnChanges, OnDestroy {

  @Input('product') articulo: Articulo;
  @Input('default-number') defaultNumber: number;
  @Output('emit-events') emitEvents = new EventEmitter<ShopCart>(true); //Must set the EventEmitter to async

  private shopItem: ShopItem = null;
  private state;
  subs = new Subscription();


  constructor(
    private store: Store<AppState>,
    private shop: ShopcartService,
    private toastr: ToastrService
  ) {
    //Create ShopItem
    this.shopItem = new ShopItem();

  }
  public ngOnChanges() {

  }

  ngOnInit() {

    this.subs.add(this.store.subscribe(o => this.state = o));

    this.numero(this.articulo.id);
    if (this.state.shopcart.cnt > 0) {
      this.shopItem.lastQuantity = this.shopItem.count;
    }
    this.shopItem.id = this.articulo.id;
    this.shopItem.name = this.articulo.name;
    this.shopItem.price = this.articulo.price;
    this.shopItem.quantity = this.articulo.quantity;
  }
  private increment() {

    if (this.shopItem.count + 1 > this.articulo.quantity) {
    }
    else {
      this.shopItem.count += 1;
    }


  }

  private decrement() {
    if (this.shopItem.count > 0) {
      this.shopItem.count -= 1;
    }
  }


  private sendToCart() {
    let action;
    if ((this.shopItem.count > 0) || (this.shopItem.count == 0 && this.shopItem.lastQuantity != 0)) {
      if (this.shopItem.count <= this.shopItem.lastQuantity) {
        this.state.shopcart = this.shop.pullFromCart(this.state.shopcart, this.shopItem);
      } else if (this.shopItem.count == this.state.shopcart.lastQuantity) {
      }
      else {
        this.state.shopcart = this.shop.pushToCart(this.state.shopcart, this.shopItem);
      }


      action = new ShopcartAction(ShopcartActionTypes.PUSH, this.state.shopcart);
      this.store.dispatch(action);

      this.showToaster(this.shopItem);
      this.shopItem.lastQuantity = this.shopItem.count;
    }
  }

  showToaster(payload) {
    if (payload.lastQuantity < payload.count) {
      this.toastr.success('Se han añadido ' + (payload.count - payload.lastQuantity) + ' unidad/es de ' + payload.name + ' al carrito para hacer un total de ' + payload.count);
    } else if (payload.lastQuantity > payload.count) {
      this.toastr.success('Se han quitado ' + (payload.lastQuantity - payload.count) + ' unidad/es de ' + payload.name + ' del carrito para hacer un total de ' + payload.count);
    }
  }

  numero(id) {
    this.state.shopcart.items.forEach(x => {
      if (x.id == this.articulo.id) {
        this.shopItem.count = x.count;
      }
    }
    )

    return 0;
  }

  changes(id) {
    let a = (<HTMLInputElement>document.getElementById(id)).value;
    let b = <HTMLInputElement>document.getElementById(id);
    if (parseInt(a) <= this.shopItem.quantity) {
      this.shopItem.count = parseInt(a);
      b.value = this.shopItem.count + "";
    } else {
      b.value = this.shopItem.quantity + "";
      this.shopItem.count = this.shopItem.quantity;
    }

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}