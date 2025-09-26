import { IBuyer, TPayment, FormErrors } from '../../types';
import { Model } from '../base/Model';

export class BuyerModel extends Model<IBuyer> {
    private _payment: TPayment = null;
    private _address: string = '';
    private _phone: string = '';
    private _email: string = '';

    constructor(events: any) {
        super({ 
            payment: null, 
            address: '', 
            phone: '', 
            email: '' 
        }, events);
    }

    setBuyerData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        if (data.phone !== undefined) this._phone = data.phone;
        if (data.email !== undefined) this._email = data.email;

        this.emitChanges('buyer:updated', this.getBuyerData());
    }

    getBuyerData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            phone: this._phone,
            email: this._email,
        };
    }

    clear(): void {
        this._payment = null;
        this._address = '';
        this._phone = '';
        this._email = '';
        this.emitChanges('buyer:updated', this.getBuyerData());
    }

    validateOrder(): FormErrors {
        const errors: FormErrors = {};
        
        if (!this._payment) errors.payment = 'Не выбран вид оплаты';
        if (!this._address.trim()) errors.address = 'Укажите адрес доставки';
        
        return errors;
    }

    validateContacts(): FormErrors {
        const errors: FormErrors = {};
        
        if (!this._phone.trim()) errors.phone = 'Укажите номер телефона';
        if (!this._email.trim()) errors.email = 'Укажите адрес электронной почты';
        
        return errors;
    }

    isOrderValid(): boolean {
        return Object.keys(this.validateOrder()).length === 0;
    }

    isContactsValid(): boolean {
        return Object.keys(this.validateContacts()).length === 0;
    }
}