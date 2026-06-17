import { IProduct } from "../../types";

export class Catalog{
  private products: IProduct[];
  private product: null | IProduct = null;

  constructor(products: IProduct[]) {
    this.products = products;
  }

  //сохранение массива товаров полученного в параметрах метода
  setProducts(products: IProduct[]): void {
    this.products = [...products];
    this.product = null;
  }

  //получение массива товаров из модели
  getProducts(): IProduct[] {
    return this.products;
  }

  //получение одного товара по его id
  getProductByID(id: string): IProduct | null {
    const product = this.products.find((item) => id === item.id);
    return product ?? null;
  }

  //сохранение товара для подробного отображения
  setProduct(product: IProduct): void {
    this.product = product;
  }

  //получение товара для подробного отображения
  getProduct(): IProduct | null {
    return this.product;
  }
}