import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
    this.container.addEventListener('click', () => {
      this.events.emit('modal:close');
    });

    const modalContainer = ensureElement<HTMLElement>('.modal__container', this.container);
    modalContainer.addEventListener('click', (event) => {
      event.stopPropagation();
    })
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }

  set content(value: HTMLElement) {
    this.contentElement.innerHTML = '';
    this.contentElement.append(value);
  }
}