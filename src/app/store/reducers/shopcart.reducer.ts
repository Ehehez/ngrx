import { Action, ActionReducer } from '@ngrx/store';
import { IShopCart } from '../../interfaces/IShopCart';
import { ShopCart } from '../../models/ShopCart';
import { ShopcartAction } from 'src/app/models/shopcartAction';
import { All, ShopcartActionTypes } from '../actions/shopcart.actions';

export const shopcartReducer: ActionReducer<IShopCart> = (state: ShopCart = new ShopCart(), action: All) => {
    switch (action.type) {
        case ShopcartActionTypes.PULL:
            return state = action.payload;
        case ShopcartActionTypes.CLEAR:
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