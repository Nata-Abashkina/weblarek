import { IBuyer } from "../../types";
import { TPayment } from "../../types";

type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;

  constructor(payment: TPayment, email: string, phone: string, address: string) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  //сохранение данных в модели
  updBuyer(buyer: Partial<IBuyer>): Buyer {
    (Object.keys(buyer) as Array<keyof IBuyer>).forEach(key  => {
      if (buyer[key] != undefined) {
        if (key === 'payment') {
          if (buyer[key] === 'online' || buyer[key] === 'cash') {
            this[key] = buyer[key] as TPayment;
          } else {
            this.payment = '';
          }
        } else {
          this[key] = buyer[key];
        }
      }
    })
    return this;
  }

  //получение всех данных покупателя
  getBuyer(): IBuyer {
    const buyer = {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };

    return buyer;
  }

  //очистка данных покупателя
  delBuyer(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  //валидация данных
  validBuyer(): ValidationErrors {
      let err: ValidationErrors = {};

    if (this.payment != 'online' && this.payment != 'cash') {
      err.payment = 'Не выбран вид оплаты';
    }

    if (this.email === '') {
      err.email = 'Укажите емэйл';
    }

    if (this.phone === '') {
      err.phone = 'Введите номер телефона';
    }

    if (this.address === '') {
      err.address = 'Укажите адрес';
    }
    return err;
  }
}