export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiError {
    error: string;
}

// Тип для способа оплаты
export type TPayment = 'card' | 'cash' | null;

// Данные товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Данные покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Интерфейс для отправки заказа
export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];
  total: number;
}

// Результат создания заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// Ответ сервера с товарами
export interface IProductListResponse {
  items: IProduct[];
}

// Тип для ошибок формы
export type FormErrors = Partial<Record<keyof IBuyer, string>>;