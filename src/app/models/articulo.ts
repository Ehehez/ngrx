import { Image } from './images';

export class Articulo {
    id: any;
    name?: string;
    price: any;
    quantity: number;
    idCategoria: number;
    url?: string;
    Images: Image[];
}

