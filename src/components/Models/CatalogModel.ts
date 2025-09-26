import { IProduct } from '../../types';
import { Model } from '../base/Model';

interface ICatalogData {
    products: IProduct[];
    selectedProduct: IProduct | null;
}

export class CatalogModel extends Model<ICatalogData> {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor(events: any) {
        super({ products: [], selectedProduct: null }, events);
    }

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.emitChanges('catalog:updated', { 
            products: this._products,
            selectedProduct: this._selectedProduct
        });
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProductById(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this.emitChanges('product:selected', { 
            products: this._products,
            selectedProduct: this._selectedProduct
        });
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }

    clearSelectedProduct(): void {
        this._selectedProduct = null;
        this.emitChanges('product:selected', { 
            products: this._products,
            selectedProduct: null
        });
    }
}