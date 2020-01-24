import { ShopItem } from '../models/ShopItem';

export interface IShopCart {
    items: ShopItem[];
    cnt: number; //total booking counter
    sum: number; //total cost
}