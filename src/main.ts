import './scss/styles.scss';

import { API_URL } from './utils/constants.ts';

import { apiProducts } from './utils/data.ts';

import { IApi } from './types/index.ts';
import { Api } from './components/base/Api.ts';

import { Catalog } from './components/models/Catalog.ts';
import { Basket } from './components/models/Basket.ts';
import { Buyer } from './components/models/Buyer.ts';
import { ApiClient } from './components/sevices/ApiClient.ts';

const productsModel = new Catalog([]);
productsModel.setProducts(apiProducts.items);
console.log('получение массива товаров из модели', productsModel.getProducts());
console.log('получение одного товара по его id', productsModel.getProductByID('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

productsModel.setProduct(apiProducts.items[2]);
console.log('получение товара для подробного отображения', productsModel.getProduct());

const basketModel = new Basket();
basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[1]);
basketModel.addProduct(apiProducts.items[2]);
console.log('получение массива товаров, которые находятся в корзине', basketModel.getProducts());
console.log('получение стоимости всех товаров в корзине', basketModel.getPriceBasket());
console.log('получение количества товаров в корзине', basketModel.getCountProducts());
console.log('проверка наличия товара в корзине по его id', basketModel.hasProduct('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

basketModel.delProduct(apiProducts.items[2]);
console.log('корзина, после удаления одного из товаров', basketModel.getProducts());

basketModel.delBasket();
console.log('корзина после очистки', basketModel.getProducts());

const buyerModel = new Buyer('online', 'test@example.com', '+79991234567', 'г. Москва, ул. Ленина, д. 1');
console.log('получение всех данных покупателя', buyerModel.getBuyer());

buyerModel.updBuyer({payment: 'cash', address: 'г. Москва, ул. Ленина, д. 2'});
console.log('данные после обновления', buyerModel.getBuyer());

buyerModel.delBuyer();
console.log('данные после очистки', buyerModel.getBuyer());

const buyerModel2 = new Buyer('', 'test@example.com', '', 'г. Москва, ул. Ленина, д. 1');
console.log('получение всех данных покупателя', buyerModel2.getBuyer());
console.log('валидация данных', buyerModel2.validBuyer());

const api: IApi = new Api(API_URL);
const apiClient = new ApiClient(api);

try {
  const products = await apiClient.getProducts();
  productsModel.setProducts(products.items);
  console.log('КАТАЛОГ ТОВАРОВ:', productsModel.getProducts());
} catch (error) {
  console.error('Ошибка загрузки каталога:', error);
}
