# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с компонентами приложения
- src/components/base/ — базовые классы и утилиты
- src/components/Models/ — классы моделей данных
- src/components/view/ — классы представления
- src/components/presenter/ — презентер для связи данных и представления
- src/components/Services/ — сервисы для работы с API
- src/types/ — файл с типами и интерфейсами
- src/utils/ — утилиты и константы
- src/main.ts — точка входа приложения
- src/scss/ — стили приложения
- index.html — главная страница приложения

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
```typescript
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}
    
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }
    
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }
    
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) element.alt = alt;
        }
    }
    
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
```


#### Класс Api
Содержит в себе базовую логику отправки запросов.
```typescript
export class Api implements IApi {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...((options.headers as object) ?? {}),
            },
        };
    }
    
    get<T extends object>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET',
        }).then(this.handleResponse<T>);
    }
    
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data),
        }).then(this.handleResponse<T>);
    }
}
```
#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.
```typescript
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }
}
```

## Данные
### Интерфейсы данных 
В приложении используются две сущности, которые описывают данные, — товар и покупатель. Их можно описать такими интерфейсами:
```typescript
  interface IProduct {
    id: string;           // Уникальный идентификатор товара
    description: string;  // Подробное описание товара
    image: string;        // Ссылка на изображение товара
    title: string;        // Название товара
    category: string;     // Категория, к которой принадлежит товар
    price: number | null; // Цена товара (может быть null, если цена не определена)
  }
  
  // Данные покупателя
  interface IBuyer {
    payment: TPayment; // Выбранный способ оплаты
    email: string;     // Адрес электронной почты
    phone: string;     // Номер телефона
    address: string;   // Адрес доставки
  }
```
## Модели данных
Для управления состоянием приложения реализованы три модели, отвечающие за хранение и обработку данных.

### Класс CatalogModel
Назначение: Модель представляет собой список всех товаров на главной странице. Отвечает за хранение каталога товаров и управление состоянием выбранного товара для подробного просмотра.
```typescript
export class CatalogModel extends Model<ICatalogData> {
    private _products: IProduct[] = [];

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.emitChanges('catalog:updated', { 
            products: this._products,
            selectedProduct: this._selectedProduct
        });
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProductById(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }
}
```
### Класс CartModel
Назначение: Модель управляет корзиной покупок: добавлением, удалением товаров, подсчетом общей стоимости и количества.
Конструктор не принимает параметров. Инициализирует модель с пустой корзиной.
```typescript
export class CartModel extends Model<ICartData> {
    private _items: IProduct[] = [];

    addItem(product: IProduct): void {
        this._items.push(product);
        this.emitChanges('cart:updated', this.getCartData());
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.emitChanges('cart:updated', this.getCartData());
    }

    getTotalPrice(): number {
        return this._items.reduce((total, product) => total + (product.price || 0), 0);
    }
}
```
### Класс BuyerModel
Назначение: Модель хранит и валидирует контактные данные и данные о доставке, введенные пользователем при оформлении заказа.
```typescript
export class BuyerModel extends Model<IBuyer> {
    private _payment: TPayment = null;
    private _address: string = '';
    private _phone: string = '';
    private _email: string = '';

    setBuyerData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        if (data.phone !== undefined) this._phone = data.phone;
        if (data.email !== undefined) this._email = data.email;

        this.emitChanges('buyer:updated', this.getBuyerData());
    }

    validateOrder(): FormErrors {
        const errors: FormErrors = {};
        if (!this._payment) errors.payment = 'Не выбран вид оплаты';
        if (!this._address.trim()) errors.address = 'Укажите адрес доставки';
        return errors;
    }
}
```

## Слой коммуникации

### Класс ShopAPI

**Назначение:** Класс отвечает за взаимодействие с API сервера «веб-ларёк». Инкапсулирует логику получения данных о товарах и отправки заказов.

**Конструктор:**
- `constructor(api: IApi)` - принимает экземпляр класса, реализующего интерфейс IApi, для выполнения HTTP-запросов

