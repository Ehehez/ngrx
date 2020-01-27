import { Action, ActionReducer } from '@ngrx/store';
import { IShopCart } from '../../interfaces/IShopCart';
import { ShopCart } from '../../models/ShopCart';
import { ShopItem } from '../../models/ShopItem';
import { ShopcartAction } from 'src/app/models/shopcartAction';

export const PUSH = 'PUSH';
export const PULL = 'PULL';
export const CLEAR = 'CLEAR';

export const shopcartReducer: ActionReducer<IShopCart> = (state: ShopCart = new ShopCart(), action: ShopcartAction) => {
    switch (action.type) {
        case PUSH:
            return pushToCart(state, action.payload);

        case PULL:
            return pullFromCart(state, action.payload);

        case CLEAR:
            state.items = [];
            state.cnt = 0;
            state.sum = 0;
            return state;

        default:
            return state;
    }
}

export interface State {
    items: [];
    cnt: number;
    sum: number;
}

export function pushToCart(shopcart: ShopCart, payload: ShopItem) {
    shopcart.cnt += payload.count - payload.lastQuantity;
    shopcart.sum += payload.price * (payload.count - payload.lastQuantity);
    updateItems(shopcart, payload);
    return shopcart;
}

export function pullFromCart(shopcart: ShopCart, payload: ShopItem) {
    shopcart.cnt -= payload.lastQuantity - payload.count;
    shopcart.sum -= payload.price * (payload.lastQuantity - payload.count);
    updateItems(shopcart, payload);
    return shopcart;
}

function updateItems(shopcart: ShopCart, payload: ShopItem) {
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


}