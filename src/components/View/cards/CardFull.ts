import { CardMain } from "./CardMain";
import { ICardActions, IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { ICardFullData } from "../../../types";


type CategoryKey = keyof typeof categoryMap;

export class CardFull extends CardMain<ICardFullData> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }

  set price(value: number | null) {
    super.price = value;

    if (value === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = 'Недоступно';
    } else {
      this.buttonElement.disabled = false;
    }
  }


  set inBasket(value: boolean) {
    if (this.buttonElement.disabled) return; // Если цена null, кнопку не трогаем
    this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
  }


  set category(value: string) {
    this.categoryElement.textContent = value;
  
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}