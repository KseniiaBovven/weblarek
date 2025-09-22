import { IProduct } from '../../types';

export class CartModel {
    private items: IProduct[] = [];
    
    // Возвращает товары в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавляет товар в корзину
    addItem(product: IProduct): void {
        this.items.push(product);
    }

    // Удаляет товар из корзины
    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    // Очищает корзину
    clear(): void {
        this.items = [];
    }

    // Считает общую стоимость
    getTotalPrice(): number {
        return this.items.reduce((total, product) => total + (product.price || 0), 0);
    }
    
    // Возвращает количество товаров
    getItemCount(): number {
        return this.items.length;
    }

    // Проверяет наличие товара
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}