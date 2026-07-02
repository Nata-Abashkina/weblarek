import { IBuyer } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export class FormAddPayment extends Form<Pick<IBuyer, 'payment' | 'address'>> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: IEvents){
    super(container, events);

    this.cardButton = ensureElement<HTMLButtonElement>('button[name=card]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name=cash]', this.container);

    this.cardButton.addEventListener('click', (event: Event) => {
      event.preventDefault();

      this.events.emit('order.payment:change', { key: 'payment', value: 'online' })
    });

    this.cashButton.addEventListener('click', (event: Event) => {
      event.preventDefault();

      this.events.emit('order.payment:change', { key: 'payment', value: 'cash' })
    })
  }

  set payment(value: string) {
    this.cardButton.classList.toggle('button_alt-active', value === 'online');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }
}