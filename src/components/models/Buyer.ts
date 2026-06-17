import { IBuyer } from "../../types";
import { TPayment } from "../../types";

export class Buyer implements IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;

  constructor(payment: TPayment, email: string, phone: string, address: string) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  //сохранение данных в модели
  updBuyer(buyer: Partial<IBuyer>): IBuyer {
    (Object.keys(buyer) as Array<keyof IBuyer>).forEach(key  => {
      if (buyer[key] != undefined) {
        if (key === 'payment') {
          if (buyer[key] === 'online' || buyer[key] === 'cash') {
            this[key] = buyer[key] as TPayment;
          } else {
            this.payment = 'online';
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
    this.payment = 'online';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  //валидация данных
  validPayAndEmail(payment: TPayment, email: string): {payment?: string; email?: string} {
    let err: {payment?: string; email?: string} = {};

    if (payment != 'online' && payment != 'cash') {
      err.payment = 'Не выбран вид оплаты';
    }

    if (email === '') {
      err.email = 'Укажите емэйл';
    }
    return err;
  }

  validPhoneAndAddr(phone: string, address: string): {phone?: string, address?: string} {
    let err: {phone?: string, address?: string} = {};

    if (phone === '') {
      err.phone = 'Введите номер телефона';
    }

    if (address === '') {
      err.address = 'Укажите адрес';
    }
    return err;
  }
}