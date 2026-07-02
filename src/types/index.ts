export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProductListResponse {
  total: number;
  items: IProduct[]
}

export interface IOrderConfirmation {
  id: string,
  total: number
}

export interface IOrder extends IBuyer {
  total: number,
  items: string[]
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'online' | 'cash';

export interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}
export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICardFullData extends IProduct {
  inBasket?: boolean;
}