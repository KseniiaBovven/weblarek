import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<object> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Открываем модальное окно
    open(content?: HTMLElement): void {
        if (content) {
            this._content.replaceChildren(content);
        }
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this._handleEscape.bind(this));
        this.events.emit('modal:open');
        this.events.emit('page:locked', { locked: true });
    }

    // Закрываем модальное окно
    close(): void {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        document.removeEventListener('keydown', this._handleEscape.bind(this));
        this.events.emit('modal:close');
        this.events.emit('page:locked', { locked: false });
    }

    // Обработчик клавиши Escape
    private _handleEscape(evt: KeyboardEvent): void {
        if (evt.key === 'Escape') {
            this.close();
        }
    }
    
    render(): HTMLElement {
        return this.container;
    }
}