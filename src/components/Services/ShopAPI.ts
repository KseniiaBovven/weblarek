import { IApi, IProduct, IOrderRequest, IOrderResult, IProductListResponse } from '../../types';

export class ShopAPI {
    constructor(private api: IApi) {}

    async getProductList(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<IProductListResponse>('/product');
            return response.items;
        } catch (error) {
            console.error('Ошибка при получении списка товаров:', error);
            return [];
        }
    }

    async createOrder(orderData: IOrderRequest): Promise<IOrderResult> {
        try {
            const response = await this.api.post<IOrderResult>('/order', orderData);
            return response;
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            throw error;
        }
    }
}