import { IApi } from "../../types";
import { IProductListResponse } from "../../types";
import { IOrderConfirmation } from "../../types";
import { IOrder } from "../../types";

export class ApiClient {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProductListResponse> {
    const result = await this.api.get<IProductListResponse>('/product/');
    return result;
  }

  async postOrder(orderData: IOrder): Promise<IOrderConfirmation> {
    return await this.api.post<IOrderConfirmation>('/order/', orderData);
  }
}