import { ActionReducer } from '@ngrx/store';
import { IShopCart } from '../../interfaces/IShopCart';
import { ShopCart } from '../../models/ShopCart';
import { All, ShopcartActionTypes } from './shopcart.actions';

export const shopcartReducer: ActionReducer<IShopCart> = (state: ShopCart = new ShopCart(), action: All) => {
    switch (action.type) {
        case ShopcartActionTypes.PULL:
            state = action.payload;
            return { ...state };
        case ShopcartActionTypes.CLEAR:
            return initialState;
        default:
            return { ...state };
    }
}

export interface State {
    items: [];
    cnt: number;
    sum: number;
}

export const initialState: State = {
    items: [],
    cnt: 0,
    sum: 0
};