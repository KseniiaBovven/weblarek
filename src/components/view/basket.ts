import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';

interface IBasketData {
    items: IProduct[];
    total: number;
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

        this._list.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const itemElement = target.closest('.basket__item');
            
            if (itemElement && target.classList.contains('basket__item-delete')) {
                const id = itemElement.getAttribute('data-id');
                if (id) {
                    events.emit('basket:remove', { id });
                }
            }
        });
    }

    set items(items: IProduct[]) {
        while (this._list.firstChild) {
            this._list.removeChild(this._list.firstChild);
        }

        if (!items || items.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            this._list.appendChild(emptyMessage);
            this.setDisabled(this._button, true);
        } else {
            items.forEach((item, index) => {
                const itemElement = this.createBasketItem(item, index + 1);
                this._list.appendChild(itemElement);
            });
            this.setDisabled(this._button, false);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    private createBasketItem(item: IProduct, index: number): HTMLElement {
        const template = cloneTemplate('#card-basket');
        const title = template.querySelector('.card__title');
        const price = template.querySelector('.card__price');
        const indexElement = template.querySelector('.basket__item-index');
        const deleteButton = template.querySelector('.basket__item-delete');
        
        if (title) title.textContent = item.title;
        if (price) price.textContent = item.price ? `${item.price} синапсов` : 'Бесценно';
        if (indexElement) indexElement.textContent = String(index);
        
        template.setAttribute('data-id', item.id);
        
        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.events.emit('basket:remove', { id: item.id });
            });
        }
        
        return template;
    }

    render(data: IBasketData): HTMLElement {
        if (data.items) this.items = data.items;
        if (data.total !== undefined) this.total = data.total;
        return this.container;
    }
}