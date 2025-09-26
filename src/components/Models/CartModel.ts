import { IProduct } from '../../types';
import { Model } from '../base/Model';

// Создаем интерфейс для данных корзины
interface ICartData {
    items: IProduct[];
    total: number;
    count: number;
}

export class CartModel extends Model<ICartData> {
    private _items: IProduct[] = [];

    constructor(events: any) {
        super({ items: [], total: 0, count: 0 }, events);
    }

    addItem(product: IProduct): void {
        this._items.push(product);
        this.emitChanges('cart:updated', this.getCartData());
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.emitChanges('cart:updated', this.getCartData());
    }

    clear(): void {
        this._items = [];
        this.emitChanges('cart:updated', this.getCartData());
    }

    private getCartData(): ICartData {
        return {
            items: this._items,
            total: this.getTotalPrice(),
            count: this.getItemCount()
        };
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getTotalPrice(): number {
        return this._items.reduce((total, product) => total + (product.price || 0), 0);
    }
    
    getItemCount(): number {
        return this._items.length;
    }

    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    getItemIds(): string[] {
        return this._items.map(item => item.id);
    }
}