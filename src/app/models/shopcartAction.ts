import { ShopItem } from './ShopItem';
import { Action } from '@ngrx/store';

export class ShopcartAction implements Action {
    constructor(
        public type: string,
        public payload: ShopItem) {
    }
}