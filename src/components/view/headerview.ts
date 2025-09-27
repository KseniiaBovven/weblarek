import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IHeaderData {
    counter: number;
}

export class HeaderView extends Component<IHeaderData> {
    protected _counter: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basket = ensureElement<HTMLElement>('.header__basket', container);

        if (this._basket) {
            this._basket.addEventListener('click', () => {
                this.events.emit('basket:open');
            });
        }
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    render(data?: Partial<IHeaderData>): HTMLElement {
        if (data && data.counter !== undefined) {
            this.counter = data.counter;
        }
        return this.container;
    }
}