import './scss/styles.scss';

import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { ShopAPI } from './components/Services/ShopAPI';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

// Функция тестирования моделей
function testModels() {
    console.log('ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ');

    const catalogModel = new CatalogModel();
    catalogModel.setProducts(apiProducts.items);
    console.log('CatalogModel: товаров сохранено', catalogModel.getProducts().length);

    const products = catalogModel.getProducts();
    if (products.length > 0) {
        const cartModel = new CartModel();
        cartModel.addItem(products[0]);
        console.log('CartModel: товар добавлен в корзину, итого:', cartModel.getItemCount());
    }

    const buyerModel = new BuyerModel();
    buyerModel.setBuyerData({
        payment: 'card',
        email: 'test@example.com',
        phone: '+79991234567',
        address: 'Тестовый адрес'
    });
    console.log('BuyerModel: данные покупателя сохранены');

    console.log('ТЕСТИРОВАНИЕ МОДЕЛЕЙ ЗАВЕРШЕНО');
}

async function testServerIntegration() {
    console.log('ТЕСТИРОВАНИЕ РАБОТЫ С СЕРВЕРОМ');

    try {
        const api = new Api(API_URL || 'https://example.com/api');
        const shopAPI = new ShopAPI(api);
        const catalogModel = new CatalogModel();

        console.log('Загружаем товары с сервера...');
        const productsFromServer = await shopAPI.getProductList();
        
        if (productsFromServer.length > 0) {
            catalogModel.setProducts(productsFromServer);
            console.log('Товары загружены с сервера:', productsFromServer.length);
            
            const firstProduct = productsFromServer[0];
            console.log('Пример товара:', {
                id: firstProduct.id,
                title: firstProduct.title,
                price: firstProduct.price
            });
        } else {
            catalogModel.setProducts(apiProducts.items);
            console.log('Сервер не вернул товары, используем тестовые данные');
        }

        // Подготовка тестового заказа
        const products = catalogModel.getProducts();
        const testOrder = {
            payment: 'card' as const,
            email: 'test@example.com',
            phone: '+79991234567',
            address: 'Тестовый адрес',
            items: products.slice(0, 2).map(p => p.id)
        };

        console.log('Подготовлен тестовый заказ:', {
            items: testOrder.items,
            payment: testOrder.payment
        });

    } catch (error) {
        console.error('Ошибка при работе с сервером:', error);
        
        const catalogModel = new CatalogModel();
        catalogModel.setProducts(apiProducts.items);
        console.log('Используем тестовые данные из-за ошибки сервера');
    }

    console.log('ТЕСТИРОВАНИЕ СЕРВЕРА ЗАВЕРШЕНО');
}

// Основная функция инициализации
async function initializeApp() {
    console.log('Запуск приложения Web-Larek...');
    
    try {
        // Тестируем модели
        testModels();
        
        // Тестируем работу с сервером
        await testServerIntegration();
        
        console.log('ПРИЛОЖЕНИЕ УСПЕШНО ЗАПУЩЕНО');
        console.log('Для просмотра логов откройте консоль разработчика (F12)');
        
    } catch (error) {
        console.error('Критическая ошибка при запуске:', error);
    }
}

// Запускаем приложение
initializeApp();