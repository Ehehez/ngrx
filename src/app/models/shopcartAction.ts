import { ShopItem } from './ShopItem';
import { Action } from '@ngrx/store';
import { ShopCart } from './ShopCart';

export class ShopcartAction implements Action {
    constructor(
        public type: string,
        public payload?: ShopCart) {
    }
}