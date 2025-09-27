import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';

interface IBasketData {
    items: IProduct[];
    total: number;
}

class BasketItem extends Component<{item: IProduct, index: number}> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this._deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const id = this.container.getAttribute('data-id');
            if (id) {
                this.events.emit('basket:remove', { id });
            }
        });
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    }

    set index(value: number) {
        this.setText(this._index, String(value));
    }

    render(data: {item: IProduct, index: number}): HTMLElement {
        if (data.item) {
            this.container.setAttribute('data-id', data.item.id);
            this.title = data.item.title;
            this.price = data.item.price;
            this.index = data.index;
        }
        return this.container;
    }
}

export class Basket extends Component<IBasketData> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:open');
        });

    }

    set items(items: IProduct[]) {
        this._list.replaceChildren();

        if (!items || items.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            this._list.appendChild(emptyMessage);
            this.setDisabled(this._button, true);
        } else {
            const itemElements = items.map((item, index) => {
                const element = cloneTemplate('#card-basket');
                const basketItem = new BasketItem(element, this.events);
                return basketItem.render({ item, index: index + 1 });
            });

            this._list.append(...itemElements);
            this.setDisabled(this._button, false);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    render(data: IBasketData): HTMLElement {
        if (data.items) this.items = data.items;
        if (data.total !== undefined) this.total = data.total;
        return this.container;
    }
}