import { IProduct } from '../../types';

export class CatalogModel {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    // Сохраняет массив товаров
    setProducts(products: IProduct[]): void {
        this.products = products;
    }

    // Возвращает массив всех товаров
    getProducts(): IProduct[] {
        return this.products;
    }

    // Находит товар по ID
    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    // Сохраняет выбранный товар
    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    // Возвращает выбранный товар
    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}