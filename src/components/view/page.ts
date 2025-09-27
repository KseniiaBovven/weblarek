import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { HeaderView } from './HeaderView'; // Добавляем импорт

interface IPage {
    counter: number;
    gallery: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _gallery: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _header: HeaderView; 

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        const headerContainer = ensureElement<HTMLElement>('.header', container);
        this._header = new HeaderView(headerContainer, events);
        
        this._gallery = ensureElement<HTMLElement>('.gallery', container);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);

    }

    set counter(value: number) {
        this._header.counter = value; 
    }

    set gallery(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }

    render(data?: Partial<IPage>): HTMLElement {
        if (data) {
            if (data.counter !== undefined) this.counter = data.counter;
            if (data.gallery !== undefined) this.gallery = data.gallery;
            if (data.locked !== undefined) this.locked = data.locked;
        }
        return this.container;
    }
}