import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils'; 

export class CardView extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);
     
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.className = 'card__category';
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this._category.classList.add(categoryClass);
        }
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    }

    set image(src: string) {
        this.setImage(this._image, src, this._title.textContent || '');
    }
}