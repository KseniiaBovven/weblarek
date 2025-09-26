import { IProduct } from '../types';
import { cloneTemplate } from './utils';


export function createProductCard(
    product: IProduct, 
    templateId: string
): HTMLElement {
    const element = cloneTemplate(templateId);
    
    // Заполняем данные карточки
    const title = element.querySelector('.card__title');
    const price = element.querySelector('.card__price');
    const image = element.querySelector('.card__image');
    const category = element.querySelector('.card__category');
    
    if (title) title.textContent = product.title;
    if (price) price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
    if (image && image instanceof HTMLImageElement) {
        image.src = product.image;
        image.alt = product.title;
    }
    if (category) category.textContent = product.category;
    
    return element;
}