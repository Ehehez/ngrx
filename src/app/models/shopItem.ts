export class ShopItem {
    id: string; //Product ID
    name: string; //Product name
    count: number; //Counter
    price: number; //Cash summary
    quantity: number;
    public constructor(
        fields?: {
            id?: string,
            name?: string,
            count?: number,
            price?: number
            quantity?: number;
        }) {
        if (fields) {
            Object.assign(this, fields);
        } else {
            this.count = 0;
            this.price = 0;
        }
    }
}