import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";


interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      this.events.emit('order:open');
    })
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set items(cards: HTMLElement[]) {
    if (cards.length === 0) {
      this.buttonElement.disabled = true;
    } else {
      this.buttonElement.disabled = false;
      this.listElement.innerHTML = '';
      this.listElement.append(...cards);
    }
  }
}