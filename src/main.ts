import './scss/styles.scss';

import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { ShopAPI } from './components/Services/ShopAPI';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { AppPresenter } from './components/presenter/presenter';
import { API_URL } from './utils/constants';

async function initializeApp() {
    console.log('Starting app...');
    
    try {
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }
        
        const events = new EventEmitter();
        const api = new Api(API_URL);
        const shopAPI = new ShopAPI(api);
        const catalogModel = new CatalogModel(events);
        const cartModel = new CartModel(events);
        const buyerModel = new BuyerModel(events);
        
        new AppPresenter(shopAPI, catalogModel, cartModel, buyerModel, events);
        
        console.log('App started successfully');
        
    } catch (error) {
        console.error('Error starting app:', error);
    }
}

initializeApp();