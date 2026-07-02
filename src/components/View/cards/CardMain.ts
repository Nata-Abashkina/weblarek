import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export class CardMain<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  get title(): string {
    return this.titleElement?.textContent || '';
  }

  set price(value: number | null) {
    if (this.priceElement) {
      this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }
  }
}
