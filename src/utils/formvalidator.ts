import { IBuyer, FormErrors } from '../types';

export class FormValidator {
    static validateOrder(order: Partial<IBuyer>): FormErrors {
        const errors: FormErrors = {};
        if (!order.payment) errors.payment = 'Выберите способ оплаты';
        if (!order.address?.trim()) errors.address = 'Укажите адрес доставки';
        return errors;
    }

    static validateContacts(order: Partial<IBuyer>): FormErrors {
        const errors: FormErrors = {};
        if (!order.email?.trim()) errors.email = 'Укажите email';
        if (!order.phone?.trim()) errors.phone = 'Укажите телефон';
        return errors;
    }

    static getErrorMessage(errors: FormErrors): string {
        const errorMessages = Object.values(errors);
        if (errorMessages.length === 0) return '';
        if (errorMessages.length === 1) return errorMessages[0];
        return errorMessages.join('; ');
    }
}