**Методы класса:**
- `getProductList(): Promise<IProduct[]>` - выполняет GET-запрос к эндпоинту `/product/` и возвращает массив товаров
- `createOrder(orderData: IOrderRequest): Promise<OrderResult>` - выполняет POST-запрос к эндпоинту `/order/`, передает данные заказа и возвращает результат

**Принцип работы:**
- Использует композицию, делегируя выполнение запросов переданному объекту API
- Преобразует данные в необходимые форматы перед отправкой на сервер
- Обрабатывает ошибки сетевых запросов

## Слой представления

### Page
Главная страница приложения.

```typescript
export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _gallery: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set gallery(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }
}
```
### ProductCard
Карточка товара.

```typescript
export class ProductCard extends CardView {
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._button.addEventListener('click', (event) => {
            event.stopPropagation();
            this.events.emit(this._inBasket ? 'card:remove' : 'basket:add', {
                id: this._cardId
            });
        });
    }

    set inBasket(value: boolean) {
        this._inBasket = value;
        if (this._button) {
            this.setText(this._button, value ? 'Убрать' : 'В корзину');
        }
    }
}
```
### Basket
Корзина покупок.

```typescript
export class Basket extends Component<IBasketData> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._button.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(items: IProduct[]) {
        // Безопасное создание элементов через DOM API
        while (this._list.firstChild) {
            this._list.removeChild(this._list.firstChild);
        }
        
        items.forEach((item, index) => {
            const itemElement = this.createBasketItem(item, index + 1);
            this._list.appendChild(itemElement);
        });
    }
}
```
### AppPresenter
Связывает все компоненты приложения.

```typescript
export class AppPresenter {
    private page: Page;
    private modal: Modal;
    private basket: Basket;
    private orderForm: OrderForm;
    private contactForm: ContactForm;

    constructor(
        private api: ShopAPI,
        private catalogModel: CatalogModel,
        private cartModel: CartModel,
        private buyerModel: BuyerModel,
        private events: IEvents
    ) {
        this.setupEventListeners();
        this.initializeApp();
    }

    private setupEventListeners(): void {
        this.events.on('catalog:updated', () => {
            this.renderCatalog();
        });

        this.events.on('basket:add', (data: { id: string }) => {
            const product = this.catalogModel.getProductById(data.id);
            if (product) {
                this.cartModel.addItem(product);
            }
        });

        this.events.on('order:submit', () => {
            if (this.buyerModel.isOrderValid()) {
                this.openContactForm();
            }
        });
    }

    private async initializeApp(): Promise<void> {
        const products = await this.api.getProductList();
        this.catalogModel.setProducts(products);
    }
}
```
## Список событий
### События данных
`catalog:updated` - обновление каталога товаров
`cart:updated` - изменение корзины
`buyer:updated` - обновление данных покупателя

### События интерфейса
`product:select` - выбор товара для просмотра
`basket:add` - добавление товара в корзину
`basket:remove` - удаление товара из корзины
`order:open` - открытие формы заказа
`order:submit` - отправка формы заказа
`contacts:submit` - отправка контактной формы

## Процессы приложения
### Загрузка товаров
Приложение инициализируется в `main.ts`
`AppPresenter` загружает товары через `ShopAPI`
Данные сохраняются в `CatalogModel`
Генерируется событие `catalog:updated`
`AppPresenter` отображает каталог через `Page`

## Добавление в корзину
Пользователь нажимает "В корзину" в `ProductCard`
Генерируется событие `basket:add`
`AppPresenter` добавляет товар в `CartModel`
`CartModel` генерирует `cart:updated`
Обновляется счетчик корзины и интерфейс

## Оформление заказа
Пользователь открывает корзину → `basket:open`
Нажимает "Оформить" → `order:open`
Заполняет данные заказа → `order:payment`, `order:address`
Отправляет форму → `order:submit`
После валидации открывается контактная форма
Заполняет контакты → `contacts:email`, `contacts:phone`
Отправляет заказ → `contacts:submit`
`AppPresenter` создает заказ через `ShopAPI`
Показывает подтверждение заказа

## Валидация форм
Валидация выполняется с помощью `FormValidator` при отправке форм. Ошибки отображаются под полями ввода, кнопки блокируются до исправления ошибок.