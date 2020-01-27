import { Action, ActionReducer } from '@ngrx/store';
import { IShopCart } from '../../interfaces/IShopCart';
import { ShopCart } from '../../models/ShopCart';
import { ShopcartAction } from 'src/app/models/shopcartAction';

export const PUSH = 'PUSH';
export const PULL = 'PULL';
export const CLEAR = 'CLEAR';

export const shopcartReducer: ActionReducer<IShopCart> = (state: ShopCart = new ShopCart(), action: ShopcartAction) => {
    switch (action.type) {
        case PUSH:
            return state = action.payload;
        case PULL:
            return state = action.payload;
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