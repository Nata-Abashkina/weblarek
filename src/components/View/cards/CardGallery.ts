import { CardMain } from "./CardMain";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import { ICardActions } from "../../../types";


type CategoryKey = keyof typeof categoryMap;
export type TCardGallery = Pick<IProduct, 'image' | 'category'>;

export class CardGallery extends CardMain<TCardGallery & Pick<IProduct, 'title' | 'price'>> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement; 

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
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

}