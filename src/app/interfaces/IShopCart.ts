import { ShopItem } from '../models/ShopItem';

export interface IShopCart {
    items: ShopItem[];
    cnt: number;
    sum: number;
}