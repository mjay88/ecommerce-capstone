export class CartItem {
    id: string;
    name: string;
    imageUrl: string;
    unitPrice: number;

    quantity: number;
    constructor(id: string, name: string, imageUrl: string, unitPrice: number, quantity: number) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }
}
