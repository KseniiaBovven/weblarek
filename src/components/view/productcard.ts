import { CardView } from './CardView';
import { IEvents } from '../base/Events';

interface IProductCard {
    id: string;
    title: string;
    category: string;
    price: number | null;
    image: string;
    description?: string;
    inBasket?: boolean;
}

export class ProductCard extends CardView {
    protected _description: HTMLElement | null;
    protected _button: HTMLButtonElement | null;
    protected _cardId: string = '';
    protected _inBasket: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._description = container.querySelector('.card__text');
        this._button = container.querySelector('.card__button');

        this.container.addEventListener('click', () => {
            if (this._cardId) {
                this.events.emit('product:select', { id: this._cardId });
            }
        });

        if (this._button) {
            this._button.addEventListener('click', (event) => {
                event.stopPropagation();
                if (this._cardId) {
                    this.events.emit(this._inBasket ? 'card:remove' : 'basket:add', {
                        id: this._cardId
                    });
                }
            });
        }
    }

    set id(value: string) {
        this._cardId = value;
    }

    set description(value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }

    set inBasket(value: boolean) {
        this._inBasket = value;
        if (this._button) {
            this.setText(this._button, value ? 'Убрать' : 'В корзину');
        }
    }

    set price(value: number | null) {
        super.price = value;
        if (this._button) {
            this._button.style.display = value === null ? 'none' : 'block';
        }
    }

    render(data: Partial<IProductCard>): HTMLElement {
        if (data.id) this.id = data.id;
        if (data.title) this.title = data.title;
        if (data.category) this.category = data.category;
        if (data.price !== undefined) this.price = data.price;
        if (data.image) this.image = data.image;
        if (data.description) this.description = data.description;
        if (data.inBasket !== undefined) this.inBasket = data.inBasket;

        return this.container;
    }
}