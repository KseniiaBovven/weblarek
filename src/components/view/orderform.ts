import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IOrderFormData {
  payment: string;
  address: string;
  valid: boolean;
  errors: string;
}

export class OrderForm extends Component<IOrderFormData> {
  protected _paymentCard: HTMLButtonElement;
  protected _paymentCash: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Находим элементы в конструкторе
    this._paymentCard = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container
    );
    this._paymentCash = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container
    );
    this._addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );
    this._submitButton = ensureElement<HTMLButtonElement>(
      '.order__button',
      container
    );
    this._errors = ensureElement<HTMLElement>('.form__errors', container);

    // Обработчики выбора оплаты
    this._paymentCard.addEventListener('click', () => {
      this.events.emit('order:payment', { payment: 'card' });
    });

    this._paymentCash.addEventListener('click', () => {
      this.events.emit('order:payment', { payment: 'cash' });
    });

    // Обработчик ввода адреса
    this._addressInput.addEventListener('input', () => {
      this.events.emit('order:address', { address: this._addressInput.value });
    });

    // Обработчик отправки формы
    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });
  }

  set payment(value: string) {
    // Убираем активный класс с обеих кнопок
    this._paymentCard.classList.remove('button_alt-active');
    this._paymentCash.classList.remove('button_alt-active');

    // Добавляем активный класс выбранной кнопке
    if (value === 'card') {
      this._paymentCard.classList.add('button_alt-active');
    } else if (value === 'cash') {
      this._paymentCash.classList.add('button_alt-active');
    }
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }

  render(data: Partial<IOrderFormData>): HTMLElement {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.valid !== undefined) this.valid = data.valid;
    if (data.errors !== undefined) this.errors = data.errors;

    return this.container;
  }
}
