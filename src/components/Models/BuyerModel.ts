import { IBuyer, TPayment } from '../../types'; 

export class BuyerModel { 
    private payment: TPayment | null = null; 
    private address: string = ''; 
    private phone: string = ''; 
    private email: string = ''; 

    setBuyerData(data: Partial<IBuyer>): void { 
        if (data.payment !== undefined) this.payment = data.payment; 
        if (data.address !== undefined) this.address = data.address; 
        if (data.phone !== undefined) this.phone = data.phone; 
        if (data.email !== undefined) this.email = data.email; 
    } 

    getBuyerData(): IBuyer { 
        return { 
            payment: this.payment as TPayment, 
            address: this.address, 
            phone: this.phone, 
            email: this.email, 
        }; 
    } 

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