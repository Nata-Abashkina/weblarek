import { CardMain } from "./CardMain";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { ICardActions } from "../../../types";

export class CardBasket extends CardMain<Pick<IProduct, 'title' | 'price'> & { index: number }> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onClick) {
      this.deleteButton.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}