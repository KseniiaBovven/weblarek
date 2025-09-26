import { IEvents } from './Events';

/**
 * Базовый класс модели для наследования
 */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    /**
     * Сообщить об изменении в модели
     */
    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }
}