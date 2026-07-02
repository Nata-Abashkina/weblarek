import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket{
  private products: IProduct[] = [];

  constructor(private events: IEvents) {};

  //получение массива товаров, которые находятся в корзине
  getProducts(): IProduct[] {
    return this.products;
  }

  //добавление товара, который был получен в параметре, в массив корзины
  addProduct(product: IProduct): void {
    this.products.push(product);
    this.events.emit('basket:change');
  }

  //удаление товара, полученного в параметре из массива корзины
  delProduct(product: IProduct): void {
    this.products = this.products.filter((item) => item.id != product.id);
    this.events.emit('basket:change');
  }

  //очистка корзины
  delBasket(): void {
    this.products = [];
    this.events.emit('basket:change');
  }

  //получение стоимости всех товаров в корзине
  getPriceBasket(): number {
    return this.products.reduce((acc, item) => {
      if (item.price != null) {
        return acc + item.price;
      } else {
        return acc;
      }
    }, 0);
  }

  //получение количества товаров в корзине
  getCountProducts(): number {
    return this.products.length;
  }

  //проверка наличия товара в корзине по его id, полученного в параметр метода
  hasProduct(id: string): boolean {
    return Boolean(this.products.find((item) => item.id === id));
  }
}
