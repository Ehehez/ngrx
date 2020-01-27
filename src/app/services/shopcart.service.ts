import { Injectable } from '@angular/core';
import { ShopCart } from '../models/ShopCart';
import { ShopItem } from '../models/ShopItem';

@Injectable({
  providedIn: 'root'
})
export class ShopcartService {

  constructor() { }

  pushToCart(shopcart: ShopCart, payload: ShopItem) {
    shopcart.cnt += payload.count - payload.lastQuantity;
    shopcart.sum += payload.price * (payload.count - payload.lastQuantity);
    this.updateItems(shopcart, payload);
    return shopcart;
  }

  pullFromCart(shopcart: ShopCart, payload: ShopItem) {
    shopcart.cnt -= payload.lastQuantity - payload.count;
    shopcart.sum -= payload.price * (payload.lastQuantity - payload.count);
    this.updateItems(shopcart, payload);
    return shopcart;
  }

  updateItems(shopcart: ShopCart, payload: ShopItem) {
    let targetItem = shopcart.items.find(item => item.id === payload.id);
    if (targetItem) { //Exist
      if (payload.count <= 0) {
        var index = shopcart.items.indexOf(targetItem);
        shopcart.items.splice(index, 1);
      }
      else {
        targetItem.count = payload.count;
      }
    }
    else { //First time adding to shopping cart
      shopcart.items.push(payload);
    }

    return shopcart;
  }

}

