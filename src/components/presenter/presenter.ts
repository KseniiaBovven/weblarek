import { IEvents } from '../base/Events';
import { ShopAPI } from '../Services/ShopAPI';
import { CatalogModel } from '../Models/CatalogModel';
import { CartModel } from '../Models/CartModel';
import { BuyerModel } from '../Models/BuyerModel';
import { Page } from '../view/Page';
import { Modal } from '../view/Modal';
import { ProductCard } from '../view/ProductCard';
import { Basket } from '../view/Basket';
import { OrderForm } from '../view/OrderForm';
import { ContactForm } from '../view/ContactForm';
import { SuccessView } from '../view/successform';
import { IOrderRequest } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { FormValidator } from '../../utils/FormValidator';

export class AppPresenter {
  private page: Page;
  private modal: Modal;
  private basket: Basket;
  private orderForm: OrderForm;
  private contactForm: ContactForm;
  private success: SuccessView;

  constructor(
    private api: ShopAPI,
    private catalogModel: CatalogModel,
    private cartModel: CartModel,
    private buyerModel: BuyerModel,
    private events: IEvents
  ) {
    this.page = new Page(ensureElement('.page'), events);
    this.modal = new Modal(ensureElement('#modal-container'), events);
    this.basket = new Basket(cloneTemplate('#basket'), events);
    this.orderForm = new OrderForm(cloneTemplate('#order'), events);
    this.contactForm = new ContactForm(cloneTemplate('#contacts'), events);
    this.success = new SuccessView(cloneTemplate('#success'), events);

    this.setupEventListeners();
    this.initializeApp();
  }

  private setupEventListeners(): void {
    this.events.on('catalog:updated', () => {
      this.renderCatalog();
    });

    this.events.on('product:select', (data: { id: string }) => {
      this.openProductModal(data.id);
    });

    this.events.on('cart:updated', (data: any) => {
      this.basket.render(data);
      this.page.counter = data.count || 0;
    });

    this.events.on('basket:add', (data: { id: string }) => {
      const product = this.catalogModel.getProductById(data.id);
      if (product) {
        this.cartModel.addItem(product);
        this.modal.close();
      }
    });

    this.events.on('basket:remove', (data: { id: string }) => {
      this.cartModel.removeItem(data.id);
    });

    this.events.on('card:remove', (data: { id: string }) => {
      this.cartModel.removeItem(data.id);
      this.modal.close();
    });

    this.events.on('basket:open', () => {
      this.modal.open(
        this.basket.render({
          items: this.cartModel.getItems(),
          total: this.cartModel.getTotalPrice(),
        })
      );
    });

    this.events.on('order:open', () => {
      this.buyerModel.clear();
      this.openOrderForm();
    });

    this.events.on('order:payment', (data: { payment: string }) => {
      this.buyerModel.setBuyerData({ payment: data.payment as any });
      this.updateOrderForm();
    });

    this.events.on('order:address', (data: { address: string }) => {
      this.buyerModel.setBuyerData({ address: data.address });
      this.updateOrderForm();
    });

    this.events.on('order:submit', () => {
      if (this.buyerModel.isOrderValid()) {
        this.openContactForm();
      }
    });

    this.events.on('contacts:email', (data: { email: string }) => {
      this.buyerModel.setBuyerData({ email: data.email });
      this.updateContactForm();
    });

    this.events.on('contacts:phone', (data: { phone: string }) => {
      this.buyerModel.setBuyerData({ phone: data.phone });
      this.updateContactForm();
    });

    this.events.on('contacts:submit', () => {
      if (this.buyerModel.isContactsValid()) {
        this.submitOrder();
      }
    });

    this.events.on('success:close', () => {
      this.modal.close();
    });

    this.events.on('modal:open', () => {
      this.events.emit('page:locked', { locked: true });
    });

    this.events.on('modal:close', () => {
      this.events.emit('page:locked', { locked: false });
    });

    this.events.on('page:locked', (data: { locked: boolean }) => {
      this.page.locked = data.locked;
    });
  }

  private async initializeApp(): Promise<void> {
    try {
      const products = await this.api.getProductList();
      console.log('Товары с сервера:', products);

      if (products.length > 0) {
        console.log('Пример товара:', {
          id: products[0].id,
          title: products[0].title,
          image: products[0].image,
          hasImage: !!products[0].image,
        });
      }

      const productsWithCDN = products.map((product) => {
        const fullImageUrl = product.image ? `${CDN_URL}${product.image}` : '';
        console.log(` ${product.title}: ${product.image} -> ${fullImageUrl}`);
        return {
          ...product,
          image: fullImageUrl,
        };
      });

      this.catalogModel.setProducts(productsWithCDN);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  }

  private renderCatalog(): void {
    const products = this.catalogModel.getProducts();
    const catalogItems = products.map((product) => {
      const element = cloneTemplate('#card-catalog');
      const card = new ProductCard(element, this.events);
      const inBasket = this.cartModel.hasItem(product.id);

      return card.render({
        ...product,
        inBasket: inBasket,
      });
    });

    this.page.gallery = catalogItems;
    this.events.on('cart:updated', (data: any) => {
    this.basket.render(data);
    this.page.counter = data.count || 0; 
    });

  }

  private openProductModal(productId: string): void {
    const product = this.catalogModel.getProductById(productId);
    if (!product) return;

    const element = cloneTemplate('#card-preview');
    const card = new ProductCard(element, this.events);
    const inBasket = this.cartModel.hasItem(product.id);

    this.modal.open(
      card.render({
        ...product,
        inBasket: inBasket,
      })
    );
  }

  private openOrderForm(): void {
    const buyerData = this.buyerModel.getBuyerData();
    const isValid = this.buyerModel.isOrderValid();

    const formData = {
      payment: buyerData.payment || '',
      address: buyerData.address,
      valid: isValid,
      errors: '',
    };

    this.modal.open(this.orderForm.render(formData));
  }

  private updateOrderForm(): void {
    const buyerData = this.buyerModel.getBuyerData();
    const errors = this.buyerModel.validateOrder();
    const isValid = this.buyerModel.isOrderValid();

    const formData = {
      payment: buyerData.payment || '',
      address: buyerData.address,
      valid: isValid,
      errors: FormValidator.getErrorMessage(errors),
    };

    this.orderForm.render(formData); 
  }

  private openContactForm(): void {
    const buyerData = this.buyerModel.getBuyerData();
    const isValid = this.buyerModel.isContactsValid();

    const formData = {
      email: buyerData.email,
      phone: buyerData.phone,
      valid: isValid,
      errors: '',
    };

    this.modal.open(this.contactForm.render(formData));
  }

  private updateContactForm(): void {
    const buyerData = this.buyerModel.getBuyerData();
    const errors = this.buyerModel.validateContacts();
    const isValid = this.buyerModel.isContactsValid();

    const formData = {
      email: buyerData.email,
      phone: buyerData.phone,
      valid: isValid,
      errors: FormValidator.getErrorMessage(errors),
    };

    this.contactForm.render(formData); 
  }

  private async submitOrder(): Promise<void> {
    try {
      const orderData: IOrderRequest = {
        ...this.buyerModel.getBuyerData(),
        items: this.cartModel.getItemIds(),
        total: this.cartModel.getTotalPrice(),
      };

      const result = await this.api.createOrder(orderData);

      this.cartModel.clear();
      this.buyerModel.clear();

      this.modal.open(
        this.success.render({
          total: result.total,
        })
      );
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      this.contactForm.errors = 'Ошибка оформления заказа. Попробуйте еще раз.';
    }
  }
}
