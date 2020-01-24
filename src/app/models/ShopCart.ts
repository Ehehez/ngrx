import { IShopCart } from '../interfaces/IShopCart';
import { ShopItem } from './ShopItem';

export class ShopCart implements IShopCart {
    items: ShopItem[];
    cnt: number;
    sum: number;

    constructor() {
        this.items = [];
        this.cnt = 0;
        this.sum = 0;
    }
}