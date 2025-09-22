import { IBuyer, TPayment } from '../../types';

export class BuyerModel {
    private payment: TPayment | null = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    // Сохраняет данные покупателя
    setBuyerData(data: Partial<IBuyer>): void {
        if (data.payment) this.payment = data.payment;
        if (data.address) this.address = data.address;
        if (data.phone) this.phone = data.phone;
        if (data.email) this.email = data.email;
    }

    // Возвращает все данные
    getBuyerData(): IBuyer {
        if (!this.payment) {
            throw new Error('Payment method is not set');
        }
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    // Очищает данные
    clear(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    // Валидация данных
    validate(): { [field in keyof IBuyer]?: string } {
        const errors: { [field in keyof IBuyer]?: string } = {};
        
        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.address.trim()) errors.address = 'Укажите адрес доставки';
        if (!this.phone.trim()) errors.phone = 'Укажите номер телефона';
        if (!this.email.trim()) errors.email = 'Укажите адрес электронной почты';
        
        return errors;
    }
}