import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IContactFormData {
  email: string;
  phone: string;
  valid: boolean;
  errors: string;
}

export class ContactForm extends Component<IContactFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    );
    this._phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    );
    this._submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );
    this._errors = ensureElement<HTMLElement>('.form__errors', container);
    
    this._emailInput.addEventListener('input', () => {
      this.events.emit('contacts:email', { email: this._emailInput.value });
    });

    this._phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:phone', { phone: this._phoneInput.value });
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('contacts:submit');
    });
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }

  render(data: Partial<IContactFormData>): HTMLElement {
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.valid !== undefined) this.valid = data.valid;
    if (data.errors !== undefined) this.errors = data.errors;

    return this.container;
  }
}
